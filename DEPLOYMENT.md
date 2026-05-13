# Production Deployment Guide

## Overview
- **Frontend**: Deployed on Vercel (https://tgi-japanese-language-report-system.vercel.app)
- **Backend**: Deploy to Render.com (FREE tier available)
- **Database**: MongoDB Atlas (Already configured)

---

## Step 1: Update Frontend with Production API URL

### 1.1 Create Environment Variables
Frontend environments are already set up:
- `.env.local` → Used during development (localhost:5000)
- `.env.production` → Used in production (to be updated)

### 1.2 After Backend Deployment
Once you get the Render backend URL (e.g., `https://tgi-backend.onrender.com`), update `.env.production`:

```env
REACT_APP_API_URL=https://tgi-backend.onrender.com
```

Then redeploy to Vercel:
```bash
git add .env.production
git commit -m "Update production API URL"
git push origin main
```

---

## Step 2: Deploy Backend to Render.com

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up (can use GitHub account)
3. Connect your GitHub repository

### 2.2 Create a New Web Service
1. Click **"New +"** → **"Web Service"**
2. Select your GitHub repository (`tgi-report-system`)
3. Configure:
   - **Name**: `tgi-report-backend` (or your preference)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `tgi-report-backend`

### 2.3 Set Environment Variables
In Render dashboard for your service:
1. Go to **Settings** → **Environment**
2. Add these variables:

```
MONGO_URI=mongodb+srv://[your-mongodb-user]:[password]@ac-z4kow6c.0.../tgi_report_db
JWT_SECRET=tgi_report_system_secret_key_2026_waddy
PORT=5000
NODE_ENV=production
```

**Note**: Keep `PORT=5000` (Render will expose it via HTTPS automatically)

### 2.4 Deploy
- Click **Deploy**
- Wait for build to complete (usually 2-3 minutes)
- Once deployed, note the URL (e.g., `https://tgi-backend.onrender.com`)

### 2.5 Test Backend is Working
```bash
curl https://tgi-backend.onrender.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"waddy@tgi.com","password":"Waddy@tgi"}'
```

Should return a token if working correctly.

---

## Step 3: Update Frontend with Production Backend URL

### 3.1 Update Environment Variables
Edit `.env.production`:
```env
REACT_APP_API_URL=https://tgi-backend.onrender.com
```

### 3.2 Deploy to Vercel
```bash
git add .env.production
git commit -m "Update backend API URL for production"
git push origin main
```

Vercel will automatically redeploy when you push to main branch.

---

## Step 4: Configure CORS (Already Done)

The backend now accepts:
- `http://localhost:3000` (local development)
- `https://tgi-japanese-language-report-system.vercel.app` (production)

To add more origins, edit `tgi-report-backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://tgi-japanese-language-report-system.vercel.app',
  'https://your-new-frontend-url.vercel.app' // Add here if needed
];
```

---

## Step 5: Verify Production Setup

### 5.1 Test Login
1. Go to https://tgi-japanese-language-report-system.vercel.app
2. Try to login with: `waddy@tgi.com` / `Waddy@tgi`
3. Should successfully authenticate and load dashboard

### 5.2 Test Report Submission
1. Create a new report
2. Should successfully save to MongoDB

### 5.3 Check Browser Console
- Open DevTools (F12)
- Go to **Network** tab
- Make sure API calls to `https://tgi-backend.onrender.com/api/...` are working

---

## Troubleshooting

### Backend Not Responding
1. Check Render dashboard - is service running?
2. Click on service logs to see errors
3. Verify MongoDB URI is correct

### CORS Error
If you see `blocked by CORS policy`:
1. Check frontend URL is in `allowedOrigins` in server.js
2. Redeploy backend after changes

### 502 Bad Gateway
Usually means backend crashed. Check Render logs.

---

## Local Development (No Changes Needed)

Continue running locally:
```bash
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend
cd tgi-report-backend
npm run dev
```

Frontend will use `http://localhost:5000` automatically (from `.env.local`).

---

## Notes

- **Free Tier**: Render's free tier auto-shuts down after 15 min of inactivity. First request will be slow. Upgrade if needed.
- **MongoDB**: Already on Atlas (cloud), no changes needed
- **Sessions**: Last 24 hours (set in backend JWT)
- **Admin Account**: `waddy@tgi.com` / `Waddy@tgi` (created automatically on first backend start)

---

## Quick Reference

| Component | Local | Production |
|-----------|-------|-----------|
| Frontend | http://localhost:3000 | https://tgi-japanese-language-report-system.vercel.app |
| Backend | http://localhost:5000 | https://tgi-backend.onrender.com |
| Database | MongoDB Atlas (same) | MongoDB Atlas (same) |
| API URL | http://localhost:5000 | https://tgi-backend.onrender.com |

