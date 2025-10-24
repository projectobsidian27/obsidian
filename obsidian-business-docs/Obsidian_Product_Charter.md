Obsidian — Section 1: Strategic Positioning (2025-10-24)

Mission: "We restore order to the revenue pipeline — helping teams recover what they’ve already earned."

Core Philosophy:
- Discipline > Hustle
- Outcome > Noise
- Signal > Vanity

Problem: CRM pipelines decay; ownership blurs; forecasts lie. Tools add automation, not truth.

Solution: A discipline layer on top of HubSpot/Salesforce/Dynamics with explainable signals, CRM-native task injection, and an Evidence Unit to prove ROI.

ICP: RevOps/CRM Admins (primary); VP Sales/CRO; Founder-Operators.

Market: ~$81B (2025) growing → $123B (2030). Beachhead: HubSpot; follow-on: Salesforce; Phase-2: Dynamics.

Pricing: Start Flat Tier → move to Pipeline Volume; optional Performance-based for enterprise. Target margin: 80–85%.


Obsidian — Section 2: Product Architecture & MVP Units (2025-10-24)

Single-tenant by design. Instance-specific AI Units with Best Practice Relay (anonymized patterns).

Units:
- Vanguard (Scan): detects stalls, ownership gaps; builds explainable signals.
- Command (Integrity): enforces CRM tasks; idempotent; audited.
- Scribe (Narrative): human-grade explanations + audio briefings.
- Evidence (Proof): anonymized case studies + benchmarks.
- Interface (UX): onboarding, trust wall, reports. LT oversees orchestration.

Data stance: no raw CRM storage; derived metrics only; ephemeral processing.


Obsidian — Section 3: Technical Architecture (2025-10-24)

MVP Stack: Next.js (web), FastAPI/NestJS (api), Postgres (derived-only), Redis (cache), serverless + container hybrid. OAuth to HubSpot (MVP), Salesforce/Dynamics Phase-2.

APIs: /scan/run, /scan/:id/results, /enforce/preview, /enforce/commit, /report/sharelink, /pixel/register.

Explainability: Signals with weights; confidence; math and thresholds visible in UI.


Obsidian — Section 4: Onboarding & Diagnostic Trial Flow (2025-10-24)

Flow: Sign-in (magic link) → Trust Contract → Connect CRM → Vanguard Scan (<90s) → Explainable Report + Audio → Optional Pixel (30d) → Conversion.

Panels: Pipeline Health, Revenue at Risk, Signals & Causes, Revival Forecast. Shareable hosted report. Task enforcement gated behind paid plan.


Obsidian — Section 5: Post-Trial Conversion Strategy (2025-10-24)

Principles: proof before payment; always-be-closing softly; ROI deltas; optional human hand-off.

Lifecycle: Trial → Decision (Day 30–40) → Activation → Engagement → Expansion. Health metrics & churn prevention protocol aligned to Evidence Unit outputs.


Obsidian — Section 6: Success Metrics & Reporting (2025-10-24)

Client dashboard: Integrity %, Motion Discipline, Zombie Ratio, Revival $, Confidence Index, ROI.

Internal: scan success/latency, trial→paid, NRR/GRR, error budgets, Unit utilization. Monthly Proof Snapshot; Quarterly Intelligence Report.


Obsidian — Section 7: Roadmap & Phased Plan (2025-10-24)

Phase 1 (0–120d): Diagnostic + HubSpot + Proof + Audio + Task preview.
Phase 2 (4–8 mo): Continuous enforcement, Salesforce/Dynamics, Slack/Teams, BPR.
Phase 3 (9–15 mo): Success Unit, benchmarks, SDK/API, predictive trends, mobile.

Resourcing ~ $650k Year 1; target $1M ARR.
