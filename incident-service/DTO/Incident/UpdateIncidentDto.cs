using incident_service.Enums;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace incident_service.DTO.Incident
{
    public class UpdateIncidentDto
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public IncidentType? Type { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
        public double? Longitude { get; set; }

        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
        public double? Latitude { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public IncidentStatus? Status { get; set; }
    }
}
