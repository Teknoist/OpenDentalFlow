$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$frontend = Join-Path $root "frontend"
$api = Join-Path $root "backend/OpenDentalFlow.Api"
$wwwroot = Join-Path $api "wwwroot"
$release = Join-Path $root "release"
Push-Location $frontend
npm ci
npm run build
Pop-Location
if (Test-Path $wwwroot) { Remove-Item -Recurse -Force $wwwroot }
New-Item -ItemType Directory -Force $wwwroot | Out-Null
Copy-Item -Recurse (Join-Path $frontend "dist/*") $wwwroot
if (Test-Path $release) { Remove-Item -Recurse -Force $release }
dotnet publish (Join-Path $api "OpenDentalFlow.Api.csproj") -c Release -r win-x64 --self-contained true -o $release -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -p:IncludeAllContentForSelfExtract=true -p:DebugType=None -p:DebugSymbols=false
Compress-Archive -Path (Join-Path $release "*") -DestinationPath (Join-Path $root "OpenDentalLab-Windows-x64-v1.4.0-test.zip") -Force
Write-Host "Hazir: OpenDentalLab-Windows-x64-v1.4.0-test.zip"
