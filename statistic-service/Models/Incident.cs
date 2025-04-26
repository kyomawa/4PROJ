using System.ComponentModel.DataAnnotations.Schema;
using statistic_service.Enums;

namespace statistic_service.Models
{
    [Table("Incident")]
    public class Incident
    {
        public Guid Id { get; init; }
        public IncidentType Type { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public IncidentStatus Status { get; set; }
        public DateTime CreationDate { get; set; }
        public ICollection<UserIncidentVote> Votes { get; set; }
    }
}
