using incident_service.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace incident_service.DTO.Incident
{
    public class PutIncidentDto
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        [Required(ErrorMessage = "Reaction type is mandatory")]
        public ReactionType Reaction { get; set; }

        [JsonIgnore]
        public string Blank { get; set; } = string.Empty; // unused field to avoid serialization of DTO if invalid and then to return a generic error
    }
}
