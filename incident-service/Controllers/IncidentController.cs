using incident_service.DTO.Incident;
using incident_service.Services;
using Microsoft.AspNetCore.Mvc;
using incident_service.Models;

namespace incident_service.Controllers
{
    [ApiController]
    [Route("incident")]
    public class IncidentController(InterfaceIncidentService incidentService) : ControllerBase
    {
        [HttpGet]
        public async Task<ApiResponse<List<IncidentDto>>> GetAll()
        {
            try
            {
                var response = await incidentService.GetAll();
                return new ApiResponse<List<IncidentDto>> { Data = response};
            } catch (Exception ex)
            {
                return new ApiResponse<List<IncidentDto>> { Success = false, Message = ex.Message, StatusCode = 500 };
            }
        }

        [HttpGet("{id}")]
        public async Task<ApiResponse<IncidentDto>> Get(string id)
        {
            try
            {
                var response = await incidentService.Get(id);
                return new ApiResponse<IncidentDto> { Data = response };
            }
            catch (Exception ex)
            {
                return new ApiResponse<IncidentDto> { Success = false, Message = ex.Message, StatusCode = 500 };
            }
        }

        [HttpPost]
        public async Task<ApiResponse<IncidentDto>> Create([FromBody] PostIncidentDto postIncidentDto)
        {
            try
            {
                var response = await incidentService.Create(postIncidentDto);
                return new ApiResponse<IncidentDto> { Data = response };
            }
            catch (Exception ex)
            {
                return new ApiResponse<IncidentDto> { Success = false, Message = ex.Message, StatusCode = 500 };
            }
        }


        [HttpPut("{id}")]
        public async Task<ApiResponse<IncidentDto>> Update([FromBody] PutIncidentDto putIncidentDto)
        {
            try
            {
                var response = await incidentService.Update(putIncidentDto);
                return new ApiResponse<IncidentDto> { Data = response };
            }
            catch (Exception ex)
            {
                return new ApiResponse<IncidentDto> { Success = false, Message = ex.Message, StatusCode = 500 };
            }
        }

        [HttpDelete("{id}")]
        public async Task<ApiResponse<IncidentDto>> Delete(string id)
        {
            try
            {
                var response = await incidentService.Delete(id);
                return new ApiResponse<IncidentDto> { Data = response };
            }
            catch (Exception ex)
            {
                return new ApiResponse<IncidentDto> { Success = false, Message = ex.Message, StatusCode = 500 };
            }
        }
    }
}
