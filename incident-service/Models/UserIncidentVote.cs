using incident_service.Enums;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace incident_service.Models
{
    public class UserIncidentVote
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid IncidentId { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public ReactionType Reaction { get; set; }

        [ForeignKey("IncidentId")]
        public Incident Incident { get; set; }
    }
}
