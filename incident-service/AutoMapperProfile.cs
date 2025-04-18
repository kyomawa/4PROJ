using AutoMapper;
using incident_service.DTO.Incident;
using incident_service.DTO.Vote;
using incident_service.Models;

namespace incident_service
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() 
        {
            CreateMap<Incident, IncidentDto>()
                .ForMember(dest => dest.Votes, opt => opt.MapFrom(src => src.Votes));

            CreateMap<UserIncidentVote, VoteDto>();
        }
    }
}
