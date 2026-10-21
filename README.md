# NetScope

Understand shared internet usage. Split the cost with evidence.

NetScope is an open-source, cooperative tool for households sharing a capped
internet plan. It links a person's Windows and Android devices, aims to count
only their household connection, and makes missing measurement visible.

**Status: project foundation, not a working internet meter yet.** The repository
contains an app shell, API health endpoint, design tokens, contracts and an
implementation backlog. The first useful release targets a local Windows alpha.
Android billing accuracy remains a measurement gate. There is no cloud
deployment, live sign-in, automatic collection or payment service in this commit.

[العربية](README.ar.md) · [Start here](docs/START_HERE.md) ·
[Current capabilities](docs/STATE.md) · [Roadmap](docs/ROADMAP.md) ·
[GitHub issues](https://github.com/Lord-Labs/NetScope/issues)

## Product decisions

- Flutter for Android/Windows; native Kotlin/Rust collectors; local SQLite.
- Svelte web dashboard later; Hono/Workers, D1/Drizzle and Better Auth later.
- No VPN, router access, root, Student Pack or required paid cloud plan.
- Cooperative reporting: shutdown/uninstall can leave unverifiable gaps.
- All cost is proportional to accepted use within a selected start/end period.
  Base plans and top-ups are entered manually. Missing coverage requires review.
- Members see member totals and coverage; device details stay owner-only.
- Estimated Wi-Fi/interface bytes must never masquerade as verified ISP bytes.

## Quick start

Use Node 24 LTS, npm, and a stable Flutter SDK with a compatible Dart SDK.
Exact tested tool versions and platform setup live in [development](docs/DEVELOPMENT.md).

```sh
npm ci
npm run check:repo
npm test
npm run dev:api
```

The API exposes `GET /health` at the address printed by Wrangler. It does not
accept usage reports yet. To run the Flutter shell in another terminal:

```sh
cd apps/client
flutter pub get
flutter run -d windows
```

On Windows, the Flutter desktop toolchain also requires Visual Studio's
Desktop development with C++ workload. See `flutter doctor -v` and the setup
guide before treating a compiler/toolchain failure as an app defect.

## Repository map

```text
apps/client/          Flutter app and its platform runners
apps/api/             Hono Worker foundation
apps/web/             Future Svelte dashboard boundary (not implemented)
native/windows/       Future independent Rust collector boundary
packages/contracts/   Measurement schema, fixtures, implemented API spec
design/               Shared semantic design tokens
docs/                 Product, architecture, gates, releases, handoff
planning/             Issue and milestone source, links to published issues
scripts/              Small repository/token checks
.github/              CI and contributor templates
```

## What ships first

The first local Windows alpha must select one household network, persist real
usage, show coverage/quality, survive UI closure, and export a transparent
local report. It needs no login or hosted service. Financial settlement and
multi-device aggregation are later releases, after measurement evidence.

Follow the dependencies in [the roadmap](docs/ROADMAP.md), not every issue at
once. Read [AGENTS.md](AGENTS.md) before changing code. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the PR and evidence requirements.

## Design and license

Calm neutral surfaces, clear typography, a restrained blue accent, useful motion
and honest measurement states. Inspired by [Arc](https://uiarc.dev), adapted
for Flutter/Svelte without vendoring Arc React or paid component source.

NetScope code is [MIT licensed](LICENSE). Third-party references and dependencies
retain their own licenses; see [provenance](docs/references/arc.md).
