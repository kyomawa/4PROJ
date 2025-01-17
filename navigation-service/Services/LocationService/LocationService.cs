using AutoMapper;
using navigation_service.Models;
using System.Net.Http;
using System.Text.Json.Nodes;
using System.Text.Json;
using navigation_service.DTO;

namespace navigation_service.Services.LocationService
{
    public class LocationService(HttpClient httpClient, IMapper mapper) : ILocationService
    {
        public async Task<ApiResponse<List<LocationDto>>> ConvertToGeoPoint(string type, string value)
        {
            httpClient.DefaultRequestHeaders.Add("User-Agent", "laynz-api/1.0 (contact: victorperezpro14@gmail.com)");
            HttpResponseMessage response = await httpClient.GetAsync($"https://nominatim.openstreetmap.org/search?{type}={value}&format=json");

            var jsonResponse = await response.Content.ReadAsStringAsync();

            var geoObjects = JsonSerializer.Deserialize<List<JsonObject>>(jsonResponse);

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
