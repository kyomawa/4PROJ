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
        public async Task<ActionResult<ApiResponse<ItineraryDto>>> CalculateItinerary([FromQuery] string departure, [FromQuery] string departure_type, [FromQuery] string arrival, [FromQuery] string arrival_type, string method)
        {
            try
            {
                var response = await itineraryService.GetItinerary(departure, departure_type, arrival, arrival_type, method);
                return new ApiResponse<ItineraryDto> { Data = response, Message = "Request successfully executed" };
            } catch (Exception ex)
            {
                return new ApiResponse<ItineraryDto> { Success = false, Message = ex.Message, StatusCode = (ex.GetType() == typeof(LocationNotFoundException)) ? ((LocationNotFoundException)ex).StatusCode : 500, Errors = new List<string> { ex.GetType().ToString() } };
            }
        }
    }
}
