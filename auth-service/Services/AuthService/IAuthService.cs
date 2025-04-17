using auth_service.DTO;

namespace auth_service.Services.AuthService
{
    public interface IAuthService
    {
        public Task<AuthDto> Auth(LoginDto loginDto);
    }
}
