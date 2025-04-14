using incident_service.DTO.BoundingBox;
using incident_service.DTO.Incident;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Nodes;

namespace incident_service.Services
{
    public interface InterfaceIncidentService
    {
        public Task<List<IncidentDto>> GetAll();
        public Task<List<IncidentDto>> GetByBoundingBox(BoundingBoxDto boundingBox);
        public Task<IncidentDto> Get(Guid id);
        public Task<IncidentDto> Create(PostIncidentDto postIncidentDto);
        public Task<IncidentDto> Update(Guid id, UpdateIncidentDto updateIncidentDto);
        public Task<IncidentDto> Contribute(Guid id, [FromBody] ContributeIncidentDto putIncidentDto);
        public Task<IncidentDto> Delete(Guid id);

    }
}
