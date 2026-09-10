using ceres.domain.Gym.Entities;

namespace ceres.application.Gym.Routines.Interfaces;

public interface IRoutineRepository
{
    Task<IReadOnlyList<Routine>> ListByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<Routine?> FindOwnedByIdAsync(
        Guid routineId,
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<Routine?> FindOwnedByIdForWriteAsync(
        Guid routineId,
        Guid userId,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Routine routine,
        CancellationToken cancellationToken = default);

    void Remove(Routine routine);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}
