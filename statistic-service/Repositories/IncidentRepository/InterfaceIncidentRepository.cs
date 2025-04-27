using statistic_service.DTO.IncidentDto;

namespace statistic_service.Repositories.IncidentRepository
{
    public interface InterfaceIncidentRepository
    {
        public Task<List<IncidentsCountByType>> GetIncidentsCountByType();
        public Task<List<IncidentsCountByHour>> GetIncidentsCountsByHour();
    }
}
