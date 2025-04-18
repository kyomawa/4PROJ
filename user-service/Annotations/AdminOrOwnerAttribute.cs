using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace user_service.Annotations
{
    public class AdminOrOwnerAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var currentUserRole = context.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            var currentUserId = context.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var userId = context.RouteData.Values["id"]?.ToString();

            if (currentUserRole != "Admin" && currentUserId != userId)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
