using navigation_service.DTO;
using navigation_service.Models;

namespace navigation_service.Services.LocationService
{
    public interface ILocationService
    {
        public Task<ApiResponse<List<LocationDto>>> ConvertToGeoPoint(string text);
    }
}
