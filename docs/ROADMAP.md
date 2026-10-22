# Roadmap and dependency order

Milestones describe release scope, not deadlines. Stable issue keys map to
published GitHub numbers in [planning/ISSUES](../planning/ISSUES.md). The machine
source is `planning/backlog.json`; each issue has explicit acceptance and tests.

| Milestone | Outcome | Keys | Exit gate |
| --- | --- | --- | --- |
| Repository foundation | A reproducible starting point and truthful handoff | F01 | Documentation, schema/token checks, app/API checks |
| v0.1.0-alpha.1: local Windows core | First useful local app | G01, A01-A09 | A09, plus Windows evidence; no accounts required |
| v0.2.0-alpha.1: shared household | Identity, devices, sync and aggregates | S01-S08 | Tenant isolation, offline recovery, free-budget checks |
| v0.3.0-beta.1: reviewed settlements | Costs, custom periods, reviewed shares | B01-B05 | Exact rounding, gap review, immutable approval and pilot |
| Android evidence and beta | Android collection only where evidence supports it | G02, D01-D04 | Platform capability matrix and background/battery tests |
| v1.0.0: validated public release | Supported platforms/accuracy stated with evidence | R01 | Security, privacy, release and documentation audit |

## Critical path: first useful Windows alpha

```text
F01 -> G01 -> A02 -> A03 -> A04 -> A05 -> A06 -> A07 -> A08 -> A09
  \-> A01 -----------------------------------------/
```

A01 implements/refines the React/Tauri design system and states. G01 tests the
actual OS measurements before the collection approach is committed. Small
parts may be combined in a PR when their acceptance criteria remain reviewable;
the keys are scope boundaries, not a demand for bureaucratic sequencing.

G02 runs independently from G01. An Android blocker must not hold a validated
Windows release hostage. Never mark Android supported just because React/Tauri
can build an APK.

## Shared service and settlements

```text
local alpha -> S01 -> S02 -> S03 -> S04 -> S05 -> S07 -> S08
                                  \------> S06 -----/
shared service -> B01 -> B02 -> B03 -> B04 -> B05
G02 -> D01 -> D02 -> D03 -> D04
Windows + Android + shared + settlement gates -> R01
```

The backlog source records the precise dependencies, including UI requirements.
No Redis/queue/background worker is required for the first shared deployment.
Only add one after demonstrated workload makes it necessary.

## What can ship without waiting for v1

- The local Windows alpha can ship honest, explicitly estimated interface
  traffic without financial settlement, if G01 cannot validate internet-only
  scope but does establish repeatable household attribution.
- Shared alpha can present estimates and missing coverage; it cannot finalize
  bills as verified on that basis.
- A beta supports only the OS/device combinations recorded as validated.
  Unsupported combinations remain unsupported, with an actionable explanation.

## Completion discipline

Do not close a spike for writing an API list. It needs reproducible observations
and a go/no-go decision. Do not close an implementation issue for a mock or an
installer for a ZIP alone. No release tag until the release checklist passes.
Keep all later work open; foundation scaffolding does not complete the roadmap.
