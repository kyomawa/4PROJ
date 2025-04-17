using incident_service.DTO.BoundingBox;
using incident_service.DTO.Incident;
using incident_service.DTO.Vote;
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
        public Task<IncidentDto> Vote(Guid currentUserId, Guid id, VoteIncidentDto contributeIncidentDto);
        public Task<IncidentDto> Delete(Guid id);

    }
}
