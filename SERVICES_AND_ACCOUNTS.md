# Obsidian - Services & Accounts Tracking

## Overview
This document tracks all third-party services used for the Obsidian Pipeline Discipline Platform.

---

## Services List

### 1. GitHub
**Purpose:** Version control and code repository
**Login Method:** GitHub account (projectobsidian27)
**URL:** https://github.com/projectobsidian27/obsidian
**Notes:** Main repository, connected to Vercel for auto-deploy

---

### 2. Vercel
**Purpose:** Frontend hosting (Next.js app)
**Login Method:** Connected via GitHub
**URL:** https://vercel.com/nick-misewiczs-projects-e72f50c6/obsidian
**Production URL:** https://obsidian-nick-misewiczs-projects-e72f50c6.vercel.app
**Environment Variables:**
- AUTH0_SECRET: `52g1XzhLlrVDa2_iwHvIdd-n6yImvKfL_V7mHQpdzs2OTowU05HzmtrsdJZ_ZM74`
- AUTH0_CLIENT_SECRET: `52g1XzhLlrVDa2_iwHvIdd-n6yImvKfL_V7mHQpdzs2OTowU05HzmtrsdJZ_ZM74`
- AUTH0_ISSUER_BASE_URL: `https://dev-ybvv5kwju22dtdbv.us.auth0.com`
- AUTH0_CLIENT_ID: `7c1oR94u34DiCswzK8L8B2sSf45ouU27`
- AUTH0_BASE_URL: `https://obsidian-nick-misewiczs-projects-e72f50c6.vercel.app`
- NEXT_PUBLIC_API_URL: `https://obsidian-api-iyhx.onrender.com` ✅ Updated
- NEXT_PUBLIC_APP_URL: `https://obsidian-nick-misewiczs-projects-e72f50c6.vercel.app`

**Notes:** Auto-deploys on push to main branch. Frontend now connected to Render backend.

---

### 3. Auth0
**Purpose:** Authentication (magic link/passwordless)
**Login Method:** GitHub login
**URL:** https://manage.auth0.com/dashboard
**Domain:** dev-ybvv5kwju22dtdbv.us.auth0.com
**Application:** Obsidian Pipeline Platform
**Client ID:** 7c1oR94u34DiCswzK8L8B2sSf45ouU27
**Client Secret:** 52g1XzhLlrVDa2_iwHvIdd-n6yImvKfL_V7mHQpdzs2OTowU05HzmtrsdJZ_ZM74
**Allowed Callback URLs:** https://obsidian-nick-misewiczs-projects-e72f50c6.vercel.app/api/auth/callback
**Allowed Logout URLs:** https://obsidian-nick-misewiczs-projects-e72f50c6.vercel.app
**Notes:** Currently in MVP mode (auth flow simplified)

---

### 4. Render
**Purpose:** Backend hosting (FastAPI), PostgreSQL database
**Login Method:** Connected via GitHub
**URL:** https://dashboard.render.com
**Blueprint ID:** exs-d3tu2v1r0fns73apirqg
**Status:** ✅ Live and Running

**Resources:**
- **Database:** obsidian-db (PostgreSQL 15) - ✅ Live
  - Connection: `postgresql://obsidian_prod_user:ET1FDE7S5gpbWOq5vXjkl7lssbOvfe0B@dpg-d3tu316r433s73dvhovg-a.oregon-postgres.render.com/obsidian_prod`
  - Schema: 7 tables created (users, crm_connections, scans, enforcement_logs, shared_reports, tracking_pixels, audit_logs)
- **Web Service:** obsidian-api (Python FastAPI) - ✅ Live
  - **Backend URL:** https://obsidian-api-iyhx.onrender.com

**Notes:** Free tier includes 750 hours/month for web service, PostgreSQL free tier includes 90 days then $7/month

---

### 5. Local Development Services

#### PostgreSQL (Local)
**Purpose:** Development database
**Version:** PostgreSQL 14
**Database:** obsidian_dev
**Port:** 5432
**Status:** Running locally

#### Redis (Local)
**Purpose:** Development cache
**Version:** 8.0.2
**Port:** 6379
**Status:** Running locally

---

## Upcoming Services (Not Yet Set Up)

### Upstash Redis
**Purpose:** Production Redis cache
**Status:** Not yet created
**Free Tier:** Yes (10,000 commands/day)
**Notes:** Will replace local Redis for production

---

### 6. HubSpot Developer
**Purpose:** CRM OAuth integration
**Login Method:** Developer account
**URL:** https://app.hubspot.com/developers
**Status:** ✅ App Created

**App Details:**
- **App Name:** Obsidian Pipeline Platform
- **App Type:** Private Legacy App
- **Client ID:** [Stored in Render environment variables]
- **Client Secret:** [Stored in Render environment variables]
- **Access Token:** [Stored in Render environment variables]
- **Redirect URL:** https://obsidian-api-iyhx.onrender.com/auth/hubspot/callback

**Scopes:**
- crm.objects.deals.read
- crm.objects.contacts.read
- crm.objects.companies.read
- crm.objects.owners.read
- crm.schemas.deals.read
- timeline

**Notes:** OAuth integration for Vanguard scanning

---

## Local Environment Files

### Frontend (.env.local)
Location: `obsidian-ai/apps/web/.env.local`

### Backend (.env)
Location: `obsidian-ai/apps/api/.env`

---

## Quick Reference

**Deploy Frontend:** Push to GitHub main branch (auto-deploys to Vercel)
**Deploy Backend:** TBD (will set up via Render)
**View Logs:** Vercel dashboard for frontend, Render dashboard for backend
**Database Schema:** `obsidian-ai/apps/api/app/db/schema.sql`

---

*Last Updated: 2025-10-24*
