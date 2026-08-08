using ceres.application.HealthCheck.Interfaces;

namespace ceres.application.HealthCheck.Services;

public sealed class HealthCheckService(IDatabaseHealthCheck databaseHealthCheck) : IHealthCheckService
{
    public async Task<bool> CanConnectToDatabaseAsync(CancellationToken cancellationToken = default)
    {
        return await databaseHealthCheck.CanConnectAsync(cancellationToken);
    }
}
