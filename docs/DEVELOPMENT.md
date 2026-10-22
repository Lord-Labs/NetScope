# Development and validation

## Tools

Node 24 LTS and npm; commit package-lock.json. React 19, Vite 8, TypeScript 6,
Tailwind 4 and Tauri 2 versions are locked in the workspace manifests/lockfile.
Rust stable and Cargo.lock are used by the native host.

Windows native development requires MSVC C++ Build Tools, a Windows SDK and
WebView2. Follow https://v2.tauri.app/start/prerequisites/. Avoid modifying global
toolchains automatically. Browser development and API checks need no native SDK.

## Root commands

```sh
npm ci
npm run dev:client
npm run dev:api
```

Use separate terminals for the two dev servers. The API is health-only.

```sh
npm run tokens:check
npm run check:repo
npm run typecheck
npm run lint
npm test
npm run build
npm exec --workspace @netscope/client -- playwright install chromium
npm run test:e2e --workspace @netscope/client
```

The API build is a Wrangler deployment dry-run, not a deployment. Client build
is a Vite static asset build, not an installer. Playwright starts Vite itself.

## Native host

```sh
npm run tauri --workspace @netscope/client -- dev
cargo fmt --manifest-path apps/client/src-tauri/Cargo.toml --check
cargo check --locked --manifest-path apps/client/src-tauri/Cargo.toml
```

Build the frontend before checking Cargo on a clean checkout. The host exposes
no collection commands or privileged plugin capabilities yet. bundle.active is
false until A08 adds the reviewed installer/service packaging.

Android: install the currently supported Android Studio SDK/JDK/NDK, set local
JAVA_HOME/ANDROID_HOME/NDK_HOME as documented by Tauri, install target Rust
toolchains, then run `npm run tauri --workspace @netscope/client -- android init`
and `android dev`. Generated runner files are ignored; D01 must document their
reproducible initialization/version choices before supporting APK releases.
Vite honors the Tauri-provided TAURI_DEV_HOST for device/LAN development;
ordinary browser development binds only to loopback. Review development CSP/HMR
on the actual Android target before adding any exception to production CSP.
Do not infer measurement support from a successful host/APK build.

## UI and dependencies

Edit design/tokens.json, then `npm run tokens:generate`. CSS type tokens use rem
so browser/WebView text preferences can scale them. Shared CSS is imported after
Arc foundation; component internals are not a second theme source.

components.json registers @uiarc. From apps/client, install only a reviewed
free item with `npx shadcn@latest add @uiarc/<id>` after reading its markdown.
The Arc skill registry targets a global Claude directory; read its linked docs,
do not install global instructions as part of this repository.

Review library licenses, lifecycle scripts, bundle impact and web/native
compatibility. Do not install all components or add routing/state/fetch libraries
before a feature needs them. Native collectors stay outside JavaScript timers.
TypeScript 6 is intentional: the current typescript-eslint release does not
support TypeScript 7. Upgrade the compiler and lint toolchain together after
compatibility checks; never bypass peer dependencies with --force.

## CI and evidence

CI checks repository/contracts/tokens, API/client types/tests/builds, Chromium
interaction/responsiveness and Windows Rust host compilation. It does not deploy,
publish an installer or establish Android/collector accuracy. Use redacted
hardware evidence for metering, background, battery, WebView and installer claims.
