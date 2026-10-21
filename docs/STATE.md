# Actual implementation state

Updated: 2026-10-22. Do not infer implemented features from the roadmap.

| Capability | State | Evidence / next work |
| --- | --- | --- |
| Product decisions, agent rules, release plan | Implemented | Repository documents and linked backlog |
| Arc-inspired semantic token source | Implemented | `design/tokens.json`, generated Dart/CSS |
| Flutter app shell | Foundation | Empty/unknown states; no live readings |
| `GET /health` Worker | Foundation | API unit tests; no DB dependency |
| Measurement JSON schema / fixtures | Design contract | Contract checks; ingestion not implemented |
| Windows collector / service | Not implemented | G01, A02, A03 |
| Android collector / background lifecycle | Not implemented | G02, D01, D02 |
| Household-only internet accuracy | Unverified on both platforms | Hardware evidence is required |
| SQLite usage ledger | Not implemented | A04 / D02 |
| Authentication / memberships / upload | Not implemented | S02, S03, S04, S05 |
| Svelte web dashboard | Not implemented | S06; only its boundary README exists |
| D1 resources / public cloud deployment | Not provisioned | S01; no paid or student services |
| Billing / settlement / member totals | Not implemented | B01 through B05 |
| Published monitoring binary | Not released | A09 is the first release gate |

## Next work

Take G01 (Windows measurement spike). G02 is an independent early research
task. A01 can refine the foundation UI alongside evidence work. Follow
`planning/ISSUES.md` for actual GitHub links and dependency keys.

## Evidence rules

CI validates builds, types and deterministic tests. It cannot establish
collector accuracy, battery impact, background survival, OS permission UX,
installer reliability, or ISP accounting parity. Record these separately.

Do not change a row to implemented without its acceptance evidence. Update
this file and the corresponding issue together. Foundation is not v0.1 alpha.
