# Windows collector boundary

No collector is implemented here yet. G01's read-only spike harness is in
[g01-spike](g01-spike/README.md); its partial evidence
([Windows measurement evidence](../../docs/evidence/G01-windows-measurement.md))
points at `GetIfTable2` interface counters with scope `interface_all_traffic` and
confidence `estimated`, but G01 is still open on the sleep/reboot, network switch,
second network, upload and independent-reference runs. A02 introduces the Rust
crate and focused tests after that. A03 supplies restricted local IPC and service
lifecycle. A04 owns durable SQLite checkpoints.

The service must remain independent of React/Tauri process lifetime, use justified
least privilege, and record resets/gaps/network attribution. Shared computers
need explicit device ownership. Never implement an always-successful placeholder
collector or assume interface bytes are internet-only bytes.

Use `docs/evidence/TEMPLATE.md` for measurements. Cargo checks enter CI only
when a real crate exists; an empty package would falsely imply implementation.
