using statistic_service.DTO.UserDto;

namespace statistic_service.Repositories.UserRepository
{
    public interface IUserRepository
    {
        public Task<List<UserCountByMonth>> UsersCountByMonthThisYear();
    }
}
