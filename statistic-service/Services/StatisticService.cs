using AutoMapper;
using statistic_service.DTO;
using statistic_service.DTO.IncidentDto;
using statistic_service.DTO.UserDto;
using statistic_service.Repositories.IncidentRepository;
using statistic_service.Repositories.UserRepository;
using System.Reflection.Metadata.Ecma335;

namespace statistic_service.Services
{
    public class StatisticService(IUserRepository userRepository, InterfaceIncidentRepository incidentRepository) : IStatisticService
    {
        private static readonly string[] months =
        {
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        };
        public async Task<List<UserCountByMonthString>> UsersCountByMonth()
        {
            var usersCountByMonths = await userRepository.UsersCountByMonthThisYear();

            var countsAsStringMonths = months.Select((monthName, index) =>
            {
                var monthNumber = index + 1;
                var count = usersCountByMonths.FirstOrDefault(x => x.Month == monthNumber)?.Count ?? 0;

                return new UserCountByMonthString
                {
                    Month = monthName,
                    Count = count
                };
            }).ToList();

            return countsAsStringMonths;

        }

        public async Task<List<IncidentsCountByType>> IncidentsCountByType()
        {
            var incidentsCountByTypes = await incidentRepository.GetIncidentsCountByType();

            return incidentsCountByTypes;
        }

        public async Task<CongestionPeriodStatisticsDto> GetCongestionPeriodStatistics()
        {
            return new CongestionPeriodStatisticsDto { };
        }
    }
}
