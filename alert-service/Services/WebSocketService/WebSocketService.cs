using Microsoft.AspNetCore.Http;
using System.Net.WebSockets;
using System.Text;
using alert_service.Services.WebSocketService;
using alert_service.Services.AlertService;


namespace alert_service.Services.WebSocketService
{
    public class WebSocketService(WebSocketManager webSocketManager, IAlertService alertService) : IWebSocketService
    {
        public async Task HandleWebSocketConnection(HttpContext context)
        {
            if (context.WebSockets.IsWebSocketRequest)
            {
                var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                await webSocketManager.Add(webSocket);
                await ListenToSocketAsync(webSocket);
            }
            else
            {
                context.Response.StatusCode = 400;
            }
        }

        private async Task ListenToSocketAsync(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];

            while (webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Text)
                {
                    string message = Encoding.UTF8.GetString(buffer, 0, result.Count);

                    if (message.Equals("alert-incident"))
                    {
                        var incidentMessage = await alertService.CheckNearIncident();

                        await webSocket.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(incidentMessage)),
                            WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                }
                else if (result.MessageType == WebSocketMessageType.Close)
                {
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
                }
            }
        }

    }
}
