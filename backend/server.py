from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta
from bson import ObjectId
from typing import List, Optional
import secrets

# Load environment variables FIRST
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Now import our modules
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    get_current_user,
    get_current_admin
)
from models import (
    UserRegister,
    UserLogin,
    UserResponse,
    SacredGroveCreate,
    SacredGroveResponse,
    ArticleCreate,
    ArticleResponse,
    NewsCreate,
    NewsResponse,
    ResourceCreate,
    ResourceResponse,
    ThreatReportCreate,
    ThreatReportResponse
)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===== STARTUP EVENTS =====
@app.on_event("startup")
async def startup_event():
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    await db.login_attempts.create_index("identifier")
    await db.sacred_groves.create_index("district")
    await db.sacred_groves.create_index("name")
    
    # Seed admin user
    await seed_admin()
    logger.info("Database indexes created and admin seeded")

async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@devrai.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "approval_status": "approved",
            "created_at": datetime.now(timezone.utc)
        })
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logger.info(f"Admin password updated: {admin_email}")
    
    # Write test credentials
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Test Credentials for Devrai Application\n\n")
        f.write("## Admin Account\n")
        f.write(f"- Email: {admin_email}\n")
        f.write(f"- Password: {admin_password}\n")
        f.write(f"- Role: admin\n\n")
        f.write("## Auth Endpoints\n")
        f.write("- POST /api/auth/register\n")
        f.write("- POST /api/auth/login\n")
        f.write("- POST /api/auth/logout\n")
        f.write("- GET /api/auth/me\n")
        f.write("- POST /api/auth/refresh\n\n")
        f.write("## Note\n")
        f.write("New user registrations require admin approval before they can login.\n")

# ===== AUTH ROUTES =====
@api_router.post("/auth/register")
async def register(user: UserRegister, response: Response):
    email = user.email.lower()
    
    # Check if user exists
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed = hash_password(user.password)
    
    # Create user with pending approval
    user_doc = {
        "email": email,
        "password_hash": hashed,
        "name": user.name,
        "role": "user",
        "approval_status": "pending",
        "created_at": datetime.now(timezone.utc)
    }
    
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = str(result.inserted_id)
    user_doc.pop("password_hash")
    
    return {
        "message": "Registration successful. Please wait for admin approval before logging in.",
        "user": user_doc
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin, response: Response, request: Request):
    email = credentials.email.lower()
    
    # Check brute force
    identifier = f"{request.client.host}:{email}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        lockout_time = attempts.get("locked_until")
        if lockout_time and datetime.now(timezone.utc) < lockout_time:
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
    
    # Find user
    user = await db.users.find_one({"email": email})
    if not user:
        await increment_failed_attempts(identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check approval status
    if user.get("approval_status") != "approved":
        raise HTTPException(status_code=403, detail="Your account is pending admin approval")
    
    # Verify password
    if not verify_password(credentials.password, user.get("password_hash", "")):
        await increment_failed_attempts(identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Clear failed attempts
    await db.login_attempts.delete_one({"identifier": identifier})
    
    # Create tokens
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    # Set cookies (secure=True for production HTTPS)
    is_production = os.environ.get("FRONTEND_URL", "").startswith("https://")
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=is_production,
        samesite="lax",
        max_age=900,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=is_production,
        samesite="lax",
        max_age=604800,
        path="/"
    )
    
    # Return user data
    user["_id"] = user_id
    user.pop("password_hash")
    return user

async def increment_failed_attempts(identifier: str):
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts:
        count = attempts.get("count", 0) + 1
        update = {"$set": {"count": count}}
        if count >= 5:
            update["$set"]["locked_until"] = datetime.now(timezone.utc) + timedelta(minutes=15)
        await db.login_attempts.update_one({"identifier": identifier}, update)
    else:
        await db.login_attempts.insert_one({
            "identifier": identifier,
            "count": 1,
            "created_at": datetime.now(timezone.utc)
        })

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request, db)
    return user

@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    
    try:
        import jwt
        from auth import get_jwt_secret, JWT_ALGORITHM
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        # Create new access token
        user_id = str(user["_id"])
        new_access_token = create_access_token(user_id, user["email"])
        
        is_production = os.environ.get("FRONTEND_URL", "").startswith("https://")
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            httponly=True,
            secure=is_production,
            samesite="lax",
            max_age=900,
            path="/"
        )
        
        return {"message": "Token refreshed"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

# ===== ADMIN ROUTES =====
@api_router.get("/admin/users")
async def get_all_users(request: Request):
    await get_current_admin(request, db)
    # Don't fetch password_hash from database
    users = await db.users.find({}, {"password_hash": 0}).to_list(1000)
    for user in users:
        user["_id"] = str(user["_id"])
    return users

@api_router.patch("/admin/users/{user_id}/approve")
async def approve_user(user_id: str, request: Request):
    await get_current_admin(request, db)
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"approval_status": "approved"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User approved"}

@api_router.patch("/admin/users/{user_id}/reject")
async def reject_user(user_id: str, request: Request):
    await get_current_admin(request, db)
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"approval_status": "rejected"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User rejected"}

# ===== SACRED GROVES ROUTES (PUBLIC) =====
@api_router.get("/groves")
async def get_groves(district: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if district and district != "all":
        query["district"] = district
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"district": {"$regex": search, "$options": "i"}}
        ]
    
    # Fetch only necessary fields (exclude _id will be converted to string anyway)
    groves = await db.sacred_groves.find(query, {"_id": 1, "name": 1, "district": 1, "coordinates": 1, "location": 1, "natural_history": 1, "present_status": 1, "threats": 1, "references": 1, "image": 1, "created_at": 1}).to_list(1000)
    for grove in groves:
        grove["_id"] = str(grove["_id"])
    return groves

@api_router.get("/groves/{grove_id}")
async def get_grove(grove_id: str):
    grove = await db.sacred_groves.find_one({"_id": ObjectId(grove_id)})
    if not grove:
        raise HTTPException(status_code=404, detail="Grove not found")
    grove["_id"] = str(grove["_id"])
    return grove

@api_router.get("/groves/by-district/{district}")
async def get_groves_by_district(district: str):
    # Fetch only necessary fields
    groves = await db.sacred_groves.find({"district": district}, {"_id": 1, "name": 1, "district": 1, "coordinates": 1, "location": 1, "natural_history": 1, "present_status": 1, "threats": 1, "references": 1, "image": 1, "created_at": 1}).to_list(1000)
    for grove in groves:
        grove["_id"] = str(grove["_id"])
    return groves

@api_router.get("/districts")
async def get_districts():
    districts = await db.sacred_groves.distinct("district")
    return sorted(districts)

@api_router.post("/groves")
async def create_grove(grove: SacredGroveCreate, request: Request):
    await get_current_admin(request, db)
    grove_doc = grove.dict()
    grove_doc["created_at"] = datetime.now(timezone.utc)
    result = await db.sacred_groves.insert_one(grove_doc)
    grove_doc["_id"] = str(result.inserted_id)
    return grove_doc

@api_router.put("/groves/{grove_id}")
async def update_grove(grove_id: str, grove: SacredGroveCreate, request: Request):
    await get_current_admin(request, db)
    result = await db.sacred_groves.update_one(
        {"_id": ObjectId(grove_id)},
        {"$set": grove.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Grove not found")
    return {"message": "Grove updated"}

@api_router.delete("/groves/{grove_id}")
async def delete_grove(grove_id: str, request: Request):
    await get_current_admin(request, db)
    result = await db.sacred_groves.delete_one({"_id": ObjectId(grove_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Grove not found")
    return {"message": "Grove deleted"}

# ===== ARTICLES ROUTES (PUBLIC) =====
@api_router.get("/articles")
async def get_articles(category: Optional[str] = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    articles = await db.articles.find(query).sort("date", -1).to_list(1000)
    for article in articles:
        article["_id"] = str(article["_id"])
    return articles

@api_router.post("/articles")
async def create_article(article: ArticleCreate, request: Request):
    await get_current_admin(request, db)
    article_doc = article.dict()
    article_doc["date"] = datetime.now(timezone.utc)
    result = await db.articles.insert_one(article_doc)
    article_doc["_id"] = str(result.inserted_id)
    return article_doc

# ===== NEWS ROUTES =====
@api_router.get("/news")
async def get_news(request: Request):
    await get_current_user(request, db)
    news = await db.news.find().sort("date", -1).to_list(1000)
    for item in news:
        item["_id"] = str(item["_id"])
    return news

@api_router.post("/news")
async def create_news(news_item: NewsCreate, request: Request):
    await get_current_admin(request, db)
    news_doc = news_item.dict()
    news_doc["date"] = datetime.now(timezone.utc)
    result = await db.news.insert_one(news_doc)
    news_doc["_id"] = str(result.inserted_id)
    return news_doc

# ===== RESOURCES ROUTES =====
@api_router.get("/resources")
async def get_resources(request: Request):
    await get_current_user(request, db)
    resources = await db.resources.find().to_list(1000)
    for resource in resources:
        resource["_id"] = str(resource["_id"])
    return resources

@api_router.post("/resources")
async def create_resource(resource: ResourceCreate, request: Request):
    await get_current_admin(request, db)
    resource_doc = resource.dict()
    result = await db.resources.insert_one(resource_doc)
    resource_doc["_id"] = str(result.inserted_id)
    return resource_doc

# ===== THREAT REPORTS ROUTES =====
@api_router.post("/threats/report")
async def report_threat(threat: ThreatReportCreate, request: Request):
    user = await get_current_user(request, db)
    threat_doc = threat.dict()
    threat_doc["reported_by"] = user["email"]
    threat_doc["status"] = "Pending"
    threat_doc["reported_at"] = datetime.now(timezone.utc)
    result = await db.threat_reports.insert_one(threat_doc)
    threat_doc["_id"] = str(result.inserted_id)
    return threat_doc

@api_router.get("/threats")
async def get_threats(request: Request):
    await get_current_admin(request, db)
    threats = await db.threat_reports.find().sort("reported_at", -1).to_list(1000)
    for threat in threats:
        threat["_id"] = str(threat["_id"])
    return threats

@api_router.patch("/threats/{threat_id}/status")
async def update_threat_status(threat_id: str, status: str, request: Request):
    await get_current_admin(request, db)
    result = await db.threat_reports.update_one(
        {"_id": ObjectId(threat_id)},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Threat report not found")
    return {"message": "Threat status updated"}

# ===== ROOT ROUTE =====
@api_router.get("/")
async def root():
    return {"message": "Devrai API - Sacred Groves Database"}

# Include the router in the main app
app.include_router(api_router)

# CORS Configuration
# Note: Cannot use wildcard '*' with allow_credentials=True
cors_origins_env = os.environ.get('CORS_ORIGINS', 'http://localhost:3000')
origins = [origin.strip() for origin in cors_origins_env.split(',')]

# Expand wildcard patterns for emergent.host
final_origins = []
for origin in origins:
    if '*.emergent.host' in origin:
        # Add common emergent.host patterns
        final_origins.extend([
            'https://eco-info.emergent.host',
            'https://eco-info.preview.emergentagent.com'
        ])
    else:
        final_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=final_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
