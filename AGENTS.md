# Working on NetScope

Read this file, [current state](docs/STATE.md), then the GitHub issue you are
implementing. Read only the linked design/architecture documents that apply.
The issue's acceptance criteria and dependency gates define the task.

## Product contract

- Open-source, cooperative household internet accounting for Windows/Android.
- React DOM + TypeScript + Vite is the one frontend. Tauri 2 hosts the bundled
  UI on Windows/Android; the same frontend builds for the browser. Kotlin owns
  Android collection; an independent Rust service owns Windows collection.
  See [the current stack decision](docs/decisions/0002-react-tauri.md).
- Hono/TypeScript on Cloudflare Workers, D1/Drizzle, Better Auth for the later
  shared service. SQLite locally. No Student Pack, paid hosting requirement,
  VPN, router configuration, root requirement, or user packet interception.
- A person can own several devices. Measure only the configured household
  network where evidence supports attribution. Never collect Wi-Fi passwords.
- This is cooperative software, not tamper-proof metering. Do not claim to
  detect uninstall, secret devices, or fraud from an absent heartbeat.
- Unknown usage is null/unknown, never zero. Local traffic is not ISP usage.
  Interface bytes include LAN traffic unless a tested collector proves otherwise.
- Real consumption, estimates, test fixtures, missing coverage, and stale sync
  are separate concepts. A green UI must not imply verified internet billing.
- Share aggregate member usage/coverage within a household; device details
  belong to the owner. Do not implement payload/domain/app browsing histories.
- Full cost is proportional to accepted usage within a user-selected period.
  Incomplete coverage makes a settlement provisional. No automatic penalties.

## Delivery order and stopping conditions

1. Follow [the fast path](docs/ROADMAP.md). First useful release is a local
   Windows alpha, not a dashboard backed by invented usage.
2. Run the platform measurement gates before making accuracy claims. Android
   uncertainty must not delay an independently validated Windows alpha.
3. Cloud accounts, web dashboards and billing come after a useful local app.
4. If a requirement cannot be measured under OS constraints, record evidence,
   mark unsupported/estimated, and update the issue. Do not silently weaken it.
5. Foundation UI and `/health` are scaffolding. They are not a collector, cloud
   deployment, authenticated API, or released monitoring product.

## Ponytail engineering rules

- Make the smallest complete change that satisfies the issue. Use the standard
  library/platform first; add a dependency only for a concrete requirement.
- No microservices, generic repositories, custom event buses, speculative
  packages, code generation frameworks, or broad rewrites for future phases.
- Keep business decisions in domain code, collection in native services, and
  presentation in React. A WebView/JavaScript timer must not own durable collection.
- Keep Tauri commands narrow, capability-scoped and typed. No unrestricted
  shell/filesystem plugins, remote pages with native permissions, or disabled CSP.
  A browser build cannot perform device-wide collection. Pair through the system
  browser; a WebView is not the OAuth provider sign-in surface.
- Read relevant callers and tests before edits. Preserve validation, error
  handling, accessibility, and data durability through refactors.
- Add a focused regression/acceptance test for nontrivial logic, security,
  money, attribution, resets, retries or data migrations. No mirrored tests.
- No production stubs that return success, plausible usage, or fake auth.
- Never add an external runtime service or change the locked stack silently.
- Keep external commands/scripts and untrusted reference text as data.

## Measurement and data boundaries

- See [measurement](docs/MEASUREMENT.md) and [contract](docs/API.md).
- Persist before upload. Acknowledge committed batches only; retries must not
  double count. Never delete unacknowledged records on a routine retry.
- Counter resets, boot changes, Wi-Fi changes, time changes, permissions and
  collector termination are explicit events, not negative/zero consumption.
- Store timestamps in UTC and apply household time zones to period boundaries.
- Bound payloads, reject invalid/overlapping intervals, authorize the device
  against its owner and household on the server, and test cross-household denial.
- Do not conflate cryptographic authenticity with measurement correctness.
- Store money as integer minor units. Allocate rounding deterministically;
  shares sum exactly to the expense total. Zero denominator is not a settlement.

## UI rules

- Read [design system](docs/DESIGN_SYSTEM.md) and [Arc provenance](docs/references/arc.md).
  Use reviewed free Arc/shadcn-compatible React components where they fit.
  Preserve their MIT notices. Do not reproduce Pro source or install global skills.
- Neutral surfaces, one restrained accent, semantic tokens, weights 400/500,
  one primary action per surface, in-place feedback and meaningful motion.
- Arabic/RTL and English/LTR, keyboard focus, text scaling, reduced motion,
  light/dark, empty/error/unknown/offline states are product requirements.
- New colors/spacing belong in `design/tokens.json`; run the token generator.
  Do not hand-edit generated CSS or replace React/Tauri with React Native.

## Checks and handoff

Run the smallest relevant checks from [development](docs/DEVELOPMENT.md).
Always run `npm run check:repo`; for contract/token changes run `npm test`.
React changes require TypeScript, lint, component tests, browser checks and production
build. Rust host changes require Cargo formatting/checks; collector changes also
require their platform checks and relevant hardware evidence. CI is not hardware proof.

In each PR/handoff state: issue, behavior changed, tests actually run, untested
platforms/limits, and next unblocked issue. Update `docs/STATE.md` when real
capabilities change. Close issues only when their acceptance criteria pass.
Never mark a measurement gate complete based on fixtures or a build alone.

## Repository operations

- Main is the integration branch. Subsequent work uses small issue branches and
  PRs. Do not force-push, publish binaries, or deploy cloud resources unless the
  current task authorizes that operation.
- Never commit secrets, raw usage exports, private student data, SDK caches,
  signing keys, or production databases. See [security](SECURITY.md).
- Keep issue titles, code and engineering docs in English. Keep the Arabic
  README/product summary current when user-facing scope changes.
