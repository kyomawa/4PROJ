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
            .ForMember(dest => dest.Formatted, opt => opt.MapFrom(src => src["formatted"]))
            .ForMember(dest => dest.WayNumber, opt => opt.MapFrom(src => src["housenumber"])) // return not defined if way number is empty ?
            .ForMember(dest => dest.Street, opt => opt.MapFrom(src => src["street"]))
            .ForMember(dest => dest.PostalCode, opt => opt.MapFrom(src => src["postcode"]))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src["city"]))
            .ForMember(dest => dest.Borough, opt => opt.MapFrom(src => src["suburb"]))
            .ForMember(dest => dest.Area, opt => opt.MapFrom(src => src["state"]))
            .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src["country"]))
            .ForMember(dest => dest.BoundingBox, opt => opt.MapFrom(src =>
                src["bbox"] is JsonObject ?
                    new List<double> {
                        Convert.ToDouble(src["bbox"]["lon1"].ToString()),
                        Convert.ToDouble(src["bbox"]["lat1"].ToString()),
                        Convert.ToDouble(src["bbox"]["lon2"].ToString()),
                        Convert.ToDouble(src["bbox"]["lat2"].ToString())
                    } : new List<double>()));

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
