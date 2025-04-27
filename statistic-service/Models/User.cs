using statistic_service.Enums;

namespace statistic_service.Models
{
    public class User
    {
        public Guid Id { get; init; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public DateTime CreationDate { get; set; }
        public UserRole Role { get; set; }
    }
}
