using ceres.domain.Identity.Entities;

namespace ceres.infrastructure.Repositories.Identity;

public interface IUserRepository
{
    Task<User?> FindByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task AddAsync(User user, CancellationToken cancellationToken = default);
}
