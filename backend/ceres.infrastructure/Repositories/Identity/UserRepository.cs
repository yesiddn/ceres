using ceres.application.Identity.Interfaces;
using ceres.domain.Identity.Entities;
using ceres.infrastructure.persistence;
using Microsoft.EntityFrameworkCore;

namespace ceres.infrastructure.Repositories.Identity;

public sealed class UserRepository(AppDbContext dbContext) : IUserRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public Task<User?> FindByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return _dbContext.Users
            .SingleOrDefaultAsync(user => user.Email == email, cancellationToken);
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _dbContext.Users.AddAsync(user, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
