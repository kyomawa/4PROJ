using user_service.DTO;

namespace user_service.Services.UserService
{
    public interface IUserService
    {
        public Task<List<UserDto>> GetAll();
        public Task<UserDto> GetById(Guid id);
        public Task<UserDto> Create(CreateUserDto createUserDto);
        public Task<UserDto> GetByEmail(string email);
        public Task<bool> Exist(string email, string password);
        public Task<UserDto> GrantRoleAdmin(string email);
        public Task<UserDto> Update(Guid id, UpdateUserDto updateUserDto);
        public Task<UserDto> Delete(Guid id);
    }
}
