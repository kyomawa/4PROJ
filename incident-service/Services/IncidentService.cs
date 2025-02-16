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
/*        private string _overpassURL = configuration["OVERPASS_URL"];
        public async Task<JsonObject> GetRoadDetails(string road, string lat_min, string lon_min, string lat_max, string lon_max)
        {
            var query = $"[out:json];way[\"name\"=\"{road}\"][\"highway\"]({lat_min},{lon_min},{lat_max},{lon_max});out body;>;out skel qt;";

            var response = await httpClient.PostAsync(_overpassURL, new StringContent(query));

            *//*if (!response.IsSuccessStatusCode)
            {
                return new ApiResponse<RoadDetailsDto>
                {
                    Success = false,
                    Message = "Failed to retrieve data from Overpass API."
                };
            }*//*

            var result = await response.Content.ReadAsStringAsync();

            var jsonResponse = JsonSerializer.Deserialize<JsonObject>(result);

            *//*                var elements = jsonResponse?["elements"]?.AsArray();

                        if (elements == null || elements.Count == 0)
                        {
                            return new ApiResponse<RoadDetailsDto>
                            {
                                Success = false,
                                Message = "No road details found."
                            };
                        }*//*


            return jsonResponse;
        }*/

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
