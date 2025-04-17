using auth_service.DTO;
using auth_service.Services.EncryptionService;
using System.Text.Json;
using System.Text;

namespace auth_service.Services.AuthService
{
    public class AuthService(HttpClient httpClient, IEncryptionService encryptionHelper) : IAuthService
    {
        public async Task<AuthDto> Auth(LoginDto loginDto)
        {
            string encryptedPassword = encryptionHelper.EncryptPassword(loginDto.Password);

            var jsonContent = new StringContent(JsonSerializer.Serialize(new {
                Email = loginDto.Email,
                EncryptedPassword = encryptedPassword
            }), Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync($"http://user-service:8080/user/exist", jsonContent);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            string responseBody = await response.Content.ReadAsStringAsync();

            var user = JsonSerializer.Deserialize<UserDto>(responseBody, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            var token = encryptionHelper.GenerateToken(user.Id, user.Role.ToString());

            return new AuthDto { Data = user, Token = token };
        }
    }
}
