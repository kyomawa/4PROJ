using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using user_service.Models;

namespace user_service.DTO
{
    public class UpdateUserDto
    {
        [RegularExpression(@"^\S+$", ErrorMessage = "Username cannot be empty or contain only spaces")]
        public string? Username { get; set; }

        [RegularExpression(@"^\d+$", ErrorMessage = "Phone number must contain only digits")]
        public string? PhoneNumber { get; set; }

        [RegularExpression(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", ErrorMessage = "Invalid email format")]
        public string? Email { get; set; }
        
        [Required(ErrorMessage = "Current password is required for profile updates")]
        public string CurrentPassword { get; set; }
    }
}