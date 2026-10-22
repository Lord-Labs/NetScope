# ADR 0002: React DOM and Tauri 2 replace the previous frontend

Status: accepted. Date: 2026-10-22. Supersedes ADR 0001's frontend/tooling choices.

## Human decision

The user explicitly changed the requirement to React to use ready-made component
libraries and Arc's React components. Current work must follow this decision,
not the earlier chat or superseded scaffold.

## Decision

One React DOM + TypeScript + Vite frontend in apps/client, hosted by Tauri 2 on
Windows/Android and built as static assets for the later shared website.
Tailwind CSS 4 handles product layout. Selected free Arc components use CSS
modules/Motion and install through the shadcn-compatible registry. No Pro code.

React Native would require different primitives and could not directly reuse
Arc's DOM/CSS components. Next.js SSR is unnecessary for this private utility and
does not run inside Tauri's bundled WebView. Electron has no Android target.
Avoid separate mobile and desktop frontend frameworks.

Native measurement remains independent: Rust Windows OS service and Kotlin
Android service/plugin, durable SQLite/Room, narrow Tauri commands/events. Closing
the WebView must not stop validated collection. A Tauri sidecar alone is not an
OS service. Browser mode never advertises device-wide metering.

Hono/Workers, D1/Drizzle and Better Auth remain the later shared-service target.
The free-budget integration gates, no VPN/router/root/Student Pack, cooperative
trust model and local-Windows-alpha-first release order remain accepted.

## Consequences and gates

Use bundled assets, restrictive CSP/capabilities and the system browser for
OAuth/pairing. Validate return links/origins. Do not expose native commands to
remote websites or enable broad shell/filesystem plugins for convenience.

Windows needs MSVC/WebView2. Android needs the supported SDK/JDK/NDK, Android
WebView, an initialized Tauri runner and a real Kotlin plugin. Tauri is a UI
host, not an exemption from Android background limits. Validate memory/startup,
offline distribution, accessibility, Back/insets and native plugin behavior on
hardware. Do not promise a smaller binary or lower RAM from framework choice alone.

Historical frontend source/runners/locks/jobs were removed from the active tree.
Existing issue numbers are retained; their acceptance and paths are migrated.
The earlier verification PR is closed as superseded rather than merging old code.

## Primary references

- https://v2.tauri.app/start/frontend/
- https://v2.tauri.app/develop/plugins/develop-mobile/
- https://v2.tauri.app/start/prerequisites/
- https://v2.tauri.app/security/capabilities/
- https://uiarc.dev/docs/installation
