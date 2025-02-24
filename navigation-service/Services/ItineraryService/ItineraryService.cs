using System.Text.Json.Nodes;
using System.Text.Json;
using navigation_service.Services.LocationService;
using navigation_service.DTO;
using AutoMapper;

namespace navigation_service.Services.ItineraryService
{
    public class ItineraryService(HttpClient httpClient, ILocationService locationService, IConfiguration configuration, IMapper mapper) : InterfaceItineraryService
    {
        private string _tomtomUrl = configuration["TOMTOM_URL"];
        private string _tomtomApiKey = configuration["TOMTOM_APIKEY"];

        public async Task<ItineraryDto> GetItinerary(double departure_lon, double departure_lat, double arrival_lon, double arrival_lat, string travelMode)
        {
            HttpResponseMessage response = await httpClient.GetAsync($"{_tomtomUrl}/calculateRoute/{departure_lat}%2C{departure_lon}%3A{arrival_lat}%2C{arrival_lon}/json?instructionsType=text&traffic=true&travelMode={travelMode}&key={_tomtomApiKey}&language=fr");

            var jsonResponse = await response.Content.ReadAsStringAsync();
            // calc best itinerary with incidents and road data
            // foreach route getIncidents(route)
            //

            if (response.IsSuccessStatusCode)
            {
                try
                {
                    JsonObject itinerary = JsonSerializer.Deserialize<JsonObject>(jsonResponse);
                    return mapper.Map<ItineraryDto>(itinerary);
                }
                catch (JsonException ex)
                {
                    throw new Exception("Erreur lors de la désérialisation de la réponse JSON.", ex);
                }
            }
            else
            {
                throw new Exception($"Erreur lors de l'appel à l'API : {response.StatusCode} - {jsonResponse}");
            }
        }
    }
}
