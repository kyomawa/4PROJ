using navigation_service.DTO;

namespace navigation_service.Services.LocationService
{
    public interface ILocationService
    {
        public Task<List<LocationDto>> ConvertToGeoPoint(string textLocation);
    }
}
