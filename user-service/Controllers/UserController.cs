using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using user_service.DTO;
using user_service.Models;
using user_service.Services;
using user_service.Services.UserService;
using user_service.Annotations;
using user_service.Exceptions;

namespace user_service.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController(IUserService userService) : ControllerBase
    {
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> Index()
        {
            try
            {
                var users = await userService.GetAll();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [AdminOrOwner]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Details(Guid id)
        {
            try
            {
                var user = await userService.GetById(id);
                if (user == null)
                {
                    return BadRequest("User not found");
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> Create([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                var createdUser = await userService.Create(createUserDto);
                return Ok(createdUser);
            }
            catch (Exception ex)
            {
                if (ex is ConflictException)
                {
                    return Conflict(ex.Message);
                }
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("exist")]
        public async Task<ActionResult<UserDto>> UserExist([FromBody] UserExistDto userExistDto)
        {
            try
            {
                bool exists = await userService.Exist(userExistDto.Email, userExistDto.EncryptedPassword);
                if (!exists)
                {
                    return NotFound(new { Message = "User not found" });
                }

                var userData = await userService.GetByEmail(userExistDto.Email);

                return Ok(userData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal error", Error = ex.Message });
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("/grant/{email}")]
        public async Task<ActionResult<UserDto>> GrantRoleAdmin(string email)
        {
            try
            {
                var user = await userService.GrantRoleAdmin(email);

                if (user == null) 
                {
                    return NotFound(new { Message = "User not found" });
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal error", Error = ex.Message });
            }
        }

        [Authorize]
        [AdminOrOwner]
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Edit(Guid id, [FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                var updatedUser = await userService.Update(id, updateUserDto);
                if (updatedUser == null)
                {
                    var user = await userService.GetById(id);
                    if (user == null)
                    {
                        return NotFound(new { Message = "User not found" });
                    }
                    
                    return Unauthorized(new { Message = "Current password is incorrect" });
                }
                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal error", Error = ex.Message });
            }
        }

        [Authorize]
        [AdminOrOwner]
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserDto>> Delete(Guid id)
        {
            try
            {
                var deletedUser = await userService.Delete(id);
                if (deletedUser == null)
                {
                    return NotFound(new { Message = "User not found" });
                }
                return Ok(deletedUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal error", Error = ex.Message });
            }
        }
    }
}
