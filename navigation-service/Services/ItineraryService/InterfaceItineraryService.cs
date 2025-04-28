using Microsoft.AspNetCore.Mvc;
using navigation_service.DTO.ItineraryDTO;

namespace navigation_service.Services.ItineraryService
{
    public interface InterfaceItineraryService
    {
        public Task<UserItineraryDto> GetAllByUser(Guid userId);
        public Task<SavedItineraryDto> GetById(Guid itineraryId, Guid userId);
        public Task<SavedItineraryDto> Save(Guid userId, CreateItineraryDto createItineraryDto);
        public Task<SavedItineraryDto> Delete(Guid itineraryId, Guid userId);
        public Task<ItineraryDto> GetItinerary(ItineraryQueryParams queryParams);
    }
}
