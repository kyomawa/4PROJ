using Microsoft.EntityFrameworkCore;
using statistic_service.Contexts;
using statistic_service.DTO.UserDto;

namespace statistic_service.Repositories.UserRepository
{
    public class UserRepository(UserContext context) : IUserRepository
    {
        public async Task<List<UserCountByMonth>> UsersCountByMonthThisYear()
        {
            var userCounts = await context.Users
                .Where(u => u.CreationDate.Year == DateTime.Now.Year)
                .GroupBy(u => u.CreationDate.Month)
                .Select(g => new UserCountByMonth { Month = g.Key, Count = g.Count() })
                .ToListAsync();

            return userCounts;
        }

    }
}
