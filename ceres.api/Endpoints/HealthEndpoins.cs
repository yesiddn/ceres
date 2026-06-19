using Microsoft.AspNetCore.Http.HttpResults;

namespace ceres.api.Endpoints;

public static class HealthEndpoins
{
    public static RouteGroupBuilder MapHealthEndpoints(this RouteGroupBuilder api)
    {
        var health = api.MapGroup("/health").WithTags("Health");

        health.MapGet("/", HealthCheck)
            .WithName(nameof(HealthCheck))
            .Produces(StatusCodes.Status200OK)
            .WithSummary("Health check")
            .WithDescription("Health check endpoint used to determine whether the API is running");

        return api;
    }

    private static Ok HealthCheck()
    {
        return TypedResults.Ok();
    }
}
