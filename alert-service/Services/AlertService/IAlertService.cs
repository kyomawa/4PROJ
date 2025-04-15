namespace alert_service.Services.AlertService
{
    public interface IAlertService
    {
        public Task<string> CheckNearIncident();
    }
}
