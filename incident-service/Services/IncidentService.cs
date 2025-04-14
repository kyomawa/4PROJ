using System.Net.Http;
using System.Text.Json.Nodes;
using System.Text.Json;
using incident_service.DTO.Incident;
using incident_service.Repository;
using incident_service.Enums;
using AutoMapper;
using incident_service.Models;
using incident_service.Exceptions;
using incident_service.DTO.BoundingBox;

namespace incident_service.Services
{
    public class IncidentService(InterfaceIncidentRepository incidentRepository, IMapper mapper, HttpClient httpClient) : InterfaceIncidentService
    {
        private const int MaxDislikesBeforeDelete = 0; 

        public async Task<List<IncidentDto>> GetAll()
        {
            var incidents = await incidentRepository.GetAll();
            return mapper.Map<List<IncidentDto>>(incidents);
        }
        public async Task<List<IncidentDto>> GetByBoundingBox(BoundingBoxDto boundingBox)
        {
            var incidents = await incidentRepository.GetByBoundingBox(boundingBox);
            return mapper.Map<List<IncidentDto>>(incidents);
        }
        public async Task<IncidentDto> Get(Guid id)
        {
            var incident = await incidentRepository.Get(id);
            return mapper.Map<IncidentDto>(incident);
        }

        public async Task<IncidentDto> Create(PostIncidentDto postIncidentDto)
        {
            var incidentExist = await incidentRepository.Exist(postIncidentDto);

            if (incidentExist)
            {
                return null;
            }

            var incident = await incidentRepository.Create(postIncidentDto);
            return mapper.Map<IncidentDto>(incident);
        }

        public async Task<IncidentDto> Update(Guid id, UpdateIncidentDto updateIncidentDto)
        {
            var incident = await incidentRepository.Get(id);
            if (incident == null)
            {
                return null;
            }

            incident = await incidentRepository.Update(incident, updateIncidentDto);
            return mapper.Map<IncidentDto>(incident);
        }

        public async Task<IncidentDto> Contribute(Guid id, ContributeIncidentDto contributeIncidentDto)
        {
            var incident = await incidentRepository.Get(id);
            if (incident == null)
            {
                return null;
            }

            if (contributeIncidentDto.Reaction == ReactionType.Like)
            {
                incident = await incidentRepository.AddLike(incident);
            }
            else if (contributeIncidentDto.Reaction == ReactionType.Dislike)
            {
                incident = await incidentRepository.AddDislike(incident);
                if (incident.Dislike > incident.Like + MaxDislikesBeforeDelete && incident.Status == IncidentStatus.Active)
                {
                    await incidentRepository.Disable(incident);
                }
            }
            return mapper.Map<IncidentDto>(incident);
        }

        public async Task<IncidentDto> Delete(Guid id)
        {
            var incident = await incidentRepository.Get(id);
            if (incident == null)
            {
                return null;
            }
            var incidentDeleted = await incidentRepository.Delete(incident);
            return mapper.Map<IncidentDto>(incidentDeleted);
        }
    }
}
