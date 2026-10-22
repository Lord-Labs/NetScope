# Release gates

No deadline overrides a failed correctness, security or measurement gate.
Foundation scaffolding is not a monitoring release.

## v0.1.0-alpha.1: first useful local Windows app

- G01 evidence records supported OS, attribution, units, reference comparison,
  LAN contamination and actual scope. Accuracy labels match the evidence.
- A real collector continues through UI closure. Permissions/start behavior
  are guided. Unsupported configurations have a next step, not fake success.
- Selected-network use persists across normal service restarts/reboots; resets
  and lost intervals are explicit. Unknown is never zero.
- SQLite history/export and recovery tests pass; private data stays local.
- React/Tauri shows real data, no seeded demo consumption, Arabic/English, light/dark,
  keyboard focus, 200% text and reduced motion without blocking the core task.
- Installer/startup/uninstall tested on a clean supported Windows environment.
- Publish measured idle/active CPU, memory, disk/write rate and installer/download
  sizes with environment. Set performance budgets from that baseline before
  accepting the alpha; do not invent numbers in the README.
- Release notes state that local estimates do not authorize internet billing.

## Shared alpha and billing beta

- Cross-household and owner-only device access tests pass.
- Revoked credentials, offline retries, duplicates, rollback and delayed ACKs
  preserve usage and cannot silently multiply it.
- Current free-tier CPU/reads/writes/storage are measured at pilot load, including
  retry storms and UI access. Capacity failure preserves local measurements.
- Selected periods/top-ups, exact rounding, gaps and reviewed immutable
  settlement snapshots pass their fixtures and a small real pilot.
- Privacy/export/delete and migration/restore behavior are documented and tested.

## Android support and v1

- G02/D04 evidence covers stated devices/OS versions, screen-off, battery saver,
  reboot, force-stop, VPN/IPv6, switching and permissions. Known unsupported
  conditions are visible before collecting or charging.
- A React/Tauri APK build alone is not Android measurement support.
- No unexplained collection continuity, ISP parity or anti-tamper claim remains.
- README, STATE, issues, release assets and compatibility matrix agree.

## Evidence classification

For every item distinguish: deterministic test / CI build / local manual check /
real hardware observation / still unverified. Never substitute one for another.
