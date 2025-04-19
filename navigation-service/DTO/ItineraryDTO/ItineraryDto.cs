using navigation_service.Models;

namespace navigation_service.DTO.ItineraryDTO
{
    public class ItineraryDto
    {
        public string TravelMode { get; set; }
        public double Distance { get; set; }
        public double Duration { get; set; }
        public List<StepDto> Steps { get; set; }
        public List<CoordinateDto> Coordinates { get; set; }
        public List<IncidentDto> Incidents { get; set; } = new List<IncidentDto>();
        public BoundingBox BoundingBox { get; set; }
    }
}
