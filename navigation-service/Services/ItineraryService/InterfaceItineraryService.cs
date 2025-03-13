using Microsoft.AspNetCore.Mvc;
using navigation_service.DTO;

namespace navigation_service.Services.ItineraryService
{
    public interface InterfaceItineraryService
    {
        public Task<ItineraryDto> GetItinerary(double departure_lon, double departure_lat, double arrival_lon, double arrival_lat, string travelMethod, string routeType);
    }
}
