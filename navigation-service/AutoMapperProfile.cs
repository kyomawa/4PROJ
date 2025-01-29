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

            CreateMap<JsonObject, StepDto>()
                .ForMember(dest => dest.Distance, opt => opt.MapFrom(src => Convert.ToDouble(src["distance"].ToString())))
                .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => Convert.ToDouble(src["duration"].ToString())))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src["type"].ToString()))
                .ForMember(dest => dest.Instruction, opt => opt.MapFrom(src => src["instruction"].ToString()))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src["name"].ToString()))
                .ForMember(dest => dest.WayPoints, opt => opt.MapFrom(src => src["way_points"].AsArray()
                    .Select(point => Convert.ToDouble(point.ToString())).ToArray()));

            CreateMap<JsonObject, ItineraryDto>()
                .ForMember(dest => dest.Method, opt => opt.MapFrom(src => src["metadata"]["query"]["profile"]))
                .ForMember(dest => dest.Distance, opt => opt.MapFrom(src => src["features"][0]["properties"]["segments"][0]["distance"]))
                .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => src["features"][0]["properties"]["segments"][0]["duration"]))
                .ForMember(dest => dest.Steps, opt => opt.MapFrom(src => src["features"][0]["properties"]["segments"][0]["steps"]))
                .ForMember(dest => dest.Coordinates, opt => opt.MapFrom(src => src["features"][0]["geometry"]["coordinates"].AsArray()));
        }
    }
}
