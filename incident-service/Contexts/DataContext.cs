using AutoMapper.Execution;
using incident_service.Enums;
using incident_service.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace incident_service.Contexts
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DataContext() { }
        public DbSet<Incident> Incidents => Set<Incident>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var converter = new ValueConverter<IncidentType, string>(
                    v => v.ToString(),
                    v => (IncidentType)Enum.Parse(typeof(IncidentType), v)
                );

            base.OnModelCreating(modelBuilder);

            modelBuilder
                .Entity<Incident>()
                .Property(i => i.Type)
                .HasConversion(converter);
        }
    }
}
