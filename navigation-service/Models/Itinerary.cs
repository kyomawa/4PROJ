namespace navigation_service.Models
{
    public class Itinerary
    {
        public Guid Id { get; init; }
        public BoundingBox BoundingBox { get; init; }
        public Guid UserId { get; init; }
    }
}
