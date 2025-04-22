using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace navigation_service.Models
{
    [Table("UserItinerary")]
    public class UserItinerary
    {
        [Key]
        public Guid Id { get; init; }
        [Required]
        public Guid UserId { get; set; }
        public ICollection<Itinerary> Itineraries { get; set; }
    }
}