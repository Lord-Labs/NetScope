# Billing rules (future; never silently enabled in the local alpha)

## Inputs

- Explicit household and selected `[start, end)` boundaries in its IANA time zone.
- Base-plan and top-up expenses manually associated with that period.
- Accepted device usage and coverage, aggregated by historical owner/membership.
- Quality/scope evidence and known unsupported sharing/tethering cases.

Package exhaustion is not automatically discoverable without router/ISP access.
Do not infer renewal from a counter threshold or assume monthly periods.

## Proportional allocation

`share = total_cost * accepted_member_bytes / accepted_group_bytes`

All cost is variable; there is no equal/base component. Preserve integer money:
use exact integer arithmetic, floor allocations, then assign remaining minor
units by descending fractional remainder with a stable member-ID tie-breaker.
The resulting shares sum exactly to the total. Byte totals must not use floating
point. A zero group denominator requires review; it is not a division fallback.

Example: EGP 600 total, 300 GB accepted use, member has 75 GB across two devices:
the unrounded share is EGP 150. Units must be consistently defined.

## Draft and approval

1. Build a draft showing member totals, scope/confidence, missing periods and costs.
2. Mark unknown/partial/estimated data clearly. Never insert zero for an absent
   device/member or distribute invented usage as fact.
3. Require explicit review when gaps, LAN-inclusive scope or coarse boundaries
   affect the allocation. Record the explanation/decision with an audit event.
4. Freeze source revisions, membership, expenses, time boundaries and shares on
   approval. Late data suggests a correction; it cannot mutate an approved bill.
5. Corrections create a versioned replacement with history. Approved settlement
   periods cannot overlap for the same use/cost without an explicit correction.

Interface-only estimates cannot become a verified internet bill through an
approval click. The product may record an explicit cooperative provisional
agreement while preserving the estimate labels; verified status needs evidence.

## Required tests

Exact fractions, tiny amounts, uneven rounding/ties, zero use, missing members,
two devices per owner, top-ups, custom/overlapping periods, UTC/local boundaries,
Egypt DST transitions, membership changes, late reports, concurrent approval,
retries, immutable snapshots and cross-household access denial.
