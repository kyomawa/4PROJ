using alert_service.DTO;
using alert_service.Services.AlertService;
using Microsoft.AspNetCore.SignalR;

namespace alert_service.Hub
{
    public class AlertHub(IAlertService alertService) : Microsoft.AspNetCore.SignalR.Hub
    {
        public async Task RequestAlertIncident(CoordinatesDto coordinatesDto)
        {
            var incidentData = await alertService.CheckNearIncidents(coordinatesDto);
            await Clients.Caller.SendAsync("IncidentsNear", incidentData);
        }
    }
}
