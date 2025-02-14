using AutoMapper;
using incident_service.DTO.Incident;
using incident_service.Models;

namespace incident_service
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() 
        {
            CreateMap<Incident, IncidentDto>();
            CreateMap<IncidentDto, IncidentDto>();
        }
    }
}
