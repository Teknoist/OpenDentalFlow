using System.Drawing;
using System.Drawing.Printing;
using System.Drawing.Imaging;
using OpenDentalFlow.Api.Domain;

namespace OpenDentalFlow.Api.Services;

public interface IWindowsPrinterService
{
    IReadOnlyList<string> GetInstalledPrinters();
    PrintResult PrintLabel(Job job, string publicUrl, string printerName);
}

public record PrintResult(string Message, string? OutputPath = null);

public sealed class WindowsPrinterService(ILabelService labels) : IWindowsPrinterService
{
    public const string TestPrinter = "OpenDental Test Printer (PNG)";
    public IReadOnlyList<string> GetInstalledPrinters() =>
        [TestPrinter, .. PrinterSettings.InstalledPrinters.Cast<string>().OrderBy(x => x)];

    public PrintResult PrintLabel(Job job, string publicUrl, string printerName)
    {
        if (string.IsNullOrWhiteSpace(printerName))
            throw new InvalidOperationException("Ayarlar bölümünden varsayılan etiket yazıcısını seçin.");

        using var qrStream = new MemoryStream(labels.Qr(publicUrl));
        using var barcodeStream = new MemoryStream(labels.Barcode(job.JobCode));
        using var qr = Image.FromStream(qrStream);
        using var barcode = Image.FromStream(barcodeStream);
        using var titleFont = new Font("Arial", 14, FontStyle.Bold);
        using var bodyFont = new Font("Arial", 7, FontStyle.Regular);
        using var boldFont = new Font("Arial", 8, FontStyle.Bold);

        void Draw(Graphics g, float scaleX, float scaleY)
        {
            g.PageUnit = GraphicsUnit.Pixel;
            g.Clear(Color.White);
            PointF P(float x, float y) => new(x * scaleX, y * scaleY);
            RectangleF R(float x, float y, float width, float height) => new(x * scaleX, y * scaleY, width * scaleX, height * scaleY);
            g.DrawString(job.Clinic.Name, bodyFont, Brushes.Black, P(10, 8));
            g.DrawString(job.JobCode, titleFont, Brushes.Black, P(10, 25));
            g.DrawString($"{job.Patient.FirstName} {job.Patient.LastName}", boldFont, Brushes.Black, P(10, 52));
            g.DrawString($"{job.JobType} · {job.Material} · {job.Shade}", bodyFont, Brushes.Black, P(10, 70));
            g.DrawString($"Diş: {job.Teeth} · {job.UnitCount} üye", bodyFont, Brushes.Black, P(10, 84));
            g.DrawString($"Teslim: {job.DueDate:dd.MM.yyyy}", bodyFont, Brushes.Black, P(10, 98));
            if (job.DigitalModelRequired)
                g.DrawString("DİJİTAL MODEL", boldFont, Brushes.Black, P(10, 112));
            g.DrawImage(barcode, R(10, 132, 165, 42));
            g.DrawImage(qr, R(186, 18, 78, 78));
        }

        if (printerName == TestPrinter)
        {
            var folder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "OpenDentalFlow", "TestPrints");
            Directory.CreateDirectory(folder);
            var path = Path.Combine(folder, $"{job.JobCode}-{DateTime.Now:yyyyMMdd-HHmmssfff}.png");
            using var preview = new Bitmap(552, 394);
            preview.SetResolution(200, 200);
            using (var graphics = Graphics.FromImage(preview))
            {
                graphics.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAliasGridFit;
                Draw(graphics, 2, 2);
            }
            preview.Save(path, ImageFormat.Png);
            return new PrintResult("Test etiketi PNG olarak kaydedildi.", path);
        }

        using var document = new PrintDocument
        {
            DocumentName = $"OpenDentalLab-{job.JobCode}",
            PrintController = new StandardPrintController()
        };
        document.PrinterSettings.PrinterName = printerName;
        if (!document.PrinterSettings.IsValid)
            throw new InvalidOperationException($"'{printerName}' yazıcısı bulunamadı veya kullanılamıyor.");
        document.DefaultPageSettings.PaperSize = new PaperSize("OpenDental Lab 70x50", 276, 197);
        document.DefaultPageSettings.Margins = new Margins(0, 0, 0, 0);
        document.OriginAtMargins = false;
        document.PrintPage += (_, e) =>
        {
            var graphics = e.Graphics ?? throw new InvalidOperationException("Yazıcı çizim yüzeyi oluşturulamadı.");
            Draw(graphics, graphics.DpiX / 100f, graphics.DpiY / 100f);
            e.HasMorePages = false;
        };

        document.Print();
        return new PrintResult("Etiket yazıcıya gönderildi.");
    }
}
