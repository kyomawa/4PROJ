using incident_service.DTO.Incident;
using incident_service.Services;
using Microsoft.AspNetCore.Mvc;
using incident_service.DTO.BoundingBox;
using incident_service.Enums;

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


        [HttpPut("{id}")]
        public async Task<ActionResult<IncidentDto>> Update(Guid id, [FromBody] PutIncidentDto putIncidentDto)
        {
            try
            {
                if (!Enum.IsDefined(typeof(ReactionType), putIncidentDto.Reaction))
                {
                    return BadRequest(new { Message = $"Invalid reaction type : {putIncidentDto.Reaction}" });
                }

                var response = await incidentService.Update(id, putIncidentDto);
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
