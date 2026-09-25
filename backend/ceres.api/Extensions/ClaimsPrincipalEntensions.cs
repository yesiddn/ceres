using System.Security.Claims;

namespace ceres.api.Extensions;

internal static class ClaimsPrincipalEntensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirstValue("UserId");

        if (!Guid.TryParse(value, out var userId))
        {
            throw new InvalidOperationException("Authenticated user does not contain a valid UserId claim");
        }

        return userId;
    }
}
