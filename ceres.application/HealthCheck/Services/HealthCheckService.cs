using ceres.application.HealthCheck.Interfaces;
using ceres.infrastructure.persistence;

namespace ceres.application.HealthCheck.Services;

public sealed class HealthCheckService(AppDbContext dbContext) : IHealthCheckService
{
    public async Task<bool> CanConnectToDatabaseAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Database.CanConnectAsync(cancellationToken);
    }
}
