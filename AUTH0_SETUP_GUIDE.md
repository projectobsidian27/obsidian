# Auth0 Setup Guide for Obsidian

## ✅ What's Already Done

- [x] PostgreSQL installed and running
- [x] Redis installed and running
- [x] Database schema created (7 tables)
- [x] Auth0 SDKs installed
- [x] Environment files created

---

## 🔧 What You Need To Do

### Step 1: Get Your Auth0 Credentials

1. **Go to your Auth0 Dashboard:** https://manage.auth0.com

2. **Create Application** (if you haven't already):
   - Click "Applications" → "Applications"
   - Click "Create Application"
   - Name: **"Obsidian Pipeline Platform"**
   - Type: **"Regular Web Applications"**
   - Click "Create"

3. **Configure Application Settings:**
   - Go to "Settings" tab
   - Add these URLs:
     ```
     Allowed Callback URLs:
     http://localhost:3000/api/auth/callback

     Allowed Logout URLs:
     http://localhost:3000

     Allowed Web Origins:
     http://localhost:3000
     ```
   - Click "Save Changes"

4. **Copy these credentials** (from the Settings tab):
   - **Domain** (e.g., `dev-xxxxx.us.auth0.com`)
   - **Client ID** (long string)
   - **Client Secret** (long string)

---

### Step 2: Enable Passwordless (Magic Links)

1. In Auth0 Dashboard → **Authentication** → **Passwordless**
2. Toggle **Email** to ON
3. Click "Email" to configure:
   - From: `noreply@yourdomain.com` (or use Auth0's default)
   - Subject: `Your login link for Obsidian`
   - Template: Keep default or customize
4. Click "Save"

---

### Step 3: Update Environment Variables

#### Frontend (.env.local)

Edit: `/Users/nickmisewicz/Desktop/Nick's project/obsidian-ai/apps/web/.env.local`

```bash
# Generate a secret (run this in terminal):
openssl rand -hex 32

# Then update:
AUTH0_SECRET='paste_the_generated_secret_here'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN.auth0.com'
AUTH0_CLIENT_ID='YOUR_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_CLIENT_SECRET'
AUTH0_AUDIENCE='https://YOUR_AUTH0_DOMAIN.auth0.com/api/v2/'

NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace:**
- `YOUR_AUTH0_DOMAIN` → Your actual domain from Step 1
- `YOUR_CLIENT_ID` → Client ID from Step 1
- `YOUR_CLIENT_SECRET` → Client Secret from Step 1

#### Backend (.env)

Edit: `/Users/nickmisewicz/Desktop/Nick's project/obsidian-ai/apps/api/.env`

```bash
AUTH0_DOMAIN='YOUR_AUTH0_DOMAIN.auth0.com'
AUTH0_AUDIENCE='https://YOUR_AUTH0_DOMAIN.auth0.com/api/v2/'
AUTH0_ISSUER='https://YOUR_AUTH0_DOMAIN.auth0.com/'
```

**Replace:**
- `YOUR_AUTH0_DOMAIN` → Same domain from Step 1

---

### Step 4: Test Authentication

1. **Restart your dev servers:**
   ```bash
   cd obsidian-ai
   # Kill existing servers (Ctrl+C in the terminal running `make dev`)
   make dev
   ```

2. **Visit:** http://localhost:3000

3. **Try logging in:**
   - Click "Get Started Free"
   - You should be redirected to Auth0
   - Enter your email
   - Check your email for the magic link
   - Click the link → You should be logged in!

---

## 📋 Quick Reference

### Auth0 Dashboard URLs

| Purpose | URL |
|---------|-----|
| Main Dashboard | https://manage.auth0.com |
| Applications | https://manage.auth0.com/dashboard/us/dev-xxxxx/applications |
| Passwordless | https://manage.auth0.com/dashboard/us/dev-xxxxx/connections/passwordless |
| Logs | https://manage.auth0.com/dashboard/us/dev-xxxxx/logs |

### Local Services Status

Check if everything is running:

```bash
# PostgreSQL
psql obsidian_dev -c "SELECT version();"

# Redis
redis-cli ping  # Should return "PONG"

# Check tables
psql obsidian_dev -c "\dt"
```

---

## 🚨 Troubleshooting

### "Callback URL mismatch" error
- Make sure `http://localhost:3000/api/auth/callback` is in "Allowed Callback URLs"

### "Invalid state" error
- Clear browser cookies/cache
- Make sure `AUTH0_SECRET` is set and unique

### Database connection error
- Check PostgreSQL is running: `brew services list | grep postgresql`
- Test connection: `psql obsidian_dev -c "SELECT 1;"`

### Redis connection error
- Check Redis is running: `brew services list | grep redis`
- Test connection: `redis-cli ping`

---

## ✅ Verification Checklist

Before proceeding, verify:

- [ ] Auth0 application created
- [ ] Callback URLs configured
- [ ] Passwordless email enabled
- [ ] Frontend `.env.local` updated with real credentials
- [ ] Backend `.env` updated with real credentials
- [ ] `AUTH0_SECRET` generated and added
- [ ] Dev servers restarted
- [ ] Can visit http://localhost:3000
- [ ] Can click login and see Auth0 screen
- [ ] Can receive magic link email
- [ ] Can log in successfully

---

## 🎯 Next Steps (After Auth Works)

Once authentication is working, we'll build:

1. **User Profile Page** — Show logged-in user info
2. **Protected Routes** — Require auth for dashboard pages
3. **HubSpot OAuth** — Connect CRM
4. **Vanguard Scan** — Run pipeline analysis

---

## 📞 Need Help?

If you're stuck, share:
1. The error message you're seeing
2. Which step you're on
3. Screenshot of Auth0 settings (hide secrets!)

I'll help you debug!
