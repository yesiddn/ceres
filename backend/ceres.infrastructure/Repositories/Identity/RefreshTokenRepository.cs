using ceres.application.Identity.Interfaces;
using ceres.domain.Identity.Entities;
using ceres.infrastructure.persistence;
using Microsoft.EntityFrameworkCore;

namespace ceres.infrastructure.Repositories.Identity;

public sealed class RefreshTokenRepository(AppDbContext dbContext) : IRefreshTokenRepository
{
    private readonly AppDbContext _dbContext = dbContext;
    public Task<RefreshToken?> FindByHashAsync(string tokenHash, CancellationToken cancellationToken = default)
    {
        return _dbContext.RefreshTokens
            .SingleOrDefaultAsync(refreshToken => refreshToken.TokenHash == tokenHash, cancellationToken);
    }

    public async Task AddAsync(RefreshToken refreshToken, CancellationToken cancellationToken = default)
    {
        await _dbContext.RefreshTokens.AddAsync(refreshToken, cancellationToken);
    }

    public void Revoke(RefreshToken refreshToken, DateTime revokedAt, string? replacedByTokenHash = null)
    {
        refreshToken.RevokedAt = revokedAt;
        refreshToken.ReplacedByTokenHash = replacedByTokenHash;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
