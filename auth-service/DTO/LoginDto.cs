using System.ComponentModel.DataAnnotations;

namespace auth_service.DTO
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Email cannot be empty")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password cannot be empty")]
        public string Password { get; set; }
    }
}
