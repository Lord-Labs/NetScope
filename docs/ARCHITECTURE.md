# Architecture

## One repository, independently built targets

One React DOM/TypeScript/Vite frontend serves the bundled Tauri 2 app and the
later website. Kotlin/Rust and the Hono API meet it at narrow contracts. A monorepo
keeps those boundaries, design tokens, CI and issue context together. npm workspaces
cover JavaScript only; Cargo and Android retain their normal toolchains.

```mermaid
flowchart TD
  FW[React Windows UI] --> TH[Tauri Rust host]
  TH -->|restricted local IPC| WC[Rust Windows service]
  FA[React Android UI] -->|scoped Tauri plugin| AC[Kotlin Android service]
  WC --> WL[(local SQLite)]
  AC --> AL[(local SQLite / Room)]
  WC -->|later: committed report batches| API[Hono / Cloudflare Worker]
  AC -->|later: committed report batches| API
  WEB[same React frontend in browser] --> API
  API --> DB[(D1)]
```

Traffic does not travel through NetScope's cloud. Local mode must remain useful
without account credentials, a cloud deployment, or a running WebView or JavaScript renderer.

## Native boundaries

Windows collection is an OS service, not a JavaScript timer or a tray application's
background loop. Use the least privileges justified by measured APIs. Restrict
IPC to the appropriate local user and a small typed command set; bind device
ownership explicitly on shared Windows machines.

Android collection uses supported OS APIs and an honest background lifecycle.
Kotlin owns sampling, coverage events, durable writes and short sync jobs.
React/Tauri owns screens and user actions. Use narrow, permission-scoped Tauri commands/events.
No VPN fallback, hidden API, root fallback, or dependency on keeping an Activity
alive. WorkManager is for deferrable work, not a promise of continuous sampling.

## Cloud boundary (later)

One Hono application with modules for auth, groups, devices, ingest, reports
and settlements; one D1 database initially. Use Drizzle only when implementing
the data layer. Better Auth must pass a Worker/D1/CPU-budget integration spike
before becoming part of the running service.

Device credentials authorize that device's reports only; human permissions
authorize reading group totals and managing periods. Web sessions use secure
HttpOnly cookies. Do not pass a user password to a native background service.
Use a reviewed short-lived pairing flow and OS-protected device credentials.

Keep domain rules separate from framework request handlers. Share schemas and
fixtures through `packages/contracts`, not a generic repository abstraction.
The server never trusts a caller-provided household ID without authorization.

## Source precedence

Only one accepted source covers an interval for a device/network. An OS history
re-query revises that interval; it is not extra consumption. A collector epoch
and monotonic revision distinguish resets from duplicates. Different devices
behind a tether/hotspot can double-count the same traversal; record this as an
unsupported/needs-review case until the collection path is established.

## Persistence and failure behavior

Persist first, upload later, acknowledge only committed rows. Replayed batches
are idempotent. Write counters and their checkpoint/epoch together locally.
Do not advance a cursor on a rejected upload. Reconcile late OS buckets instead
of manufacturing fine-grained data from coarse statistics.

Cloud unavailability means stale sync, not missing local measurement. Process
death/network transitions can mean missing measurement even when sync is fresh.
Use explicit timestamps, unknown coverage and explainable quality flags.

## Current versus planned

The foundation API implements health only. The client is a non-measuring shell.
There are intentionally no production auth stubs, D1 IDs, native collector
stubs, imaginary users, or successful upload endpoints. See STATE and issues.
