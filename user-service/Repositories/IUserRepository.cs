using user_service.DTO;
using user_service.Models;

namespace user_service.Repositories
{
    public interface IUserRepository
    {
        public Task<List<User>> GetAll();
        public Task<User> GetById(Guid id);
        public Task<User> Create(CreateUserDto createUserDto);
        public Task<User> GetByEmail(string email);
        public Task<User> GetByUsername(string username);
        public Task<User> GrantRoleAdmin(User user);
        public Task<bool> Exist(string email, string password);
        public Task<User> Update(User user, UpdateUserDto updateUserDto);
        public Task<User> Delete(User user);
    }
}
