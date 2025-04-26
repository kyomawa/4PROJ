using statistic_service.DTO;
using statistic_service.DTO.IncidentDto;
using statistic_service.DTO.UserDto;

namespace statistic_service.Services
{
    public interface IStatisticService
    {
        public Task<List<UserCountByMonthString>> UsersCountByMonth();
        public Task<List<IncidentsCountByType>> IncidentsCountByType();
        public Task<CongestionPeriodStatisticsDto> GetCongestionPeriodStatistics();
    }
}
