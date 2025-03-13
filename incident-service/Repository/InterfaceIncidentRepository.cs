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
        public Task<Incident> Create(PostIncidentDto postIncidentDto);
        public Task<Incident> AddLike(Guid id);
        public Task<Incident> AddDislike(Guid id);
        public Task<Incident> Delete(Guid id);
    }
}
