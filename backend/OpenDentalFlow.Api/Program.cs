using System.Diagnostics;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using OpenDentalFlow.Api.Data;
using OpenDentalFlow.Api.Domain;
using OpenDentalFlow.Api.Services;

var executableRoot = Path.GetDirectoryName(Environment.ProcessPath) ?? Directory.GetCurrentDirectory();
var builder = WebApplication.CreateBuilder(new WebApplicationOptions { Args = args, ContentRootPath = executableRoot });
var dataRoot = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "OpenDentalFlow");
Directory.CreateDirectory(dataRoot);
Directory.CreateDirectory(Path.Combine(dataRoot, "uploads"));
var port = builder.Configuration.GetValue("Port", 5080);
var localUrl = $"http://localhost:{port}";
var configuredPublicBaseUrl = builder.Configuration["PublicBaseUrl"]?.Trim().TrimEnd('/');
var detectedLanAddress = NetworkInterface.GetAllNetworkInterfaces()
    .Where(x => x.OperationalStatus == OperationalStatus.Up && x.NetworkInterfaceType is not NetworkInterfaceType.Loopback)
    .OrderByDescending(x => x.GetIPProperties().GatewayAddresses.Count > 0)
    .SelectMany(x => x.GetIPProperties().UnicastAddresses)
    .Select(x => x.Address)
    .FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(x));
var detectedPublicBaseUrl = $"http://{detectedLanAddress ?? IPAddress.Loopback}:{port}";
if (string.IsNullOrWhiteSpace(configuredPublicBaseUrl) ||
    configuredPublicBaseUrl.Equals("http://lab.local:5173", StringComparison.OrdinalIgnoreCase) ||
    configuredPublicBaseUrl.Equals("http://localhost:5173", StringComparison.OrdinalIgnoreCase))
{
    builder.Configuration["PublicBaseUrl"] = detectedPublicBaseUrl;
}
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlite($"Data Source={Path.Combine(dataRoot, "opendentalflow.db")}"));
builder.Services.AddScoped<IShortCodeService, ShortCodeService>(); builder.Services.AddSingleton<ICodeService, CodeService>(); builder.Services.AddSingleton<ILabelService, LabelService>(); builder.Services.AddScoped<IFileStorage, LocalFileStorage>();
builder.Services.AddSingleton<IWindowsPrinterService, WindowsPrinterService>();
builder.Services.AddScoped<DemoDataSeeder>();
builder.Services.AddControllers().AddJsonOptions(o => { o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles; o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); });
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "OpenDentalFlow-local-change-this-secret-2026");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o => o.TokenValidationParameters = new() { ValidateIssuer = false, ValidateAudience = false, ValidateLifetime = true, ValidateIssuerSigningKey = true, IssuerSigningKey = new SymmetricSecurityKey(key) });
builder.Services.AddAuthorization(); builder.Services.AddRateLimiter(o => o.AddFixedWindowLimiter("public", x => { x.PermitLimit = 60; x.Window = TimeSpan.FromMinutes(1); x.QueueLimit = 0; }));
builder.Services.AddEndpointsApiExplorer(); builder.Services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new() { Title = "OpenDental Lab API", Version = "v1" }); c.AddSecurityDefinition("Bearer", new() { Type = SecuritySchemeType.Http, Scheme = "bearer", BearerFormat = "JWT" }); });
var app = builder.Build(); app.UseSwagger(); app.UseSwaggerUI(); app.UseCors(); app.UseRateLimiter();
app.Use(async (context,next)=>{try{await next();}catch(InvalidOperationException ex) when(context.Request.Path.Value?.Contains("/photos",StringComparison.OrdinalIgnoreCase)==true){context.Response.StatusCode=StatusCodes.Status400BadRequest;await context.Response.WriteAsJsonAsync(new{message=ex.Message});}});
app.UseDefaultFiles(); app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions { FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(Path.Combine(dataRoot, "uploads")), RequestPath = "/uploads" });
app.UseAuthentication(); app.UseAuthorization(); app.MapControllers(); app.MapFallbackToFile("index.html");
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await scope.ServiceProvider.GetRequiredService<DemoDataSeeder>().SeedAsync();
}
await app.StartAsync();
var headless = args.Contains("--no-ui") || args.Contains("--no-browser");
if (headless)
{
    await app.WaitForShutdownAsync();
}
else
{
    var windowClosed = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
    var uiThread = new Thread(() =>
    {
        try
        {
            var desktop = new System.Windows.Application
            {
                ShutdownMode = System.Windows.ShutdownMode.OnMainWindowClose
            };
            desktop.Run(new OpenDentalFlow.Api.Desktop.DesktopWindow(localUrl));
            windowClosed.TrySetResult();
        }
        catch (Exception ex)
        {
            windowClosed.TrySetException(ex);
        }
    })
    {
        IsBackground = false,
        Name = "OpenDental Lab Desktop UI"
    };
    uiThread.SetApartmentState(ApartmentState.STA);
    uiThread.Start();
    await windowClosed.Task;
    await app.StopAsync();
}
public partial class Program { }
