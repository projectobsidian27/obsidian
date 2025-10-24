# Quick Deploy to Vercel - Manual Steps

Your code is committed and ready to deploy! Here's what to do:

## Step 1: Authenticate GitHub CLI (30 seconds)

```bash
cd "/Users/nickmisewicz/Desktop/Nick's project"
gh auth login
```

Follow the prompts:
- What account? **GitHub.com**
- Protocol? **HTTPS**
- Authenticate? **Login with a web browser**
- Copy the one-time code, press Enter, paste in browser

## Step 2: Create GitHub Repository (1 minute)

```bash
gh repo create obsidian --public --source=. --remote=origin --push
```

This will:
- Create `projectobsidian27/obsidian` on GitHub
- Set it as your remote
- Push all your code

## Step 3: Deploy to Vercel via Dashboard (3 minutes)

1. **Go to:** https://vercel.com/new

2. **Import:** Click "Import Git Repository"

3. **Select:** `projectobsidian27/obsidian`

4. **Configure:**
   - Framework: **Next.js**
   - Root Directory: **`obsidian-ai/apps/web`**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **Add Environment Variables:**

Click "Environment Variables" and add these:

```
AUTH0_SECRET=(run: openssl rand -hex 32)
AUTH0_BASE_URL=(will be https://YOUR-APP.vercel.app)
AUTH0_ISSUER_BASE_URL=https://YOUR-DOMAIN.auth0.com
AUTH0_CLIENT_ID=(from Auth0 dashboard)
AUTH0_CLIENT_SECRET=(from Auth0 dashboard)
AUTH0_AUDIENCE=https://YOUR-DOMAIN.auth0.com/api/v2/
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

6. **Click Deploy!**

## Step 4: Get Your Vercel URL

After deployment (takes ~2 minutes), you'll get:
```
https://obsidian-xxxxx.vercel.app
```

## Step 5: Update Auth0

1. Go to: https://manage.auth0.com
2. Applications → Your App → Settings
3. Update:
   - **Allowed Callback URLs:** `https://your-app.vercel.app/api/auth/callback, http://localhost:3000/api/auth/callback`
   - **Allowed Logout URLs:** `https://your-app.vercel.app, http://localhost:3000`
   - **Allowed Web Origins:** `https://your-app.vercel.app, http://localhost:3000`
4. Save Changes

## Step 6: Update Vercel Environment Variables

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Edit `AUTH0_BASE_URL` → `https://your-app.vercel.app`
3. Edit `NEXT_PUBLIC_APP_URL` → `https://your-app.vercel.app`
4. **Redeploy:** Go to Deployments → Click ... → Redeploy

## Done!

Visit `https://your-app.vercel.app` and test your app!

---

## Alternative: Deploy via Vercel CLI

```bash
cd obsidian-ai/apps/web
vercel login
vercel --prod
```

Follow prompts, add environment variables when asked.

---

## Troubleshooting

**Can't authenticate gh?**
- Make sure you're logged into GitHub in your browser
- Try `gh auth status` to check

**Vercel build fails?**
- Check the build logs in Vercel dashboard
- Verify all environment variables are set

**Auth0 callback error?**
- Make sure URLs match exactly in Auth0 settings
- Try clearing browser cookies

---

Need help? The code is ready - just run the commands above! 🚀
