using AutoMapper;
using System.Text;
using user_service.DTO;
using user_service.Models;
using user_service.Repositories;
using user_service.Services.EncryptionService;

namespace user_service.Services.UserService
{
    public class UserService(IUserRepository userRepository, IEncryptionService encryptionHelper, IMapper mapper) : IUserService
    {
        public async Task<List<UserDto>> GetAll()
        {
            var users = await userRepository.GetAll();
            return mapper.Map<List<UserDto>>(users);
        }
        public async Task<UserDto> GetById(Guid id)
        {
            var user = await userRepository.GetById(id);
            if (user == null)
            {
                return null;
            }
            return mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> Create(CreateUserDto createUserDto)
        {
            var createdUser = await userRepository.Create(createUserDto);
            return mapper.Map<UserDto>(createdUser);
        }

        public async Task<UserDto> GetByEmail(string email)
        {
            var user = await userRepository.GetByEmail(email);
            if (user == null)
            {
                return null;
            }
            return mapper.Map<UserDto>(user);
        }

        public async Task<bool> Exist(string email, string password)
        {
            var decryptedPassword = encryptionHelper.Decrypt(password);
            return await userRepository.Exist(email, decryptedPassword);
        }
        public async Task<UserDto> GrantRoleAdmin(string email)
        {
            var user = await userRepository.GetByEmail(email);
            if (user == null)
            {
                return null;
            }
            var updatedUser = await userRepository.GrantRoleAdmin(user);
            return mapper.Map<UserDto>(updatedUser);
        }
        public async Task<UserDto> Update(Guid id, UpdateUserDto updateUserDto)
        {
            var user = await userRepository.GetById(id);

            if (user == null)
            {
                return null;
            }

            var updatedUser = await userRepository.Update(user, updateUserDto);

            if (updatedUser == null)
            {
                throw new Exception($"Error when updating {user.Email}");
            }

            return mapper.Map<UserDto>(updatedUser);
        }
        public async Task<UserDto> Delete(Guid id)
        {
            var user = await userRepository.GetById(id);
            if (user == null)
            {
                return null;
            }
            var deletedUser = await userRepository.Delete(user);
            return mapper.Map<UserDto>(deletedUser);
        }
    }
}
