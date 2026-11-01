# Measurement specification and go/no-go gates

## Non-negotiable scope

Only the configured household connection is in scope. Exclude cellular and
other Wi-Fi; exclude local transfers when claiming internet-only measurement.
SSID/BSSID/profile identity is operational attribution evidence, not a trusted
cryptographic network identity. Roaming, multiple APs, Ethernet and simultaneous
interfaces must be observed rather than guessed.

Wi-Fi interface counters include LAN traffic. `total - cellular` is not a
validated substitute. A cloud public-IP check or heartbeat cannot prove the
path of each byte and cannot identify unreported devices.

## Windows gate (G01)

Compare public ConnectionProfile usage APIs and interface counters against an
independent gateway/test harness on a network the tester owns. Check whether
profile history includes LAN and how buckets/late adjustments behave. Avoid
writing a packet driver before evidence establishes the need and feasible scope.

Record exact OS/API/tool versions, network topology, protocol/traffic sources,
counter baseline, epoch changes, units, collection layer, loss/overhead and
independent reference layer. Decide one of:

- `internet_verified`: tested method and supported conditions justify the scope;
- `interface_all_traffic` + `estimated`: useful household-attributed data, not
  an ISP bill; experimental local release only;
- `unsupported`: attribution/coverage is too unreliable for a useful result.

### Partial G01 findings (2026-10-22, Windows 11 build 26200.9711)

The full record and numbers are in
[the G01 evidence file](evidence/G01-windows-measurement.md); this section is the
decision-relevant summary. The matrix is not complete, so G01 stays open.

- `GetIfTable2` is usable without administrator rights and its counters tracked
  three controlled 100 MiB downloads consistently at the interface layer
  (aggregate +3.72%, repetition spread 0.56 percentage points).
- One physical Wi-Fi adapter appeared as six rows sharing identical counters
  (physical plus filter drivers); selecting the physical row by
  `hardware_interface`/`filter_interface` flags is mandatory.
- LAN-only traffic (24 MB UDP broadcast) was counted by the interface counter,
  so interface bytes are not internet-only bytes.
- `ConnectionProfile.GetNetworkUsageAsync` exposed no bucket timestamps through
  the .NET projection; its buckets are sparse, delayed, and the same historical
  window returned 207.5 MB and later 0 B. It is rejected as a collector
  accounting source for this phase.
- WAN upload on the test connection was not stable (burst-sized transfers
  completed; sustained attempts stalled), so upload evidence is directional
  only. IPv6, sleep/reboot, network switch, a second network and simultaneous
  interfaces remain untested.

Provisional direction: implement the Windows collector with `GetIfTable2` and
report scope `interface_all_traffic` with confidence `estimated`, recording
counter epochs, resets, network changes and coverage gaps. `internet_verified`
is not supported by current evidence. Finish the remaining G01 matrix before
A02 treats the measurement path as validated.

## Android gate (G02)

Start with Android 12+ for the per-interface TrafficStats experiment, while
checking the exact supported API contracts on tested versions. Public
NetworkStatsManager can help reconcile historical data, but normal Wi-Fi
queries do not provide a simple household SSID filter and details can be coarse.
Do not infer historical network assignment just from the current SSID.

Confirm needed permissions, SSID/BSSID availability, per-interface counters,
background execution, screen-off/battery modes and counter recovery. A suitable
foreground-service type and its real OS/store eligibility need evidence;
`dataSync` is not an indefinite service exemption. No claim of automatic restart
after force-stop. Third-party VPN compatibility is a test case, not a guarantee.

If no non-VPN method can isolate internet-only bytes, report that result. The
user prohibited VPN; do not solve the gate by changing that requirement.

## Required experimental matrix

| Experiment | Expected product interpretation |
| --- | --- |
| Known download/upload via household network | Count both directions at the documented layer |
| Same transfer via other Wi-Fi | Not household use |
| Cellular while Wi-Fi is also connected | Attribute by actual supported interface evidence |
| Local transfer between household devices | Excluded for `internet_verified`; otherwise scope warning |
| AP roam / reconnect / network switch | Close context; no cross-network delta |
| IPv4, IPv6, VPN on/off | Document supported cases and scope/counter differences |
| Sleep, screen-off, battery saver | Document gaps and recovery; no invented continuity |
| Reboot / counter reset / clock correction | New epoch/events, no negative or huge fake delta |
| UI closed / collector stopped / force-stop | State/coverage reflects what can actually be known |
| Tethering / shared PC user / unregistered device | Explicit attribution limitation; no double-count claim |
| Offline cloud and repeated uploads | Local durability; no duplicate accepted use |

Use controlled references for repeated transfers, not just file payload size.
Record numeric error and worst case. A provisional target is <=5% aggregate
relative error at a comparable accounting layer for controlled transfers >=100 MB;
this is an engineering gate to validate, not a current product promise. LAN
contamination and wrong-network attribution must be separately tested, not hidden
by averaging. Any threshold change needs an explicit evidence-backed decision.

## State dimensions

- Collector state: `not_started`, `collecting`, `paused`, `permission_required`,
  `unsupported`, `error`.
- Scope: `interface_all_traffic` or `internet_verified`.
- Confidence: `estimated` or `validated`, with a referenced evidence record.
- Coverage: `complete`, `partial`, `unknown` for the reported interval.
- Sync freshness: last local observation, last committed upload, server receipt.

Missing data is represented as gaps/null, not a measured zero. A device can
accurately measure zero only while collection and attribution were established.
An absent heartbeat alone establishes neither deliberate shutdown nor usage.

## Reference APIs (review before implementation)

- https://developer.android.com/reference/android/net/TrafficStats
- https://developer.android.com/reference/android/app/usage/NetworkStatsManager
- https://developer.android.com/develop/background-work/services/fgs/service-types
- https://learn.microsoft.com/en-us/uwp/api/windows.networking.connectivity.connectionprofile.getnetworkusageasync

Save redacted observations using [the evidence template](evidence/TEMPLATE.md).
Do not commit real SSIDs, device/user identifiers, packets or household history.
