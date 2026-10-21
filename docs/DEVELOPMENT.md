# Development and validation

## Tooling

- Node 24 LTS, npm (root `package-lock.json` is committed).
- Flutter stable 3.47.7 for the foundation, with its bundled Dart SDK. CI pins
  this version. Revalidate the pinned SDK before deliberate upgrades.
- Windows Flutter builds need Visual Studio Desktop development with C++.
- Android builds need the Android SDK/JDK supported by this Flutter release.
- Rust stable is needed only when A02 introduces the collector crate.

Run `flutter doctor -v` before platform builds. A local `.tools/flutter` used by
the maintainer is ignored and is not a repository dependency. Install the SDK
normally or invoke that local path; never commit SDKs/caches.

## Root and API

```sh
npm ci
npm run tokens:check
npm run check:repo
npm run typecheck
npm test
npm run build --workspace @netscope/api
npm run dev:api
```

Wrangler build is `deploy --dry-run`, so it does not provision or publish cloud
resources. API tests run Hono's request interface; S01 adds a real Worker/D1
integration suite. No secrets are required for foundation checks.

## Flutter

```sh
cd apps/client
flutter pub get
dart format --output=none --set-exit-if-changed lib test
flutter analyze
flutter test
flutter run -d windows
```

For a connected/emulated Android device use the ID from `flutter devices`.
Building an APK does not prove household measurement or background survival.

Use `npm run tokens:generate` from the root after editing the token JSON. Its
generated Dart is formatted deterministically by the generator; do not hand-edit
it. `node scripts/planning.mjs --render` regenerates the issue index.

## CI and evidence

Foundation CI runs repository/token/schema checks, API types/tests/dry-run build,
and Flutter formatting/analysis/widget tests. No cloud deployment or application
release is triggered on a push. Windows/Android native and release jobs arrive
with the actual collectors/installer issues rather than fake green placeholder jobs.

CI results are not calibration or usability evidence. Record hardware observations
in `docs/evidence` using synthetic/redacted identifiers. Later releases require
real installation, offline recovery, background operation and accessibility tests.

## Dependency changes

Pin app SDKs and commit relevant lockfiles. Review package lifecycle scripts,
licenses and CPU/size cost. Prefer one justified dependency to a custom parser,
but do not add cloud/auth/database libraries before their feature exists.
Native toolchains stay independent: npm scripts do not pretend to build Rust,
Kotlin and Flutter through a new generic task framework.
