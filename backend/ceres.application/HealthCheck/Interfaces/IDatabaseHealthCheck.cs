namespace ceres.application.HealthCheck.Interfaces;

public interface IDatabaseHealthCheck
{
    Task<bool> CanConnectAsync(CancellationToken cancellationToken = default);
}
