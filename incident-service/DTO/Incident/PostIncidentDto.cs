using incident_service.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace incident_service.DTO.Incident
{
    public class PostIncidentDto
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        [Required(ErrorMessage = "Incident type is mandatory")]
        public IncidentType Type { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
        [Required(ErrorMessage = "Longitude is mandatory")]
        public double? Longitude { get; set; }

        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
        [Required(ErrorMessage = "Latitude is mandatory")]
        public double? Latitude { get; set; }
    }
}
