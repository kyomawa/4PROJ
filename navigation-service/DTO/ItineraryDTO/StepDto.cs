using System.Text.Json.Nodes;

namespace navigation_service.DTO.ItineraryDTO
{
    public class StepDto
    {
        public double Distance { get; set; }
        public double Duration { get; set; }
        public string Instruction { get; set; }
        public string Type { get; set; }
        public CoordinateDto WayPoints { get; set; }
    }
}
