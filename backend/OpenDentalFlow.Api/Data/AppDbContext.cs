using Microsoft.EntityFrameworkCore;
using OpenDentalFlow.Api.Domain;

namespace OpenDentalFlow.Api.Data;
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options) {
 public DbSet<User> Users => Set<User>(); public DbSet<Clinic> Clinics => Set<Clinic>(); public DbSet<Patient> Patients => Set<Patient>(); public DbSet<Job> Jobs => Set<Job>(); public DbSet<JobStatusHistory> JobStatusHistory => Set<JobStatusHistory>(); public DbSet<JobPhoto> JobPhotos => Set<JobPhoto>(); public DbSet<JobNote> JobNotes => Set<JobNote>(); public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();
 protected override void OnModelCreating(ModelBuilder b) {
  b.Entity<User>().HasIndex(x=>x.Username).IsUnique(); b.Entity<Clinic>().HasIndex(x=>x.ShortCode).IsUnique();
  b.Entity<Patient>().HasIndex(x=>x.PatientCode).IsUnique(); b.Entity<Patient>().HasIndex(x=>new{x.ClinicId,x.ClinicSequence}).IsUnique();
  b.Entity<Job>().HasIndex(x=>x.JobCode).IsUnique(); b.Entity<Job>().HasIndex(x=>x.AccessToken).IsUnique(); b.Entity<Job>().HasIndex(x=>new{x.PatientId,x.JobSequence}).IsUnique();
  b.Entity<SystemSetting>().HasIndex(x=>x.Key).IsUnique();
 }
}
