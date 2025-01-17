namespace navigation_service.DTO
{
    public class LocationDto
    {
        public long PlaceId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Importance { get; set; }
        public string AddressType { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public List<double> BoundingBox { get; set; }
    }
}
