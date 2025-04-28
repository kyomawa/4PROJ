using alert_service.DTO;
using alert_service.Services.AlertService;

public class AlertService(HttpClient httpClient) : IAlertService
{
    private const double offsetDegree = 0.002;

    public async Task<string> CheckNearIncidents(CoordinatesDto coordinatesDto)
    {
        var boundingBox = new BoundingBoxDto
        {
            MinLat = coordinatesDto.Latitude - offsetDegree,
            MaxLat = coordinatesDto.Latitude + offsetDegree,
            MinLon = coordinatesDto.Longitude - offsetDegree,
            MaxLon = coordinatesDto.Longitude + offsetDegree
        };

        return await GetIncidentsInBoundingBox(boundingBox);
    }

    public async Task<string> CheckIncidentsInItinerary(BoundingBoxDto itineraryBoundingBox)
    {
        return await GetIncidentsInBoundingBox(itineraryBoundingBox);
    }

    private async Task<string> GetIncidentsInBoundingBox(BoundingBoxDto boundingBox)
    {
        var url = $"http://incident-service:8080/incident/bounding-box?minLat={boundingBox.MinLat}&maxLat={boundingBox.MaxLat}&minLon={boundingBox.MinLon}&maxLon={boundingBox.MaxLon}";
        var response = await httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
            throw new Exception("Cannot get incidents from incident service");

        return await response.Content.ReadAsStringAsync();
    }
}
