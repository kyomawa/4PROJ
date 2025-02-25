using incident_service.Contexts;
using incident_service.DTO.Incident;
using incident_service.Models;
using Microsoft.EntityFrameworkCore;

namespace incident_service.Repository
{
    public class IncidentRepository(DataContext dataContext) : InterfaceIncidentRepository
    {
        public async Task<List<Incident>> GetAll()
        {
            var incidents = await dataContext.Incidents.ToListAsync();
            return incidents;
        }
        public async Task<Incident> Get(Guid id)
        {
            var incident = await dataContext.Incidents.FindAsync(id);
            return incident;
        }
        public async Task<Incident> Create(PostIncidentDto postIncidentDto)
        {
            var incident = new Incident
            {
                Type = postIncidentDto.Type,
                Longitude = postIncidentDto.Longitude,
                Latitude = postIncidentDto.Latitude,
                CreationDate = DateTime.Now
            };

            var createdIncident = await dataContext.Incidents.AddAsync(incident);
            await dataContext.SaveChangesAsync();
            return createdIncident.Entity;
        }
        public async Task<Incident> AddLike(Guid id)
        {
            var incident = await Get(id);
            incident.Like++;
            await dataContext.SaveChangesAsync();
            return incident;
        }
        public async Task<Incident> AddDislike(Guid id)
        {
            var incident = await Get(id);
            incident.Like--;
            await dataContext.SaveChangesAsync();
            return incident;
        }
        public async Task<Incident> Delete(Guid id)
        {
            var incident = await Get(id);
            var removedIncident = dataContext.Incidents.Remove(incident);
            await dataContext.SaveChangesAsync();
            return removedIncident.Entity;
        }
    }
}
