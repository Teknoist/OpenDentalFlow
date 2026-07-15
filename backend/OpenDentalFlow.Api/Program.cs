using System.Diagnostics;
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
var builder = WebApplication.CreateBuilder(new WebApplicationOptions { Args=args, ContentRootPath=executableRoot });
var dataRoot = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "OpenDentalFlow");
Directory.CreateDirectory(dataRoot);
Directory.CreateDirectory(Path.Combine(dataRoot, "uploads"));
var port = builder.Configuration.GetValue("Port", 5080);
var localUrl = $"http://localhost:{port}";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlite($"Data Source={Path.Combine(dataRoot,"opendentalflow.db")}"));
builder.Services.AddScoped<IShortCodeService,ShortCodeService>(); builder.Services.AddSingleton<ICodeService,CodeService>(); builder.Services.AddSingleton<ILabelService,LabelService>(); builder.Services.AddScoped<IFileStorage,LocalFileStorage>();
builder.Services.AddControllers().AddJsonOptions(o => { o.JsonSerializerOptions.ReferenceHandler=ReferenceHandler.IgnoreCycles; o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); });
builder.Services.AddCors(o=>o.AddDefaultPolicy(p=>p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
var key=Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]??"OpenDentalFlow-local-change-this-secret-2026");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o=>o.TokenValidationParameters=new(){ValidateIssuer=false,ValidateAudience=false,ValidateLifetime=true,ValidateIssuerSigningKey=true,IssuerSigningKey=new SymmetricSecurityKey(key)});
builder.Services.AddAuthorization(); builder.Services.AddRateLimiter(o=>o.AddFixedWindowLimiter("public",x=>{x.PermitLimit=60;x.Window=TimeSpan.FromMinutes(1);x.QueueLimit=0;}));
builder.Services.AddEndpointsApiExplorer(); builder.Services.AddSwaggerGen(c=>{c.SwaggerDoc("v1",new(){Title="OpenDentalFlow API",Version="v1"});c.AddSecurityDefinition("Bearer",new(){Type=SecuritySchemeType.Http,Scheme="bearer",BearerFormat="JWT"});});
var app=builder.Build(); app.UseSwagger(); app.UseSwaggerUI(); app.UseCors(); app.UseRateLimiter(); app.UseDefaultFiles(); app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions{FileProvider=new Microsoft.Extensions.FileProviders.PhysicalFileProvider(Path.Combine(dataRoot,"uploads")),RequestPath="/uploads"});
app.UseAuthentication(); app.UseAuthorization(); app.MapControllers(); app.MapFallbackToFile("index.html");
using(var scope=app.Services.CreateScope()){var db=scope.ServiceProvider.GetRequiredService<AppDbContext>();await db.Database.MigrateAsync();if(!await db.Users.AnyAsync()){db.Users.Add(new(){Username="admin",PasswordHash=BCrypt.Net.BCrypt.HashPassword("Admin123!"),Role=UserRole.Admin});var c=new Clinic{Name="DentPlus",ShortCode="DPL",Phone="0212 555 01 01",LastPatientSequence=1};var p=new Patient{Clinic=c,PatientCode="DPL-001",ClinicSequence=1,FirstName="Örnek",LastName="Hasta"};var j=new Job{Clinic=c,Patient=p,JobCode="DPL-001-1",JobSequence=1,JobType="Zirkonyum Kron",Material="Zirkonyum",Shade="A2",Teeth="11,12",UnitCount=2,DueDate=DateTime.Today.AddDays(3),AccessToken=Convert.ToHexString(System.Security.Cryptography.RandomNumberGenerator.GetBytes(10))};db.AddRange(c,p,j,new SystemSetting{Key="PublicBaseUrl",Value=builder.Configuration["PublicBaseUrl"]??localUrl});await db.SaveChangesAsync();}}
if(!args.Contains("--no-browser"))app.Lifetime.ApplicationStarted.Register(()=>{try{Process.Start(new ProcessStartInfo(localUrl){UseShellExecute=true});}catch{}});
await app.RunAsync(); public partial class Program{}
