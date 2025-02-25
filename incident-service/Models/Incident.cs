using incident_service.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [Column("Like")]
        public int Like { get; set; }

        [Column("Dislike")]
        public int Dislike { get; set; }

        [Column("CreationDate")]
        public DateTime CreationDate { get; init; }
    }
}
