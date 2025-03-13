using System.Text.Json.Serialization;

namespace navigation_service.DTO
{
    public class IncidentDto
    {
        [JsonPropertyName("id")]
        public Guid Id { get; init; }

        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonPropertyName("longitude")]
        public double Longitude { get; set; }

        [JsonPropertyName("latitude")]
        public double Latitude { get; set; }

        [JsonPropertyName("like")]
        public int Like { get; set; }

        [JsonPropertyName("dislike")]
        public int Dislike { get; set; }

        [JsonPropertyName("creationDate")]
        public DateTime CreationDate { get; init; }
    }
}