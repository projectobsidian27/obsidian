# Vercel Deployment Guide for Obsidian

This guide will help you deploy your Obsidian app to production using Vercel (frontend) and Render (backend).

---

## 🎯 **Deployment Architecture**

```
Vercel (Frontend)           Render (Backend)
https://obsidian.vercel.app → https://obsidian-api.onrender.com
      ↓                              ↓
   Next.js                       FastAPI
      ↓                              ↓
   Auth0 ←──────────────────────────┘
      ↓
   PostgreSQL (Render)
   Redis (Upstash - free)
```

---

## 📦 **Part 1: Deploy Frontend to Vercel**

### **Step 1: Initialize Git Repository**

```bash
cd "/Users/nickmisewicz/Desktop/Nick's project"

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Obsidian MVP"
```

### **Step 2: Push to GitHub**

1. Go to https://github.com/new
2. Create a new repository: `obsidian-pipeline`
3. **Don't** initialize with README (we already have code)
4. Copy the commands and run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/obsidian-pipeline.git
git branch -M main
git push -u origin main
```

### **Step 3: Deploy to Vercel**

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `obsidian-ai/apps/web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

4. Add Environment Variables:
   - `AUTH0_SECRET` → (generate with `openssl rand -hex 32`)
   - `AUTH0_BASE_URL` → (will be `https://your-app.vercel.app`)
   - `AUTH0_ISSUER_BASE_URL` → `https://YOUR_DOMAIN.auth0.com`
   - `AUTH0_CLIENT_ID` → (from Auth0 dashboard)
   - `AUTH0_CLIENT_SECRET` → (from Auth0 dashboard)
   - `AUTH0_AUDIENCE` → `https://YOUR_DOMAIN.auth0.com/api/v2/`
   - `NEXT_PUBLIC_API_URL` → (will be your Render URL, add later)

5. Click **Deploy**

**Option B: Via CLI**

```bash
cd obsidian-ai/apps/web
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: obsidian-pipeline
# - Directory: ./
# - Override build settings? No

# Deploy to production
vercel --prod
```

### **Step 4: Get Your Vercel URL**

After deployment, you'll get a URL like:
```
https://obsidian-pipeline.vercel.app
```

**Save this URL** - you'll need it for Auth0!

---

## 🚀 **Part 2: Deploy Backend to Render**

### **Step 1: Create Render Account**

1. Go to https://render.com
2. Sign up (use GitHub auth)

### **Step 2: Create PostgreSQL Database**

1. Dashboard → "New" → "PostgreSQL"
2. Name: `obsidian-db`
3. Database: `obsidian_production`
4. Region: Oregon (or closest to you)
5. Plan: **Free** (for development)
6. Click "Create Database"

7. **Save these credentials:**
   - Internal Database URL (use this in your app)
   - Example: `postgresql://user:pass@dpg-xxx.oregon-postgres.render.com/obsidian_production`

8. **Run your schema:**
   ```bash
   # Get the External Database URL from Render dashboard
   psql "postgresql://user:pass@dpg-xxx.oregon-postgres.render.com/obsidian_production" \
     -f "obsidian-ai/apps/api/app/db/schema.sql"
   ```

### **Step 3: Create Redis (Upstash - Free)**

1. Go to https://upstash.com
2. Sign up (free tier: 10,000 commands/day)
3. Create database:
   - Name: `obsidian-cache`
   - Region: Same as your Render region
   - Click "Create"

4. **Save the Redis URL:**
   - Example: `rediss://default:xxx@xxx.upstash.io:6379`

### **Step 4: Deploy FastAPI to Render**

1. Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `obsidian-api`
   - **Region:** Oregon (same as database)
   - **Branch:** `main`
   - **Root Directory:** `obsidian-ai/apps/api`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free

4. Add Environment Variables:
   - `DATABASE_URL` → (from Step 2 - Internal URL)
   - `REDIS_URL` → (from Step 3)
   - `AUTH0_DOMAIN` → `YOUR_DOMAIN.auth0.com`
   - `AUTH0_AUDIENCE` → `https://YOUR_DOMAIN.auth0.com/api/v2/`
   - `AUTH0_ISSUER` → `https://YOUR_DOMAIN.auth0.com/`
   - `SECRET_KEY` → (generate with `openssl rand -hex 32`)

5. Click "Create Web Service"

6. **Save your API URL:**
   ```
   https://obsidian-api.onrender.com
   ```

---

## 🔐 **Part 3: Update Auth0 with Production URLs**

1. Go to https://manage.auth0.com
2. Applications → Your App → Settings

3. **Update URLs:**

   **Allowed Callback URLs:**
   ```
   https://your-app.vercel.app/api/auth/callback,
   http://localhost:3000/api/auth/callback
   ```

   **Allowed Logout URLs:**
   ```
   https://your-app.vercel.app,
   http://localhost:3000
   ```

   **Allowed Web Origins:**
   ```
   https://your-app.vercel.app,
   http://localhost:3000
   ```

4. Click "Save Changes"

---

## 🔄 **Part 4: Update Environment Variables**

### **Update Vercel (Frontend)**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables

2. Update:
   - `AUTH0_BASE_URL` → `https://your-app.vercel.app`
   - `NEXT_PUBLIC_API_URL` → `https://obsidian-api.onrender.com`
   - `NEXT_PUBLIC_APP_URL` → `https://your-app.vercel.app`

3. **Redeploy:**
   - Go to Deployments tab
   - Click "..." → "Redeploy"

### **Update Render (Backend)**

Already done in Part 2!

---

## ✅ **Part 5: Test Your Deployment**

### **Test Checklist:**

1. **Visit your app:**
   ```
   https://your-app.vercel.app
   ```

2. **Test authentication:**
   - Click "Get Started Free"
   - Should redirect to Auth0
   - Enter your email
   - Check email for magic link
   - Click link → Should log you in!

3. **Test API:**
   ```bash
   curl https://obsidian-api.onrender.com/health
   # Should return: {"ok": true, "service": "Obsidian API", "version": "0.1.0"}
   ```

4. **Check logs:**
   - Vercel: Dashboard → Your Project → Deployments → Click deployment → View Function Logs
   - Render: Dashboard → Your Service → Logs

---

## 💰 **Cost Summary**

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Vercel** | 100GB bandwidth/month | $20/month |
| **Render** | 750 hours/month | $7/month |
| **PostgreSQL (Render)** | 1GB storage | $7/month |
| **Redis (Upstash)** | 10K commands/day | $10/month |
| **Auth0** | 7,500 users/month | $35/month |

**Total (Free Tier):** $0/month
**Total (Paid):** ~$79/month (when you need to scale)

---

## 🔧 **Local Development with Production Setup**

You can still develop locally and connect to production services:

### **Update local .env.local:**

```bash
# apps/web/.env.local
AUTH0_SECRET='your_local_secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_DOMAIN.auth0.com'
AUTH0_CLIENT_ID='your_client_id'
AUTH0_CLIENT_SECRET='your_client_secret'
AUTH0_AUDIENCE='https://YOUR_DOMAIN.auth0.com/api/v2/'

# Point to production API or local
NEXT_PUBLIC_API_URL=http://localhost:8000
# or
NEXT_PUBLIC_API_URL=https://obsidian-api.onrender.com
```

### **Update local .env:**

```bash
# apps/api/.env

# Use production database
DATABASE_URL=postgresql://user:pass@dpg-xxx.oregon-postgres.render.com/obsidian_production

# Or use local database
DATABASE_URL=postgresql://nickmisewicz@localhost:5432/obsidian_dev

# Use production Redis
REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379

# Or use local Redis
REDIS_URL=redis://localhost:6379
```

---

## 🚨 **Troubleshooting**

### **Vercel build fails**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version (should be 18+)

### **Auth0 callback error**
- Verify callback URLs match exactly
- Check environment variables in Vercel
- Clear browser cookies and try again

### **API connection error**
- Check if Render service is running
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in FastAPI

### **Database connection error**
- Verify `DATABASE_URL` is correct (use Internal URL)
- Check if Render database is running
- Test connection: `psql "DATABASE_URL" -c "SELECT 1;"`

---

## 📋 **Quick Reference**

### **Important URLs:**

| Service | URL |
|---------|-----|
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Render Dashboard** | https://dashboard.render.com |
| **Upstash Dashboard** | https://console.upstash.com |
| **Auth0 Dashboard** | https://manage.auth0.com |
| **Your Frontend** | https://your-app.vercel.app |
| **Your API** | https://obsidian-api.onrender.com |

### **Useful Commands:**

```bash
# Deploy frontend
cd apps/web
vercel --prod

# Check API logs
# Go to Render dashboard → Your service → Logs

# Run migrations
psql "PRODUCTION_DATABASE_URL" -f apps/api/app/db/schema.sql

# Test API locally
curl http://localhost:8000/health

# Test API production
curl https://obsidian-api.onrender.com/health
```

---

## 🎯 **Next Steps**

Once deployed:

1. ✅ Test authentication flow
2. ✅ Set up HubSpot OAuth (use production URLs)
3. ✅ Build Vanguard scan functionality
4. ✅ Test end-to-end flow
5. ✅ Share with early users!

---

Need help? Just ask! 🚀
