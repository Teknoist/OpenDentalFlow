using System.ComponentModel.DataAnnotations;
using OpenDentalFlow.Api.Domain;
namespace OpenDentalFlow.Api.Contracts;
public record LoginDto([Required]string Username,[Required]string Password);
public record ClinicDto([Required]string Name,[Required,RegularExpression("^[A-Z0-9]{3,4}$")]string ShortCode,string? Phone,string? Address,bool IsActive=true);
public record CreateJobDto(int ClinicId,int? PatientId,string? FirstName,string? LastName,string? PatientDescription,DateTime? DueDate,[Required]string JobType,string? Material,string? Shade,List<int> Teeth,int? UnitCount,string Priority="Normal",string? Description=null);
public record StatusDto(JobStatus Status);
public record NoteDto([Required,MaxLength(2000)]string Text);
public record SettingDto([Required]string Value);
