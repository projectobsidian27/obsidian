# Obsidian — Pipeline Discipline Platform

Restore order to your revenue pipeline — recover what you've already earned.

## Overview

Obsidian is a Pipeline Discipline Platform that helps RevOps/CRM teams detect stalls, ownership gaps, and revenue at risk in their CRM pipelines. We provide explainable signals with CRM-native task injection to enforce process discipline.

**Mission:** "We restore order to the revenue pipeline — helping teams recover what they've already earned."

## Core Philosophy

- **Discipline > Hustle** — Stop chasing deals. Start enforcing process.
- **Outcome > Noise** — Explainable signals with confidence scores. No black boxes.
- **Signal > Vanity** — Track what matters: Pipeline integrity, motion discipline, revival opportunities.

## Project Structure

```
obsidian-ai/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # FastAPI backend
├── obsidian-business-docs/  # Business documentation
└── Makefile          # Build and development commands
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Make

### Setup

```bash
# Install dependencies
make setup

# Start development servers
make dev
# Web runs on http://localhost:3000
# API runs on http://localhost:8000
```

### Other Commands

```bash
make build      # Build production bundle
make lint       # Run linters
make typecheck  # Run type checking
make test       # Run tests
make format     # Format code
make clean      # Clean build artifacts
```

## Architecture

### MVP Stack

- **Frontend:** Next.js (React, TypeScript)
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL (derived metrics only)
- **Cache:** Redis
- **Deployment:** Serverless + container hybrid

### Key Components (Units)

1. **Vanguard (Scan)** — Detects stalls, ownership gaps; builds explainable signals
2. **Command (Integrity)** — Enforces CRM tasks; idempotent; audited
3. **Scribe (Narrative)** — Human-grade explanations + audio briefings
4. **Evidence (Proof)** — Anonymized case studies + benchmarks
5. **Interface (UX)** — Onboarding, trust wall, reports

## Onboarding Flow

1. **Sign-in** — Magic link authentication (passwordless)
2. **Trust Contract** — Transparent data handling promises
3. **Connect CRM** — OAuth to HubSpot (Phase 1), Salesforce/Dynamics (Phase 2)
4. **Vanguard Scan** — Pipeline diagnostic in < 90 seconds
5. **Explainable Report** — Signals, weights, audio briefing
6. **Optional Pixel** — 30-day ROI tracking
7. **Conversion** — Task enforcement gated behind paid plan

## API Endpoints

### Auth
- `POST /auth/magic-link` — Send magic link
- `POST /auth/verify` — Verify token
- `POST /auth/crm/connect` — Initiate CRM OAuth
- `POST /auth/crm/callback` — Handle OAuth callback

### Scan
- `POST /scan/run` — Trigger Vanguard scan
- `GET /scan/:id/results` — Get scan results
- `GET /scan/:id/status` — Check scan status

### Enforce
- `POST /enforce/preview` — Preview task injection (read-only)
- `POST /enforce/commit` — Commit tasks to CRM (paid plan)
- `GET /enforce/status/:id` — Get enforcement status

## Key Metrics

- **Pipeline Health Score** — Composite score from weighted signals
- **Revenue at Risk** — Pipeline value from stalled deals
- **Integrity Score** — CRM data quality & completeness
- **Confidence Index** — Signal reliability score
- **Revival Forecast** — Estimated recovery potential

## Data Stance

- **No raw CRM storage** — Only derived metrics
- **Ephemeral processing** — Pipeline data processed in-memory
- **Single-tenant** — Isolated instances per customer
- **Explainable signals** — Every score, weight, threshold visible
- **Revocable access** — Disconnect anytime, data purged

## Roadmap

### Phase 1 (0-120 days) — MVP
- [x] Diagnostic scan
- [x] HubSpot OAuth
- [x] Explainable signals
- [x] Audio briefing
- [x] Task preview
- [ ] Magic link auth
- [ ] Tracking pixel
- [ ] Hosted reports

### Phase 2 (4-8 months)
- [ ] Continuous enforcement
- [ ] Salesforce integration
- [ ] Dynamics 365 integration
- [ ] Slack/Teams notifications
- [ ] Best Practice Relay (BPR)

### Phase 3 (9-15 months)
- [ ] Success Unit
- [ ] Benchmark library
- [ ] SDK/API for developers
- [ ] Predictive trends
- [ ] Mobile app

## Development

### Frontend (Next.js)

```bash
cd apps/web
npm run dev
```

Key pages:
- `/` — Landing page
- `/onboarding/trust-contract` — Trust contract
- `/onboarding/connect-crm` — CRM connection
- `/onboarding/scanning` — Scan progress
- `/dashboard/report` — Diagnostic report

### Backend (FastAPI)

```bash
cd apps/api
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

## License

Proprietary — All rights reserved

## Contact

For more information, see the business documentation in `obsidian-business-docs/`
