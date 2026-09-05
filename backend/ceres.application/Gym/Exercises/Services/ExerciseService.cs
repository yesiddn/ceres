using ceres.application.Gym.Exercises.DTOs;
using ceres.application.Gym.Exercises.Enums;
using ceres.application.Gym.Exercises.Interfaces;
using ceres.application.Gym.Exercises.Mappers;
using ceres.domain.Gym.Entities;

namespace ceres.application.Gym.Exercises.Services;

public sealed class ExerciseService(IExerciseRepository exerciseRepository) : IExerciseService
{
    public async Task<IReadOnlyList<ExerciseResponse>> ListAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var exercises =
            await exerciseRepository.ListByUserIdAsync(
                userId,
                cancellationToken);

        return exercises
            .Select(exercise => exercise.ToResponse())
            .ToList();
    }

    public async Task<ExerciseResult> GetByIdAsync(
        Guid userId,
        Guid exerciseId,
        CancellationToken cancellationToken = default)
    {
        var exercise =
            await exerciseRepository.FindOwnedByIdAsync(
                exerciseId,
                userId,
                cancellationToken);

        if (exercise is null)
        {
            return new ExerciseResult(
                ExerciseStatus.NotFound);
        }

        return new ExerciseResult(
            ExerciseStatus.Success,
            exercise.ToResponse());
    }

    public async Task<ExerciseResult> CreateAsync(
        Guid userId,
        ExerciseRequest request,
        CancellationToken cancellationToken = default)
    {
        var exercise = new Exercise
        {
            Name = request.Name.Trim(),
            MuscleGroup = request.MuscleGroup.Trim(),
            UserId = userId
        };

        await exerciseRepository.AddAsync(
            exercise,
            cancellationToken);

        await exerciseRepository.SaveChangesAsync(
            cancellationToken);

        return new ExerciseResult(
            ExerciseStatus.Success,
            exercise.ToResponse());
    }

    public async Task<ExerciseResult> UpdateAsync(
        Guid userId,
        Guid exerciseId,
        ExerciseRequest request,
        CancellationToken cancellationToken = default)
    {
        var exercise =
            await exerciseRepository.FindOwnedByIdAsync(
                exerciseId,
                userId,
                cancellationToken);

        if (exercise is null)
        {
            return new ExerciseResult(
                ExerciseStatus.NotFound);
        }

        exercise.Name = request.Name.Trim();
        exercise.MuscleGroup = request.MuscleGroup.Trim();

        await exerciseRepository.SaveChangesAsync(
            cancellationToken);

        return new ExerciseResult(
            ExerciseStatus.Success,
            exercise.ToResponse());
    }

    public async Task<ExerciseResult> DeleteAsync(
        Guid userId,
        Guid exerciseId,
        CancellationToken cancellationToken = default)
    {
        var exercise =
            await exerciseRepository.FindOwnedByIdAsync(
                exerciseId,
                userId,
                cancellationToken);

        if (exercise is null)
        {
            return new ExerciseResult(
                ExerciseStatus.NotFound);
        }

        var isUsedByRoutine =
            await exerciseRepository.IsUsedByRoutineAsync(
                exerciseId,
                cancellationToken);

        if (isUsedByRoutine)
        {
            return new ExerciseResult(
                ExerciseStatus.InUse);
        }

        exerciseRepository.Remove(exercise);

        await exerciseRepository.SaveChangesAsync(
            cancellationToken);

        return new ExerciseResult(
            ExerciseStatus.Success);
    }
}
