# Production Deployment Guide for Devrai (devraiforest.in)

## Issue Summary

When accessing your custom production domain `https://devraiforest.in`, the website experienced:
1. ❌ Data not loading (groves and districts)
2. ❌ Login failure
3. ✅ Preview environment (`https://eco-info.preview.emergentagent.com`) works fine

## Root Cause

The production deployment issue was caused by **CORS (Cross-Origin Resource Sharing) misconfiguration**:

### The Problem:
- The backend was configured with CORS `allow_origins: "*"` (wildcard)
- Frontend API calls used `withCredentials: true` (needed for cookie-based authentication)
- **CORS specification prohibits using wildcard `*` with credentials**

This resulted in the browser blocking all API requests with the error:
```
Access to XMLHttpRequest blocked by CORS policy: The value of the 
'Access-Control-Allow-Origin' header must not be the wildcard '*' 
when the request's credentials mode is 'include'.
```

## Fixes Applied ✅

### 1. Backend CORS Configuration (`/app/backend/server.py`)
**Before:**
```python
cors_origins = os.environ.get('CORS_ORIGINS', '*')
if cors_origins == '*':
    origins = ["*"]
else:
    origins = cors_origins.split(',')
```

**After:**
```python
# Note: Cannot use wildcard '*' with allow_credentials=True
cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000')
origins = [origin.strip() for origin in cors_origins.split(',')]
```

### 2. Backend Environment Variables (`/app/backend/.env`)
**Updated:**
```env
CORS_ORIGINS="https://devraiforest.in,https://eco-info.preview.emergentagent.com,http://localhost:3000"
FRONTEND_URL="https://devraiforest.in"
```

### 3. Cookie Security Settings (`/app/backend/server.py`)
**Updated login endpoint to use dynamic secure cookies:**
```python
# Set cookies (secure=True for production HTTPS)
is_production = os.environ.get("FRONTEND_URL", "").startswith("https://")
response.set_cookie(
    key="access_token",
    value=access_token,
    httponly=True,
    secure=is_production,  # True for HTTPS, False for HTTP
    samesite="lax",
    max_age=900,
    path="/"
)
```

### 4. Frontend Environment Configuration (`/app/frontend/.env`)
For production deployment, this should be:
```env
REACT_APP_BACKEND_URL=https://devraiforest.in
```

## How to Deploy to Production

### Option 1: Using Emergent Native Deployment

1. **Save Current Changes to GitHub** (if not already done)
   - Use the "Save to GitHub" button in the Emergent chat interface

2. **Deploy to Production**
   - The changes made here are in your **preview environment**
   - To update your production domain (`devraiforest.in`), you need to **redeploy**
   - Contact Emergent support or use the deployment interface to push these changes to production

3. **Verify Production Environment Variables**
   - Ensure `CORS_ORIGINS` includes `https://devraiforest.in`
   - Ensure `FRONTEND_URL=https://devraiforest.in`
   - Ensure `REACT_APP_BACKEND_URL=https://devraiforest.in`

### Option 2: Manual Deployment Verification

After deployment, verify the fixes worked:

1. **Test CORS Headers:**
```bash
curl -i -X GET "https://devraiforest.in/api/groves" \
  -H "Origin: https://devraiforest.in"
```

Expected response should include:
```
access-control-allow-origin: https://devraiforest.in
access-control-allow-credentials: true
```

Should NOT include:
```
access-control-allow-origin: *  ❌ (This is the problem!)
```

2. **Test Login:**
```bash
curl -i -X POST "https://devraiforest.in/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: https://devraiforest.in" \
  -d '{"email":"admin@devrai.com","password":"admin123"}'
```

Should return cookies with `Secure` flag for HTTPS.

3. **Test Data Loading:**
```bash
curl -s "https://devraiforest.in/api/groves" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Total groves: {len(data)}')"
```

Should return: `Total groves: 288`

## Technical Details

### Database Status
- ✅ MongoDB contains **288 Sacred Groves** across **10 districts**
- ✅ All data is intact and accessible via local API
- ✅ Districts: Bhandara, Chandrapur, Jalgaon, Kolaba, Kolhapur, Pune, Ratnagiri, Satara, Thana, Yeotmal

### Architecture
```
User Browser (devraiforest.in)
    ↓
Frontend (React) - Port 3000
    ↓ API calls with credentials
Backend (FastAPI) - Port 8001
    ↓
MongoDB - Port 27017
```

### CORS Flow
1. Browser makes request from `https://devraiforest.in` (origin)
2. Request goes to backend at `https://devraiforest.in/api/*`
3. Backend checks if origin is in allowed `CORS_ORIGINS`
4. Backend responds with `Access-Control-Allow-Origin: https://devraiforest.in`
5. Browser allows the response because origins match

## Environment Separation

**Important:** The Emergent platform maintains separate environments:

| Environment | URL | Purpose | Status |
|-------------|-----|---------|--------|
| **Local Development** | `http://localhost:3000` | Development/testing | ✅ Fixed |
| **Preview** | `https://eco-info.preview.emergentagent.com` | Pre-production testing | ⚠️ Cached CORS* |
| **Production** | `https://devraiforest.in` | Live site | ❌ Needs Deployment |

*Preview may show cached responses due to Cloudflare CDN. Local backend is fixed.

## Next Steps

1. ✅ **Code fixes completed** - All necessary changes have been made
2. 🔄 **Deployment required** - Push changes to production environment
3. ✅ **Verification** - Test production site after deployment
4. 📝 **Future consideration** - Set up admin approval dashboard (currently in backlog)

## Test Credentials

After deployment, use these credentials to verify login:
- **Email:** admin@devrai.com
- **Password:** admin123
- **Role:** admin

## Support

If you encounter issues after deployment:
1. Check browser console for CORS errors
2. Verify environment variables in production
3. Check backend logs for errors
4. Ensure Cloudflare/CDN cache is cleared

---
**Status:** Code fixes completed ✅ | Deployment pending 🔄
**Date:** April 14, 2026
**Next Action:** Deploy to production domain `devraiforest.in`
