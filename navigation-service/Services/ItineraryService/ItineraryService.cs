using System.Text.Json;
using System.Net.Http.Headers;
using navigation_service.Services.LocationService;
using navigation_service.DTO;
using AutoMapper;
using navigation_service.Models;
using System.Text.Json.Nodes;
using navigation_service.DTO.ItineraryDTO;

namespace navigation_service.Services.ItineraryService
{
    public class ItineraryService(HttpClient httpClient, ILocationService locationService, IConfiguration configuration, IMapper mapper) : InterfaceItineraryService
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

        public async Task<ItineraryDto> GetItinerary(double departure_lon, double departure_lat, double arrival_lon, double arrival_lat, string travelMethod, string routeType)
        {

            var itineraryBoundingBox = GetBoundingBox(new List<CoordinateDto>
            {
                new CoordinateDto { Latitude = departure_lat, Longitude = departure_lon },
                new CoordinateDto { Latitude = arrival_lat, Longitude = arrival_lon }
            });

            var incidents = await GetIncidentsInBoundingBox(itineraryBoundingBox);

            if (incidents.Count == 0)
            {
                // creer l'itineraire en db
                var itinerary = await GetRoute(departure_lat, departure_lon, arrival_lat, arrival_lon, travelMethod, routeType, null);
                itinerary.BoundingBox = itineraryBoundingBox;
                return itinerary;
            }

            var areasToAvoid = AreasToAvoid(incidents);
            var itineraryWithIncidents = await GetRoute(departure_lat, departure_lon, arrival_lat, arrival_lon, travelMethod, routeType, areasToAvoid);
            itineraryWithIncidents.Incidents = incidents;
            itineraryWithIncidents.BoundingBox = itineraryBoundingBox;

            return itineraryWithIncidents;
        }

        private async Task<ItineraryDto> GetRoute(double departure_lat, double departure_lon, double arrival_lat, double arrival_lon, string travelMethod, string routeType, object avoidAreas)
        {
            try
            {
                var url = $"{_tomtomUrl}/routing/1/calculateRoute/{departure_lat},{departure_lon}:{arrival_lat},{arrival_lon}/json?key={_tomtomApiKey}&travelMode={travelMethod}&routeType={routeType}&instructionsType=text&traffic=true&language=fr";

                HttpResponseMessage itineraryResponse;

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
                    // creer l'itineraire en db

                    return mapper.Map<ItineraryDto>(itineraryObject);
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
