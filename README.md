# NetScope

Understand shared internet usage. Split the cost with evidence.

NetScope is an open-source, cooperative tool for households sharing a capped
internet plan. A person can own several Windows/Android devices. Household-only
attribution, coverage and accuracy must be established by platform evidence.

**Status: React/Tauri foundation, not a working internet meter yet.** The app
shows honest unknown states. The API implements health only. There is no live
collector, authentication, cloud deployment, settlement or monitoring release.

[العربية](README.ar.md) · [Start here](docs/START_HERE.md) ·
[Current capabilities](docs/STATE.md) · [Roadmap](docs/ROADMAP.md) ·
[Issues](https://github.com/Lord-Labs/NetScope/issues)

## Stack

| Layer | Choice |
| --- | --- |
| One frontend | React DOM + TypeScript + Vite |
| Native UI host | Tauri 2 on Windows and Android |
| Components | Free Arc items, shadcn-compatible registry, Tailwind CSS 4, Lucide, Motion |
| Local collection/storage | Independent Rust Windows service; Kotlin Android plugin/service; SQLite/Room |
| Later shared backend | Hono on Cloudflare Workers, D1/Drizzle, Better Auth after integration checks |
| Later shared website | Web build of the same React frontend |

The native app bundles its UI. Traffic does not pass through NetScope's cloud.
A browser cannot meter device-wide use. No VPN, router administration, root,
Student Pack or required paid hosting plan. See the
[stack decision](docs/decisions/0002-react-tauri.md).

## Quick start

Use Node 24 LTS and npm. From the repository root:

```sh
npm ci
npm run dev:client
```

Open the Vite URL for the foundation preview. In a second terminal:

```sh
npm run dev:api
```

The Worker implements only `GET /health`. To run the native Windows UI host,
install Rust stable, MSVC C++ build tools and WebView2, then:

```sh
npm run tauri --workspace @netscope/client -- dev
```

See [development](docs/DEVELOPMENT.md) for checks and Android SDK/JDK/NDK setup.
Native host compilation does not establish measurement support.

## Repository map

```text
apps/client/src/        Shared React UI and selected free Arc components
apps/client/src-tauri/  Native UI host, CSP and capability definitions
apps/api/              Hono Worker health foundation
native/windows/        Planned independent Rust measurement service
native/android/        Planned Kotlin Tauri plugin/service
packages/contracts/    Measurement schema, fixtures and implemented API spec
design/                Semantic token source and generated CSS
docs/                  Product, architecture, gates and contributor handoff
planning/              Validated backlog and real GitHub issue links
.github/               CI and contributor templates
```

## What ships first

Local Windows alpha: select a household network, persist real readings, show
scope/history/gaps, survive UI closure, export and install cleanly. No account
or hosted service is required. Android evidence is independent. Sharing and
full-cost proportional settlement over arbitrary selected periods follow.
Missing data is never zero and estimated LAN/interface bytes are not a verified
internet bill. Cooperative software cannot prevent an owner stopping/uninstalling it.

Read [AGENTS.md](AGENTS.md) and [CONTRIBUTING.md](CONTRIBUTING.md) before coding.
Start with [G01](https://github.com/Lord-Labs/NetScope/issues/2).

## Design and license

Neutral surfaces, restrained accent, clear typography, Arabic/English, RTL/LTR,
light/dark, keyboard and reduced motion. Free Arc source is used with its MIT
notice, not paid components or preview data. See [provenance](docs/references/arc.md)
and [third-party notices](THIRD_PARTY_NOTICES.md). Original NetScope code is [MIT](LICENSE).
