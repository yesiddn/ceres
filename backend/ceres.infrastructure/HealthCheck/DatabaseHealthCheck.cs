using ceres.application.HealthCheck.Interfaces;
using ceres.infrastructure.persistence;

namespace ceres.infrastructure.HealthCheck;

public sealed class DatabaseHealthCheck(AppDbContext dbContext)
    : IDatabaseHealthCheck
{
    public Task<bool> CanConnectAsync(
        CancellationToken cancellationToken = default)
    {
        return dbContext.Database.CanConnectAsync(cancellationToken);
    }
}
