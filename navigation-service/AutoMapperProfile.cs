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

            CreateMap<JsonObject, ItineraryDto>()
                .ForMember(dest => dest.TravelMode, opt => opt.MapFrom(src => src["routes"][0]["sections"][0]["travelMode"]))
                .ForMember(dest => dest.Distance, opt => opt.MapFrom(src => src["routes"][0]["summary"]["lengthInMeters"]))
                .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => src["routes"][0]["summary"]["travelTimeInSeconds"]))
                .ForMember(dest => dest.Steps, opt => opt.MapFrom(src =>
                    src["routes"][0]["guidance"]["instructions"]
                        .AsArray()
                        .Select(instr => new StepDto
                        {
                            Distance = Convert.ToDouble(instr["routeOffsetInMeters"].ToString()),
                            Duration = Convert.ToDouble(instr["travelTimeInSeconds"].ToString()),
                            Instruction = instr["message"].ToString(),
                            Type = instr["instructionType"].ToString(),
                            WayPoints = new CoordinateDto 
                            {
                                Latitude = Convert.ToDouble(instr["point"]["latitude"].ToString()),
                                Longitude = Convert.ToDouble(instr["point"]["longitude"].ToString())
                            }
                        })
                        .ToList()
                ))
                .ForMember(dest => dest.Coordinates, opt => opt.MapFrom(src =>
                    src["routes"][0]["legs"][0]["points"]
                        .AsArray()
                        .Select(point => new CoordinateDto
                        {
                            Latitude = Convert.ToDouble(point["latitude"].ToString()),
                            Longitude = Convert.ToDouble(point["longitude"].ToString())
                        })
                        .ToList()
                ));
        }
    }
}
