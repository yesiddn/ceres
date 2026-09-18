using ceres.application.Gym.Exercises.Interfaces;
using ceres.application.Gym.Routines.DTOs;
using ceres.application.Gym.Routines.Enums;
using ceres.application.Gym.Routines.Interfaces;
using ceres.application.Gym.Routines.Mappers;
using ceres.domain.Gym.Entities;

namespace ceres.application.Gym.Routines.Services;

public sealed class RoutineService(
    IRoutineRepository routineRepository,
    IExerciseRepository exerciseRepository)
    : IRoutineService
{
    public async Task<IReadOnlyList<RoutineListItemResponse>> ListAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var routines = await routineRepository.ListByUserIdAsync(userId, cancellationToken);

        return routines.Select(routine => routine.ToListItemResponse())
            .ToList();
    }

    public async Task<RoutineResult> GetByIdAsync(
        Guid userId,
        Guid routineId,
        CancellationToken cancellationToken = default)
    {
        var routine = await routineRepository.FindOwnedByIdAsync(
            routineId,
            userId,
            cancellationToken);

        if (routine is null)
        {
            return new RoutineResult(
                RoutineStatus.NotFound);
        }

        return new RoutineResult(
            RoutineStatus.Success,
            routine.ToResponse());
    }

    public async Task<RoutineResult> CreateAsync(
        Guid userId,
        RoutineRequest request,
        CancellationToken cancellationToken = default)
    {
        if (HasInvalidConfiguration(request))
        {
            return new RoutineResult(
                RoutineStatus.InvalidConfiguration);
        }

        if (await HasInaccessibleExercisesAsync(
                userId,
                request,
                cancellationToken))
        {
            return new RoutineResult(
                RoutineStatus.InaccessibleExercise);
        }

        var routine = new Routine
        {
            Name = request.Name.Trim(),
            ScheduledDays = request.ScheduledDays,
            UserId = userId
        };

        foreach (var exercise in request.Exercises)
        {
            routine.Exercises.Add(
                CreateRoutineExercise(exercise));
        }

        await routineRepository.AddAsync(
            routine,
            cancellationToken);

        await routineRepository.SaveChangesAsync(
            cancellationToken);

        var createdRoutine =
            await routineRepository.FindOwnedByIdAsync(
                routine.Id,
                userId,
                cancellationToken);

        if (createdRoutine is null)
        {
            throw new InvalidOperationException(
                "Created routine could not be loaded.");
        }

        return new RoutineResult(
            RoutineStatus.Success,
            createdRoutine.ToResponse());
    }

    public async Task<RoutineResult> UpdateAsync(Guid userId, Guid routineId, RoutineRequest request, CancellationToken cancellationToken = default)
    {
        var routine =
            await routineRepository.FindOwnedByIdForWriteAsync(
                routineId,
                userId,
                cancellationToken);

        if (routine is null)
        {
            return new RoutineResult(
                RoutineStatus.NotFound);
        }

        if (HasInvalidConfiguration(request))
        {
            return new RoutineResult(
                RoutineStatus.InvalidConfiguration);
        }

        if (await HasInaccessibleExercisesAsync(
                userId,
                request,
                cancellationToken))
        {
            return new RoutineResult(
                RoutineStatus.InaccessibleExercise);
        }

        routine.Name = request.Name.Trim();
        routine.ScheduledDays = request.ScheduledDays;

        routine.Exercises.Clear();

        foreach (var exercise in request.Exercises)
        {
            routine.Exercises.Add(
                CreateRoutineExercise(exercise));
        }

        await routineRepository.SaveChangesAsync(
            cancellationToken);

        var updatedRoutine =
            await routineRepository.FindOwnedByIdAsync(
                routineId,
                userId,
                cancellationToken);

        if (updatedRoutine is null)
        {
            throw new InvalidOperationException(
                "Updated routine could not be loaded.");
        }

        return new RoutineResult(
            RoutineStatus.Success,
            updatedRoutine.ToResponse());
    }

    public async Task<RoutineResult> DeleteAsync(
        Guid userId,
        Guid routineId,
        CancellationToken cancellationToken = default)
    {
        var routine =
            await routineRepository.FindOwnedByIdForWriteAsync(
                routineId,
                userId,
                cancellationToken);

        if (routine is null)
        {
            return new RoutineResult(
                RoutineStatus.NotFound);
        }

        routineRepository.Remove(routine);

        await routineRepository.SaveChangesAsync(
            cancellationToken);

        return new RoutineResult(
            RoutineStatus.Success);
    }

    private static bool HasInvalidConfiguration(
        RoutineRequest request)
    {
        var hasDuplicateOrders =
            request.Exercises
                .Select(exercise => exercise.Order)
                .Distinct()
                .Count() != request.Exercises.Count;

        if (hasDuplicateOrders)
        {
            return true;
        }

        var hasDuplicateExercises =
            request.Exercises
                .Select(exercise => exercise.ExerciseId)
                .Distinct()
                .Count() != request.Exercises.Count;

        return hasDuplicateExercises;
    }

    private async Task<bool> HasInaccessibleExercisesAsync(
        Guid userId,
        RoutineRequest request,
        CancellationToken cancellationToken)
    {
        var requestedIds = request.Exercises
            .Select(exercise => exercise.ExerciseId)
            .Distinct()
            .ToArray();

        if (requestedIds.Length == 0)
        {
            return false;
        }

        var ownedIds = await exerciseRepository.ListOwnedIdsAsync(
            userId,
            requestedIds,
            cancellationToken);

        return ownedIds.Count != requestedIds.Length;
    }

    private static RoutineExercise CreateRoutineExercise(
        RoutineExerciseRequest request)
    {
        return new RoutineExercise
        {
            ExerciseId = request.ExerciseId,
            Order = request.Order,
            TargetSets = request.TargetSets,
            TargetReps = request.TargetReps,
            RestTimeSeconds = request.RestTimeSeconds,
            GroupId = request.GroupId
        };
    }
}
