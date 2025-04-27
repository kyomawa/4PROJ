using statistic_service.DTO.IncidentDto;
using statistic_service.DTO.UserDto;
using statistic_service.Enums;
using statistic_service.Repositories.IncidentRepository;
using statistic_service.Repositories.UserRepository;

namespace statistic_service.Services
{
    public class StatisticService(IUserRepository userRepository, InterfaceIncidentRepository incidentRepository) : IStatisticService
    {
        private static readonly string[] Months =
        {
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        };

        private static readonly string[] IncidentTypes =
        {
            "Crash", "Bottling", "ClosedRoad", "PoliceControl", "Obstacle"
        };

        private static readonly int HoursInDay = 24;

        public async Task<List<UserCountByMonthString>> UsersCountByMonth()
        {
            var usersCountByMonths = await userRepository.UsersCountByMonthThisYear();

            var countsAsStringMonths = Months.Select((monthName, index) =>
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

            var countsAsStringTypes = IncidentTypes.Select(typeName =>
            {
                var count = incidentsCountByTypes.FirstOrDefault(x => x.Type.ToString() == typeName)?.Count ?? 0;

                return new IncidentsCountByType
                {
                    Type = Enum.Parse<IncidentType>(typeName),
                    Count = count
                };
            }).ToList();

            return countsAsStringTypes;
        }

        public async Task<List<IncidentsCountByHour>> GetCongestionsPeriod()
        {
            var incidentsCountByHour = await incidentRepository.GetIncidentsCountsByHour();

            var countsAsStringTypes = Enumerable.Range(0, HoursInDay).Select(hour =>
            {
                var count = incidentsCountByHour.FirstOrDefault(x => x.Hour == hour)?.Count ?? 0;

                return new IncidentsCountByHour
                {
                    Hour = hour,
                    Count = count
                };
            }).ToList();


            return countsAsStringTypes;
        }
    }
}
