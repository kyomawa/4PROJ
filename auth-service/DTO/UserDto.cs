using auth_service.Enums;
using System.Text.Json.Serialization;

namespace auth_service.DTO
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public UserRole Role { get; set; }
    }
}
