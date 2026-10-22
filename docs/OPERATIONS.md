# Operations and free-tier budget

## Hosting decisions

Cloudflare Workers for Hono and later static React assets, D1 for shared SQL,
Better Auth only after a successful integration spike. No Student Pack, Heroku,
Azure credits, required custom domain, paid plan, Redis or hosted job system.
Use a free `workers.dev` address initially. No cloud resource is provisioned now.

Keep `/health` independent of database readiness. Add a separate readiness check
only with a real database dependency. Keep credentials in platform secrets,
never `wrangler.jsonc`, React/Tauri assets or the Git repository.

## Budget assumptions to verify at provisioning

Reference snapshot: 2026-10-22; provider plans can change.

| Workers/D1 free resource | Published allowance |
| --- | --- |
| Dynamic Worker requests | 100,000/day |
| Worker CPU per invocation | 10 ms |
| D1 rows read | 5 million/day |
| D1 rows written | 100,000/day |
| D1 database size | 500 MB per database |
| D1 account storage | 5 GB total |
| D1 point-in-time recovery | 7 days |

Sources: https://developers.cloudflare.com/workers/platform/pricing/,
https://developers.cloudflare.com/d1/platform/pricing/,
https://developers.cloudflare.com/d1/platform/limits/.

100 devices uploading every 15 minutes continuously make 9,600 requests/day,
before UI/auth/retries. A request may write many rows; indexes and updates also
consume write quota. This arithmetic is not a supported-user-count guarantee.
Measure CPU and D1 rows at the actual request/batch shape before public signup.

## Graceful quota behavior

Bound batches and queries, add jitter/backoff, monitor budget headroom and limit
new registrations before exhausting resources. Do not enable automatic upgrades
or overage services. A rejected/unavailable cloud write stays in the device's
durable outbox; no false ACK. A capacity incident is visible as stale sync.

Define and test retention before launch. Proposed starting point: bounded
fine-grained history and daily rollups; approved settlements/audit revisions
persist. Do not erase unacknowledged local data as routine retention. Rollups
change the precision of old arbitrary-period queries and must say so.

## Deployment / observability / backups

- Build/test before deploy. Review schema migrations and rollback/export first.
- Separate local/test and real resources; CI does not need production secrets.
- Scrub tokens, SSIDs, user/device information and reports from logs.
- Sample operational logs; keep product history in its data store, not logs.
- Treat provider recovery as short-window protection, not an off-platform backup.
  Test redacted export/restore and an encrypted operator-controlled backup.
- Native signed binaries and app-store enrollment may have separate costs.
  Initial direct distribution uses GitHub Releases; never claim a free plan
  includes all future signing, store or domain expenses.

## Distribution

The first release issue must build real Windows artifacts from a release tag,
include checksums, publish supported scope/limitations and give an uninstall
path preserving/exporting user data by choice. Android APK distribution starts
only after its separate evidence gate. Never upload a demo as a monitoring app.
