using System.Text.Json.Nodes;

namespace traffic_service.Services
{
    public interface ITrafficService
    {
        public Task<JsonObject> GetRoadDetails(string road, string lat_min, string lon_min, string lat_max, string lon_max);
    }
}
