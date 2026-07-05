namespace ceres.application.HealthCheck.Interfaces;

public interface IHealthCheckService
{
    Task<bool> CanConnectToDatabaseAsync(CancellationToken cancellationToken = default);
}
