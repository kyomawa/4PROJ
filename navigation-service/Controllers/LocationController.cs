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
        public async Task<ActionResult<List<LocationDto>>> GeoLocation([FromQuery(Name = "textLocation")] string textLocation)
        {
            try
            {
                var response = await locationService.ConvertToGeoPoint(textLocation);

                if (response == null)
                {
                    return NotFound("No data found for this location");
                }
                return Ok(response);
            } catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }
    }
}
