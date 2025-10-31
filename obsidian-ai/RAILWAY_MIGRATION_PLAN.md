# 🚂 Railway Migration Plan - Obsidian Platform

**Objective:** Migrate from Vercel + Render to Railway for unified infrastructure

**Timeline:** 1-2 hours
**Downtime:** ~5-10 minutes during DNS cutover
**Rollback Plan:** Keep Vercel/Render active until Railway is fully tested

---

## 📋 **Pre-Migration Checklist**

### **Current State Inventory**

**Vercel:**
- ✅ Next.js app deployed
- ✅ Environment variables configured
- ✅ Custom domain (if any): TBD
- ✅ GitHub integration (auto-deploy on push)
- ✅ Build command: `npm run build`
- ✅ Start command: `npm run start`
- ✅ Root directory: `obsidian-ai/apps/web`

**Render:**
- ✅ PostgreSQL database only
- ✅ Database name: TBD
- ✅ Current connection string stored in Vercel env

**GitHub:**
- ✅ Repository: `projectobsidian27/obsidian`
- ✅ Main branch: `main`
- ✅ Monorepo structure: `obsidian-ai/apps/web`

**Environment Variables (from Vercel):**
```
HUBSPOT_CLIENT_ID=c5676eb8-7188-44b3-a72b-2b5a42ed1c27
HUBSPOT_CLIENT_SECRET=[redacted]
DATABASE_URL=[from Render]
ENCRYPTION_KEY=[generated]
NEXT_PUBLIC_URL=[vercel deployment url]
```

---

## 🎯 **Migration Steps**

### **PHASE 1: Railway Account Setup (5 minutes)**

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub
   - Connect your `projectobsidian27` GitHub account

2. **Install Railway CLI (optional but recommended)**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

3. **Create New Project**
   - Click "New Project"
   - Name it: `obsidian-platform`
   - Select region: US West or US East (closest to your users)

---

### **PHASE 2: Database Setup (10 minutes)**

1. **Add PostgreSQL Service**
   - In Railway project, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically provision the database

2. **Get Database Credentials**
   - Click on the PostgreSQL service
   - Go to "Variables" tab
   - Copy these variables:
     - `DATABASE_URL` (full connection string)
     - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

3. **Run Database Migrations**
   - Option A: Use Railway's "Data" tab → "Query" to run SQL directly
   - Option B: Connect via psql:
     ```bash
     psql $DATABASE_URL -f apps/web/migrations/000_initial_setup.sql
     ```

4. **Verify Tables Created**
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```
   Should show: users, crm_connections, notifications, announcements, etc.

---

### **PHASE 3: Next.js App Deployment (15 minutes)**

1. **Add Web Service**
   - In Railway project, click "+ New"
   - Select "GitHub Repo"
   - Choose `projectobsidian27/obsidian`
   - Railway will detect it's a Node.js/Next.js app

2. **Configure Build Settings**

   **Root Directory:**
   ```
   obsidian-ai/apps/web
   ```

   **Build Command:**
   ```
   npm run build
   ```

   **Start Command:**
   ```
   npm run start
   ```

   **Install Command (if needed):**
   ```
   npm install
   ```

3. **Set Environment Variables**
   - Click on the web service
   - Go to "Variables" tab
   - Add these variables:

   ```bash
   # HubSpot OAuth
   HUBSPOT_CLIENT_ID=c5676eb8-7188-44b3-a72b-2b5a42ed1c27
   HUBSPOT_CLIENT_SECRET=<your-secret>

   # Database (will auto-populate from Railway PostgreSQL)
   DATABASE_URL=${{Postgres.DATABASE_URL}}

   # Security
   ENCRYPTION_KEY=<your-existing-key-or-generate-new>

   # App URL (will be Railway URL initially)
   NEXT_PUBLIC_URL=${{RAILWAY_PUBLIC_DOMAIN}}

   # Node environment
   NODE_ENV=production
   ```

   **Note:** Railway uses `${{ServiceName.VARIABLE}}` syntax to reference other services

4. **Configure Networking**
   - Railway auto-assigns a public URL like: `obsidian-platform-production.up.railway.app`
   - Click "Settings" → "Networking"
   - Click "Generate Domain" if not auto-generated
   - Copy this URL for the next step

5. **Update HubSpot OAuth Redirect URL**
   - Go to HubSpot Developer dashboard
   - Update OAuth redirect URI to:
     ```
     https://obsidian-platform-production.up.railway.app/api/hubspot/callback
     ```
   - Replace with your actual Railway URL

6. **Trigger Deployment**
   - Railway auto-deploys on push to main
   - Or click "Deploy" button to trigger manually
   - Watch build logs in real-time

7. **Verify Deployment**
   - Check build logs for errors
   - Visit the Railway URL
   - Test the home page loads

---

### **PHASE 4: Database Migration from Render (Optional - 10 minutes)**

**Only if you have existing data in Render PostgreSQL:**

1. **Export from Render**
   ```bash
   # Get Render database URL from dashboard
   pg_dump $RENDER_DATABASE_URL > render_backup.sql
   ```

2. **Import to Railway**
   ```bash
   # Get Railway database URL
   psql $RAILWAY_DATABASE_URL < render_backup.sql
   ```

3. **Verify Data**
   ```sql
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM crm_connections;
   ```

**If you have NO data yet (likely case):**
- Skip this step, you already ran the migrations in Phase 2

---

### **PHASE 5: Configure Cron Jobs (10 minutes)**

Railway supports cron jobs natively!

1. **Create Cron Service**
   - In Railway project, click "+ New"
   - Select "Empty Service"
   - Name it: `zombie-scanner-cron`

2. **Configure Cron Job**
   - Settings → "Cron Schedule"
   - Set schedule: `0 8 * * *` (daily at 8am)
   - Set command:
     ```bash
     curl -X POST https://your-railway-url.railway.app/api/deals/scan-zombies
     ```

3. **Set Environment Variables**
   - Add same DATABASE_URL reference
   - Add any API keys needed

---

### **PHASE 6: Custom Domain (Optional - 5 minutes)**

**If you have a custom domain:**

1. **Add Domain in Railway**
   - Click web service
   - Settings → "Domains"
   - Click "Add Domain"
   - Enter: `app.obsidian.com` (or your domain)

2. **Configure DNS**
   Railway will show you DNS records to add:
   ```
   Type: CNAME
   Name: app (or @)
   Value: [railway-provided-value].railway.app
   ```

3. **Update Environment Variables**
   ```bash
   NEXT_PUBLIC_URL=https://app.obsidian.com
   ```

4. **Update HubSpot OAuth**
   - Change redirect URI to custom domain:
     ```
     https://app.obsidian.com/api/hubspot/callback
     ```

---

### **PHASE 7: Testing & Validation (15 minutes)**

**Test Checklist:**

1. **Homepage**
   - [ ] Loads correctly
   - [ ] Sticky CTA works
   - [ ] Design looks correct

2. **OAuth Flow**
   - [ ] Click "Connect HubSpot"
   - [ ] Redirects to HubSpot
   - [ ] Callback works
   - [ ] Token saved to database

3. **Dashboard**
   - [ ] Loads at `/dashboard`
   - [ ] Mock data toggle works
   - [ ] Metrics display correctly

4. **Notifications**
   - [ ] Bell icon shows
   - [ ] Can open notification panel
   - [ ] Can mark as read

5. **Database Connections**
   - [ ] OAuth tokens stored
   - [ ] Users created
   - [ ] Notifications queryable

6. **Admin Dashboard**
   - [ ] Loads at `/admin`
   - [ ] Client cards show
   - [ ] Can send messages
   - [ ] Can create announcements

---

### **PHASE 8: Cut Over & Cleanup (10 minutes)**

1. **Update GitHub Webhooks**
   - Railway auto-deploys from GitHub
   - Verify in Railway settings

2. **Archive Vercel Deployment**
   - Go to Vercel dashboard
   - Set project to "Paused" (don't delete yet)
   - Keep for rollback if needed

3. **Archive Render Database**
   - Export final backup
   - Pause database (don't delete)
   - Keep for 30 days

4. **Update Documentation**
   - Update README.md with new Railway URLs
   - Update environment variable docs
   - Document new deployment process

---

## 🔄 **Rollback Plan**

**If something goes wrong:**

1. **Immediate Rollback (< 5 minutes)**
   - Re-enable Vercel project
   - Point DNS back to Vercel (if changed)
   - HubSpot OAuth still works (both URLs can be whitelisted)

2. **Database Rollback**
   - Re-point DATABASE_URL to Render
   - No data loss (Render still has everything)

3. **Investigation**
   - Check Railway logs: `railway logs`
   - Check build errors in dashboard
   - Verify environment variables

---

## 💰 **Cost Comparison**

**Current (Vercel + Render):**
- Vercel: $0 (Hobby tier)
- Render PostgreSQL: $7/month (Starter tier)
- **Total: $7/month**

**After (Railway):**
- Railway Starter: $5/month (includes everything)
- PostgreSQL: Included
- Next.js hosting: Included
- Cron jobs: Included
- **Total: $5/month**

**Savings: $2/month + unified platform**

---

## 📊 **Success Metrics**

After migration, verify:

- ✅ Uptime: 99.9%+
- ✅ Response time: < 500ms
- ✅ Build time: < 5 minutes
- ✅ Database queries: < 100ms
- ✅ OAuth flow: < 3 seconds
- ✅ Zero errors in logs (first 24 hours)

---

## 🛠️ **Railway Configuration Files to Create**

### **1. railway.json** (optional, for advanced config)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **2. nixpacks.toml** (optional, for fine-tuned control)

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run start"
```

### **3. .railwayignore** (like .gitignore)

```
node_modules/
.next/
.vercel/
*.log
.env.local
.DS_Store
```

---

## 📝 **Post-Migration Tasks**

**Week 1:**
- [ ] Monitor error logs daily
- [ ] Check database performance
- [ ] Verify cron jobs running
- [ ] Test OAuth flow multiple times
- [ ] Collect user feedback

**Week 2:**
- [ ] Delete Vercel project (if all good)
- [ ] Delete Render database (if all good)
- [ ] Update all external docs/links
- [ ] Set up Railway monitoring/alerts

**Ongoing:**
- [ ] Review Railway usage/costs
- [ ] Optimize build times if needed
- [ ] Set up staging environment (if desired)

---

## 🚨 **Common Issues & Solutions**

**Issue: Build fails with "Module not found"**
- Solution: Check root directory is set to `obsidian-ai/apps/web`
- Verify `package.json` has all dependencies

**Issue: Database connection errors**
- Solution: Check DATABASE_URL format
- Verify Railway PostgreSQL is running
- Check network policies (should be public)

**Issue: OAuth redirect fails**
- Solution: Verify NEXT_PUBLIC_URL is correct
- Update HubSpot redirect URI
- Check HTTPS is enabled

**Issue: Environment variables not loading**
- Solution: Railway auto-injects, but verify syntax: `${{Postgres.DATABASE_URL}}`
- Restart service after adding variables

---

## ✅ **Final Pre-Migration Checklist**

**Before you begin:**
- [ ] Backup Render database (if any data exists)
- [ ] Document all Vercel environment variables
- [ ] Have HubSpot developer credentials ready
- [ ] Have GitHub repo access confirmed
- [ ] Set aside 1-2 hours uninterrupted time
- [ ] Have rollback plan ready
- [ ] Inform any team members of maintenance window

**You're ready to migrate!**

---

## 📞 **Support Resources**

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

**If you need help during migration:**
- Railway support response: < 1 hour (Discord)
- Check logs: `railway logs` or dashboard
- Database shell: Available in Railway dashboard

---

## 🎉 **Post-Migration Benefits**

After completing this migration, you'll have:

✅ **Unified platform** - One place for everything
✅ **Faster deploys** - No serverless cold starts
✅ **Better monitoring** - Built-in logs and metrics
✅ **Cron jobs** - Native support for background tasks
✅ **Simpler env vars** - Reference between services
✅ **Cost savings** - $5/month vs $7/month
✅ **Easier scaling** - Vertical + horizontal
✅ **Better DX** - Railway CLI, better dashboard

---

**Ready to start? Let me know and we'll begin with Phase 1!**
