using incident_service.Enums;
using System.Text.Json.Serialization;

namespace incident_service.DTO.Incident
{
    public class PostIncidentDto
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public IncidentType Type { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
    }
}
