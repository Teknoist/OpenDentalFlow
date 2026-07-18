# OpenDental Lab

[English](README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md)

OpenDental Lab, diş laboratuvarları için açık kaynak ve yerel ağ öncelikli bir vaka/iş takip uygulamasıdır. Tek Windows programı masaüstü yönetim ekranını açar, aynı Wi-Fi’daki telefonlara QR sayfalarını sunar, verileri SQLite’ta saklar ve 70 × 50 mm etiketi seçilen Windows yazıcısına doğrudan gönderir.

> Bu bağımsız proje, mevcut Open Dental klinik yönetim ürünüyle bağlantılı değildir. Görünen isimdeki “Lab” ifadesi laboratuvar kapsamını belirtir.

> **Demo ve gizlilik uyarısı:** Bu depoda, ekran görüntülerinde ve başlangıç demo veritabanında görülen hasta/klinik isimleri, iletişim bilgileri, işler, tarihler, notlar ve görsel içerikleri tamamen kurgusal ve demo amacıyla rastgele oluşturulmuştur. Hiçbiri gerçek bir kişi, hasta, klinik veya klinik vakayı temsil etmez.

![İngilizce gösterge ekranı](docs/screenshots/dashboard-en-v14.png)

## Öne çıkan özellikler

- Klinik bazlı değiştirilemez hasta kodu (`MRD-042`) ve hasta bazlı iş kodu (`MRD-042-2`)
- Aynı hasta altında birden fazla iş ve kronolojik laboratuvar işlem geçmişi
- Kişisel bilgi taşımayan, tahmin edilemez 80-bit anahtarlı QR bağlantısı
- QR + Code 128 etiket, sessiz yerel baskı, varsayılan yazıcı ve PNG test yazıcısı
- `Enter`, `F3`, `F9`, `F10` hızlı kayıt kısayolları
- FDI diş şeması, iş türü/materyal listeleri, otomatik materyal ve dijital model işareti
- Hasta/klinik/kod/barkod araması ve USB barkod okuyucu desteği
- Uygulama kurmadan mobil fotoğraf ve not ekleme
- JPEG/PNG/WebP doğrulama, güvenli ad, EXIF temizleme, yeniden boyutlandırma ve küçük önizleme
- Filtreli fotoğraf galerisi, büyük önizleme, kategori değiştirme ve yetkili silme
- Türkçe, İngilizce, Almanca; açık ve koyu tema
- Yönetici, çalışan ve sadece görüntüleme rolleri; tam kullanıcı düzenleme
- QR iptal/yenileme, durum geçmişi ve tek tık ZIP yedek
- Swagger/OpenAPI ve gelecekteki Android paylaşım uygulamasına hazır API

![Fotoğraf galerisi](docs/screenshots/gallery-en-v14.png)

## Barkod ve etiket çalışma mantığı

![QR ve Code 128 etiket önizlemesi](docs/screenshots/barcode-label-en-v14-v3.png)

- Her işin `MRD-001-1` gibi değiştirilemez ve insan tarafından okunabilen tek bir iş kodu vardır.
- Çizgili barkod **Code 128** formatındadır ve yalnızca bu iş kodunu taşır. Hasta adı, not, fotoğraf verisi veya QR erişim anahtarı barkodun içinde bulunmaz.
- QR kod ayrıdır. Ayarlanan yerel ağ adresini ve işe ait tahmin edilemez erişim anahtarını taşır; sınırlı yetkili mobil iş sayfasını açar.
- Etiket önizlemesi iki görseli `GET /api/jobs/{id}/label` üzerinden alır. Barkod ve QR için `/label/barcode` ile `/label/qr` PNG uçları da vardır.
- USB barkod okuyucu genellikle klavye gibi çalışır. İş listesinde hızlı arama alanı odaktayken etiket okutulur; okuyucunun `Enter/CR` son eki gelince sistem tam iş kodunu arar ve doğrudan iş detayını açar.
- `F9` yalnızca kaydeder. `F10`, işi kaydeder ve 70 × 50 mm etiketi Ayarlar'da seçilen Windows yazıcısına tarayıcı baskı penceresi göstermeden gönderir.
- Donanım olmadan denemek için **OpenDental Test Printer (PNG)** seçilir. Fiziksel okuyucuda Code 128 etkin olmalı ve kullanım kılavuzundan `Enter` son eki ayarlanmalıdır.

Etiket üzerinde laboratuvar kullanımı için hasta adı görünür olabilir; ancak ne Code 128 barkodun ne de QR URL’sinin içine hasta adı yazılır. Yazdırma katmanı gelecekte ZPL/TSPL eklenebilecek şekilde soyutlanmıştır.

## Tek program olarak kurulum

`OpenDentalLab-Windows-x64-v1.4.0-test.zip` dosyasını bir klasöre çıkarın ve `OpenDentalLab.exe` dosyasını çalıştırın. CMD, tarayıcı, Node.js veya .NET gerekmez. Veriler `%LOCALAPPDATA%\OpenDentalFlow` altında saklandığı için program güncellenince kaybolmaz.

İlk yönetici: `admin` / `Admin123!`<br>
Gerçek veri girmeden önce parolayı değiştirin. Güvenlik için giriş alanları boş açılır.

## Kaynaktan geliştirme

Gereksinimler: Windows 10/11 x64, .NET 8 SDK, Node.js 20+ ve Edge WebView2 Runtime.

```powershell
git clone https://github.com/Teknoist/OpenDentalFlow.git
cd OpenDentalFlow
dotnet restore
cd frontend
npm install
npm run build
```

```powershell
dotnet run --project backend/OpenDentalFlow.Api
```

Geliştirme arayüzü için ikinci terminal:

```powershell
cd frontend
npm run dev -- --host 0.0.0.0
```

Swagger: `http://localhost:5080/swagger`

## Migration ve demo verisi

Migration’lar açılışta otomatik uygulanır. Elle uygulamak için:

```powershell
dotnet tool install --global dotnet-ef --version 8.*
dotnet ef database update --project backend/OpenDentalFlow.Api --startup-project backend/OpenDentalFlow.Api
```

Yeni boş kurulumda gerçekçi fakat tamamen sentetik klinik, hasta, iş, işlem geçmişi, not ve iki laboratuvar görseli oluşturulur. Gösterilen tüm isimler, kayıtlar ve görsel içerikleri yalnızca demo için kurgusal ve rastgele üretilmiştir; gerçek hasta, klinik veya kimlik bilgisi içermez. Mevcut veritabanı asla demo veriyle değiştirilmez.

## Yerel ağ, Firewall ve `lab.local`

1. Bilgisayar ve telefonları aynı güvenilir Wi-Fi’a bağlayın.
2. `ipconfig` ile bilgisayarın IPv4 adresini bulun.
3. Telefonda `http://SUNUCU-IP:5080` adresini deneyin. `5173` yalnız geliştirme portudur ve paketli uygulamada kullanılmamalıdır.
4. **Ayarlar → QR ana adresi** alanına bu adresi veya tercihen `http://lab.local:5080` yazın.
5. Kalıcı etiket basmadan önce QR’ı telefonla test edin.

Özel ağ için Windows Firewall kuralı:

```powershell
New-NetFirewallRule -DisplayName "OpenDental Lab LAN" -Direction Inbound -Protocol TCP -LocalPort 5080 -Action Allow -Profile Private
```

`lab.local` için en iyi çözüm modem/router üzerinde yerel DNS ve sabit DHCP kaydıdır. Pi-hole veya AdGuard Home da kullanılabilir. Android cihazlarda genellikle modem/yerel DNS gerekir. Sabit ad, IP değişse bile eski QR etiketlerini korur.

## Termal yazıcı

Üreticinin Windows sürücüsünü kurup kenar boşluksuz 70 × 50 mm kâğıt tanımlayın. **Ayarlar → Varsayılan etiket yazıcısı** alanından seçin. `F10`, tarayıcı penceresi göstermeden doğrudan baskı gönderir.

Gerçek yazıcı olmadan denemek için **OpenDental Test Printer (PNG)** seçin. Çıktılar `%LOCALAPPDATA%\OpenDentalFlow\TestPrints` klasörüne 200 DPI PNG olarak yazılır.

## Güvenlik

- Sistemi doğrudan internete açmayın; güvenilir yerel ağda kullanın.
- İlk parolayı ve örnek JWT anahtarını değiştirin.
- QR sayfası ana kayıtları değiştiremez, hasta/iş silemez, klinik değiştiremez ve kullanıcı yönetemez.
- Fotoğraflar MIME + dosya imzasıyla doğrulanır; kullanıcı dosya adı depolama yolu olarak kullanılmaz.
- Hasta verileri hassastır. Yetki, saklama, onay, yedek ve silme politikalarını mevzuata göre belirleyin.
- Yedekleri şifreli biçimde farklı bir cihazda da saklayın ve geri yüklemeyi düzenli test edin.

## Varsayımlar

- Bir kurulum tek laboratuvarı temsil eder.
- SQLite, tek yerel sunucuda indeksli binlerce iş için uygundur. Çok şubeli ve yoğun eş zamanlı kullanımda PostgreSQL/SQL Server’a geçilmelidir.
- Oturumlar 12 saatlik JWT kullanır; yenileme tokenı ve parola kurtarma MVP dışında bırakılmıştır.
- Android uygulaması zorunlu değildir; API sonraki paylaşım uygulamasına hazırdır.
- Fiyatlandırma, fatura ve bulut senkronizasyonu bu MVP’nin dışındadır.

## Test ve paketleme

```powershell
dotnet build OpenDentalFlow.sln
dotnet test OpenDentalFlow.sln
cd frontend
npm run build
```

Windows paketi: `.\build-windows.ps1`

## Lisans

[MIT](LICENSE).
