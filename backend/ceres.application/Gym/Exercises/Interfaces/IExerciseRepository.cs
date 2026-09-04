using ceres.domain.Gym.Entities;

namespace ceres.application.Gym.Exercises.Interfaces;

public interface IExerciseRepository
{
    Task<IReadOnlyList<Exercise>> ListByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Exercise?> FindOwnedByIdAsync(Guid exerciseId, Guid userId, CancellationToken cancellationToken = default);
    Task<bool> IsUsedByRoutineAsync(Guid exerciseId, CancellationToken cancellationToken = default);
    Task AddAsync(Exercise exercise, CancellationToken cancellationToken = default);
    void Remove(Exercise exercise);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
