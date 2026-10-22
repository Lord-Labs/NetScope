<#
.SYNOPSIS
Read-only G01 measurement spike for Windows. Samples interface counters through
iphlpapi.dll GetIfTable2 and the public Windows.Networking.Connectivity
per-profile usage history, optionally around a controlled transfer or LAN loop.

.DESCRIPTION
This is evidence tooling for NetScope issue #2 (G01), not the A02 collector.
It has no service, timer loop, database or upload path. Run it with Windows
PowerShell 5.1 because the profile usage API projection is unavailable in
PowerShell 7. No administrator rights are required.

Data is printed as JSON on stdout. The Wi-Fi profile name is replaced by a
stable hash, and the SSID, BSSID, gateway address and public IP are never
printed. Redirect stdout to save evidence.

.EXAMPLE
powershell.exe -NoProfile -ExecutionPolicy Bypass -File measure.ps1 -Mode context

.EXAMPLE
powershell.exe -NoProfile -ExecutionPolicy Bypass -File measure.ps1 -Mode transfer -Direction download
#>
[CmdletBinding()]
param(
    [ValidateSet('context', 'counter', 'profile', 'transfer', 'lan')]
    [string]$Mode = 'context',

    # profile mode window; defaults to the last ProfileMinutes
    [int]$ProfileMinutes = 10,
    [string]$StartUtc,
    [string]$EndUtc,
    [ValidateSet('PerMinute', 'PerHour', 'PerDay')]
    [string]$Granularity = 'PerMinute',

    # transfer mode
    [ValidateSet('download', 'upload')]
    [string]$Direction = 'download',
    [string]$Url = 'http://212.183.159.230/100MB.zip',
    [int]$UploadBytes = 20971520,
    [int]$MaxTimeSeconds = 900,

    # lan mode
    [int]$LanRequests = 100,

    [string]$OutFile
)

$ErrorActionPreference = 'Stop'

if ($PSVersionTable.PSEdition -ne 'Desktop') {
    throw 'Run this script with Windows PowerShell 5.1 (powershell.exe), not pwsh 7: the WinRT profile usage projection is unavailable in PowerShell 7.'
}

$counterSource = @'
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;

public static class NetScopeIfTable
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct MIB_IF_ROW2
    {
        public ulong InterfaceLuid;
        public uint InterfaceIndex;
        public Guid InterfaceGuid;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 257)] public string Alias;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 257)] public string Description;
        public uint PhysicalAddressLength;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 32)] public byte[] PhysicalAddress;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 32)] public byte[] PermanentPhysicalAddress;
        public uint Mtu;
        public uint Type;
        public uint TunnelType;
        public uint MediaType;
        public uint PhysicalMediumType;
        public uint AccessType;
        public uint DirectionType;
        public byte InterfaceAndOperStatusFlags;
        public uint OperStatus;
        public uint AdminStatus;
        public uint MediaConnectState;
        public Guid NetworkGuid;
        public uint ConnectionType;
        public ulong TransmitLinkSpeed;
        public ulong ReceiveLinkSpeed;
        public ulong InOctets;
        public ulong InUcastPkts;
        public ulong InNUcastPkts;
        public ulong InDiscards;
        public ulong InErrors;
        public ulong InUnknownProtos;
        public ulong InUcastOctets;
        public ulong InMulticastOctets;
        public ulong InBroadcastOctets;
        public ulong OutOctets;
        public ulong OutUcastPkts;
        public ulong OutNUcastPkts;
        public ulong OutDiscards;
        public ulong OutErrors;
        public ulong OutUcastOctets;
        public ulong OutMulticastOctets;
        public ulong OutBroadcastOctets;
        public ulong OutQLen;
    }

    [DllImport("iphlpapi.dll")]
    private static extern uint GetIfTable2(out IntPtr table);

    [DllImport("iphlpapi.dll")]
    private static extern void FreeMibTable(IntPtr table);

    public static MIB_IF_ROW2[] Rows()
    {
        IntPtr table;
        uint error = GetIfTable2(out table);
        if (error != 0) throw new Win32Exception((int)error);
        try
        {
            int count = Marshal.ReadInt32(table);
            int stride = Marshal.SizeOf<MIB_IF_ROW2>();
            IntPtr first = IntPtr.Add(table, 8);
            var rows = new MIB_IF_ROW2[count];
            for (int i = 0; i < count; i++)
                rows[i] = Marshal.PtrToStructure<MIB_IF_ROW2>(IntPtr.Add(first, i * stride));
            return rows;
        }
        finally
        {
            FreeMibTable(table);
        }
    }
}
'@

Add-Type -TypeDefinition $counterSource

$script:profileTaskFactory = $null

function Get-UtcNowIso {
    return ([DateTimeOffset]::UtcNow).ToString('o')
}

function Get-RedactedProfileLabel {
    param([string]$ProfileName)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($ProfileName)
        $hash = $sha.ComputeHash($bytes)
        return 'profile-' + (-join ($hash[0..3] | ForEach-Object { $_.ToString('x2') }))
    }
    finally {
        $sha.Dispose()
    }
}

function Initialize-ProfileUsage {
    if ($null -ne $script:profileTaskFactory) { return }
    Add-Type -AssemblyName System.Runtime.WindowsRuntime
    [Windows.Networking.Connectivity.NetworkInformation, Windows.Networking.Connectivity, ContentType = WindowsRuntime] | Out-Null
    $factory = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
            $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and
            $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
        })[0]
    if ($null -eq $factory) {
        throw 'WindowsRuntimeSystemExtensions.AsTask(IAsyncOperation<T>) was not found.'
    }
    $script:profileTaskFactory = $factory
}

function Await-WinRtOperation {
    param($Operation, $ResultType)
    $asTask = $script:profileTaskFactory.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($Operation))
    $netTask.Wait(-1) | Out-Null
    return $netTask.Result
}

function Get-ProfileUsage {
    param(
        [DateTimeOffset]$From,
        [DateTimeOffset]$To,
        [string]$Granularity = 'PerMinute'
    )
    Initialize-ProfileUsage
    $profile = [Windows.Networking.Connectivity.NetworkInformation]::GetInternetConnectionProfile()
    if ($null -eq $profile) { return $null }

    $states = New-Object Windows.Networking.Connectivity.NetworkUsageStates
    $states.Roaming = [Windows.Networking.Connectivity.TriStates]::DoNotCare
    $states.Shared = [Windows.Networking.Connectivity.TriStates]::DoNotCare
    $granularityValue = [Enum]::Parse([Windows.Networking.Connectivity.DataUsageGranularity], $Granularity)

    $operation = $profile.GetNetworkUsageAsync($From, $To, $granularityValue, $states)
    $usageType = [System.Collections.Generic.IReadOnlyList[Windows.Networking.Connectivity.NetworkUsage]]
    $usage = Await-WinRtOperation -Operation $operation -ResultType $usageType

    $rx = [uint64]0
    $tx = [uint64]0
    $buckets = @()
    foreach ($entry in $usage) {
        $entryRx = [uint64]$entry.BytesReceived
        $entryTx = [uint64]$entry.BytesSent
        $rx += $entryRx
        $tx += $entryTx
        $buckets += [pscustomobject]@{ rx_octets = $entryRx; tx_octets = $entryTx }
    }

    $cost = $profile.GetConnectionCost()
    return [pscustomobject]@{
        profile_label  = Get-RedactedProfileLabel $profile.ProfileName
        cost_type      = [string]$cost.NetworkCostType
        roaming        = [bool]$cost.Roaming
        start_utc      = $From.ToString('o')
        end_utc        = $To.ToString('o')
        granularity    = $Granularity
        bucket_count   = @($buckets).Count
        rx_octets      = $rx
        tx_octets      = $tx
        buckets        = @($buckets)
    }
}

function Get-CounterSnapshot {
    $rows = [NetScopeIfTable]::Rows()
    $interfaces = @()
    foreach ($row in $rows) {
        # Ethernet, IEEE 802.11, software loopback, PPP and tunnel interface types.
        if ($row.Type -notin @(6, 23, 24, 71, 131)) { continue }
        $interfaces += [pscustomobject]@{
            index                = [uint32]$row.InterfaceIndex
            type                 = [uint32]$row.Type
            oper_status          = [uint32]$row.OperStatus
            media_connect_state  = [uint32]$row.MediaConnectState
            hardware_interface   = (($row.InterfaceAndOperStatusFlags -band 1) -ne 0)
            filter_interface     = (($row.InterfaceAndOperStatusFlags -band 2) -ne 0)
            receive_link_speed   = [uint64]$row.ReceiveLinkSpeed
            transmit_link_speed  = [uint64]$row.TransmitLinkSpeed
            in_octets            = [uint64]$row.InOctets
            out_octets           = [uint64]$row.OutOctets
            in_ucast_pkts        = [uint64]$row.InUcastPkts
            out_ucast_pkts       = [uint64]$row.OutUcastPkts
        }
    }
    return [pscustomobject]@{
        captured_utc = Get-UtcNowIso
        interfaces   = @($interfaces)
    }
}

function Get-OsContext {
    $currentVersion = Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion'
    $os = Get-CimInstance Win32_OperatingSystem
    $now = [DateTimeOffset]::UtcNow
    $boot = [DateTimeOffset]$os.LastBootUpTime.ToUniversalTime()
    return [pscustomobject]@{
        caption           = $os.Caption
        version           = $os.Version
        build             = [string]$currentVersion.CurrentBuild
        ubr               = [uint32]$currentVersion.UBR
        display_version   = [string]$currentVersion.DisplayVersion
        boot_utc          = $boot.ToString('o')
        uptime_seconds    = [int64]($now - $boot).TotalSeconds
        powershell        = $PSVersionTable.PSVersion.ToString()
        powershell_edition = $PSVersionTable.PSEdition
        utc_now           = $now.ToString('o')
    }
}

function New-UploadPayload {
    param([int]$Bytes)
    $path = Join-Path $env:TEMP ('netscope-g01-upload-' + [Guid]::NewGuid().ToString('N') + '.bin')
    $buffer = New-Object byte[] 1048576
    $stream = [System.IO.File]::Create($path)
    try {
        $remaining = [int64]$Bytes
        while ($remaining -gt 0) {
            $chunk = [int][Math]::Min($remaining, $buffer.Length)
            $stream.Write($buffer, 0, $chunk)
            $remaining -= $chunk
        }
    }
    finally {
        $stream.Dispose()
    }
    return $path
}

function Invoke-CurlJson {
    param([string[]]$CurlArguments)
    $raw = & curl.exe @CurlArguments 2>&1
    $exitCode = $LASTEXITCODE
    $text = (($raw | Out-String).Trim())
    $parsed = $null
    try { $parsed = $text | ConvertFrom-Json } catch { }
    return [pscustomobject]@{
        exit_code = $exitCode
        raw       = $text
        parsed    = $parsed
    }
}

function Get-InterfaceDeltas {
    param($Before, $After)
    $deltas = @()
    foreach ($interval in $After.interfaces) {
        $previous = $Before.interfaces | Where-Object { $_.index -eq $interval.index } | Select-Object -First 1
        if ($null -eq $previous) { continue }
        $reset = ($interval.in_octets -lt $previous.in_octets) -or ($interval.out_octets -lt $previous.out_octets)
        if ($reset) {
            $deltaIn = $null
            $deltaOut = $null
            $deltaInPackets = $null
            $deltaOutPackets = $null
        }
        else {
            $deltaIn = [uint64]($interval.in_octets - $previous.in_octets)
            $deltaOut = [uint64]($interval.out_octets - $previous.out_octets)
            $deltaInPackets = [uint64]($interval.in_ucast_pkts - $previous.in_ucast_pkts)
            $deltaOutPackets = [uint64]($interval.out_ucast_pkts - $previous.out_ucast_pkts)
        }
        $deltas += [pscustomobject]@{
            index                 = $interval.index
            type                  = $interval.type
            hardware_interface    = $interval.hardware_interface
            filter_interface      = $interval.filter_interface
            counter_reset_detected = $reset
            delta_in_octets       = $deltaIn
            delta_out_octets      = $deltaOut
            delta_in_ucast_pkts   = $deltaInPackets
            delta_out_ucast_pkts  = $deltaOutPackets
        }
    }
    return @($deltas)
}

function Invoke-Transfer {
    $payload = $null
    if ($Direction -eq 'upload') { $payload = New-UploadPayload -Bytes $UploadBytes }

    $before = Get-CounterSnapshot
    $started = Get-UtcNowIso
    $curlArguments = @('-s', '-o', 'NUL', '-w', '%{json}', '--max-time', "$MaxTimeSeconds")
    if ($Direction -eq 'download') {
        $curlArguments += $Url
    }
    else {
        $curlArguments += @('-X', 'POST', '--data-binary', ('@' + $payload), '-H', 'Content-Type: application/octet-stream', $Url)
    }
    try {
        $curl = Invoke-CurlJson -CurlArguments $curlArguments
    }
    finally {
        if ($payload) { Remove-Item -LiteralPath $payload -ErrorAction SilentlyContinue }
    }
    $after = Get-CounterSnapshot
    $ended = Get-UtcNowIso

    # Keep only accountable transfer fields; curl's raw JSON also carries IPs.
    $curlSummary = $null
    if ($null -ne $curl.parsed) {
        $parsed = $curl.parsed
        $curlSummary = [pscustomobject]@{
            http_code           = $parsed.http_code
            scheme              = $parsed.scheme
            size_download       = $parsed.size_download
            size_upload         = $parsed.size_upload
            speed_download      = $parsed.speed_download
            speed_upload        = $parsed.speed_upload
            time_connect        = $parsed.time_connect
            time_starttransfer  = $parsed.time_starttransfer
            time_total          = $parsed.time_total
            num_redirects       = $parsed.num_redirects
        }
    }

    return [pscustomobject]@{
        direction    = $Direction
        url          = $Url
        started_utc  = $started
        ended_utc    = $ended
        curl         = $curlSummary
        curl_exit_code = $curl.exit_code
        before       = $before
        after        = $after
        interface_deltas = @(Get-InterfaceDeltas -Before $before -After $after)
    }
}

function Invoke-LanLoop {
    $route = Get-NetRoute -DestinationPrefix '0.0.0.0/0' -ErrorAction Stop | Sort-Object RouteMetric | Select-Object -First 1
    if ($null -eq $route) { throw 'No IPv4 default route; cannot locate the LAN gateway.' }
    $target = 'http://' + $route.NextHop + '/'

    $before = Get-CounterSnapshot
    $started = Get-UtcNowIso
    $totalBytes = [uint64]0
    $codes = @{}
    for ($i = 0; $i -lt $LanRequests; $i++) {
        $response = Invoke-CurlJson -CurlArguments @('-s', '-o', 'NUL', '-w', '%{json}', '--max-time', '5', $target)
        if ($null -ne $response.parsed) {
            $totalBytes += [uint64]$response.parsed.size_download
            $codes[[string]$response.parsed.http_code] = $true
        }
    }
    $after = Get-CounterSnapshot
    $ended = Get-UtcNowIso

    $profile = Get-ProfileUsage -From ([DateTimeOffset]::Parse($started)) -To ([DateTimeOffset]::Parse($ended)) -Granularity 'PerMinute'
    return [pscustomobject]@{
        target       = 'default-gateway'
        requests     = $LanRequests
        http_codes   = @($codes.Keys | Sort-Object)
        app_download_octets = $totalBytes
        started_utc  = $started
        ended_utc    = $ended
        before       = $before
        after        = $after
        interface_deltas = @(Get-InterfaceDeltas -Before $before -After $after)
        profile_usage = $profile
    }
}

$result = switch ($Mode) {
    'context' {
        [pscustomobject]@{
            os          = Get-OsContext
            interfaces  = Get-CounterSnapshot
            profile     = Get-ProfileUsage -From ([DateTimeOffset]::UtcNow.AddMinutes(-$ProfileMinutes)) -To ([DateTimeOffset]::UtcNow) -Granularity 'PerMinute'
        }
    }
    'counter' { Get-CounterSnapshot }
    'profile' {
        if ($StartUtc -and $EndUtc) {
            $from = [DateTimeOffset]::Parse($StartUtc, [System.Globalization.CultureInfo]::InvariantCulture, [System.Globalization.DateTimeStyles]::RoundtripKind)
            $to = [DateTimeOffset]::Parse($EndUtc, [System.Globalization.CultureInfo]::InvariantCulture, [System.Globalization.DateTimeStyles]::RoundtripKind)
        }
        else {
            $to = [DateTimeOffset]::UtcNow
            $from = $to.AddMinutes(-$ProfileMinutes)
        }
        Get-ProfileUsage -From $from -To $to -Granularity $Granularity
    }
    'transfer' { Invoke-Transfer }
    'lan' { Invoke-LanLoop }
}

$json = $result | ConvertTo-Json -Depth 10
if ($OutFile) {
    $fullPath = [System.IO.Path]::GetFullPath($OutFile)
    $parent = Split-Path -Parent $fullPath
    if ($parent -and -not (Test-Path -LiteralPath $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }
    [System.IO.File]::WriteAllText($fullPath, $json + "`n", (New-Object System.Text.UTF8Encoding($false)))
}
$json
