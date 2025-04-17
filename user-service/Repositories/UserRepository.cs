using user_service.Contexts;
using user_service.DTO;
using user_service.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

namespace user_service.Repositories
{
    public class UserRepository(DataContext context) : IUserRepository
    {
        public async Task<List<User>> GetAll()
        {
            var users = await context.Users.ToListAsync();
            return users;
        }

        public async Task<User> GetById(Guid id)
        {
            var user = await context.Users.FindAsync(id);
            return user;
        }
        public async Task<User> Create(CreateUserDto createUserDto)
        {
            var user = new User()
            {
                Username = createUserDto.Username,
                Email = createUserDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
                PhoneNumber = createUserDto.PhoneNumber
            };

            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
            return user;
        }

        public async Task<User> GetByEmail(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(user => user.Email == email);
            return user;
        }

        public async Task<User> GetByUsername(string username)
        {
            var user = await context.Users.FirstOrDefaultAsync(user => user.Username == username);
            return user;
        }

        public async Task<User> GrantRoleAdmin(User user)
        {
            user.Role = UserRole.Admin;

            await context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> Exist(string email, string password)
        {
            var user = await context.Users.FirstOrDefaultAsync(user => user.Email == email);
            if (user == null)
            {
                return false;
            }

            return BCrypt.Net.BCrypt.Verify(password, user.Password);
        }

        public async Task<User> Update(User user, UpdateUserDto updateUserDto)
        {
            if (!BCrypt.Net.BCrypt.Verify(updateUserDto.CurrentPassword, user.Password))
            {
                return null;
            }
            
            if (updateUserDto.Username is not null) user.Username = updateUserDto.Username;
            if (updateUserDto.PhoneNumber is not null) user.PhoneNumber = updateUserDto.PhoneNumber;
            if (updateUserDto.Email is not null) user.Email = updateUserDto.Email;

            await context.SaveChangesAsync();
            return user;
        }

        public async Task<User> Delete(User user)
        {
            context.Users.Remove(user);
            await context.SaveChangesAsync();
            return user;
        }
    }
}
