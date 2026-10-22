# React/Tauri foundation evidence

Date: 2026-10-22. Issue: F01. Current decision: ADR 0002.
This is scaffold evidence, not a network measurement or app-release validation.

## Environment and checks

Local Windows, Node 24.19.0/npm 11.17.0, Rust 1.99.0/MSVC. Dependency versions
are recorded in package-lock.json and apps/client/src-tauri/Cargo.lock.

- React component tests exercise unknown versus zero, collector wording,
  locale/theme changes, help disclosure and device limitations.
- Playwright Chromium checks keyboard actions, computed dark theme, RTL/LTR,
  320/390/768/1024/1440 widths, 200% root text size and reduced-motion preference.
- Repository checks validate links/backlog; token tests check consistency and
  contrast; contract tests validate gaps and byte precision. API checks cover
  health and missing endpoints. TypeScript checks and Vite/Worker dry-run builds
  validate the two JavaScript workspaces.
- Cargo formatting and Windows host check compile the actual Tauri configuration.
  The host has a CSP, no plugin permissions and no collection command handlers.

Local outcomes: repository checks, token/schema tests, both TypeScript checks,
two React component tests, two API tests, six Chromium browser tests, Vite build,
Worker dry-run, Cargo formatting and Windows host compilation passed.
Rendered Arabic desktop light/dark (1280x900), Arabic phone dark (390x844) and
English desktop dark were inspected. Native/browser limits must be stated in the linked PR/CI.
Do not use the superseded frontend's green run as evidence for this stack.

## Review and limits

Selected free Arc files keep their source and MIT notice. React UI review checks
semantic headings/buttons/landmarks, named icon controls, effect-based document
updates, stable elements and a single frontend. No runtime font downloads,
production fake readings, privileged browser adapter or OAuth stub was added.

No Windows installer, Android runner/APK or Kotlin collector has been validated.
No real traffic accuracy, battery/background behavior, native screen reader,
WebView hardware usability, cloud deployment or financial settlement is proven.
The app is a foundation preview. G01 remains next; G02 is independent.
