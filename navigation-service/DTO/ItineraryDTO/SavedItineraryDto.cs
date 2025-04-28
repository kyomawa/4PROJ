namespace navigation_service.DTO.ItineraryDTO
{
    public class SavedItineraryDto
    {
        public Guid Id { get; set; }
        public string Departure { get; set; }
        public double DepartureLon { get; set; }
        public double DepartureLat { get; set; }
        public string Arrival { get; set; }
        public double ArrivalLon { get; set; }
        public double ArrivalLat { get; set; }
        public string TravelMode { get; set; }
        public double Distance { get; set; }
        public double Duration { get; set; }
    }
}
