using incident_service.DTO.Incident;
using incident_service.Models;

namespace incident_service.Repository
{
    public interface InterfaceIncidentRepository
    {
        public Task<List<Incident>> GetAll();
        public Task<Incident> Get(string id);
        public Task<Incident> Create(PostIncidentDto postIncidentDto);
        public Task<Incident> AddLike(string id);
        public Task<Incident> AddDislike(string id);
        public Task<Incident> Delete(string id);
    }
}
