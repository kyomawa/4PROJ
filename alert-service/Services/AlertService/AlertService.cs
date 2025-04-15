using System.Net.Http;

namespace alert_service.Services.AlertService
{
    public class AlertService(HttpClient httpClient) : IAlertService
    {
        public async Task<string> CheckNearIncident()
        {
            var response = await httpClient.GetAsync("http://incident-service/incidents");

            Console.WriteLine("reponse = " + response);
            if (response.IsSuccessStatusCode)
            {
                var incidentsNear = await response.Content.ReadAsStringAsync();
                Console.WriteLine("incidentsNear = " + incidentsNear);

                return incidentsNear;
            }
            else
            {
                return "No incidents found nearby.";
            }
        }
    }
}
