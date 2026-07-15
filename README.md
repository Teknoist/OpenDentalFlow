# OpenDentalFlow / Açık Diş Laboratuvarı Akışı

OpenDentalFlow is an open-source, local-network-first dental laboratory job tracking MVP. It combines patient/job numbering, QR and Code 128 labels, a responsive React panel, anonymous limited QR pages, photos, notes, status history and role-based API security.

OpenDentalFlow; hasta/iş kodlama, QR ve Code 128 etiketleri, mobil uyumlu React paneli, sınırlı anonim QR sayfaları, fotoğraflar, notlar, durum geçmişi ve rol tabanlı API güvenliğini birleştiren açık kaynak, yerel ağ odaklı bir diş laboratuvarı MVP’sidir.

## Architecture / Mimari

- `backend/OpenDentalFlow.Api`: ASP.NET Core 8, EF Core, SQLite, JWT, Swagger, QRCoder, BarcodeLib
- `backend/OpenDentalFlow.Tests`: xUnit critical service and constraint tests
- `frontend`: React, TypeScript and Vite management/mobile UI
- `backend/OpenDentalFlow.Api/Data/Migrations`: reproducible SQLite schema

The print layer is represented by `ILabelService`; ZPL/TSPL implementations can be added without changing controllers. File storage is behind `IFileStorage`.

## Requirements / Gereksinimler

### Tek program olarak kullanım / One-click Windows app

GitHub Releases bölümünden `OpenDentalFlow-Windows-x64-v1.0.0.zip` dosyasını indirin, klasöre çıkarın ve `OpenDentalFlow.exe` dosyasını çalıştırın. .NET veya Node.js kurulumu gerekmez; tarayıcı otomatik açılır. Veritabanı ve fotoğraflar `%LOCALAPPDATA%\OpenDentalFlow` altında kalıcı saklanır. Aynı Wi-Fi ağındaki telefonlar `http://SUNUCU-IP:5080` adresini açabilir.

Download `OpenDentalFlow-Windows-x64-v1.0.0.zip` from GitHub Releases, extract it, and run `OpenDentalFlow.exe`. No .NET or Node.js installation is required. Persistent data is stored under `%LOCALAPPDATA%\OpenDentalFlow`.

- .NET 8 SDK
- Node.js 20+ and npm
- Windows 10/11 or another OS supported by .NET
- Phones and server connected to the same trusted Wi-Fi/LAN

## Setup / Kurulum

```powershell
git clone https://github.com/Teknoist/OpenDentalFlow.git
cd OpenDentalFlow
dotnet restore
cd frontend
npm install
```

Configure `backend/OpenDentalFlow.Api/appsettings.json`: change `Jwt:Key`, choose the SQLite path, upload limit and `PublicBaseUrl`. For production-like use, do not retain the sample secret or password.

## Database migration / Veritabanı migration

```powershell
dotnet tool install --global dotnet-ef --version 8.*
dotnet ef database update --project backend/OpenDentalFlow.Api --startup-project backend/OpenDentalFlow.Api
```

The API also runs pending migrations on startup and seeds one clinic, patient and job when the database is empty.

## Run / Çalıştırma

Terminal 1:

```powershell
dotnet run --project backend/OpenDentalFlow.Api
```

Swagger: `http://localhost:5080/swagger`

Terminal 2:

```powershell
cd frontend
$env:VITE_API_URL="http://localhost:5080/api"
npm run dev -- --host 0.0.0.0
```

Panel: `http://localhost:5173`

Default development account / Varsayılan geliştirme hesabı: `admin` / `Admin123!`. Change it before real patient data is entered.

## Local network / Yerel ağ erişimi

Find the server’s IPv4 address with `ipconfig`, set `VITE_API_URL=http://192.168.x.x:5080/api`, set `PublicBaseUrl=http://192.168.x.x:5173`, and restart both services. Open TCP ports 5080 and 5173 only for the Private network profile:

```powershell
New-NetFirewallRule -DisplayName "OpenDentalFlow API" -Direction Inbound -Protocol TCP -LocalPort 5080 -Action Allow -Profile Private
New-NetFirewallRule -DisplayName "OpenDentalFlow Web" -Direction Inbound -Protocol TCP -LocalPort 5173 -Action Allow -Profile Private
```

Prefer a stable `lab.local` hostname so printed QR labels survive DHCP address changes. A router DNS reservation/local DNS entry is the best option. For a small Windows-only setup, add `SERVER_IP lab.local` to `C:\Windows\System32\drivers\etc\hosts` on each client; Android generally requires router DNS, Pi-hole/AdGuard Home, or mDNS-compatible hosting. Test the exact URL from a phone before printing labels.

## Thermal printer / Termal yazıcı

Install the manufacturer’s Windows driver and create a 70 × 50 mm paper profile with margins disabled. Open a job’s label page, choose the thermal printer, scale 100%, disable headers/footers and print. The stylesheet contains `@page { size: 70mm 50mm; margin: 0 }`.

## Security / Güvenlik

- Access tokens use 80 random bits and carry no patient data.
- JWT protects management endpoints; public QR endpoints expose only job-scoped operations.
- Passwords use BCrypt. EF Core parameterizes SQL and database unique constraints protect numbering.
- Uploads receive random server filenames, sanitized original names, MIME allow-listing and configurable size limits.
- Never expose this MVP directly to the public internet. Use a trusted LAN, backups, HTTPS reverse proxy where possible, strong passwords and restricted firewall rules.
- Rotate the seeded credentials and JWT key. Patient data is sensitive; establish retention, consent, backup and access policies appropriate to your jurisdiction.

## Assumptions / Varsayımlar

- One installation represents one laboratory; clinic short codes are therefore globally unique in its database.
- MVP authentication uses stateless 12-hour JWT sessions; refresh tokens and account recovery are deferred.
- SQLite serializes write transactions; unique constraints are the final concurrency guard. Failed collisions return HTTP 409 and are safe to retry.
- Photos are stored under the API content root. Original bytes are retained; EXIF stripping and thumbnail generation should be enabled with a separately reviewed image pipeline before production clinical use.
- Prices are intentionally absent. The QR page cannot delete or change core records.
- Android is not included; the job-code/token lookup and multipart upload endpoints are ready for Android share-intent integration.

## Validation / Doğrulama

```powershell
dotnet test OpenDentalFlow.sln
cd frontend
npm run build
```

Maintainers can reproduce the Windows package with `./build-windows.ps1`.

## License

Open source under the MIT License. Contributions in Turkish or English are welcome.
