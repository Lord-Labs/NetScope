# Product contract

## Problem and audience

Small households in Egypt commonly share a capped internet plan. Equal payment
does not reflect unequal usage. NetScope serves independent groups, typically
5-6 people with about two devices each, without hard-coding those limits.

## Locked decisions

| Decision | Requirement |
| --- | --- |
| Distribution | Open-source from the first commit; one shared hosted site later |
| Platforms | Flutter UI for Windows and Android; native OS collection |
| Network | Household internet only; mobile data and other Wi-Fi excluded |
| Permissions | No router administration, extra gateway, VPN, root or MDM |
| Trust | Cooperative; gaps visible; no tamper-proof or fraud-detection claims |
| Identity | One user, multiple registered devices, independent households |
| Costs | Entire selected cost apportioned by accepted measured usage |
| Period | User-selected start/end; never assume a fixed calendar month |
| Top-ups | Manually entered with the base package, explicitly attached to a period |
| Privacy | Members see member aggregates/coverage; owner sees device details |
| Missing data | Provisional review, no invented consumption or penalties |
| Budget | Free-tier services only; no Student Pack or required paid plan |
| UX | One-time setup, automatic operation where OS allows, few screens |

## Three different quantities

1. **Interface traffic:** packets counted on an interface; may include LAN,
   overhead, VPN effects and other traffic that is not ISP-billed usage.
2. **Household-attributed traffic:** evidence ties an interval to the configured
   household network, but that does not alone prove internet-only scope.
3. **Validated internet usage:** a tested collector and calibration justify that
   scope. It may still differ from the ISP's accounting layer.

Every report carries scope, confidence and coverage. These are not labels the
UI may upgrade for appearance. The application total is the **recorded total
of participating devices**, not a verified WAN total for the whole household.

## First useful release

Local Windows alpha: identify one configured household network; collect real
data with explicit scope; persist it; show interval history and gaps; keep the
collector separate from UI lifetime; export a report. No account is required.
If only interface traffic is supportable, the experimental release says so in
Arabic/English and cannot represent a final internet bill.

## Later shared experience

Create a group -> share an invitation -> sign in and register devices ->
one guided permission/setup path -> see usage and coverage -> enter costs and
select a period -> review provisional shares -> approve an immutable settlement.

## Deliberate exclusions

No speed throttling/QoS, payments, debt collection, packet capture, DPI, browsing
history, per-application monitoring, AI features, leaderboards, real-time socket
infrastructure, iOS/macOS/Linux launch, or mandatory cloud account for local mode.
Counting volume does not solve congestion. No app-level anti-uninstall tricks.
