# Obsidian MVP Implementation Roadmap

This document outlines the step-by-step implementation plan to take Obsidian from the current foundation to a fully functional MVP.

---

## Phase 1: Core Authentication & Infrastructure (Week 1-2)

### 1.1 Magic Link Authentication ⚡ **Priority: CRITICAL**

**What it is:** Passwordless login via email links

**What you need to do:**
1. Choose an email service provider:
   - **Recommended:** SendGrid (free tier: 100 emails/day)
   - Alternative: Mailgun, AWS SES, Postmark

2. Set up email templates:
   ```python
   # apps/api/app/services/email.py
   - create_magic_link_email(email, token, link)
   - send_email(to, subject, html_body)
   ```

3. Implement token generation & storage:
   ```python
   # apps/api/app/services/auth.py
   - generate_magic_token() -> creates secure token
   - store_token_in_redis() -> 15-minute expiry
   - verify_token() -> checks validity
   ```

4. Update frontend to handle token verification:
   ```typescript
   // apps/web/src/pages/auth/verify.tsx
   - Read token from URL query params
   - Call /auth/verify API
   - Store session in localStorage/cookies
   - Redirect to /onboarding/trust-contract
   ```

**Estimated time:** 2-3 days
**Dependencies:** None
**Testing:** Send yourself a magic link, click it, verify you're logged in

---

### 1.2 Database Setup 🗄️ **Priority: CRITICAL**

**What it is:** PostgreSQL database for storing derived metrics (NOT raw CRM data)

**What you need to do:**
1. Install PostgreSQL locally:
   ```bash
   brew install postgresql@15
   brew services start postgresql@15
   ```

2. Create database schema:
   ```sql
   -- apps/api/app/db/schema.sql

   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE crm_connections (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id),
     crm_type VARCHAR(50) NOT NULL, -- 'hubspot', 'salesforce', 'dynamics'
     access_token_encrypted TEXT NOT NULL,
     refresh_token_encrypted TEXT,
     tenant_id VARCHAR(255),
     connected_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE scans (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id),
     pipeline_health DECIMAL(5,2),
     revenue_at_risk DECIMAL(15,2),
     zombie_deals INTEGER,
     integrity_score DECIMAL(5,2),
     confidence_index DECIMAL(3,2),
     scan_metadata JSONB, -- store signals, forecast, etc.
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE enforcement_logs (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     scan_id UUID REFERENCES scans(id),
     tasks_created INTEGER,
     tasks_completed INTEGER,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. Set up database connection:
   ```python
   # apps/api/app/db/connection.py
   from sqlalchemy import create_engine
   from sqlalchemy.orm import sessionmaker

   DATABASE_URL = os.getenv("DATABASE_URL")
   engine = create_engine(DATABASE_URL)
   SessionLocal = sessionmaker(bind=engine)
   ```

4. Add migration tool:
   ```bash
   cd apps/api
   python3 -m pip install alembic
   alembic init migrations
   ```

**Estimated time:** 1-2 days
**Dependencies:** None
**Testing:** Run migrations, insert test data, query it back

---

### 1.3 Redis Setup for Caching 🔴 **Priority: HIGH**

**What it is:** In-memory cache for tokens, session data, rate limiting

**What you need to do:**
1. Install Redis:
   ```bash
   brew install redis
   brew services start redis
   ```

2. Add Redis client to backend:
   ```bash
   cd apps/api
   python3 -m pip install redis
   ```

3. Create Redis service:
   ```python
   # apps/api/app/services/cache.py
   import redis

   redis_client = redis.from_url(os.getenv("REDIS_URL"))

   def set_with_expiry(key, value, seconds):
       redis_client.setex(key, seconds, value)

   def get(key):
       return redis_client.get(key)
   ```

**Estimated time:** 1 day
**Dependencies:** None
**Testing:** Store a value, retrieve it, verify expiry works

---

## Phase 2: HubSpot Integration (Week 2-3)

### 2.1 HubSpot OAuth Setup 🔗 **Priority: CRITICAL**

**What it is:** Connect to user's HubSpot account securely

**What you need to do:**
1. Register HubSpot Developer Account:
   - Go to https://developers.hubspot.com/
   - Create a new app
   - Get Client ID and Client Secret
   - Set redirect URI: `http://localhost:3000/auth/callback`

2. Implement OAuth flow:
   ```python
   # apps/api/app/routers/auth.py

   @router.get("/crm/hubspot/authorize")
   async def hubspot_authorize():
       auth_url = (
           f"https://app.hubspot.com/oauth/authorize?"
           f"client_id={HUBSPOT_CLIENT_ID}&"
           f"redirect_uri={REDIRECT_URI}&"
           f"scope=crm.objects.deals.read crm.objects.contacts.read"
       )
       return {"authorization_url": auth_url}

   @router.get("/crm/hubspot/callback")
   async def hubspot_callback(code: str):
       # Exchange code for access token
       response = httpx.post(
           "https://api.hubapi.com/oauth/v1/token",
           data={
               "grant_type": "authorization_code",
               "client_id": HUBSPOT_CLIENT_ID,
               "client_secret": HUBSPOT_CLIENT_SECRET,
               "redirect_uri": REDIRECT_URI,
               "code": code
           }
       )
       tokens = response.json()
       # Encrypt and store tokens in database
       # Create crm_connection record
       return {"status": "connected"}
   ```

3. Update frontend callback handler:
   ```typescript
   // apps/web/src/pages/auth/callback.tsx
   - Read code from URL
   - Call /auth/crm/hubspot/callback with code
   - Redirect to /onboarding/scanning
   ```

**Estimated time:** 2-3 days
**Dependencies:** Database setup
**Testing:** Click "Connect HubSpot", authorize, verify tokens are stored

---

### 2.2 HubSpot API Client 📡 **Priority: CRITICAL**

**What it is:** Fetch deal and contact data from HubSpot

**What you need to do:**
1. Create HubSpot client service:
   ```python
   # apps/api/app/services/hubspot.py

   class HubSpotClient:
       def __init__(self, access_token):
           self.access_token = access_token
           self.base_url = "https://api.hubapi.com"

       async def get_deals(self):
           response = await httpx.get(
               f"{self.base_url}/crm/v3/objects/deals",
               headers={"Authorization": f"Bearer {self.access_token}"},
               params={
                   "properties": "dealname,amount,dealstage,hs_lastmodifieddate,hubspot_owner_id",
                   "limit": 100
               }
           )
           return response.json()

       async def get_contacts_for_deal(self, deal_id):
           # Get associated contacts
           # Return engagement metrics
           pass

       async def get_activities(self, deal_id):
           # Get emails, calls, meetings for deal
           pass
   ```

2. Add pagination handling:
   ```python
   async def get_all_deals(self):
       all_deals = []
       after = None
       while True:
           response = await self.get_deals(after=after)
           all_deals.extend(response["results"])
           if not response.get("paging"):
               break
           after = response["paging"]["next"]["after"]
       return all_deals
   ```

**Estimated time:** 2-3 days
**Dependencies:** OAuth setup
**Testing:** Connect HubSpot, fetch deals, verify data structure

---

## Phase 3: Vanguard Scan Engine (Week 3-4)

### 3.1 Signal Calculation Algorithms 🧮 **Priority: CRITICAL**

**What it is:** The brain of Obsidian - analyzes pipeline health

**What you need to do:**
1. Implement stalled deal detection:
   ```python
   # apps/api/app/services/vanguard/signals.py

   def detect_stalled_deals(deals, stage_velocity_map):
       """
       Identify deals stuck in stages beyond normal velocity
       """
       stalled = []
       for deal in deals:
           days_in_stage = (today - deal["last_modified"]).days
           expected_days = stage_velocity_map.get(deal["stage"], 14)

           if days_in_stage > expected_days * 2:
               stalled.append({
                   "deal_id": deal["id"],
                   "days_stuck": days_in_stage,
                   "stage": deal["stage"],
                   "severity": calculate_severity(days_in_stage, expected_days)
               })
       return stalled
   ```

2. Implement ownership gap detection:
   ```python
   def detect_ownership_gaps(deals):
       """
       Find high-value deals without owners
       """
       gaps = []
       for deal in deals:
           if not deal.get("owner_id") and deal.get("amount", 0) > 10000:
               gaps.append({
                   "deal_id": deal["id"],
                   "amount": deal["amount"],
                   "stage": deal["stage"]
               })
       return gaps
   ```

3. Implement missing activity detection:
   ```python
   def detect_missing_activities(deals, activities_map):
       """
       Find deals without recent contact activity
       """
       missing = []
       for deal in deals:
           activities = activities_map.get(deal["id"], [])
           last_activity = max([a["date"] for a in activities]) if activities else None

           if not last_activity or (today - last_activity).days > 14:
               missing.append({
                   "deal_id": deal["id"],
                   "days_since_activity": (today - last_activity).days if last_activity else 999
               })
       return missing
   ```

4. Calculate composite scores:
   ```python
   def calculate_pipeline_health(signals):
       """
       Weighted composite score from all signals
       """
       base_score = 100

       # Stalled deals penalty
       stalled_penalty = len(signals["stalled_deals"]) * 1.5

       # Ownership gaps penalty
       ownership_penalty = len(signals["ownership_gaps"]) * 2.0

       # Missing activities penalty
       activity_penalty = len(signals["missing_activities"]) * 0.8

       health_score = max(0, base_score - stalled_penalty - ownership_penalty - activity_penalty)
       return round(health_score, 2)
   ```

**Estimated time:** 4-5 days
**Dependencies:** HubSpot client
**Testing:** Run on sample data, verify scores make sense

---

### 3.2 Scan Orchestration 🎯 **Priority: HIGH**

**What it is:** Coordinate the scan process from start to finish

**What you need to do:**
1. Create scan service:
   ```python
   # apps/api/app/services/vanguard/scan.py

   async def run_scan(user_id: str, crm_connection_id: str):
       # 1. Get CRM connection
       connection = await get_crm_connection(crm_connection_id)

       # 2. Initialize HubSpot client
       client = HubSpotClient(connection.access_token)

       # 3. Fetch all deals
       deals = await client.get_all_deals()

       # 4. Fetch activities for each deal
       activities = await fetch_all_activities(client, deals)

       # 5. Run signal calculations
       signals = {
           "stalled_deals": detect_stalled_deals(deals),
           "ownership_gaps": detect_ownership_gaps(deals),
           "missing_activities": detect_missing_activities(deals, activities),
           "task_compliance": calculate_task_compliance(deals)
       }

       # 6. Calculate scores
       pipeline_health = calculate_pipeline_health(signals)
       revenue_at_risk = calculate_revenue_at_risk(signals["stalled_deals"])
       integrity_score = calculate_integrity_score(deals)

       # 7. Generate revival forecast
       forecast = calculate_revival_forecast(signals)

       # 8. Save to database
       scan_result = await save_scan(
           user_id=user_id,
           pipeline_health=pipeline_health,
           revenue_at_risk=revenue_at_risk,
           signals=signals,
           forecast=forecast
       )

       return scan_result
   ```

2. Add background task support:
   ```python
   from fastapi import BackgroundTasks

   @router.post("/scan/run")
   async def trigger_scan(
       request: ScanRequest,
       background_tasks: BackgroundTasks
   ):
       scan_id = generate_scan_id()
       background_tasks.add_task(run_scan, request.user_id, request.crm_connection_id, scan_id)
       return {"scan_id": scan_id, "status": "processing"}
   ```

**Estimated time:** 2-3 days
**Dependencies:** Signal calculations, HubSpot client
**Testing:** Trigger scan, wait, verify results in database

---

## Phase 4: Enhancements (Week 4-5)

### 4.1 Audio Briefing Generation 🎧 **Priority: MEDIUM**

**What it is:** Generate spoken summary of scan results

**What you need to do:**
1. Choose text-to-speech service:
   - **Recommended:** ElevenLabs (realistic voices)
   - Alternative: Google Cloud TTS, AWS Polly, Azure Speech

2. Create briefing script generator:
   ```python
   # apps/api/app/services/scribe/briefing.py

   def generate_briefing_script(scan_result):
       script = f"""
       Your pipeline health score is {scan_result.pipeline_health} out of 100.

       You have {len(scan_result.signals.stalled_deals)} deals that are stalled,
       representing {format_currency(scan_result.revenue_at_risk)} in revenue at risk.

       Here are the key issues we found:
       - {len(scan_result.signals.ownership_gaps)} high-value deals without owners
       - {len(scan_result.signals.missing_activities)} deals with no recent activity

       Based on our analysis, if you take action now, you have a
       {scan_result.forecast.probability * 100}% chance of recovering
       {format_currency(scan_result.forecast.potential)} within
       {scan_result.forecast.timeframe}.
       """
       return script
   ```

3. Integrate TTS API:
   ```python
   async def generate_audio(script, scan_id):
       response = await httpx.post(
           "https://api.elevenlabs.io/v1/text-to-speech/voice-id",
           headers={"xi-api-key": ELEVENLABS_API_KEY},
           json={"text": script, "voice_settings": {...}}
       )
       audio_bytes = response.content

       # Save to cloud storage (S3, GCS, etc.)
       audio_url = await upload_to_storage(audio_bytes, f"{scan_id}.mp3")
       return audio_url
   ```

**Estimated time:** 2-3 days
**Dependencies:** Scan engine
**Testing:** Generate audio, listen to it, verify it sounds good

---

### 4.2 Tracking Pixel (ROI Measurement) 📊 **Priority: MEDIUM**

**What it is:** Measure which deals actually closed after using Obsidian

**What you need to do:**
1. Generate unique pixel URL:
   ```python
   @router.post("/pixel/register")
   async def register_pixel(user_id: str, scan_id: str):
       pixel_id = generate_unique_id()
       await store_pixel_mapping(pixel_id, user_id, scan_id)

       pixel_url = f"{API_URL}/pixel/{pixel_id}/track"
       pixel_html = f'<img src="{pixel_url}" width="1" height="1" />'

       return {"pixel_id": pixel_id, "pixel_html": pixel_html, "instructions": "..."}
   ```

2. Create tracking endpoint:
   ```python
   @router.get("/pixel/{pixel_id}/track")
   async def track_pixel(pixel_id: str):
       # Log pixel fire
       await log_pixel_event(pixel_id, timestamp=datetime.now())

       # Return 1x1 transparent GIF
       return Response(
           content=base64.b64decode(TRANSPARENT_GIF_BASE64),
           media_type="image/gif"
       )
   ```

3. Build ROI dashboard:
   ```typescript
   // apps/web/src/pages/dashboard/roi.tsx
   - Show deals that closed after scan
   - Compare with predicted revival forecast
   - Calculate actual vs predicted ROI
   ```

**Estimated time:** 2 days
**Dependencies:** None
**Testing:** Create pixel, embed in email, verify tracking works

---

### 4.3 Shareable Report Links 🔗 **Priority: HIGH**

**What it is:** Share scan results with team members

**What you need to do:**
1. Generate shareable link:
   ```python
   @router.post("/report/share")
   async def create_share_link(scan_id: str):
       share_token = generate_secure_token()
       await store_share_token(share_token, scan_id, expires_in_days=30)

       share_url = f"{APP_URL}/report/shared/{share_token}"
       return {"share_url": share_url, "expires_at": expires_at}
   ```

2. Create public report page:
   ```typescript
   // apps/web/src/pages/report/shared/[token].tsx
   - Fetch report by token (no auth required)
   - Display read-only version
   - Add "Get Obsidian for your team" CTA
   ```

**Estimated time:** 1-2 days
**Dependencies:** None
**Testing:** Share link, open in incognito, verify report loads

---

## Phase 5: Task Enforcement (Week 5-6)

### 5.1 Task Generation Engine ⚙️ **Priority: HIGH**

**What it is:** Generate actionable tasks for each issue found

**What you need to do:**
1. Create task templates:
   ```python
   # apps/api/app/services/command/tasks.py

   TASK_TEMPLATES = {
       "stalled_deal": {
           "title": "Follow up on stalled deal: {deal_name}",
           "description": "This deal has been in {stage} for {days} days. Expected: {expected} days.",
           "priority": "high",
           "due_days": 1
       },
       "ownership_gap": {
           "title": "Assign owner to {deal_name} (${amount})",
           "description": "High-value opportunity needs an owner assigned immediately.",
           "priority": "urgent",
           "due_days": 0
       },
       "missing_activity": {
           "title": "Re-engage with {contact_name} for {deal_name}",
           "description": "No contact activity in {days} days. Schedule a call or send an email.",
           "priority": "medium",
           "due_days": 3
       }
   }
   ```

2. Generate tasks from signals:
   ```python
   def generate_tasks(scan_result):
       tasks = []

       for stalled in scan_result.signals["stalled_deals"]:
           tasks.append(create_task_from_template(
               "stalled_deal",
               deal=stalled,
               due_date=datetime.now() + timedelta(days=1)
           ))

       for gap in scan_result.signals["ownership_gaps"]:
           tasks.append(create_task_from_template(
               "ownership_gap",
               deal=gap,
               due_date=datetime.now()
           ))

       return tasks
   ```

**Estimated time:** 2 days
**Dependencies:** Scan engine
**Testing:** Run scan, verify tasks are generated correctly

---

### 5.2 CRM Task Injection 💉 **Priority: CRITICAL**

**What it is:** Create tasks directly in HubSpot (idempotent)

**What you need to do:**
1. Implement HubSpot task creation:
   ```python
   # apps/api/app/services/hubspot.py

   async def create_task(self, task_data):
       # Check if task already exists (idempotency)
       existing = await self.find_task_by_metadata(task_data["obsidian_id"])
       if existing:
           return existing

       response = await httpx.post(
           f"{self.base_url}/crm/v3/objects/tasks",
           headers={"Authorization": f"Bearer {self.access_token}"},
           json={
               "properties": {
                   "hs_task_subject": task_data["title"],
                   "hs_task_body": task_data["description"],
                   "hs_task_status": "NOT_STARTED",
                   "hs_task_priority": task_data["priority"],
                   "hs_timestamp": task_data["due_date"].isoformat(),
                   "hs_task_type": "TODO",
                   # Custom property for idempotency
                   "obsidian_task_id": task_data["obsidian_id"]
               }
           }
       )
       return response.json()
   ```

2. Associate tasks with deals:
   ```python
   async def associate_task_with_deal(self, task_id, deal_id):
       await httpx.put(
           f"{self.base_url}/crm/v3/objects/tasks/{task_id}/associations/deals/{deal_id}/todo_to_deal"
       )
   ```

3. Build enforcement endpoint:
   ```python
   @router.post("/enforce/commit")
   async def commit_enforcement(request: EnforceCommitRequest):
       # Get tasks to create
       tasks = await get_tasks_for_scan(request.scan_id)

       # Initialize HubSpot client
       client = HubSpotClient(request.access_token)

       # Create tasks (idempotent)
       created_tasks = []
       for task in tasks:
           result = await client.create_task(task)
           await client.associate_task_with_deal(result["id"], task["deal_id"])
           created_tasks.append(result)

       # Log to audit trail
       await create_enforcement_log(
           scan_id=request.scan_id,
           tasks_created=len(created_tasks)
       )

       return {"status": "committed", "tasks_created": len(created_tasks)}
   ```

**Estimated time:** 3-4 days
**Dependencies:** Task generation, HubSpot client
**Testing:** Commit tasks, check HubSpot UI, verify they appear

---

## Phase 6: Polish & Launch Prep (Week 6-7)

### 6.1 Error Handling & Logging 🐛 **Priority: HIGH**

**What you need to do:**
1. Add structured logging:
   ```python
   import logging
   from pythonjsonlogger import jsonlogger

   logger = logging.getLogger()
   handler = logging.StreamHandler()
   formatter = jsonlogger.JsonFormatter()
   handler.setFormatter(formatter)
   logger.addHandler(handler)
   ```

2. Add error tracking (Sentry):
   ```bash
   python3 -m pip install sentry-sdk
   ```

   ```python
   import sentry_sdk
   sentry_sdk.init(dsn=SENTRY_DSN)
   ```

3. Add retry logic for API calls:
   ```python
   from tenacity import retry, stop_after_attempt, wait_exponential

   @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
   async def fetch_with_retry(url):
       response = await httpx.get(url)
       response.raise_for_status()
       return response.json()
   ```

**Estimated time:** 2 days

---

### 6.2 Rate Limiting & Security 🔐 **Priority: HIGH**

**What you need to do:**
1. Add rate limiting:
   ```python
   from slowapi import Limiter
   from slowapi.util import get_remote_address

   limiter = Limiter(key_func=get_remote_address)

   @app.get("/api/endpoint")
   @limiter.limit("10/minute")
   async def endpoint():
       pass
   ```

2. Encrypt sensitive data:
   ```python
   from cryptography.fernet import Fernet

   def encrypt_token(token: str) -> str:
       f = Fernet(ENCRYPTION_KEY)
       return f.encrypt(token.encode()).decode()

   def decrypt_token(encrypted: str) -> str:
       f = Fernet(ENCRYPTION_KEY)
       return f.decrypt(encrypted.encode()).decode()
   ```

**Estimated time:** 2 days

---

### 6.3 Testing 🧪 **Priority: MEDIUM**

**What you need to do:**
1. Write unit tests:
   ```python
   # apps/api/tests/test_signals.py

   def test_detect_stalled_deals():
       deals = [
           {"id": "1", "stage": "proposal", "last_modified": 30_days_ago}
       ]
       stalled = detect_stalled_deals(deals, {"proposal": 14})
       assert len(stalled) == 1
   ```

2. Write integration tests:
   ```python
   # apps/api/tests/test_scan.py

   @pytest.mark.asyncio
   async def test_full_scan_flow():
       # Create test user
       # Connect mock CRM
       # Trigger scan
       # Verify results
       pass
   ```

**Estimated time:** 3-4 days

---

## Summary Timeline

| Phase | Duration | Priority | Status |
|-------|----------|----------|--------|
| **Phase 1: Auth & Infra** | 1-2 weeks | CRITICAL | 🟡 Ready to start |
| **Phase 2: HubSpot Integration** | 1-2 weeks | CRITICAL | ⚪ Blocked by Phase 1 |
| **Phase 3: Vanguard Scan** | 1-2 weeks | CRITICAL | ⚪ Blocked by Phase 2 |
| **Phase 4: Enhancements** | 1 week | MEDIUM | ⚪ Can start after Phase 3 |
| **Phase 5: Task Enforcement** | 1-2 weeks | HIGH | ⚪ Blocked by Phase 3 |
| **Phase 6: Polish** | 1 week | HIGH | ⚪ Final phase |

**Total estimated time:** 6-7 weeks for full MVP

---

## Quick Wins (Start Here)

If you want to see progress quickly, start with these in order:

1. **Magic Link Auth** (2-3 days) - Get login working
2. **Database Setup** (1 day) - Store user data
3. **HubSpot OAuth** (2-3 days) - Connect to real CRM
4. **Basic Scan** (3-4 days) - Fetch deals, calculate one simple metric
5. **Show Results** (1 day) - Display in existing report UI

That's 9-12 days to a working demo you can show to potential customers!

---

## What You Have Now ✅

- Complete UI/UX foundation
- API structure with routes
- Development environment running
- Design system and styling
- Mock data for testing UI

## What You Need to Build ⏳

- Authentication backend
- Database layer
- CRM integrations
- Signal algorithms
- Task enforcement
- Email notifications
- Error handling
- Security hardening

---

## Resources

- [HubSpot API Docs](https://developers.hubspot.com/docs/api/overview)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Redis Docs](https://redis.io/docs/)

## Questions?

Refer to:
- [README.md](README.md) - Project overview
- [GETTING_STARTED.md](GETTING_STARTED.md) - How to run locally
- [Product Charter](obsidian-business-docs/Obsidian_Product_Charter.md) - Product vision
