using ceres.application.HealthCheck.Interfaces;
using ceres.application.HealthCheck.Services;

namespace ceres.api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IHealthCheckService, HealthCheckService>();
        return services;
    }
}
