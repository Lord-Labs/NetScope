# API and sync contract

## Implemented now

`GET /health` returns service identity, foundation version and disabled capability
flags. It is a liveness check, not a database readiness/measurement check.
Unknown routes return JSON 404. See `packages/contracts/openapi.json`.

There is no sign-in, device pairing, upload, household or billing endpoint yet.
Do not invent client calls to planned endpoints or return success from a stub.

## Planned shared API

Use versioned REST endpoints under `/v1` when S02-S05 implement them. Define and
test their OpenAPI schemas in the same PR. Browser auth sessions and scoped
device upload credentials are distinct. Device scope cannot authorize managing
households or viewing another member's device history.

The version-1 measurement schema in `packages/contracts/measurement.schema.json`
is a **design contract**, not an active ingestion route. It separates real
readings from coverage gaps. Absolute RX/TX totals within a bucket are revised
idempotently by `(device_id, counter_epoch, bucket_start, sequence)` semantics.
The exact database key/transaction strategy must be proven by S04.

## Validation requirements

- Validate bounded JSON payload size, batch size, timestamps, ordering, safe
  sequence numbers, ownership, active device/household membership and schema.
- Byte quantities are decimal integer strings across JSON boundaries; use
  checked 64-bit/integer handling, never floating-point consumption math.
- Intervals use UTC ISO 8601, start inclusive and end exclusive. Reject invalid
  or impossible ranges. Do not silently clip wrong-network intervals.
- Duplicate/reordered revisions cannot add usage twice. A decreasing counter
  does not become zero: reject or open a documented epoch/reset event.
- A gap has a reason where known and no byte totals. Zero is a real measurement.
- Commit batch data and checkpoint atomically. Acknowledge only committed work;
  never advance client state after partial failure without explicit per-item ACKs.
- Start with bounded batches and a ~15-minute upload cadence with jitter/backoff;
  local observation frequency is a separate measurement decision.

## Network and financial precision

Scope/confidence/coverage travel with the readings. Partial buckets cannot be
arbitrarily prorated into precise charges. Preserve the resolution required by
the selected billing boundaries, or mark/review the boundary as approximate.
Approved settlements reference frozen data revisions, not a mutable live sum.

## Tests needed before the API accepts use

Schema errors, wrong owner/household, revoked credentials, retries, reordered
records, duplicate batches, reset epochs, interval overlap, future timestamps,
oversized payloads, database rollback and delayed ACK recovery. The public
health route must never expose secrets or household/device information.
