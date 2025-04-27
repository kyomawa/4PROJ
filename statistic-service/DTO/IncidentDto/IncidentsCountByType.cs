using statistic_service.Enums;
using System.Text.Json.Serialization;

namespace statistic_service.DTO.IncidentDto
{
    public class IncidentsCountByType
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public IncidentType Type { get; set; }
        public int Count { get; set; }
    }
}
