using System.Text.Json;
using System.Net.Http.Headers;
using navigation_service.DTO;
using AutoMapper;
using navigation_service.Models;
using System.Text.Json.Nodes;
using navigation_service.DTO.ItineraryDTO;
using navigation_service.Repositories.ItineraryRepository;
using Microsoft.AspNetCore.Mvc;

namespace navigation_service.Services.ItineraryService
{
    public class ItineraryService(HttpClient httpClient, IConfiguration configuration, IMapper mapper, InterfaceItineraryRepository interfaceItineraryRepository) : InterfaceItineraryService
    {
        private string _tomtomUrl = configuration["TOMTOM_URL"];
        private string _tomtomApiKey = configuration["TOMTOM_APIKEY"];
        private static readonly Dictionary<string, double> IncidentSizes = new()
        {
            { "Crash", 0.003 }, // 0.001 degree is around 111 meters
            { "Bottling", 0.002 },
            { "ClosedRoad", 0.005 },
            { "PoliceControl", 0.001 },
            { "Obstacle", 0.002 }
        };

        public async Task<UserItineraryDto> GetAllByUser(Guid userId)
        {
            var itineraries = await interfaceItineraryRepository.GetUserItineraries(userId);
            return mapper.Map<UserItineraryDto>(itineraries);
        }

        public async Task<SavedItineraryDto> GetById(Guid itineraryId, Guid userId)
        {
            var itinerary = await interfaceItineraryRepository.GetById(itineraryId);

            if (itinerary.UserItinerary.UserId != userId)
            {
                throw new UnauthorizedAccessException("You cannot access to this itinerary");
            }
            return mapper.Map<SavedItineraryDto>(itinerary);
        }

        public async Task<SavedItineraryDto> Save(Guid userId, CreateItineraryDto createItineraryDto)
        {
            var createdItinerary = await interfaceItineraryRepository.Save(userId, createItineraryDto);
            return mapper.Map<SavedItineraryDto>(createdItinerary);
        }

        public async Task<SavedItineraryDto> Delete(Guid itineraryId, Guid userId)
        {
            var itinerary = await interfaceItineraryRepository.GetById(itineraryId);

            if (itinerary == null)
            {
                return null;
            }

            if (itinerary.UserItinerary.UserId != userId)
            {
                throw new UnauthorizedAccessException("You cannot access to this itinerary");
            }

            var deletedItinerary = await interfaceItineraryRepository.Delete(itinerary);

            return mapper.Map<SavedItineraryDto>(deletedItinerary);
        }

        public async Task<ItineraryDto> GetItinerary(ItineraryQueryParams queryParams)
        {

            var itineraryBoundingBox = GetBoundingBox(new List<CoordinateDto>
            {
                new CoordinateDto { Latitude = queryParams.DepartureLat, Longitude = queryParams.DepartureLon },
                new CoordinateDto { Latitude = queryParams.ArrivalLat, Longitude = queryParams.ArrivalLon }
            });

            var incidents = await GetIncidentsInBoundingBox(itineraryBoundingBox);

            if (incidents.Count == 0)
            {
                var itinerary = await GetRoute(queryParams, null);
                itinerary.BoundingBox = itineraryBoundingBox;
                return itinerary;
            }

            var areasToAvoid = AreasToAvoid(incidents);
            var itineraryWithIncidents = await GetRoute(queryParams, areasToAvoid);
            itineraryWithIncidents.Incidents = incidents;
            itineraryWithIncidents.BoundingBox = itineraryBoundingBox;

            return itineraryWithIncidents;
        }

        private async Task<ItineraryDto> GetRoute(ItineraryQueryParams queryParams, object avoidAreas)
        {
            try
            {
                // Map frontend travel method to TomTom API expected values
                string tomtomTravelMode = MapToTomTomTravelMode(queryParams.TravelMethod);

                var url = $"{_tomtomUrl}/routing/1/calculateRoute/{queryParams.DepartureLat},{queryParams.DepartureLon}:{queryParams.ArrivalLat},{queryParams.ArrivalLon}/json?key={_tomtomApiKey}&travelMode={tomtomTravelMode}&routeType={queryParams.RouteType}&instructionsType=text&traffic=true&language=fr";

                if (queryParams.AvoidTollRoads)
                {
                    url += "&avoid=tollRoads";
                }

                HttpResponseMessage itineraryResponse = new HttpResponseMessage { };

                if (avoidAreas == null)
                {
                    itineraryResponse = await httpClient.GetAsync(url);
                }
                else
                {
                    var requestBody = JsonSerializer.Serialize(avoidAreas);

                    var content = new StringContent(requestBody);
                    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                    itineraryResponse = await httpClient.PostAsync(url, content);
                }

                if (itineraryResponse.IsSuccessStatusCode)
                {
                    var itineraryAsJson = await itineraryResponse.Content.ReadAsStringAsync();
                    JsonObject itineraryObject = JsonSerializer.Deserialize<JsonObject>(itineraryAsJson);
                    var mappedItinerary = mapper.Map<ItineraryDto>(itineraryObject);
                    
                    // Set the travel mode to the one requested by the frontend
                    mappedItinerary.TravelMode = queryParams.TravelMethod;
                    
                    return mappedItinerary;
                }
                else
                {
                    return null;
                }
            } catch(Exception ex)
            {
                throw new Exception("An error occurred while calculating the route.", ex);
            }
        }

        // Map frontend travel methods to TomTom API expected values
        private string MapToTomTomTravelMode(string travelMethod)
        {
            return travelMethod.ToLower() switch
            {
                "car" => "car",
                "bike" => "bicycle",
                "foot" => "pedestrian",
                "train" => "publicTransport",
                _ => "car" // Default to car if unknown
            };
        }

        private async Task<List<IncidentDto>> GetIncidentsInBoundingBox(BoundingBox boundingBox)
        {
            var incidentsResponse = await httpClient.GetAsync($"http://incident-service:8080/incident/bounding-box?minLat={boundingBox.MinLat}&maxLat={boundingBox.MaxLat}&minLon={boundingBox.MinLon}&maxLon={boundingBox.MaxLon}");
            if (incidentsResponse.IsSuccessStatusCode)
            {
                var incidentsJson = await incidentsResponse.Content.ReadAsStringAsync();
                var incidents = JsonSerializer.Deserialize<List<IncidentDto>>(incidentsJson) ?? throw new JsonException("Error when deserializing incidents in itinerary");

                return incidents;
            }
            else
            {
                throw new Exception("Error when trying to get incidents in bounding box");
            }
        }

        private BoundingBox GetBoundingBox(IEnumerable<CoordinateDto> points)
        {
            double minLat = double.MaxValue;
            double maxLat = double.MinValue;
            double minLon = double.MaxValue;
            double maxLon = double.MinValue;

            foreach (var point in points)
            {
                if (point.Latitude < minLat) minLat = point.Latitude;
                if (point.Latitude > maxLat) maxLat = point.Latitude;
                if (point.Longitude < minLon) minLon = point.Longitude;
                if (point.Longitude > maxLon) maxLon = point.Longitude;
            }

            return new BoundingBox { MinLat = minLat, MaxLat = maxLat, MinLon = minLon, MaxLon = maxLon };
        }

        private object AreasToAvoid(List<IncidentDto> incidents)
        {
            var areasToAvoid = new
            {
                avoidAreas = new
                {
                    rectangles = incidents.Select(incident =>
                    {
                        double size = GetAvoidanceAreaSize(incident.Type);
                        return new
                        {
                            southWestCorner = new { latitude = incident.Latitude - size, longitude = incident.Longitude - size },
                            northEastCorner = new { latitude = incident.Latitude + size, longitude = incident.Longitude + size }
                        };
                    }).ToList()
                }
            };

            return areasToAvoid;
        }

        private double GetAvoidanceAreaSize(string type) => IncidentSizes.TryGetValue(type, out var size) ? size : 0.002;
    }
}