using Microsoft.AspNetCore.Mvc;
using navigation_service.DTO.ItineraryDTO;
using navigation_service.Services.ItineraryService;

namespace navigation_service.Controllers
{
    [ApiController]
    [Route("itinerary")]
    public class ItineraryController(InterfaceItineraryService itineraryService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<ItineraryDto>> CalculateItinerary([FromQuery] ItineraryQueryParams queryParams)
        {
            if (queryParams.DepartureLon == queryParams.ArrivalLon && queryParams.DepartureLat == queryParams.ArrivalLat)
            {
                return BadRequest(new { Message = "The departure and arrival points cannot be the same" });
            }

            try
            {
                var response = await itineraryService.GetItinerary(
                    queryParams.DepartureLon, queryParams.DepartureLat,
                    queryParams.ArrivalLon, queryParams.ArrivalLat,
                    queryParams.TravelMethod, queryParams.RouteType
                );
                if (response == null)
                {
                    return BadRequest("Invalid points : There is probably no drivable section near to this point");
                }

                return Ok(response);
            } catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
