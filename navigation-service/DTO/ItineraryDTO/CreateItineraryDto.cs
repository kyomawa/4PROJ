using System.ComponentModel.DataAnnotations;

namespace navigation_service.DTO.ItineraryDTO
{
    public class CreateItineraryDto
    {
        [Required(ErrorMessage = "Departure is required")]
        public string Departure { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
        [Required(ErrorMessage = "DepartureLon is required")]
        public double DepartureLon { get; set; }

        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
        [Required]
        public double DepartureLat { get; set; }

        [Required(ErrorMessage = "Arrival is required")]
        public string Arrival { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
        [Required(ErrorMessage = "ArrivalLon is required")]
        public double ArrivalLon { get; set; }

        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
        [Required] 
        public double ArrivalLat { get; set; }

        [Required(ErrorMessage = "TravelMode is required")]
        public string TravelMode { get; set; }

        [Required(ErrorMessage = "Distance is required")]
        public double Distance { get; set; }

        [Required(ErrorMessage = "Duration is required")]
        public double Duration { get; set; }
    }
}
