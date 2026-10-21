# Contributing

Start with [AGENTS.md](AGENTS.md), [STATE](docs/STATE.md), and one unblocked
issue. Comment that you are taking it, or coordinate in its discussion. Keep
one behavioral change per PR; reference the issue and its acceptance criteria.

## Before coding

- Confirm dependencies and the release milestone. Do not pull later phases
  into the fast local alpha.
- Read the relevant measurement, design, security and API decisions.
- Explain a new dependency or stack deviation in the issue before adopting it.
- Never include real household/device identifiers or usage in test fixtures.

## Definition of done

- Acceptance criteria are demonstrated, not merely described.
- Relevant format/type/static/test checks pass.
- Failure, unknown and recovery paths are covered for new durable behavior.
- UI changes include light/dark and Arabic/English evidence at narrow/desktop
  sizes and 200% text scale where relevant.
- Collector changes include reproducible platform evidence; simulated readings
  are useful tests but cannot validate measurement accuracy.
- Documentation, current-state status and compatible schema changes are updated.
- No secrets, production data, SDKs, binary dumps or unlicensed assets appear.
- Handoff states exactly what was tested and what remains unverified.

Follow the PR template. Prefer conventional commits (`docs:`, `feat:`, `fix:`,
`test:`, `ci:`). Use an issue branch such as `feat/12-local-history`.

## Conduct and security

Be respectful and specific. Review code and evidence rather than contributors.
Do not post exploitable vulnerabilities or real resident data in public issues;
follow [SECURITY.md](SECURITY.md). MIT applies to original contributions, not
to third-party materials you do not have permission to contribute.
