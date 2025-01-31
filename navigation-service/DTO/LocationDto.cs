namespace navigation_service.DTO
{
    public class LocationDto
    {
        public string PlaceId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Formatted { get; set; }
        public string WayNumber { get; set; }
        public string Street { get; set; }
        public string PostalCode { get; set; }
        public string City { get; set; }
        public string Borough { get; set; }
        public string Area { get; set; }
        public string Country { get; set; }
        public List<double> BoundingBox { get; set; }
    }
}
