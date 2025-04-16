using System.ComponentModel.DataAnnotations;

namespace user_service.DTO
{
    public class CreateUserDto
    {
        [Required(ErrorMessage = "Username is required")]
        [RegularExpression(@"^\S+$", ErrorMessage = "Username cannot be empty or contain only spaces")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [RegularExpression(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [RegularExpression(@"^\S+$", ErrorMessage = "Password cannot be empty or contain only spaces")]
        public string Password { get; set; }

        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "PhoneNumber is required")]
        [RegularExpression(@"^\d+$", ErrorMessage = "Phone number must contain only digits")]
        public string PhoneNumber { get; set; }
    }
}
