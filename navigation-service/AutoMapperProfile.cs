using AutoMapper;
using navigation_service.DTO;
using System.Text.Json.Nodes;

namespace navigation_service
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<JsonObject, LocationDto>()
            .ForMember(dest => dest.PlaceId, opt => opt.MapFrom(src => src["place_id"]))
            .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => Convert.ToDouble(src["lat"].ToString())))
            .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => Convert.ToDouble(src["lon"].ToString())))
            .ForMember(dest => dest.Importance, opt => opt.MapFrom(src => Convert.ToDouble(src["importance"].ToString())))
            .ForMember(dest => dest.AddressType, opt => opt.MapFrom(src => src["addresstype"]))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src["name"]))
            .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src["display_name"]))
            .ForMember(dest => dest.BoundingBox, opt => opt.MapFrom(src => src["boundingbox"].AsArray()
                .Select(x => x.ToString()).ToList()));
        }
    }
}
