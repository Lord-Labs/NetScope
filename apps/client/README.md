# Shared React client and native host

React DOM + TypeScript + Vite + Tailwind CSS 4, selected free Arc components,
Tauri 2 host for Windows/Android. This same app builds for the browser; there is
no second website frontend. Root README and docs/DEVELOPMENT.md own commands.

Foundation only: no live measurement, authentication, cloud sync or billing.
The browser cannot collect device-wide usage. Native Rust/Kotlin services own
measurement/storage; scoped Tauri bridges arrive with their implementation issues.
Do not put collection in React effects, a JavaScript timer or the WebView process.

src/components/arc contains selected unmodified MIT registry files. See
../../THIRD_PARTY_NOTICES.md and ../../docs/references/arc.md. Product tokens are
generated from ../../design/tokens.json and imported after Arc foundation.
