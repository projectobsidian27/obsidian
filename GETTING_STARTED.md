# Getting Started with Obsidian

Welcome! Here's how to get your Obsidian Pipeline Discipline Platform up and running.

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
cd "/Users/nickmisewicz/Desktop/Nick's project/obsidian-ai"
make setup
```

This will:
- Install npm packages for the Next.js frontend
- Install Python packages for the FastAPI backend

### Step 2: Configure Environment

```bash
# Frontend environment
cd apps/web
cp .env.example .env.local
# Edit .env.local with your settings

# Backend environment
cd ../api
cp .env.example .env
# Edit .env with your settings
```

### Step 3: Start Development Servers

```bash
# From the obsidian-ai directory:
make dev
```

This starts:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## What You'll See

### 1. Landing Page (/)
- Value proposition and email capture
- "How It Works" section
- Core philosophy display

### 2. Trust Contract (/onboarding/trust-contract)
- Data handling commitments
- No raw CRM storage promise
- Acceptance checkbox

### 3. Connect CRM (/onboarding/connect-crm)
- HubSpot OAuth ready (Phase 1)
- Salesforce & Dynamics placeholders (Phase 2)

### 4. Scanning Progress (/onboarding/scanning)
- Animated progress bar
- Real-time status updates
- Simulates 90-second scan

### 5. Diagnostic Report (/dashboard/report)
- Pipeline Health Score
- Revenue at Risk
- Explainable Signals (click to see math!)
- Revival Forecast

## Testing the Flow

1. Visit http://localhost:3000
2. Enter an email and click "Get Started Free"
3. You'll see an alert (magic link not yet implemented)
4. Manually navigate to `/onboarding/trust-contract`
5. Accept the contract
6. Connect to HubSpot (redirects to scanning)
7. Watch the scan progress
8. View your diagnostic report!

## API Testing

Visit http://localhost:8000/docs to explore the API:

- **Health Check:** GET `/health`
- **Magic Link:** POST `/auth/magic-link`
- **Run Scan:** POST `/scan/run`
- **Get Results:** GET `/scan/{id}/results`
- **Preview Tasks:** POST `/enforce/preview`

All endpoints return mock data for now.

## Project Structure

```
obsidian-ai/
├── apps/web/           # Frontend (Next.js)
│   └── src/
│       ├── pages/      # Page components
│       ├── styles/     # CSS
│       └── lib/        # Utilities (API client)
│
└── apps/api/           # Backend (FastAPI)
    └── app/
        ├── main.py     # Main app
        └── routers/    # API endpoints
```

## Available Commands

```bash
make setup      # Install all dependencies
make dev        # Start dev servers
make build      # Build for production
make lint       # Run linters
make typecheck  # Check types
make test       # Run tests
make format     # Format code
make clean      # Clean build artifacts
```

## Next Development Steps

### Priority 1: Authentication
- [ ] Implement magic link email sending
- [ ] Set up email service (SendGrid/Mailgun)
- [ ] Create session management
- [ ] Add protected routes

### Priority 2: HubSpot Integration
- [ ] Register HubSpot OAuth app
- [ ] Implement OAuth callback handler
- [ ] Store access tokens securely
- [ ] Test CRM connection flow

### Priority 3: Vanguard Scan
- [ ] Design signal calculation algorithms
- [ ] Build deal stage velocity tracking
- [ ] Implement ownership gap detection
- [ ] Create activity analysis logic

### Priority 4: Database
- [ ] Set up PostgreSQL
- [ ] Design schema for derived metrics
- [ ] Create migration scripts
- [ ] Implement data models

## Common Issues

### Port Already in Use
```bash
# Kill processes on ports 3000 and 8000
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

### Dependencies Not Installing
```bash
# Clear caches and reinstall
make clean
rm -rf node_modules
npm cache clean --force
make setup
```

### Python Version Issues
Make sure you're using Python 3.9+:
```bash
python3 --version
```

## Resources

- [README.md](README.md) — Full project documentation
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) — What we built
- [Product Charter](obsidian-business-docs/Obsidian_Product_Charter.md) — Vision & strategy
- [API Docs](http://localhost:8000/docs) — Interactive API explorer

## Support

Questions? Check the documentation in `obsidian-business-docs/` for:
- Product vision
- Technical architecture
- Onboarding flow details
- Pricing strategy
- Market research

---

**Ready to build?** Run `make dev` and start coding! 🚀
