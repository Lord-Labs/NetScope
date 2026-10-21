# Data model boundaries (planned)

No D1 or SQLite usage schema is implemented in the foundation. Introduce actual
migrations alongside their features, not a speculative schema for the whole
roadmap. Keep historical ownership/membership and release boundaries explicit.

| Entity | Responsibilities |
| --- | --- |
| User / auth session | Human identity; reviewed auth library handles sessions |
| Household / membership | Tenant, role, effective join/leave dates, time zone |
| Device / credential | Owner, registration, platform, credential revocation |
| Network definition | Household nickname and minimal necessary matching metadata; no password |
| Measurement session | Collector version, boot/counter epoch, attribution context |
| Usage bucket / revision | Time bounds, RX/TX, scope, confidence, coverage, sequence |
| Coverage event | Missing/unknown periods, known cause and resumption evidence |
| Sync checkpoint | Durable ACK/cursor, separate from local collection state |
| Expense | Integer minor units, currency, explicit period association |
| Settlement / shares | Draft/reviewed/approved state and frozen source revisions |
| Audit event | Sensitive authorization/approval/correction actions |

## Invariants

- Foreign keys and explicit membership checks protect every tenant boundary.
- A native installation ID is not a physical-person proof. MAC/IP are not user IDs.
- Device transfers and membership changes do not rewrite historical reports.
- A bucket cannot simultaneously be a gap and a measured zero.
- Retried revisions replace the appropriate reading, never append duplicate use.
- Money uses checked integer minor units and an explicit currency (EGP initially).
- Raw low-level data, rollups and approved financial snapshots have distinct
  retention needs. An aggregate must not claim finer historical precision.
- UI authorization is not security; all owner-only detail filtering is server-side.

Index according to real queries (household, member/device and interval bounds),
and observe D1 scan/write counts. Avoid updating many redundant rollups per sample.
Document migrations, backup/export and interrupted-write recovery per platform.
