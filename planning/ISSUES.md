# Issue index

Initial source: `backlog.json`. Links/numbers: `published.json`. Live GitHub issues hold execution status and reviewed changes.

Start with G01 after F01; G02 is independent. Read [roadmap](../docs/ROADMAP.md) before taking later phases.

## Repository foundation

Reproducible scaffold, decision record, design tokens, contributor rules and dependency-linked backlog. Not a monitoring release.

| Key | Issue | Dependencies | Priority |
| --- | --- | --- | --- |
| F01 | [#1 Establish the monorepo, truthful scaffold and contributor handoff](https://github.com/Lord-Labs/NetScope/issues/1) | None | p0 |

## v0.1.0-alpha.1: local Windows core

First useful release: real selected-network readings, explicit scope/gaps, durable local history, export and tested Windows installation. No accounts or cloud dependency.

| Key | Issue | Dependencies | Priority |
| --- | --- | --- | --- |
| G01 | [#2 Prove Windows network attribution and measurement scope](https://github.com/Lord-Labs/NetScope/issues/2) | F01 | p0 |
| A01 | [#4 Complete the Arc React design primitives and state gallery](https://github.com/Lord-Labs/NetScope/issues/4) | F01 | p1 |
| A02 | [#5 Implement the evidence-selected Rust Windows collector](https://github.com/Lord-Labs/NetScope/issues/5) | G01 | p0 |
| A03 | [#6 Run collection as a Windows service with restricted local IPC](https://github.com/Lord-Labs/NetScope/issues/6) | A02 | p0 |
| A04 | [#7 Persist a crash-safe local SQLite usage ledger and checkpoints](https://github.com/Lord-Labs/NetScope/issues/7) | A03 | p0 |
| A05 | [#8 Implement one-network setup, scope labels and coverage state transitions](https://github.com/Lord-Labs/NetScope/issues/8) | A04 | p0 |
| A06 | [#9 Connect the React/Tauri overview and local history to real collector data](https://github.com/Lord-Labs/NetScope/issues/9) | A01, A05 | p0 |
| A07 | [#10 Export local usage and coverage with truthful precision and units](https://github.com/Lord-Labs/NetScope/issues/10) | A06 | p1 |
| A08 | [#11 Package the Windows app/service with guided install and safe uninstall](https://github.com/Lord-Labs/NetScope/issues/11) | A07 | p0 |
| A09 | [#12 Validate and publish the first useful local Windows alpha](https://github.com/Lord-Labs/NetScope/issues/12) | A08 | p0 |

## v0.2.0-alpha.1: shared household

Authenticated groups/devices, durable idempotent sync, owner-only device details and visible member aggregates within a measured free-tier budget.

| Key | Issue | Dependencies | Priority |
| --- | --- | --- | --- |
| S01 | [#13 Provision and verify the free Worker/D1 shared-service foundation](https://github.com/Lord-Labs/NetScope/issues/13) | A09 | p1 |
| S02 | [#14 Implement reviewed human sign-in and revocable device pairing](https://github.com/Lord-Labs/NetScope/issues/14) | S01 | p0 |
| S03 | [#15 Add households, invitations, membership and owner-only device access](https://github.com/Lord-Labs/NetScope/issues/15) | S02 | p0 |
| S04 | [#16 Accept bounded measurement batches with idempotent D1 transactions](https://github.com/Lord-Labs/NetScope/issues/16) | S03 | p0 |
| S05 | [#17 Sync the durable device outbox with retry, ACK and revocation handling](https://github.com/Lord-Labs/NetScope/issues/17) | S04 | p0 |
| S06 | [#18 Add the React household website to the shared frontend](https://github.com/Lord-Labs/NetScope/issues/18) | S03, A01 | p1 |
| S07 | [#19 Aggregate member usage with coverage, source precedence and honest totals](https://github.com/Lord-Labs/NetScope/issues/19) | S05, S06 | p0 |
| S08 | [#20 Validate free-tier capacity, retention, recovery and shared-alpha privacy](https://github.com/Lord-Labs/NetScope/issues/20) | S07 | p0 |

## v0.3.0-beta.1: reviewed settlements

Custom periods, base/top-up costs, exact proportional shares, explicit missing-data review and immutable approved snapshots.

| Key | Issue | Dependencies | Priority |
| --- | --- | --- | --- |
| B01 | [#21 Add expenses and explicit household-local accounting periods](https://github.com/Lord-Labs/NetScope/issues/21) | S08 | p1 |
| B02 | [#22 Compute exact proportional shares and deterministic minor-unit rounding](https://github.com/Lord-Labs/NetScope/issues/22) | B01 | p0 |
| B03 | [#23 Review and approve immutable settlements with versioned corrections](https://github.com/Lord-Labs/NetScope/issues/23) | B02 | p0 |
| B04 | [#24 Export reviewed household settlements without private device leakage](https://github.com/Lord-Labs/NetScope/issues/24) | B03 | p1 |
| B05 | [#25 Run a small-household settlement pilot and release the reviewed beta](https://github.com/Lord-Labs/NetScope/issues/25) | B04 | p0 |

## Android evidence and beta

Independent non-VPN measurement gate followed by Kotlin collection, durable storage and React/Tauri integration on documented supported devices.

| Key | Issue | Dependencies | Priority |
| --- | --- | --- | --- |
| G02 | [#3 Prove Android household measurement without VPN or root](https://github.com/Lord-Labs/NetScope/issues/3) | F01 | p0 |
| D01 | [#26 Implement the evidence-approved Kotlin Android collector lifecycle](https://github.com/Lord-Labs/NetScope/issues/26) | G02 | p0 |
| D02 | [#27 Persist Android readings and sync with durable native jobs](https://github.com/Lord-Labs/NetScope/issues/27) | D01 | p0 |
| D03 | [#28 Bridge Android collection into the React/Tauri permission and status UX](https://github.com/Lord-Labs/NetScope/issues/28) | D02, A01 | p1 |
| D04 | [#29 Validate Android beta artifacts, battery behavior and compatibility claims](https://github.com/Lord-Labs/NetScope/issues/29) | D03 | p0 |

## v1.0.0: validated public release

Evidence-backed platform matrix, privacy/security/restore audit and release artifacts matching documented claims.

| Key | Issue | Dependencies | Priority |
| --- | --- | --- | --- |
| R01 | [#30 Audit the full product and publish a validated public v1 release](https://github.com/Lord-Labs/NetScope/issues/30) | A09, S08, B05, D04 | p1 |
