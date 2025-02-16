namespace incident_service.DTO.Incident
{
    public class IncidentDto
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public int Like { get; set; }
        public int Dislike { get; set; }
        public DateTime CreationDate { get; init; }
    }
}
