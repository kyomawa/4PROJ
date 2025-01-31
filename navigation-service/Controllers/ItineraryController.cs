using Microsoft.AspNetCore.Mvc;
using navigation_service.DTO;
using navigation_service.Exceptions;
using navigation_service.Models;
using navigation_service.Services.ItineraryService;
using navigation_service.Services.LocationService;
using System.Text.Json.Nodes;

namespace navigation_service.Controllers
{
    [ApiController]
    [Route("itinerary")]
    public class ItineraryController(InterfaceItineraryService itineraryService, ILocationService locationService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<ApiResponse<ItineraryDto>>> CalculateItinerary([FromQuery] double departure_lon, [FromQuery] double departure_lat, [FromQuery] double arrival_lon, [FromQuery] double arrival_lat, [FromQuery] string method)
        {
            try
            {
                var response = await itineraryService.GetItinerary(departure_lon, departure_lat, arrival_lon, arrival_lat, method);
                return new ApiResponse<ItineraryDto> { Data = response, Message = "Request successfully executed" };
            } catch (Exception ex)
            {
                return new ApiResponse<ItineraryDto> { Success = false, Message = ex.Message, StatusCode = (ex.GetType() == typeof(LocationNotFoundException)) ? ((LocationNotFoundException)ex).StatusCode : 500, Errors = new List<string> { ex.GetType().ToString() } };
            }
        }
    }
}
