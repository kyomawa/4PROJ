using incident_service.DTO.BoundingBox;
using incident_service.DTO.Incident;
using incident_service.Models;

namespace incident_service.Repository
{
    public interface InterfaceIncidentRepository
    {
        public Task<List<Incident>> GetAll();
        public Task<List<Incident>> GetByBoundingBox(BoundingBoxDto boundingBox);
        public Task<Incident> Get(Guid id);
        public Task<bool> Exist(PostIncidentDto postIncidentDto);
        public Task<Incident> Disable(Incident incident);
        public Task<Incident> Create(PostIncidentDto postIncidentDto);
        public Task<Incident> Update(Incident incident, UpdateIncidentDto updateIncidentDto);
        public Task<Incident> AddLike(Incident incident);
        public Task<Incident> AddDislike(Incident incident);
        public Task<Incident> Delete(Incident incident);
    }
}
