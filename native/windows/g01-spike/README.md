# G01 measurement spike harness

Read-only Windows network measurement primitives for the [G01 spike](https://github.com/Lord-Labs/NetScope/issues/2):

- `measure.ps1` samples interface counters through `iphlpapi.dll` `GetIfTable2` and
  the public `Windows.Networking.Connectivity` per-profile usage history, and can
  run a controlled transfer or LAN-only request loop around those samples.
- It is a throwaway evidence tool, not the A02 collector. It has no service,
  database, timer loop or upload path, and it never writes measurement data but
  the JSON you redirect.

Run it with **Windows PowerShell 5.1** because the profile usage API projection is
not available in `pwsh` 7:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File measure.ps1 -Mode context
```

No administrator rights are required. The script redacts the Wi-Fi profile name
as a stable hash and does not print the SSID, BSSID, gateway address or public IP.
The transfer modes contact public test endpoints and consume real internet usage.

Modes:

| Mode | What it records |
| --- | --- |
| `context` | OS build, boot time, interface table, current profile usage |
| `counter` | interface counters at one instant (no profile query) |
| `profile` | summed per-profile usage for `-StartUtc`/`-EndUtc` or the last `-ProfileMinutes` |
| `transfer` | interface counter deltas around one controlled `-Direction` transfer |
| `lan` | interface counter and profile deltas around `-LanRequests` requests to the default gateway |

Evidence from this harness is recorded with
[the evidence template](../../../docs/evidence/TEMPLATE.md); the first partial
record is [G01 Windows measurement](../../../docs/evidence/G01-windows-measurement.md)
with raw values in
[data/g01-2026-10-22-observations.json](../../../docs/evidence/data/g01-2026-10-22-observations.json).

## Matrix runner

`run-matrix.ps1` runs the repeatable, no-physical-action subset and writes one
`matrix.json` plus per-step files to an output directory (default
`.local\g01-run`). It is Windows PowerShell 5.1 only.

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File run-matrix.ps1 -OutDir .local\g01-matrix
```

It measures an idle baseline, three 100 MiB downloads, three uploads
(`-UploadBytes`, default 20 MiB), a LAN gateway loop, profile windows around
each group and a late re-query. Physical-action runs (sleep, reboot, network
switch, second network) are documented procedure, not scripted.

Observed limits on the first run (2026-10-22): this connection's WAN upload was
not stable (burst-sized transfers completed, sustained ones stalled), and
background traffic from other applications was present. The evidence record
keeps those limits visible instead of averaging them away.

