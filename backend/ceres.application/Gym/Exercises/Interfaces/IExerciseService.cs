using ceres.application.Gym.Exercises.DTOs;

namespace ceres.application.Gym.Exercises.Interfaces;

public interface IExerciseService
{
    Task<IReadOnlyList<ExerciseResponse>> ListAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<ExerciseResult> GetByIdAsync(
        Guid userId,
        Guid exerciseId,
        CancellationToken cancellationToken = default);

    Task<ExerciseResult> CreateAsync(
        Guid userId,
        ExerciseRequest request,
        CancellationToken cancellationToken = default);

    Task<ExerciseResult> UpdateAsync(
        Guid userId,
        Guid exerciseId,
        ExerciseRequest request,
        CancellationToken cancellationToken = default);

    Task<ExerciseResult> DeleteAsync(
        Guid userId,
        Guid exerciseId,
        CancellationToken cancellationToken = default);
}
