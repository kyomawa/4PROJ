using alert_service.DTO;
using alert_service.Services.AlertService;
using Microsoft.AspNetCore.SignalR;

namespace alert_service.Hub
{
    public class AlertHub(IAlertService alertService) : Microsoft.AspNetCore.SignalR.Hub
    {
        public async Task GetNearIncidents(CoordinatesDto coordinatesDto)
        {
            var incidentsNear = await alertService.CheckNearIncidents(coordinatesDto);
            await Clients.Caller.SendAsync("IncidentsNear", incidentsNear);
        }

        public async Task GetItineraryIncidents(BoundingBoxDto itineraryBoundingBox)
        {
            var incidentsInItinerary = await alertService.CheckIncidentsInItinerary(itineraryBoundingBox);
            await Clients.Caller.SendAsync("ItineraryIncidents", incidentsInItinerary);
        }
    }
}
