using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using statistic_service.Enums;
using statistic_service.Models;

namespace statistic_service.Contexts
{
    public class IncidentContext : DbContext
    {
        public IncidentContext(DbContextOptions<IncidentContext> options) : base(options) { }
        public IncidentContext() { }
        public DbSet<Incident> Incidents => Set<Incident>();
        public DbSet<UserIncidentVote> UserIncidentVotes => Set<UserIncidentVote>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var typeConverter = new ValueConverter<IncidentType, string>(
                   v => v.ToString(),
                   v => (IncidentType)Enum.Parse(typeof(IncidentType), v)
               );

            var statusConverter = new ValueConverter<IncidentStatus, string>(
                v => v.ToString(),
                v => (IncidentStatus)Enum.Parse(typeof(IncidentStatus), v)
            );

            modelBuilder
                .Entity<Incident>()
                .Property(i => i.Type)
                .HasConversion(typeConverter);

            modelBuilder
                .Entity<Incident>()
                .Property(i => i.Status)
                .HasConversion(statusConverter);


            modelBuilder.Entity<UserIncidentVote>()
                .HasOne(v => v.Incident)
                .WithMany(i => i.Votes)
                .HasForeignKey(v => v.IncidentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
