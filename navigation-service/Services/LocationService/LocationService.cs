using AutoMapper;
using navigation_service.Models;
using System.Net.Http;
using System.Text.Json.Nodes;
using System.Text.Json;
using navigation_service.DTO;

namespace navigation_service.Services.LocationService
{
    public class LocationService(HttpClient httpClient, IMapper mapper, IConfiguration configuration) : ILocationService
    {
        private string _geoapifyUrl = configuration["GEOAPIFY_URL"];
        private string _geoapifyApiKey = configuration["GEOAPIFY_APIKEY"];
        public async Task<List<LocationDto>> ConvertToGeoPoint(string textLocation)
        {
            HttpResponseMessage response = await httpClient.GetAsync($"{_geoapifyUrl}/v1/geocode/search?text={textLocation}&format=json&apiKey={_geoapifyApiKey}");
            var jsonResponse = await response.Content.ReadAsStringAsync();

            JsonNode locationObject = JsonNode.Parse(jsonResponse);
            JsonArray resultsArray = locationObject["results"]?.AsArray();

            var geoObjects = JsonSerializer.Deserialize<List<JsonObject>>(resultsArray);

            if (geoObjects == null || geoObjects.Count == 0)
            {
                return null;
            }

            return mapper.Map<List<LocationDto>>(geoObjects);
        }
    }
}
