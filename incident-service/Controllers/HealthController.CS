using Microsoft.AspNetCore.Mvc;

namespace incident_service.Controllers
{
    [ApiController]
    [Route("health")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public ActionResult Check()
        {
            return Ok(new { status = "healthy" });
        }
    }
}