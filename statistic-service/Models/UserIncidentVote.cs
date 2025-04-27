using System.ComponentModel.DataAnnotations.Schema;
using statistic_service.Enums;

namespace statistic_service.Models
{
    public class UserIncidentVote
    {
        public Guid Id { get; set; }
        public Guid IncidentId { get; set; }
        public Guid UserId { get; set; }
        public ReactionType Reaction { get; set; }

        [ForeignKey("IncidentId")]
        public Incident Incident { get; set; }
    }
}
