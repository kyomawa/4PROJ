using incident_service.Enums;

namespace incident_service.DTO.Incident
{
    public class PutIncidentDto
    {
        public string Id { get; set; }
        public ReactionType Reaction { get; set; }
    }
}
