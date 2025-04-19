using alert_service.DTO;

namespace alert_service.Services.AlertService
{
    public interface IAlertService
    {
        public Task<string> CheckNearIncidents(CoordinatesDto coordinatesDto);
        public Task<string> CheckIncidentsInItinerary(BoundingBoxDto boundingBox);
    }
}
