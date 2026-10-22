# Security policy

NetScope is pre-release. No collector, hosted service or settlement is currently
approved for production financial decisions. See [STATE](docs/STATE.md).

Report a vulnerability through the repository's private security reporting if
enabled, or contact the maintainers privately through GitHub. Do not post
resident identities, Wi-Fi information, raw usage, tokens or signing keys in
public issues. Public reports may describe a concern without exploit details.

## Boundaries

- A device owner can stop, uninstall or modify a cooperative collector.
  Signing a report authenticates a sender, not its measurement accuracy.
- A household administrator cannot inspect another member's device-level
  details, packet payloads or browsing history through NetScope.
- Every server operation validates identity, device scope and membership.
  Database bindings and auth secrets stay server-side.
- Native service IPC must restrict callers and commands. Do not expose an
  unauthenticated localhost control endpoint or execute arbitrary UI commands.
- Tauri loads bundled frontend assets, with restrictive CSP and minimal scoped
  capabilities. No remote page receives native permissions. Do not enable
  unrestricted shell/filesystem plugins or treat WebView JavaScript as trusted
  OS authority. Use the system browser for OAuth/pairing and validate returns.
- Store credentials using OS protection; never store the household Wi-Fi
  password, ship server secrets in apps, or log credentials.
- Migrations and updates must preserve unacknowledged local records. Maintain
  rollback/export procedures and verify downloaded release integrity.

Security regressions, cross-household access, silent data loss and misleading
financial claims block a release regardless of the milestone's other progress.
