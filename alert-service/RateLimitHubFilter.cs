using Microsoft.AspNetCore.SignalR;

namespace alert_service
{
    public class RateLimitHubFilter : IHubFilter
    {
        private static readonly Dictionary<string, DateTime> LastCall = new();

        public async ValueTask<object> InvokeMethodAsync(
            HubInvocationContext invocationContext,
            Func<HubInvocationContext, ValueTask<object>> next)
        {
            var connectionId = invocationContext.Context.ConnectionId;

            if (LastCall.TryGetValue(connectionId, out var lastTime) &&
                (DateTime.UtcNow - lastTime).TotalSeconds < 10)
            {
                throw new HubException("Rate limit exceeded");
            }

            LastCall[connectionId] = DateTime.UtcNow;
            return await next(invocationContext);
        }
    }
}
