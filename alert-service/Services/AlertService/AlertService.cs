using alert_service.DTO;

namespace alert_service.Services.AlertService
{
    public class AlertService(HttpClient httpClient) : IAlertService
    {
        private const double offsetDegree = 0.002;

        public async Task<string> CheckNearIncidents(CoordinatesDto coordinatesDto)
        {
            var minLat = coordinatesDto.Latitude - offsetDegree;
            var maxLat = coordinatesDto.Latitude + offsetDegree;
            var minLon = coordinatesDto.Longitude - offsetDegree;
            var maxLon = coordinatesDto.Longitude + offsetDegree;

            var response = await httpClient.GetAsync($"http://incident-service:8080/incident/bounding-box?minLat={minLat}&maxLat={maxLat}&minLon={minLon}&maxLon={maxLon}");

            if (response.IsSuccessStatusCode)
            {
                var incidentsNear = await response.Content.ReadAsStringAsync();
                return incidentsNear;
            }
            else
            {
                throw new Exception("Cannot get near incidents");
            }
        }
    }
}
