using navigation_service.DTO.ItineraryDTO;
using navigation_service.Models;

namespace navigation_service.Repositories.ItineraryRepository
{
    public interface InterfaceItineraryRepository
    {
        public Task<UserItinerary> GetUserItineraries(Guid userId);
        public Task<Itinerary> GetById(Guid itineraryId);
        public Task<Itinerary> Save(Guid userId, CreateItineraryDto createItineraryDto);
        public Task<Itinerary> Delete(Itinerary itinerary);
    }
}
