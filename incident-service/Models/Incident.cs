using incident_service.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace incident_service.Models
{
    [Table("Incident")]
    public class Incident
    {
        [Key]
        public Guid Id { get; init; }

        [Required]
        [Column("Type")]
        public IncidentType Type { get; set; }

        [Required]
        [Column("Longitude")]
        public double Longitude { get; set; }

        [Required]
        [Column("Latitude")]
        public double Latitude { get; set; }

        [Column("Status")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public IncidentStatus Status { get; set; } = IncidentStatus.Active;

        [Column("CreationDate")]
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;
        public ICollection<UserIncidentVote> Votes { get; set; }
    }
}
