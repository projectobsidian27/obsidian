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
- AUTH0_SECRET
- AUTH0_CLIENT_SECRET
- AUTH0_ISSUER_BASE_URL
- AUTH0_CLIENT_ID
- AUTH0_BASE_URL
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_APP_URL

**Notes:** Auto-deploys on push to main branch

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
**URL:** https://render.com
**Status:** ✅ Account created
**Resources:** TBD (Web Service + PostgreSQL to be created)
**Notes:** Free tier includes 750 hours/month

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

### HubSpot API
**Purpose:** CRM integration
**Status:** Not yet configured
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
