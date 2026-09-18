using ceres.application.Gym.Routines.DTOs;

namespace ceres.application.Gym.Routines.Interfaces;

public interface IRoutineService
{
    Task<IReadOnlyList<RoutineListItemResponse>> ListAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<RoutineResult> GetByIdAsync(
        Guid userId,
        Guid routineId,
        CancellationToken cancellationToken = default);

    Task<RoutineResult> CreateAsync(
        Guid userId,
        RoutineRequest request,
        CancellationToken cancellationToken = default);

    Task<RoutineResult> UpdateAsync(
        Guid userId,
        Guid routineId,
        RoutineRequest request,
        CancellationToken cancellationToken = default);

    Task<RoutineResult> DeleteAsync(
        Guid userId,
        Guid routineId,
        CancellationToken cancellationToken = default);
}
