namespace navigation_service.DTO
{
    public class StepDto
    {
        public double Distance { get; set; }
        public double Duration { get; set; }
        public string Type { get; set; }
        public string Instruction { get; set; }
        public string Name { get; set; }
        public double[] WayPoints { get; set; }
    }
}
