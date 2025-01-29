using System.Text.Json.Nodes;
using System.Text.Json;
using navigation_service.Services.LocationService;
using navigation_service.Exceptions;
using navigation_service.DTO;
using AutoMapper;

namespace navigation_service.Services.ItineraryService
{
    public class ItineraryService(HttpClient httpClient, ILocationService locationService, IConfiguration configuration, IMapper mapper) : InterfaceItineraryService
    {
        private string _openRouteServiceUrl = configuration["OPEN_ROUTE_SERVICE_URL"];
        private string _openRouteServiceApiKey = configuration["OPEN_ROUTE_SERVICE_APIKEY"];

        public async Task<ItineraryDto> GetItinerary(string departure, string departure_type, string arrival, string arrival_type, string method)
        {
            LocationDto departureCoordinate = await GetLocationData(departure, departure_type);
            LocationDto arrivalCoordinate = await GetLocationData(arrival, arrival_type);

            HttpResponseMessage response = await httpClient.GetAsync($"{_openRouteServiceUrl}/directions/{method}?api_key={_openRouteServiceApiKey}&start={departureCoordinate.Longitude},{departureCoordinate.Latitude}&end={arrivalCoordinate.Longitude},{arrivalCoordinate.Latitude}");

            var jsonResponse = await response.Content.ReadAsStringAsync();

            // calc best itinerary with incidents and road data

            //

            if (response.IsSuccessStatusCode)
            {
                try
                {
/*                    return jsonResponse;
 */                 Console.WriteLine(jsonResponse);
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

        private async Task<LocationDto> GetLocationData(string location, string location_type)
        {
            var locationResponse = await locationService.ConvertToGeoPoint(location_type, location);
            if (!locationResponse.Success || locationResponse.Data == null || !locationResponse.Data.Any())
            {
                throw new LocationNotFoundException(location, location_type);
            }
            var locationCoordinate = locationResponse.Data.First();

            return locationCoordinate;
        }
    }
}
