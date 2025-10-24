Obsidian — Section 2: Product Architecture & MVP Units (2025-10-24)

Single-tenant by design. Instance-specific AI Units with Best Practice Relay (anonymized patterns).

Units:
- Vanguard (Scan): detects stalls, ownership gaps; builds explainable signals.
- Command (Integrity): enforces CRM tasks; idempotent; audited.
- Scribe (Narrative): human-grade explanations + audio briefings.
- Evidence (Proof): anonymized case studies + benchmarks.
- Interface (UX): onboarding, trust wall, reports. LT oversees orchestration.

Data stance: no raw CRM storage; derived metrics only; ephemeral processing.


Evidence Unit Blueprint (2025-10-24)

Purpose: Convert derived performance data into anonymized case studies and benchmarks.

Pipeline: Trigger → Collect → Anonymize → Compute KPIs → Narrate (Scribe) → Approve → Publish (hosted link).

Privacy: No PII stored. Derived-only aggregates. Opt-in Proof Library.
