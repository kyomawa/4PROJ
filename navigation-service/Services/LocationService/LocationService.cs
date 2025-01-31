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
        public async Task<ApiResponse<List<LocationDto>>> ConvertToGeoPoint(string text)
        {
            HttpResponseMessage response = await httpClient.GetAsync($"{_geoapifyUrl}/search?text={text}&format=json&apiKey={_geoapifyApiKey}");
            var jsonResponse = await response.Content.ReadAsStringAsync();

            Console.WriteLine(jsonResponse);

            JsonNode locationObject = JsonNode.Parse(jsonResponse);
            JsonArray resultsArray = locationObject["results"]?.AsArray();

            var geoObjects = JsonSerializer.Deserialize<List<JsonObject>>(resultsArray);

            if (geoObjects == null || geoObjects.Count == 0)
            {
                return new ApiResponse<List<LocationDto>>
                {
                    Success = false,
                    Message = "No results found."
                };
            }

            return new ApiResponse<List<LocationDto>> { Data = mapper.Map<List<LocationDto>>(geoObjects) };
        }
    }
}
