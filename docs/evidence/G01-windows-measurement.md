# Measurement evidence: Windows interface counters vs connection-profile usage (G01)

- Date, issue and code commit: 2026-10-22, [G01 #2](https://github.com/Lord-Labs/NetScope/issues/2),
  partial spike on branch `feat/g01-windows-measurement` (harness in
  [`native/windows/g01-spike`](../../native/windows/g01-spike/README.md)). This
  record does not close G01; the pending matrix is listed under Decision.
- Exact OS build / device class / API / SDK: Windows 11 Pro 25H2, build
  26200.9711 (uptime 689,472 s at run start), x64 laptop with a Realtek
  RTL8852BE Wi-Fi 6 adapter. APIs observed: `iphlpapi.dll` `GetIfTable2`
  (`MIB_IF_ROW2`) and `Windows.Networking.Connectivity.ConnectionProfile.GetNetworkUsageAsync`;
  `curl` 8.21.0 provided the application-layer reference. Windows PowerShell
  5.1.26100.9711, standard user, **no administrator rights**.
- Redacted network topology and configured measurement context: one household
  2.4 GHz Wi-Fi network (WPA2-Personal, 802.11n, 144.4 Mbit/s link rate) behind
  a ZTE gateway; the laptop had no other active physical interface (Ethernet and
  Bluetooth PAN down, Wi-Fi Direct virtual adapters down); no global IPv6. SSID,
  BSSID, MAC addresses, private/public addresses and the profile name are not
  recorded; the profile is shown as `profile-660d56be`. OneDrive sync was
  stopped before the measurements; other background traffic remained and is
  quantified below.
- Hypothesis / expected scope: `GetIfTable2` per-adapter counters are cumulative
  since boot and include **all** traffic on that adapter (local network included);
  the per-profile usage history is the OS "data usage" view and might provide
  internet-only totals, but not real-time interval accounting.
- Independent reference tool and accounting layer: application-layer byte counts
  from `curl` (`size_download` / `size_upload`) over plain HTTP to a public
  payload server; LAN-only traffic was generated with UDP broadcast to
  `255.255.255.255`, which has no WAN path. No router or packet-capture
  reference was available (no router admin access, no admin rights for
  `pktmon`/ETW); this is a remaining limit, not a substitute claim.
- Commands / fixture transfer / duration / byte units: harness commands are in
  the [spike README](../../native/windows/g01-spike/README.md); raw observations
  are in [`data/g01-2026-10-22-observations.json`](data/g01-2026-10-22-observations.json).
  Three controlled downloads of 104,857,600 B each over plain HTTP; upload
  attempts of 512 KiB to 20 MiB; 400 × 60,000 B UDP broadcast datagrams; a
  100-request HTTP loop to the LAN gateway. All byte values are octets.
- Permissions and foreground/background conditions: read-only counter and
  profile queries; no service, driver, packet capture, firewall or adapter
  reconfiguration. Foreground standard-user shell. Background traffic was
  present: the 61 s idle window carried 4,255,973 B in / 1,191,132 B out
  (~70 KB/s in, ~20 KB/s out), and bursts near 4 MB/s were observed outside the
  controlled windows.

| Repetition | Reference RX bytes (app) | Collector RX bytes (`GetIfTable2`) | Difference | Coverage / scope |
| --- | --- | --- | --- | --- |
| 1 | 104,857,600 | 108,956,237 | +3.91% | Wi-Fi interface, all traffic |
| 2 | 104,857,600 | 108,948,403 | +3.90% | Wi-Fi interface, all traffic |
| 3 | 104,857,600 | 108,370,204 | +3.35% | Wi-Fi interface, all traffic |
| Total | 314,572,800 | 326,274,844 | +3.72% | repetition ratios 1.0335–1.0391 |

The collector also counted 5,292,694 TX octets for HTTP requests and TCP ACKs.
The +3.7% aggregate is the expected application-to-interface layer gap (TCP/IP
and link headers) plus some residual background traffic; it is consistent in
all three repetitions (spread 0.56 percentage points), so the counter tracked
the controlled transfer correctly at its own layer. It is **not** a claim that
interface bytes are ISP bytes.

## Failure and transition observations

- **Duplicate counter rows.** `GetIfTable2` returned 40 interface rows for this
  machine. Six rows carried the same Wi-Fi counters at run start (indices 14,
  22, 23, 24, 25, 26; 1,876,076,793 RX / 170,842,904 TX octets each): the
  physical adapter plus five filter-driver rows. Summing all rows would multiply
  traffic; a collector must select the physical row (`hardware_interface` true,
  `filter_interface` false) and must re-select when the adapter set changes.
- **Profile history is not interval-stable.** The 2-minute download window
  returned 3 per-minute buckets with 207,508,023 RX octets 11 s after the last
  transfer, then returned the same 3 buckets with 0 RX octets when re-queried
  minutes later. The `NetworkUsage` type exposes only `BytesReceived`,
  `BytesSent` and `ConnectionDuration`; no bucket start/end time is reachable
  from the .NET projection, and Microsoft's remarks describe sparse intervals, a
  provisional trailing interval and accounting delay. A 5-minute query returned
  0 buckets while a 15-minute query returned 16 buckets on the same machine.
- **Profile and interface counters disagree in short windows.** A 61 s idle
  window reported 3,470,300 RX / 2,530,731 TX octets of profile usage against
  4,255,973 RX / 1,191,132 TX octets of interface usage; the TX figures cannot
  both describe the same interval. Short-window attribution from profile history
  is therefore not trustworthy.
- **LAN traffic is counted by the interface.** 24,000,000 B of UDP broadcast
  payload left the Wi-Fi adapter, and its `OutOctets` grew by 24,576,395 B
  (+2.4% link/header overhead) while no WAN path was involved. The profile
  usage for that window reported 0 B. This is the concrete reason the alpha
  cannot label interface traffic as internet-only: LAN bytes are inside the
  counter and cannot be separated from household ISP consumption.
- **WAN upload measurements were not stable on this connection.** The same
  512 KiB upload completed in 1.11 s (473,845 B/s) once and a 1 MiB upload took
  28.41 s; a 4 MiB upload timed out after sending 1,884,160 B in 150 s, and a
  20 MiB attempt stalled near 14 KB/s. This host/network did not yield a
  comparable ≥100 MiB upload reference; download evidence above is the
  quantitative result, upload direction remains directional evidence only.
- **No global IPv6.** The adapter held only link-local IPv6 addresses and
  `curl -6` to a public endpoint failed, so an IPv6 path could not be exercised.
- **Single active interface.** Ethernet and Bluetooth PAN were down; no
  simultaneous-interface or cellular observation was possible.
- **Not tested yet:** sleep, reboot, adapter/counter reset, network switch or
  roam, a second household Wi-Fi network, collector/UI process closure, and a
  router or packet-level independent reference. `GetIfTable2` counters are
  since-boot only; the reset/epoch behaviour needs the pending hardware runs.

## Decision

Provisional go/no-go for the local Windows alpha, pending the untested matrix
above (this does not close G01):

- **Collection API: `GetIfTable2`.** Non-admin, real-time, cumulative per-adapter
  counters; select the physical adapter row by flags and index, never sum filter
  rows. `ConnectionProfile.GetNetworkUsageAsync` is **rejected** as a collector
  accounting source for this phase: no accessible bucket timestamps, sparse and
  delayed intervals, unstable re-queries, and short-window disagreement.
- **Scope: `interface_all_traffic` + `estimated`.** Interface counters include
  LAN traffic and any other traffic on that adapter, so `internet_verified` is
  not supported by this evidence. The local alpha may show honest estimated
  household-device interface traffic with explicit scope, but not an ISP bill.
- **Epochs and coverage.** Persist a counter checkpoint per adapter epoch; a
  decreasing counter, adapter identity change, network switch, sleep or reboot
  closes the current interval and starts a new one with an explicit event and
  coverage `unknown`/`partial` around the transition. Missing data is a gap, not
  zero. Sampling cadence and the durable checkpoint design belong to A03/A04;
  this spike used before/after snapshots.
- **Alpha wording permitted by this evidence:** "Estimated traffic for this
  device and network adapter, including local-network traffic. Gaps are recorded
  when the network changes, the device sleeps or collection stops. Not an ISP
  bill."
- **Before closing G01:** repeat the matrix on a quiet household network with the
  tester present for sleep/reboot, network-switch and second-network runs, and
  add an independent reference (router WAN counters or a controlled packet
  capture) if one can be obtained without changing the no-root/no-VPN contract.
- Reviewer/date: pending review of the draft PR for this evidence. No
  implementation claim is based on simulated input or CI.
