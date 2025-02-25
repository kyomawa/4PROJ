using System.Net.Http;
using System.Text.Json.Nodes;
using System.Text.Json;
using incident_service.DTO.Incident;
using incident_service.Repository;
using incident_service.Enums;
using AutoMapper;
using incident_service.Models;

namespace incident_service.Services
{
    public class IncidentService(InterfaceIncidentRepository incidentRepository, IMapper mapper) : InterfaceIncidentService
    {
        public async Task<List<IncidentDto>> GetAll()
        {
            var incidents = await incidentRepository.GetAll();
            return mapper.Map<List<IncidentDto>>(incidents);
        }
        public async Task<IncidentDto> Get(string id)
        {
            var incident = await incidentRepository.Get(id);
            return mapper.Map<IncidentDto>(incident);
        }

        public async Task<IncidentDto> Create(PostIncidentDto postIncidentDto)
        {
            var incident = await incidentRepository.Create(postIncidentDto);
            return mapper.Map<IncidentDto>(incident);
        }

        public async Task<IncidentDto> Update(PutIncidentDto putIncidentDto)
        {
            Incident incident = null;
            if (putIncidentDto.Reaction == ReactionType.Like)
            {
                incident = await incidentRepository.AddLike(putIncidentDto.Id);
            }
            else if (putIncidentDto.Reaction == ReactionType.Dislike)
            {
                incident = await incidentRepository.AddDislike(putIncidentDto.Id);
            }
            return mapper.Map<IncidentDto>(incident);
        }

        public async Task<IncidentDto> Delete(string id)
        {
            var incident = await incidentRepository.Delete(id);
            return mapper.Map<IncidentDto>(incident);
        }
    }
}
