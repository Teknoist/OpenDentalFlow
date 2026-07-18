using System.Security.Cryptography; using System.Text.RegularExpressions; using BarcodeStandard; using SkiaSharp; using Microsoft.EntityFrameworkCore; using OpenDentalFlow.Api.Data; using OpenDentalFlow.Api.Domain; using QRCoder;
namespace OpenDentalFlow.Api.Services;
public interface IShortCodeService { Task<List<string>> SuggestAsync(string name); }
public class ShortCodeService(AppDbContext db):IShortCodeService { public async Task<List<string>> SuggestAsync(string name){var s=name.ToUpperInvariant().Replace("İ","I").Replace("Ş","S").Replace("Ğ","G").Replace("Ü","U").Replace("Ö","O").Replace("Ç","C");var words=Regex.Matches(s,"[A-Z0-9]+").Select(x=>x.Value).ToArray();var joined=string.Concat(words);if(joined.Length==0)joined="KLN";var c=new List<string>();if(words.Length>1)c.Add(string.Concat(words.Select(x=>x[0])).PadRight(3,joined[^1])[..3]);c.Add(joined.PadRight(3,'X')[..3]);c.Add($"{joined[0]}{joined[joined.Length/2]}{joined[^1]}");for(var i=1;i<10;i++)c.Add(($"{joined[..Math.Min(3,joined.Length)]}{i}").PadRight(3,'X')[..Math.Min(4,Math.Max(3,joined.Length+1))]);var used=await db.Clinics.Select(x=>x.ShortCode).ToListAsync();return c.Where(x=>x.Length is 3 or 4&&!used.Contains(x)).Distinct().Take(5).ToList();} }
public interface ICodeService { string Token(); } public class CodeService:ICodeService { public string Token()=>Convert.ToHexString(RandomNumberGenerator.GetBytes(10)); }
public interface ILabelService { byte[] Qr(string url); byte[] Barcode(string value); }
public class LabelService:ILabelService { public byte[] Qr(string url){using var d=QRCodeGenerator.GenerateQrCode(url,QRCodeGenerator.ECCLevel.Q);return new PngByteQRCode(d).GetGraphic(8);}public byte[] Barcode(string value){var b=new Barcode();using var image=b.Encode(BarcodeStandard.Type.Code128,value,SKColors.Black,SKColors.White,360,80);using var data=image.Encode(SKEncodedImageFormat.Png,100);return data.ToArray();} }
public interface IFileStorage { Task<JobPhoto> SaveAsync(int jobId,IFormFile file,PhotoCategory category,bool viaQr,int? userId); Task DeleteAsync(JobPhoto photo); }
public class LocalFileStorage(AppDbContext db,IConfiguration cfg):IFileStorage {
 readonly string root=Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"OpenDentalFlow","uploads");
 public async Task<JobPhoto> SaveAsync(int jobId,IFormFile file,PhotoCategory category,bool viaQr,int? userId){
  var allowed=new Dictionary<string,(string Ext,SKEncodedImageFormat Format,int Quality)>{{"image/jpeg",(".jpg",SKEncodedImageFormat.Jpeg,90)},{"image/png",(".png",SKEncodedImageFormat.Png,100)},{"image/webp",(".webp",SKEncodedImageFormat.Webp,90)}};
  var mime=file.ContentType.ToLowerInvariant();
  if(!allowed.TryGetValue(mime,out var kind))throw new InvalidOperationException(mime.Contains("heic",StringComparison.OrdinalIgnoreCase)?"HEIC desteklenmiyor. JPEG, PNG veya WebP kullanın.":"Desteklenmeyen dosya türü.");
  var max=cfg.GetValue<long>("Uploads:MaxBytes",10485760);if(file.Length<=0||file.Length>max)throw new InvalidOperationException($"Dosya en fazla {max/1048576} MB olabilir.");
  await using var input=file.OpenReadStream();using var memory=new MemoryStream();await input.CopyToAsync(memory);var bytes=memory.ToArray();
  if(!SignatureMatches(bytes,mime))throw new InvalidOperationException("Dosya içeriği seçilen görsel türüyle eşleşmiyor.");
  using var bitmap=SKBitmap.Decode(bytes)??throw new InvalidOperationException("Görsel okunamadı veya bozuk.");
  if(bitmap.Width<=0||bitmap.Height<=0||(long)bitmap.Width*bitmap.Height>60_000_000)throw new InvalidOperationException("Görsel boyutları desteklenmiyor.");
  var dir=Path.Combine(root,jobId.ToString());Directory.CreateDirectory(dir);var id=Guid.NewGuid().ToString("N");
  var stored=$"{id}{kind.Ext}";var thumb=$"{id}_thumb.jpg";
  using var normalized=Resize(bitmap,2400,2400);using(var image=SKImage.FromBitmap(normalized))using(var encoded=image.Encode(kind.Format,kind.Quality))await File.WriteAllBytesAsync(Path.Combine(dir,stored),encoded.ToArray());
  using var thumbnail=Resize(bitmap,480,360);using(var image=SKImage.FromBitmap(thumbnail))using(var encoded=image.Encode(SKEncodedImageFormat.Jpeg,82))await File.WriteAllBytesAsync(Path.Combine(dir,thumb),encoded.ToArray());
  var storedPath=$"{jobId}/{stored}";var thumbPath=$"{jobId}/{thumb}";var p=new JobPhoto{JobId=jobId,Category=category,OriginalFileName=Path.GetFileName(file.FileName),StoredFileName=storedPath,ThumbnailStoredFileName=thumbPath,MimeType=mime,FileSize=new FileInfo(Path.Combine(dir,stored)).Length,UploadedViaQr=viaQr,UploadedByUserId=userId};db.JobPhotos.Add(p);await db.SaveChangesAsync();return p;
 }
 public Task DeleteAsync(JobPhoto photo){DeleteSafe(photo.StoredFileName);if(!string.IsNullOrWhiteSpace(photo.ThumbnailStoredFileName))DeleteSafe(photo.ThumbnailStoredFileName);return Task.CompletedTask;}
 void DeleteSafe(string relative){var full=Path.GetFullPath(Path.Combine(root,relative.Replace('/',Path.DirectorySeparatorChar)));var prefix=Path.GetFullPath(root)+Path.DirectorySeparatorChar;if(full.StartsWith(prefix,StringComparison.OrdinalIgnoreCase)&&File.Exists(full))File.Delete(full);}
 static SKBitmap Resize(SKBitmap source,int maxWidth,int maxHeight){var scale=Math.Min(1d,Math.Min((double)maxWidth/source.Width,(double)maxHeight/source.Height));var info=new SKImageInfo(Math.Max(1,(int)Math.Round(source.Width*scale)),Math.Max(1,(int)Math.Round(source.Height*scale)));return source.Resize(info,SKFilterQuality.High)??source.Copy();}
 static bool SignatureMatches(byte[] b,string mime)=>mime switch{"image/jpeg"=>b.Length>3&&b[0]==0xFF&&b[1]==0xD8&&b[2]==0xFF,"image/png"=>b.Length>8&&b[0]==0x89&&b[1]==0x50&&b[2]==0x4E&&b[3]==0x47,"image/webp"=>b.Length>12&&Encoding.ASCII.GetString(b,0,4)=="RIFF"&&Encoding.ASCII.GetString(b,8,4)=="WEBP",_=>false};
}
