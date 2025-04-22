using navigation_service.Models;

namespace navigation_service.DTO.ItineraryDTO
{
    public class UserItineraryDto
    {
        public ICollection<SavedItineraryDto> Itineraries { get; set; }
    }
}
