using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using OpenDentalFlow.Api.Data;
using OpenDentalFlow.Api.Domain;

namespace OpenDentalFlow.Api.Services;

public sealed class DemoDataSeeder(
    AppDbContext db,
    ICodeService codes,
    IFileStorage storage,
    IWebHostEnvironment environment,
    IConfiguration configuration)
{
    public async Task SeedAsync()
    {
        if (!await db.Users.AnyAsync())
        {
            await SeedFreshDatabaseAsync();
        }

        await EnsureCatalogAsync();
        await EnsureSettingAsync("PublicBaseUrl", configuration["PublicBaseUrl"] ?? "http://lab.local");
        await db.SaveChangesAsync();
    }

    private async Task SeedFreshDatabaseAsync()
    {
        var now = DateTime.UtcNow;
        var today = DateTime.Today;
        var admin = new User
        {
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            CreatedAt = now.AddDays(-45)
        };
        var technician = new User
        {
            Username = "technician",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Lab123!"),
            Role = UserRole.Employee,
            CreatedAt = now.AddDays(-30)
        };

        var mardent = Clinic("Mardent Oral and Dental Health Clinic", "MRD", "0212 555 14 80", "Beşiktaş / İstanbul", "Courier pickup at 16:30. Call before urgent deliveries.", 2, now.AddDays(-120));
        var dentPlus = Clinic("DentPlus Dental Clinic", "DPL", "0216 555 32 10", "Kadıköy / İstanbul", "Prefers A-series shade photographs with every anterior case.", 2, now.AddDays(-96));
        var nova = Clinic("Nova Smile Clinic", "NSM", null, "Nilüfer / Bursa", "Digital impressions are shared through the clinic scanner portal.", 1, now.AddDays(-70));

        var ahmet = Patient(mardent, "MRD-001", 1, "Ahmet", "Yılmaz", "Existing patient — compare new cases with the previous anterior work.", now.AddDays(-42));
        var elif = Patient(mardent, "MRD-002", 2, "Elif", "Kaya", null, now.AddDays(-12));
        var selin = Patient(dentPlus, "DPL-001", 1, "Selin", "Arslan", "High smile line; request approval photo before glazing.", now.AddDays(-35));
        var can = Patient(dentPlus, "DPL-002", 2, "Can", "Demir", null, now.AddDays(-4));
        var sophie = Patient(nova, "NSM-001", 1, "Sophie", "Braun", "Bilingual clinic notes preferred.", now.AddDays(-28));

        var ahmetFirst = Job(ahmet, mardent, "MRD-001-1", 1, "Zirconia Try-in", "Zirconia", "A2", "11,12,21,22", 4, today.AddDays(1), "High", true, JobStatus.InLab, "Check midline and incisal length before final glazing.", now.AddDays(-5), codes.Token());
        ahmetFirst.Activities.AddRange([
            Activity("Zirconia Try-in", "Framework and contacts checked.", now.AddDays(-4)),
            Activity("Zirconia Dentin", "Dentin layering completed after clinic approval.", now.AddDays(-2)),
            Activity("Zirconia Adjustment", "Minor correction requested on tooth 21.", now.AddHours(-8))
        ]);
        ahmetFirst.Notes.Add(new JobNote { Text = "Clinic confirmed A2 shade; keep cervical area slightly warmer.", CreatedByUserId = null, CreatedAt = now.AddDays(-2) });

        var ahmetSecond = Job(ahmet, mardent, "MRD-001-2", 2, "Night Guard", "PMMA", null, "", 1, today.AddDays(6), "Normal", true, JobStatus.InLab, "Second independent case for the same patient.", now.AddHours(-10), codes.Token());
        var elifJob = Job(elif, mardent, "MRD-002-1", 1, "E.max Crown", "E.max", "B1", "24", 1, today, "Urgent", false, JobStatus.InLab, "Delivery before 15:00.", now.AddDays(-2), codes.Token());
        var selinJob = Job(selin, dentPlus, "DPL-001-1", 1, "Zirconia Bridge", "Zirconia", "A1", "14,15,16", 3, today.AddDays(-1), "High", true, JobStatus.InLab, "Awaiting final quality control.", now.AddDays(-7), codes.Token());
        selinJob.Activities.AddRange([
            Activity("Design", "Connector dimensions verified.", now.AddDays(-6)),
            Activity("Production", "Milled and sintered.", now.AddDays(-4)),
            Activity("Ceramic Finish", "Characterization and glaze completed.", now.AddDays(-1))
        ]);
        var canJob = Job(can, dentPlus, "DPL-002-1", 1, "Temporary Crown", "PMMA", "A3", "36", 1, today.AddDays(3), "Normal", true, JobStatus.InLab, null, now.AddDays(-1), codes.Token());
        var sophieJob = Job(sophie, nova, "NSM-001-1", 1, "Implant-supported Bridge", "Zirconia", "A2", "44,45,46", 3, today.AddDays(-2), "Normal", true, JobStatus.Dispatched, "Delivered with screw channel plugs.", now.AddDays(-12), codes.Token());
        sophieJob.CompletedAt = now.AddDays(-2);
        sophieJob.StatusHistory.Add(new JobStatusHistory { OldStatus = JobStatus.InLab, NewStatus = JobStatus.Dispatched, ChangedAt = now.AddDays(-2) });

        db.AddRange(admin, technician, mardent, dentPlus, nova, ahmet, elif, selin, can, sophie,
            ahmetFirst, ahmetSecond, elifJob, selinJob, canJob, sophieJob);
        await db.SaveChangesAsync();

        await AddDemoPhotoAsync(ahmetFirst.Id, "zirconia-anterior-demo.png", PhotoCategory.TryIn, now.AddDays(-1));
        await AddDemoPhotoAsync(selinJob.Id, "zirconia-bridge-demo.png", PhotoCategory.Finished, now.AddHours(-18));
    }

    private async Task AddDemoPhotoAsync(int jobId, string fileName, PhotoCategory category, DateTime uploadedAt)
    {
        var path = Path.Combine(environment.ContentRootPath, "DemoAssets", fileName);
        if (!File.Exists(path)) return;

        await using var stream = File.OpenRead(path);
        var file = new FormFile(stream, 0, stream.Length, "files", fileName)
        {
            Headers = new HeaderDictionary(),
            ContentType = "image/png"
        };
        var photo = await storage.SaveAsync(jobId, file, category, false, null);
        photo.UploadedAt = uploadedAt;
        await db.SaveChangesAsync();
    }

    private async Task EnsureCatalogAsync()
    {
        if (!await db.Materials.AnyAsync())
        {
            db.Materials.AddRange(
                Material("Zirconia", 1), Material("E.max", 2), Material("Metal-Ceramic", 3),
                Material("PMMA", 4), Material("Composite", 5), Material("Titanium", 6));
        }

        if (!await db.JobTypes.AnyAsync())
        {
            db.JobTypes.AddRange(
                JobType("Zirconia Crown", "Zirconia", 1), JobType("Zirconia Try-in", "Zirconia", 2),
                JobType("Zirconia Bridge", "Zirconia", 3), JobType("E.max Crown", "E.max", 4),
                JobType("Metal-Ceramic Crown", "Metal-Ceramic", 5), JobType("Implant-supported Bridge", "Zirconia", 6),
                JobType("Temporary Crown", "PMMA", 7), JobType("Night Guard", "PMMA", 8),
                JobType("Zirconia Adjustment", "Zirconia", 9));
        }
    }

    private async Task EnsureSettingAsync(string key, string value)
    {
        var setting = await db.SystemSettings.SingleOrDefaultAsync(x => x.Key == key);
        if (setting is null)
            db.SystemSettings.Add(new SystemSetting { Key = key, Value = value });
        else if (key == "PublicBaseUrl" && IsLegacyDevelopmentUrl(setting.Value))
            setting.Value = value;
    }

    private static bool IsLegacyDevelopmentUrl(string value) =>
        value.Equals("http://lab.local:5173", StringComparison.OrdinalIgnoreCase) ||
        value.Equals("http://localhost:5173", StringComparison.OrdinalIgnoreCase);

    private static Clinic Clinic(string name, string code, string? phone, string address, string notes, int sequence, DateTime createdAt) =>
        new() { Name = name, ShortCode = code, Phone = phone, Address = address, Notes = notes, LastPatientSequence = sequence, CreatedAt = createdAt };

    private static Patient Patient(Clinic clinic, string code, int sequence, string firstName, string lastName, string? description, DateTime createdAt) =>
        new() { Clinic = clinic, PatientCode = code, ClinicSequence = sequence, FirstName = firstName, LastName = lastName, Description = description, CreatedAt = createdAt };

    private static Job Job(Patient patient, Clinic clinic, string code, int sequence, string type, string? material, string? shade, string teeth, int units, DateTime due, string priority, bool digital, JobStatus status, string? description, DateTime createdAt, string token) =>
        new() { Patient = patient, Clinic = clinic, JobCode = code, JobSequence = sequence, JobType = type, Material = material, Shade = shade, Teeth = teeth, UnitCount = units, DueDate = due, Priority = priority, DigitalModelRequired = digital, Status = status, Description = description, CreatedAt = createdAt, UpdatedAt = createdAt, AccessToken = token };

    private static JobActivity Activity(string step, string description, DateTime createdAt) => new() { StepType = step, Description = description, CreatedAt = createdAt };
    private static MaterialDefinition Material(string name, int order) => new() { Name = name, SortOrder = order };
    private static JobTypeDefinition JobType(string name, string? material, int order) => new() { Name = name, DefaultMaterial = material, SortOrder = order };
}
