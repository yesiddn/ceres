using ceres.domain.Identity.Entities;

namespace ceres.application.Identity.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> FindByHashAsync(
        string tokenHash,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        RefreshToken refreshToken,
        CancellationToken cancellationToken = default);

    void Revoke(
        RefreshToken refreshToken,
        DateTime revokedAt,
        string? replacedByTokenHash = null);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}
