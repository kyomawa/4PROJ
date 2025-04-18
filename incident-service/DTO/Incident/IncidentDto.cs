using incident_service.DTO.Vote;
using incident_service.Enums;
using System.Text.Json.Serialization;

namespace incident_service.DTO.Incident
{
    public class IncidentDto
    {
        public Guid Id { get; init; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public IncidentType Type { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public IncidentStatus Status { get; set; }
        public DateTime CreationDate { get; init; }
        public List<VoteDto> Votes { get; set; }
    }
}
