# Flutter client foundation

Windows and Android share this UI. Native measurement is not implemented yet.
The shell displays unknown values and not-started state; no fake readings,
network status, registered devices or billing values are seeded.

```sh
flutter pub get
dart format --output=none --set-exit-if-changed lib test
flutter analyze
flutter test
flutter run -d windows
```

The foundation has Arabic/English, RTL/LTR, light/dark and adaptive layout using
the generated design tokens. Strings are intentionally a small inline dictionary
at this stage; move to normal ARB localization when A01 expands the UI. No state
management, router, database or HTTP package is needed for a non-measuring shell.

A02-A06 introduce the Rust service, restricted IPC, SQLite and actual data.
G02/D01-D03 introduce Kotlin collection, native durability and the Android bridge.
Do not move durable measurement into Flutter to bypass those acceptance gates.
