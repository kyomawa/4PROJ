using incident_service.DTO.Incident;
using incident_service.Services;
using Microsoft.AspNetCore.Mvc;
using incident_service.DTO.BoundingBox;
using incident_service.Enums;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using incident_service.DTO.Vote;

namespace incident_service.Controllers
{
    [ApiController]
    [Route("incident")]
    public class IncidentController(InterfaceIncidentService incidentService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IncidentDto>> GetAll()
        {
            try
            {
                var response = await incidentService.GetAll();
                return Ok(response);
            } catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("bounding-box")]
        public async Task<ActionResult<List<IncidentDto>>> GetByBoundingBox([FromQuery] BoundingBoxDto boundingBoxDto)
        { 
            try
            {
                var response = await incidentService.GetByBoundingBox(boundingBoxDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IncidentDto>> Get(Guid id)
        {
            try
            {
                var response = await incidentService.Get(id);
                if (response == null)
                {
                    return NotFound($"Incident {id} not found");
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<IncidentDto>> Create([FromBody] PostIncidentDto postIncidentDto)
        {
            try
            {
                if (!Enum.IsDefined(typeof(IncidentType), postIncidentDto.Type))
                {
                    return BadRequest(new { Message = $"Invalid incident type : {postIncidentDto.Type}" });
                }

                var response = await incidentService.Create(postIncidentDto);

                if (response == null)
                {
                    return Conflict(new { Message = "An incident of the same type already exists at these coordinates" });
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpPut("{id}/vote")]
        public async Task<ActionResult<IncidentDto>> Vote(Guid id, [FromBody] VoteIncidentDto contributeIncidentDto)
        {
            try
            {
                var currentUserId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(currentUserId) || !Guid.TryParse(currentUserId, out Guid userId))
                {
                    return Unauthorized(new { Message = "Invalid or missing user ID." });
                }

                if (!Enum.IsDefined(typeof(ReactionType), contributeIncidentDto.Reaction))
                {
                    return BadRequest(new { Message = $"Invalid reaction type : {contributeIncidentDto.Reaction}" });
                }

                var response = await incidentService.Vote(userId, id, contributeIncidentDto);
                if (response == null)
                {
                    return NotFound($"Incident {id} not found");
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}")]
        public async Task<ActionResult<IncidentDto>> Update(Guid id, [FromBody] UpdateIncidentDto updateIncidentDto)
        {
            try
            {
                if (updateIncidentDto.Status.HasValue && !Enum.IsDefined(typeof(IncidentStatus), updateIncidentDto.Status))
                {
                    return BadRequest(new { Message = $"Invalid status type : {updateIncidentDto.Status}" });
                }

                var response = await incidentService.Update(id, updateIncidentDto);
                if (response == null)
                {
                    return NotFound($"Incident {id} not found");
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<IncidentDto>> Delete(Guid id)
        {
            try
            {
                var response = await incidentService.Delete(id);
                if (response == null)
                {
                    return BadRequest($"Incident {id} not found");
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
