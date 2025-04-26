using Microsoft.EntityFrameworkCore;
using statistic_service.Contexts;
using statistic_service.DTO.IncidentDto;

namespace statistic_service.Repositories.IncidentRepository
{
    public class IncidentRepository(IncidentContext context) : InterfaceIncidentRepository
    {
        public async Task<List<IncidentsCountByType>> GetIncidentsCountByType()
        {
            var incidentsCounts = await context.Incidents
                  .GroupBy(i => i.Type)
                  .Select(g => new IncidentsCountByType { Type = g.Key, Count = g.Count() })
                  .ToListAsync();

            return incidentsCounts;
        }
    }
}
