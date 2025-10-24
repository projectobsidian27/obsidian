# Engineering Policy (Trust Wall)
- Tier 2 code (auth, CRM writebacks, pricing, data retention) requires human review.
- Tests-first. Coverage >=85% overall; 100% on enforcement, auth, pricing.
- No raw CRM data stored. Derived metrics only. KMS for secrets.
- Feature flags + canaries for user-visible changes.
- Auto-rollback if write errors >5% in 10 minutes.
