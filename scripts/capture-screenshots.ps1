param(
    [string]$BaseUrl = "http://localhost:5080",
    [string]$Username = "admin",
    [Parameter(Mandatory = $true)][string]$Password,
    [string]$OutputDirectory = (Join-Path $PSScriptRoot "..\docs\screenshots"),
    [switch]$OnlyLabel
)

$ErrorActionPreference = "Stop"
$edge = @(
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $edge) { throw "Microsoft Edge bulunamadı." }

$profile = Join-Path $env:TEMP ("OpenDentalLab-Screenshots-" + [Guid]::NewGuid().ToString("N"))
$port = Get-Random -Minimum 12000 -Maximum 18000
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$process = Start-Process -FilePath $edge -WindowStyle Hidden -PassThru -ArgumentList @(
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--remote-debugging-port=$port",
    "--user-data-dir=$profile",
    "--window-size=1440,900",
    "about:blank"
)

$socket = $null
try {
    $version = $null
    for ($i = 0; $i -lt 40 -and -not $version; $i++) {
        try { $version = Invoke-RestMethod "http://127.0.0.1:$port/json/version" -TimeoutSec 1 } catch { Start-Sleep -Milliseconds 250 }
    }
    if (-not $version) { throw "Edge headless başlatılamadı." }

    $target = Invoke-RestMethod -Method Put ("http://127.0.0.1:$port/json/new?" + [Uri]::EscapeDataString($BaseUrl))
    $socket = [System.Net.WebSockets.ClientWebSocket]::new()
    $socket.ConnectAsync([Uri]$target.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult() | Out-Null
    $script:messageId = 0

    function Send-Cdp([string]$Method, [hashtable]$Parameters = @{}) {
        $script:messageId++
        $id = $script:messageId
        $json = @{ id = $id; method = $Method; params = $Parameters } | ConvertTo-Json -Compress -Depth 12
        $bytes = [Text.Encoding]::UTF8.GetBytes($json)
        $segment = [ArraySegment[byte]]::new($bytes)
        $socket.SendAsync($segment, [Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
        while ($true) {
            $memory = [IO.MemoryStream]::new()
            do {
                $buffer = New-Object byte[] 65536
                $result = $socket.ReceiveAsync([ArraySegment[byte]]::new($buffer), [Threading.CancellationToken]::None).GetAwaiter().GetResult()
                $memory.Write($buffer, 0, $result.Count)
            } while (-not $result.EndOfMessage)
            $message = [Text.Encoding]::UTF8.GetString($memory.ToArray()) | ConvertFrom-Json
            if ($message.id -eq $id) {
                if ($message.error) { throw ($message.error | ConvertTo-Json -Compress) }
                return $message.result
            }
        }
    }

    function Navigate-And-Capture([string]$Path, [string]$FileName) {
        Send-Cdp "Page.navigate" @{ url = "$BaseUrl$Path" } | Out-Null
        Start-Sleep -Milliseconds 1500
        $shot = Send-Cdp "Page.captureScreenshot" @{ format = "png"; fromSurface = $true; captureBeyondViewport = $false }
        [IO.File]::WriteAllBytes((Join-Path $OutputDirectory $FileName), [Convert]::FromBase64String($shot.data))
    }

    Send-Cdp "Page.enable" | Out-Null
    Send-Cdp "Runtime.enable" | Out-Null
    Send-Cdp "Emulation.setDeviceMetricsOverride" @{ width = 1440; height = 900; deviceScaleFactor = 1; mobile = $false } | Out-Null
    Send-Cdp "Page.navigate" @{ url = "$BaseUrl/login" } | Out-Null
    Start-Sleep -Milliseconds 700

    $safeUser = $Username | ConvertTo-Json -Compress
    $safePassword = $Password | ConvertTo-Json -Compress
    $expression = @"
(async () => {
  const response = await fetch('/api/auth/login', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({username: $safeUser, password: $safePassword})
  });
  if (!response.ok) throw new Error('Login failed: ' + response.status);
  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('language', 'en');
  localStorage.setItem('theme', 'light');
  return true;
})()
"@
    Send-Cdp "Runtime.evaluate" @{ expression = $expression; awaitPromise = $true; returnByValue = $true } | Out-Null

    if ($OnlyLabel) {
        Send-Cdp "Page.navigate" @{ url = "$BaseUrl/label/1" } | Out-Null
        Start-Sleep -Milliseconds 1500
        $labelShot = Send-Cdp "Page.captureScreenshot" @{
            format = "png"; fromSurface = $true; captureBeyondViewport = $false
            clip = @{ x = 230; y = 0; width = 340; height = 300; scale = 2 }
        }
        $labelPath = Join-Path $OutputDirectory "barcode-label-en-v14-v3.png"
        [IO.File]::WriteAllBytes($labelPath, [Convert]::FromBase64String($labelShot.data))
        Get-Item -LiteralPath $labelPath | Select-Object Name, Length
    }
    else {
        Navigate-And-Capture "/" "dashboard-en-v14.png"
        Navigate-And-Capture "/gallery" "gallery-en-v14.png"
        Navigate-And-Capture "/jobs/1" "job-detail-en-v14.png"
        Get-ChildItem -LiteralPath $OutputDirectory -Filter "*-en-v14.png" | Select-Object Name, Length
    }
}
finally {
    if ($socket) { $socket.Dispose() }
    if ($process -and -not $process.HasExited) { Stop-Process -Id $process.Id -Force }
    if (Test-Path -LiteralPath $profile) { Remove-Item -LiteralPath $profile -Recurse -Force -ErrorAction SilentlyContinue }
}
