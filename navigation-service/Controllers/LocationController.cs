using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using navigation_service.DTO;
using navigation_service.Models;
using navigation_service.Services.LocationService;

namespace navigation_service.Controllers
{
    [ApiController]
    [Route("location")]
    public class LocationController(ILocationService locationService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<LocationDto>>>> GeoLocation([FromQuery(Name = "type")] string type, [FromQuery(Name = "value")] string value)
        {
            var response = await locationService.ConvertToGeoPoint(type, value);
            return response;
        }
    }
}
