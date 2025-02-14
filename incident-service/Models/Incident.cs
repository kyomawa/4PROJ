namespace incident_service.Models
{
    public class Incident
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
