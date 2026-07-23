using ceres.application.HealthCheck.DTOs;
using ceres.application.HealthCheck.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ceres.api.Endpoints.HealthCheck;

public static class HealthEndpoints
{
    public static RouteGroupBuilder MapHealthEndpoints(this RouteGroupBuilder api)
    {
        var health = api.MapGroup("/health").WithTags("Health");

        health.MapGet("/", HealthCheckAsync)
            .WithName(nameof(HealthCheckAsync))
            .Produces<HealthCheckResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status503ServiceUnavailable)
            .WithSummary("Health check")
            .WithDescription("Checks whether the API is running and whether the database connection is available.");

        return api;
    }

    private static async Task<Results<Ok<HealthCheckResponse>, ProblemHttpResult>>  HealthCheckAsync(IHealthCheckService healthCheckService, CancellationToken cancellationToken)
    {
        var canConnectToDatabase = await healthCheckService.CanConnectToDatabaseAsync(cancellationToken);
        if (!canConnectToDatabase)
        {
            return TypedResults.Problem(
                title: "Service unavailable",
                detail: "The database connection is not available.",
                statusCode: StatusCodes.Status503ServiceUnavailable);
        }

        var response = new HealthCheckResponse
        {
            Status = "healthy",
            DatabaseStatus = "reachable",
            Timestamp = DateTime.UtcNow
        };

        return TypedResults.Ok(response);
    }
}
