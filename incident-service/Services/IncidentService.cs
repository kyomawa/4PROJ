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
            var incident = await incidentRepository.Create(postIncidentDto);

            // Appel API TomTom pour géocodage inverse
            var response = await httpClient.GetAsync($"https://api.tomtom.com/search/2/reverseGeocode/{postIncidentDto.Latitude},{postIncidentDto.Longitude}.json?key=b7xQcWAnoOGd3Q5ceND5Aqa3lKBCn4pO");

            // Lire le contenu de la réponse en tant que chaîne
            var content = await response.Content.ReadAsStringAsync();

            // Afficher le contenu dans la console
            Console.WriteLine("TOMTOM RESPONSE ==================");
            Console.WriteLine(content);

            // Traiter la réponse JSON si nécessaire
            var jsonResponse = JsonSerializer.Deserialize<JsonObject>(content);
            Console.WriteLine("Parsed JSON ==================");
            Console.WriteLine(jsonResponse);

            // Retourner l'incident (comme précédemment)
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

        public async Task<IncidentDto> Delete(Guid id)
        {
            // get user role
            // if admin delete
            // else deny
            var incident = await incidentRepository.Delete(id);
            return mapper.Map<IncidentDto>(incident);
        }
    }
}
