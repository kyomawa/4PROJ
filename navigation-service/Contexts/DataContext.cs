using AutoMapper;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using navigation_service.Models;


namespace navigation_service.Contexts
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DataContext() { }
        public DbSet<Itinerary> Itinerary => Set<Itinerary>();
        public DbSet<UserItinerary> UserItinerary => Set<UserItinerary>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserItinerary>()
                .HasMany(userItinerary => userItinerary.Itineraries)
                .WithOne(itinerary => itinerary.UserItinerary)
                .HasForeignKey(itinerary => itinerary.UserItineraryId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
