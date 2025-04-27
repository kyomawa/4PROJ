using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using navigation_service.DTO.ItineraryDTO;
using navigation_service.Models;
using navigation_service.Services.ItineraryService;
using System.Security.Claims;

namespace navigation_service.Controllers
{
    [ApiController]
    [Route("itinerary")]
    public class ItineraryController(InterfaceItineraryService itineraryService) : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserItineraryDto>> Index()
        {
            var currentUserId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId) || !Guid.TryParse(currentUserId, out Guid userId))
            {
                return Unauthorized(new { Message = "Invalid or missing user ID." });
            }

            try
            {
                var userItineraries = await itineraryService.GetAllByUser(userId);
                return Ok(userItineraries);

            } catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<SavedItineraryDto>> Details(Guid id)
        {
            var currentUserId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId) || !Guid.TryParse(currentUserId, out Guid userId))
            {
                return Unauthorized(new { Message = "Invalid or missing user ID." });
            }

            try
            {
                var itinerary = await itineraryService.GetById(id, userId);

                if (itinerary == null)
                {
                    return NotFound(new { Message = $"Itinerary with id {id} not found" });
                }

                return Ok(itinerary);

            }
            catch (Exception ex)
            {
                if (ex is UnauthorizedAccessException)
                {
                    return Forbid();
                }
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpPost("save")]
        public async Task<ActionResult<SavedItineraryDto>> Save(CreateItineraryDto createItineraryDto)
        {
            var currentUserId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId) || !Guid.TryParse(currentUserId, out Guid userId))
            {
                return Unauthorized(new { Message = "Invalid or missing user ID." });
            }
            try
            {
                var savedItinerary = await itineraryService.Save(userId, createItineraryDto);
                return Ok(savedItinerary);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<SavedItineraryDto>> Delete(Guid id)
        {
            var currentUserId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId) || !Guid.TryParse(currentUserId, out Guid userId))
            {
                return Unauthorized(new { Message = "Invalid or missing user ID." });
            }
            try
            {
                var savedItinerary = await itineraryService.Delete(id, userId);
                if (savedItinerary == null)
                {
                    return NotFound(new { Message = $"Itinerary with id {id} not found" });
                }

                return Ok(savedItinerary);

            }
            catch (Exception ex)
            {
                if (ex is UnauthorizedAccessException)
                {
                    return Forbid();
                }
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("calculate")]
        public async Task<ActionResult<ItineraryDto>> Calculate([FromQuery] ItineraryQueryParams queryParams)
        {
            if (queryParams.DepartureLon == queryParams.ArrivalLon && queryParams.DepartureLat == queryParams.ArrivalLat)
            {
                return BadRequest(new { Message = "The departure and arrival points cannot be the same" });
            }

            try
            {
                var response = await itineraryService.GetItinerary(queryParams);

                if (response == null)
                {
                    return BadRequest("Invalid points : There is probably no drivable section near to this point");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
