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
        public async Task<Incident> Get(string id)
        {
            var incident = await dataContext.Incidents.FindAsync(id);
            return incident;
        }
        public Task<Incident> Create(PostIncidentDto postIncidentDto)
        {
            throw new NotImplementedException();
        }
        public Task<Incident> AddDislike(string id)
        {
            throw new NotImplementedException();
        }

        public Task<Incident> AddLike(string id)
        {
            throw new NotImplementedException();
        }
        public Task<Incident> Delete(string id)
        {
            throw new NotImplementedException();
        }
    }
}
