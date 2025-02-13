using incident_service.Models;
using Microsoft.EntityFrameworkCore;

namespace incident_service.Contexts
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DataContext() { }
        public DbSet<Incident> Incidents => Set<Incident>();

    }
}
}
