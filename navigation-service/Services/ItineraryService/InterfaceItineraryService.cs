using System.Text.Json.Nodes;

namespace navigation_service.Services.ItineraryService
{
    public interface InterfaceItineraryService
    {
        public Task<JsonObject> GetItinerary(string departure, string departure_type, string arrival, string arrival_type, string method);
    }
}
