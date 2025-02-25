using incident_service.Enums;

namespace incident_service.DTO.Incident
{
    public class IncidentDto
    {
        public Guid Id { get; init; }
        public string Type { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public int Like { get; set; }
        public int Dislike { get; set; }
        public DateTime CreationDate { get; init; }
    }
}
