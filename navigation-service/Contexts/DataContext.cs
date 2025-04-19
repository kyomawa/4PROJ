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
        public DbSet<Itinerary> Incidents => Set<Itinerary>();
    }
}
