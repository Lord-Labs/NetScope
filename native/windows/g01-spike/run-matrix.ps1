# G01 controlled measurement matrix
#
# Runs the repeatable parts of the G01 experiment matrix that need no physical
# action: idle baseline, controlled downloads and uploads, a LAN-only request
# loop, and per-profile usage windows around each group. It records raw JSON
# and prints a summary; analysis and the go/no-go live in the evidence record.
#
# Run with Windows PowerShell 5.1:
#   powershell.exe -NoProfile -ExecutionPolicy Bypass -File run-matrix.ps1 -OutDir ..\..\..\.local\g01-run
#
# The Wi-Fi profile name is hashed by measure.ps1; SSIDs, BSSIDs, gateway and
# public addresses are never written. Public test endpoints are contacted and
# real internet usage is consumed.

[CmdletBinding()]
param(
    [string]$OutDir = '.local\g01-run',
    [string]$DownloadUrl = 'http://212.183.159.230/100MB.zip',
    [string]$UploadUrl = 'https://speed.cloudflare.com/__up',
    [int]$DownloadReps = 3,
    [int]$UploadReps = 3,
    [int]$UploadBytes = 20971520,
    [int]$LanRequests = 100,
    [int]$IdleSeconds = 60,
    [int]$SettleSeconds = 10,
    [int]$LateAdjustmentSeconds = 360,
    [int]$MaxTimeSeconds = 900
)

$ErrorActionPreference = 'Stop'
if ($PSVersionTable.PSEdition -ne 'Desktop') {
    throw 'Run this script with Windows PowerShell 5.1 (powershell.exe).'
}

$measurePath = Join-Path $PSScriptRoot 'measure.ps1'
if (-not (Test-Path -LiteralPath $measurePath)) { throw "measure.ps1 not found next to run-matrix.ps1" }

$fullOutDir = [System.IO.Path]::GetFullPath($OutDir)
New-Item -ItemType Directory -Path $fullOutDir -Force | Out-Null

function Get-IsoUtc {
    param($Value)
    if ($Value -is [DateTime]) { return $Value.ToUniversalTime().ToString('o') }
    if ($Value -is [DateTimeOffset]) { return $Value.ToUniversalTime().ToString('o') }
    return [string]$Value
}

function Write-Step {
    param([string]$Message)
    Write-Host ('[{0}] {1}' -f ([DateTimeOffset]::UtcNow.ToString('HH:mm:ss') + 'Z'), $Message)
}

function Invoke-Measure {
    param(
        [string]$Name,
        [string[]]$MeasureArguments
    )
    Write-Step "measure $Name"
    $path = Join-Path $fullOutDir ($Name + '.json')
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $measurePath @MeasureArguments -OutFile $path | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "measure.ps1 '$Name' failed with exit code $LASTEXITCODE" }
    return (Get-Content -LiteralPath $path -Raw | ConvertFrom-Json)
}

function Get-WifiDelta {
    param($Transfer, [uint32]$WifiIndex)
    return ($Transfer.interface_deltas | Where-Object { $_.index -eq $WifiIndex } | Select-Object -First 1)
}

$runStarted = ([DateTimeOffset]::UtcNow).ToString('o')
Write-Step "matrix start; output $fullOutDir"

$context = Invoke-Measure '00-context' @('-Mode', 'context', '-ProfileMinutes', '10')
$wifiIndex = $null
foreach ($candidate in $context.interfaces.interfaces) {
    if ($candidate.type -eq 71 -and $candidate.hardware_interface -and -not $candidate.filter_interface -and $candidate.oper_status -eq 1) {
        $wifiIndex = $candidate.index
        break
    }
}
if ($null -eq $wifiIndex) { throw 'No connected physical Wi-Fi interface found in GetIfTable2 output.' }
Write-Step "physical Wi-Fi interface index $wifiIndex"

# Idle baseline: how much traffic exists without a controlled transfer.
$idleBefore = Invoke-Measure '10-idle-before' @('-Mode', 'counter')
Write-Step "idle for $IdleSeconds s"
Start-Sleep -Seconds $IdleSeconds
$idleAfter = Invoke-Measure '11-idle-after' @('-Mode', 'counter')
$idleProfile = Invoke-Measure '12-idle-profile' @('-Mode', 'profile', '-StartUtc', (Get-IsoUtc $idleBefore.captured_utc), '-EndUtc', (Get-IsoUtc $idleAfter.captured_utc), '-Granularity', 'PerMinute')
$idleSecondsActual = ([DateTimeOffset]::Parse((Get-IsoUtc $idleAfter.captured_utc), [System.Globalization.CultureInfo]::InvariantCulture, [System.Globalization.DateTimeStyles]::RoundtripKind) - [DateTimeOffset]::Parse((Get-IsoUtc $idleBefore.captured_utc), [System.Globalization.CultureInfo]::InvariantCulture, [System.Globalization.DateTimeStyles]::RoundtripKind)).TotalSeconds
$idleDelta = ($idleAfter.interfaces | Where-Object { $_.index -eq $wifiIndex })
$idlePrevious = ($idleBefore.interfaces | Where-Object { $_.index -eq $wifiIndex })
$idleIn = [int64]$idleDelta.in_octets - [int64]$idlePrevious.in_octets
$idleOut = [int64]$idleDelta.out_octets - [int64]$idlePrevious.out_octets
Write-Step ('idle {0:N1}s: in {1} B, out {2} B, in {3:N0} B/s, out {4:N0} B/s; profile rx {5} tx {6} ({7} buckets)' -f $idleSecondsActual, $idleIn, $idleOut, ($idleIn / $idleSecondsActual), ($idleOut / $idleSecondsActual), $idleProfile.rx_octets, $idleProfile.tx_octets, $idleProfile.bucket_count)

# Controlled downloads.
$downloads = @()
for ($i = 1; $i -le $DownloadReps; $i++) {
    $download = Invoke-Measure ("20-download-$i") @('-Mode', 'transfer', '-Direction', 'download', '-Url', $DownloadUrl, '-MaxTimeSeconds', "$MaxTimeSeconds")
    $downloads += $download
    $delta = Get-WifiDelta -Transfer $download -WifiIndex $wifiIndex
    $app = [uint64]$download.curl.size_download
    $ratio = $null
    if ($app -gt 0 -and $null -ne $delta.delta_in_octets) { $ratio = [math]::Round($delta.delta_in_octets / $app, 4) }
    Write-Step ('download {0}: http {1}, app {2} B, {3:N1} s, wifi in {4} B out {5} B, in/app {6}' -f $i, $download.curl.http_code, $app, $download.curl.time_total, $delta.delta_in_octets, $delta.delta_out_octets, $ratio)
    Start-Sleep -Seconds $SettleSeconds
}
$downloadProfile = Invoke-Measure '21-download-profile' @('-Mode', 'profile', '-StartUtc', (Get-IsoUtc $downloads[0].started_utc), '-EndUtc', (Get-IsoUtc $downloads[-1].ended_utc), '-Granularity', 'PerMinute')
Write-Step ('download group profile: rx {0} tx {1}, {2} buckets' -f $downloadProfile.rx_octets, $downloadProfile.tx_octets, $downloadProfile.bucket_count)

# Controlled uploads.
$uploads = @()
for ($i = 1; $i -le $UploadReps; $i++) {
    $upload = Invoke-Measure ("30-upload-$i") @('-Mode', 'transfer', '-Direction', 'upload', '-Url', $UploadUrl, '-UploadBytes', "$UploadBytes", '-MaxTimeSeconds', "$MaxTimeSeconds")
    $uploads += $upload
    $delta = Get-WifiDelta -Transfer $upload -WifiIndex $wifiIndex
    $app = [uint64]$upload.curl.size_upload
    $ratio = $null
    if ($app -gt 0 -and $null -ne $delta.delta_out_octets) { $ratio = [math]::Round($delta.delta_out_octets / $app, 4) }
    Write-Step ('upload {0}: http {1}, app {2} B, {3:N1} s, wifi in {4} B out {5} B, out/app {6}' -f $i, $upload.curl.http_code, $app, $upload.curl.time_total, $delta.delta_in_octets, $delta.delta_out_octets, $ratio)
    Start-Sleep -Seconds $SettleSeconds
}
$uploadProfile = Invoke-Measure '31-upload-profile' @('-Mode', 'profile', '-StartUtc', (Get-IsoUtc $uploads[0].started_utc), '-EndUtc', (Get-IsoUtc $uploads[-1].ended_utc), '-Granularity', 'PerMinute')
Write-Step ('upload group profile: rx {0} tx {1}, {2} buckets' -f $uploadProfile.rx_octets, $uploadProfile.tx_octets, $uploadProfile.bucket_count)

# LAN-only traffic: interface counters must include it even though no WAN bytes flow.
$lan = Invoke-Measure '40-lan' @('-Mode', 'lan', '-LanRequests', "$LanRequests")
$lanDelta = Get-WifiDelta -Transfer $lan -WifiIndex $wifiIndex
Write-Step ('lan: {0} requests, app download {1} B, http {2}, wifi in {3} B out {4} B, profile rx {5} tx {6}' -f $lan.requests, $lan.app_download_octets, ($lan.http_codes -join ','), $lanDelta.delta_in_octets, $lanDelta.delta_out_octets, $lan.profile_usage.rx_octets, $lan.profile_usage.tx_octets)

# Whole-run profile usage, compare against the run-wide interface delta.
$runEnded = ([DateTimeOffset]::UtcNow).ToString('o')
$sessionProfile = Invoke-Measure '50-session-profile' @('-Mode', 'profile', '-StartUtc', $runStarted, '-EndUtc', $runEnded, '-Granularity', 'PerMinute')
$sessionHourlyProfile = Invoke-Measure '51-session-profile-hourly' @('-Mode', 'profile', '-StartUtc', $runStarted, '-EndUtc', $runEnded, '-Granularity', 'PerHour')
Write-Step ('session profile minute: rx {0} tx {1}, {2} buckets; hour: rx {3} tx {4}, {5} buckets' -f $sessionProfile.rx_octets, $sessionProfile.tx_octets, $sessionProfile.bucket_count, $sessionHourlyProfile.rx_octets, $sessionHourlyProfile.tx_octets, $sessionHourlyProfile.bucket_count)

# Late-accounting check: re-query the same window after a delay.
Write-Step "waiting $LateAdjustmentSeconds s for late profile adjustment"
Start-Sleep -Seconds $LateAdjustmentSeconds
$sessionProfileLater = Invoke-Measure '60-session-profile-later' @('-Mode', 'profile', '-StartUtc', $runStarted, '-EndUtc', $runEnded, '-Granularity', 'PerMinute')
Write-Step ('session profile re-query: rx {0} tx {1}, {2} buckets' -f $sessionProfileLater.rx_octets, $sessionProfileLater.tx_octets, $sessionProfileLater.bucket_count)

$matrix = [pscustomobject]@{
    spike                   = 'G01 Windows measurement spike'
    measure_script_sha256   = (Get-FileHash -LiteralPath $measurePath -Algorithm SHA256).Hash
    run_started_utc         = $runStarted
    run_ended_utc           = $runEnded
    physical_wifi_index     = $wifiIndex
    context                 = $context
    idle                    = [pscustomobject]@{
        before_utc = $idleBefore.captured_utc
        after_utc  = $idleAfter.captured_utc
        seconds    = [math]::Round($idleSecondsActual, 2)
        wifi_in_octets  = $idleIn
        wifi_out_octets = $idleOut
        profile    = $idleProfile
    }
    downloads               = $downloads
    download_profile        = $downloadProfile
    uploads                 = $uploads
    upload_profile          = $uploadProfile
    lan                     = $lan
    session_profile         = $sessionProfile
    session_profile_hourly  = $sessionHourlyProfile
    session_profile_later   = $sessionProfileLater
}

$matrixPath = Join-Path $fullOutDir 'matrix.json'
$matrixJson = $matrix | ConvertTo-Json -Depth 12
[System.IO.File]::WriteAllText($matrixPath, $matrixJson + "`n", (New-Object System.Text.UTF8Encoding($false)))
Write-Step "matrix written to $matrixPath"
Write-Output 'G01 matrix complete.'

