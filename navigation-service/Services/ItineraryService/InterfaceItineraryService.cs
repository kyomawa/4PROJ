using navigation_service.DTO;

namespace navigation_service.Services.ItineraryService
{
    public interface InterfaceItineraryService
    {
        public Task<ItineraryDto> GetItinerary(string departure, string departure_type, string arrival, string arrival_type, string method);
    }
}
