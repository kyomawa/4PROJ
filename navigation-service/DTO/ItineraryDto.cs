namespace navigation_service.DTO
{
    public class ItineraryDto
    {
        public string Method { get; set; }
        public double Distance { get; set; }
        public double Duration { get; set; }
        public List<StepDto> Steps { get; set; }
        public List<double[]> Coordinates { get; set; }

    }
}
