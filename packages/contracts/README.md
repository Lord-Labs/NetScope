# Contracts

`openapi.json` describes implemented health only. `measurement.schema.json` is
the planned v1 ingestion design. The artificial fixtures are contract examples,
not current app data, hardware proof or a complete runtime validator.

A server must additionally validate UUID/time formats, ordering, 64-bit byte
bounds, authorization, overlaps, monotonic revisions, epochs and payload limits.
JSON Schema alone does not establish these relational/semantic invariants.
Do not generate production ingest/auth code without S02-S04 security tests.

Byte values use decimal strings so JSON does not lose 64-bit precision. Gaps
carry null bytes and a reason; a measured zero is a separate real reading.
