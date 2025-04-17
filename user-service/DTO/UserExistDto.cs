using System.ComponentModel.DataAnnotations;

namespace user_service.DTO
{
    public class UserExistDto
    {
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string EncryptedPassword { get; set; }
    }
}
