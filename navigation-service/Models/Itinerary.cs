using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace navigation_service.Models
{
    [Table("Itinerary")]
    public class Itinerary
    {
        [Key]
        public Guid Id { get; init; }
        [Required]
        public string Departure { get; set; }
        [Required]
        public double DepartureLon { get; set; }
        [Required]
        public double DepartureLat { get; set; }
        [Required]
        public string Arrival { get; set; }
        [Required]
        public double ArrivalLon { get; set; }
        [Required]
        public double ArrivalLat { get; set; }
        [Required]
        public string TravelMode { get; set; }
        [Required]
        public double Distance { get; set; }
        [Required]
        public double Duration { get; set; }
        public Guid UserItineraryId { get; set; }

        [ForeignKey("UserItineraryId")]
        public UserItinerary UserItinerary { get; set; }
    }
}
