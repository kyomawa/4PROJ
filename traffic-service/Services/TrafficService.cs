using System.Net.Http;
using System.Text.Json.Nodes;
using System.Text.Json;

namespace traffic_service.Services
{
    public class TrafficService(HttpClient httpClient) : ITrafficService
    {
        public async Task<JsonObject> GetRoadDetails(string road, string lat_min, string lon_min, string lat_max, string lon_max)
        {
            var query = $"[out:json];way[\"name\"=\"{road}\"][\"highway\"]({lat_min},{lon_min},{lat_max},{lon_max});out body;>;out skel qt;";

            var response = await httpClient.PostAsync("https://overpass-api.de/api/interpreter", new StringContent(query));

            /*if (!response.IsSuccessStatusCode)
            {
                return new ApiResponse<RoadDetailsDto>
                {
                    Success = false,
                    Message = "Failed to retrieve data from Overpass API."
                };
            }*/

            var result = await response.Content.ReadAsStringAsync();

            var jsonResponse = JsonSerializer.Deserialize<JsonObject>(result);

            /*                var elements = jsonResponse?["elements"]?.AsArray();

                        if (elements == null || elements.Count == 0)
                        {
                            return new ApiResponse<RoadDetailsDto>
                            {
                                Success = false,
                                Message = "No road details found."
                            };
                        }*/


            return jsonResponse;
        }
    }
}
