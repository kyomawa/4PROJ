using auth_service.DTO;
using auth_service.Services.AuthService;
using Microsoft.AspNetCore.Mvc;

namespace auth_service.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController(IAuthService authService) : Controller
    {
        [HttpPost]
        public async Task<ActionResult<AuthDto>> Auth([FromBody] LoginDto loginDto)
        {
            try
            {
                var response = await authService.Auth(loginDto);
                if (response == null)
                {
                    return NotFound("Invalid credentials");
                }
                return Ok(response);
            } catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
