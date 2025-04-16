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
    }
}
