using statistic_service.Enums;
using System.Text.Json.Serialization;

namespace statistic_service.DTO.IncidentDto
{
    public class IncidentsCountByHour
    {
        public int Hour { get; set; }
        public int Count { get; set; }
    }
}
