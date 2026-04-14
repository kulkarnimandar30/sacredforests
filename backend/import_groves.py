import asyncio
import pandas as pd
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from pathlib import Path
import re

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

def parse_coordinates(location_str):
    """Parse coordinates from DMS format to decimal degrees"""
    if pd.isna(location_str) or not location_str:
        return {'lat': 18.5204, 'lng': 73.8567}  # Default to Pune center
    
    try:
        # Pattern to match DMS coordinates like: 18°23'55.22"N  73°23'46.73"E
        pattern = r"(\d+)°\s*(\d+)'([\d.]+)\"([NS])\s+(\d+)°\s*(\d+)'([\d.]+)\"([EW])"
        match = re.search(pattern, str(location_str))
        
        if match:
            lat_deg, lat_min, lat_sec, lat_dir = match.groups()[:4]
            lng_deg, lng_min, lng_sec, lng_dir = match.groups()[4:]
            
            # Convert to decimal degrees
            lat = float(lat_deg) + float(lat_min)/60 + float(lat_sec)/3600
            lng = float(lng_deg) + float(lng_min)/60 + float(lng_sec)/3600
            
            if lat_dir == 'S':
                lat = -lat
            if lng_dir == 'W':
                lng = -lng
            
            return {'lat': round(lat, 6), 'lng': round(lng, 6)}
    except:
        pass
    
    return {'lat': 18.5204, 'lng': 73.8567}

async def import_sacred_groves():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'test_database')]

    # Read Excel file
    df = pd.read_excel('/tmp/SG_Database.xlsx')
    
    # Clear existing sacred groves
    result = await db.sacred_groves.delete_many({})
    print(f"Deleted {result.deleted_count} existing sacred groves")

    # Import sacred groves
    groves_data = []
    for _, row in df.iterrows():
        district = str(row['District']).strip() if pd.notna(row['District']) else 'Pune'
        location_str = str(row['Location']).strip() if pd.notna(row['Location']) else ''
        coords = parse_coordinates(location_str)
        
        grove_doc = {
            'name': str(row['Name of SG']).strip() if pd.notna(row['Name of SG']) else 'Unknown',
            'district': district,
            'coordinates': coords,
            'location': location_str,
            'natural_history': str(row['Natural History']).strip() if pd.notna(row['Natural History']) else '',
            'present_status': str(row['Present Status']).strip() if pd.notna(row['Present Status']) else '',
            'threats': str(row['Threats']).strip() if pd.notna(row['Threats']) else '',
            'references': str(row['References']).strip() if pd.notna(row['References']) else '',
            'image': 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80',  # Placeholder
            'created_at': datetime.now(timezone.utc)
        }
        groves_data.append(grove_doc)

    # Insert all groves
    if groves_data:
        result = await db.sacred_groves.insert_many(groves_data)
        print(f"✓ Imported {len(result.inserted_ids)} sacred groves")
    
    # Create test user
    existing_user = await db.users.find_one({"email": "kulkarnimandar30@gmail.com"})
    if not existing_user:
        from auth import hash_password
        user_doc = {
            "email": "kulkarnimandar30@gmail.com",
            "password_hash": hash_password("test123"),
            "name": "Mandar Kulkarni",
            "role": "user",
            "approval_status": "approved",  # Pre-approved for testing
            "created_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(user_doc)
        print(f"✓ Created test user: kulkarnimandar30@gmail.com (password: test123)")
    else:
        print(f"✓ Test user already exists: kulkarnimandar30@gmail.com")
    
    # Update test credentials file
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Test Credentials for Devrai Application\n\n")
        f.write("## Admin Account\n")
        f.write("- Email: admin@devrai.com\n")
        f.write("- Password: admin123\n")
        f.write("- Role: admin\n\n")
        f.write("## Test User\n")
        f.write("- Email: kulkarnimandar30@gmail.com\n")
        f.write("- Password: test123\n")
        f.write("- Role: user\n")
        f.write("- Status: approved\n\n")
        f.write("## Auth Endpoints\n")
        f.write("- POST /api/auth/register\n")
        f.write("- POST /api/auth/login\n")
        f.write("- POST /api/auth/logout\n")
        f.write("- GET /api/auth/me\n")
    
    print("\n✅ Import completed successfully!")
    print(f"Total sacred groves in database: {len(groves_data)}")
    
    # Show district breakdown
    districts = {}
    for grove in groves_data:
        dist = grove['district']
        districts[dist] = districts.get(dist, 0) + 1
    
    print("\nDistrict breakdown:")
    for dist, count in sorted(districts.items()):
        print(f"  {dist}: {count} groves")
    
    print("\nSample coordinates:")
    for i, grove in enumerate(groves_data[:5]):
        print(f"  {grove['name']}: {grove['coordinates']}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(import_sacred_groves())
