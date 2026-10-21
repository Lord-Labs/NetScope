# Windows collector boundary

No collector is implemented here yet. G01 chooses a tested OS measurement path;
A02 introduces the Rust crate and focused tests for that path. A03 supplies
restricted local IPC and service lifecycle. A04 owns durable SQLite checkpoints.

The service must remain independent of Flutter process lifetime, use justified
least privilege, and record resets/gaps/network attribution. Shared computers
need explicit device ownership. Never implement an always-successful placeholder
collector or assume interface bytes are internet-only bytes.

Use `docs/evidence/TEMPLATE.md` for measurements. Cargo checks enter CI only
when a real crate exists; an empty package would falsely imply implementation.
