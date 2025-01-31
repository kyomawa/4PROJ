using System.Text.Json.Nodes;
using System.Text.Json;
using navigation_service.Services.LocationService;
using navigation_service.Exceptions;
using navigation_service.DTO;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace navigation_service.Services.ItineraryService
{
    public class ItineraryService(HttpClient httpClient, ILocationService locationService, IConfiguration configuration, IMapper mapper) : InterfaceItineraryService
    {
        private string _openRouteServiceUrl = configuration["OPEN_ROUTE_SERVICE_URL"];
        private string _openRouteServiceApiKey = configuration["OPEN_ROUTE_SERVICE_APIKEY"];

        public async Task<ItineraryDto> GetItinerary(double departure_lon, double departure_lat, double arrival_lon, double arrival_lat, string method)
        {
            Console.WriteLine("URI = " + $"{_openRouteServiceUrl}/directions/{method}?api_key={_openRouteServiceApiKey}&start={departure_lon},{departure_lat}&end={arrival_lon},{arrival_lat}");
            HttpResponseMessage response = await httpClient.GetAsync($"{_openRouteServiceUrl}/directions/{method}?api_key={_openRouteServiceApiKey}&start={departure_lon},{departure_lat}&end={arrival_lon},{arrival_lat}");

            var jsonResponse = await response.Content.ReadAsStringAsync();

            // calc best itinerary with incidents and road data

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

/*        private async Task<LocationDto> GetLocationData(string location, string location_type)
        {
            var locationResponse = await locationService.ConvertToGeoPoint(location_type, location);
            if (!locationResponse.Success || locationResponse.Data == null || !locationResponse.Data.Any())
            {
                throw new LocationNotFoundException(location, location_type);
            }
            var locationCoordinate = locationResponse.Data.First();

            return locationCoordinate;
        }*/
    }
}
