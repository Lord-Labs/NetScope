# Foundation verification

Date: 2026-10-22. Issue: [F01](https://github.com/Lord-Labs/NetScope/issues/1).
This is repository/UI evidence, not network measurement evidence.

## Environment

- Local: Windows, Node 24.19.0 / npm 11.17.0, Flutter 3.47.7 / Dart 3.13.5.
- CI: Ubuntu runners, Node 24 and Flutter 3.47.7 pinned in the workflow.
- Test data: fictional contract fixtures only; no resident traffic or accounts.

## Checks and outcomes

| Check | Observed result |
| --- | --- |
| Repository links, backlog keys/dependencies | Passed; 30 published issues across six milestones |
| Generated token consistency and text contrast | Passed for light/dark semantic combinations |
| JSON Schema / unknown versus zero / byte precision | Passed |
| API TypeScript checks and request tests | Passed; health only, other paths do not pretend to ingest |
| Wrangler deployment dry-run | Passed; no resources created or deployed |
| Flutter formatting and static analysis | Passed |
| Flutter widget tests | Two passed: unknown/status and locale/theme; compact 320px with 200% text/navigation |
| Visual review | Offscreen Flutter renders inspected: Arabic desktop light/dark at 1280x900; English phone dark at 390x844 |
| GitHub integration | Published milestone/issue links and initial pushed checkout inspected |

Initial CI for `a0e80d6` passed both jobs:
[Foundation checks](https://github.com/Lord-Labs/NetScope/actions/runs/39695640869).
Subsequent changes must pass their own run in
[Actions](https://github.com/Lord-Labs/NetScope/actions).

The visual review found a font-family inheritance issue in theme overrides;
the theme now preserves Flutter's base text family. Rendered states remain
explicitly unknown and do not display fabricated readings. Review renders used
locally available system fonts; no font files or machine-specific preview tool
were added to the product. A01 still owns the licensed bundled-font decision,
complete state gallery and hardware accessibility review.

## Not established

No native Windows installer or Android APK was built or installed for this
foundation. No collector, real network transfer, battery/background behavior,
screen-reader hardware pass, ISP parity, cloud deployment or financial
settlement was validated. The app is a shell, not a monitoring release.
The next measurement task is [G01](https://github.com/Lord-Labs/NetScope/issues/2);
[G02](https://github.com/Lord-Labs/NetScope/issues/3) can run independently.
