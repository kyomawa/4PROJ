using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Nodes;
using traffic_service.Models;
using traffic_service.Services;

namespace traffic_service.Controllers
{
    [ApiController]
    [Route("traffic")]
    public class TrafficController(ITrafficService trafficService) : ControllerBase
    {
        [HttpGet("road_detail")]
        public async Task<ActionResult<ApiResponse<JsonObject>>> RoadDetail([FromQuery] string road, [FromQuery] string lat_min, [FromQuery] string lon_min, [FromQuery] string lat_max, [FromQuery] string lon_max)
        {
            var response = await trafficService.GetRoadDetails(road, lat_min, lon_min, lat_max, lon_max);
            return new ApiResponse<JsonObject> { Data = response, Message = "Request successfully executed" };
        }
    }
}
