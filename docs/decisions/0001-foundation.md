# ADR 0001: one repository, local alpha first

Status: superseded for frontend/tooling by [ADR 0002](0002-react-tauri.md). Historical record only. Date: 2026-10-22.

## Context

The user selected Flutter after considering native, Tauri and React Native UI
alternatives. They explicitly rejected Student Pack and VPN/router dependencies.
They want an attractive, simple app, an early useful release, and a repository
that contributors/models can continue without reconstructing conversation.

## Decision

- One monorepo; Flutter app, native Kotlin Android layer, independent Rust
  Windows service, later Svelte website and Hono/Workers shared service.
- D1/Drizzle and Better Auth remain the shared-service target, pending integration
  and quota evidence. Local SQLite is independent of cloud availability.
- First useful binary is a local Windows alpha. Android feasibility is an early
  independent gate; shared accounts and financial features follow evidence.
- Arc is visual inspiration adapted to Flutter/Svelte, not a reason to install
  React or proprietary registry components. Original tokens and components.
- Use free provider tiers and public-source distribution. No student credits,
  paid hosting dependency, paid font, required paid UI kit or custom domain.
- MIT for original NetScope code. Third-party sources keep their own licenses.

## Consequences

Multiple native toolchains are unavoidable for trustworthy background collection.
Keep their boundaries narrow and documented. The first release can be useful
without shipping the entire roadmap. Accuracy and tamper resistance are limited
by OS/network control, not fixed by choosing a UI framework.

Cloudflare quotas can limit a public deployment. D1 is SQLite-based; moving to
PostgreSQL later would require deliberate migration and tests, not an env change.
No hypothetical portability abstraction is built before that need exists.

## Superseded proposals

React Native/Tauri as app UI, WPF UI, student-funded Heroku/PostgreSQL, paid VPS,
VPN metering and router/gateway enforcement are not the implementation plan.
Do not revive them based on old chat fragments. New human direction wins and
must be recorded in a new decision document.
