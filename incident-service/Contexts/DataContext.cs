﻿using AutoMapper.Execution;
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
