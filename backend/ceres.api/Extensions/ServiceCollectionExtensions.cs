using ceres.application.HealthCheck.Interfaces;
using ceres.application.HealthCheck.Services;
using ceres.application.Identity.Interfaces;
using ceres.application.Identity.Services;
using ceres.infrastructure.HealthCheck;
using ceres.infrastructure.Repositories.Identity;

namespace ceres.api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IHealthCheckService, HealthCheckService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }

    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddScoped<IDatabaseHealthCheck, DatabaseHealthCheck>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        return services;
    }
}
