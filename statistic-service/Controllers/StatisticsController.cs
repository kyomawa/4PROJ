using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using statistic_service.Models;
using statistic_service.Services;

namespace statistic_service.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("statistic")]
    public class StatisticsController(IStatisticService statisticService) : ControllerBase
    {
        [HttpGet("user")]
        public async Task<ActionResult> UsersCountByMonth()
        {
            try 
            {
                var users = await statisticService.UsersCountByMonth();
                return Ok(users);
            } catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("incidents")]
        public async Task<ActionResult> IncidentsCountByType()
        {
            try
            {
                var users = await statisticService.IncidentsCountByType();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("congestion")]
        public async Task<ActionResult> CongestionPeriodByHour()
        {
            try
            {
                var users = await statisticService.GetCongestionsPeriod();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
