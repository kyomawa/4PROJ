using incident_service.DTO.Incident;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Nodes;

namespace incident_service.Services
{
    public interface InterfaceIncidentService
    {
        public Task<List<IncidentDto>> GetAll();
        public Task<IncidentDto> Get(string id);
        public Task<IncidentDto> Create(PostIncidentDto postIncidentDto);
        public Task<IncidentDto> Update([FromBody] PutIncidentDto putIncidentDto);
        public Task<IncidentDto> Delete(string id);

    }
}
