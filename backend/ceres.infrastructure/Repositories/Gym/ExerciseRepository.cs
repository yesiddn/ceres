using ceres.application.Gym.Exercises.Interfaces;
using ceres.domain.Gym.Entities;
using ceres.infrastructure.persistence;
using Microsoft.EntityFrameworkCore;

namespace ceres.infrastructure.Repositories.Gym;

public sealed class ExerciseRepository(AppDbContext dbContext) : IExerciseRepository
{
    public async Task<IReadOnlyList<Exercise>> ListByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await dbContext.Exercises
            .AsNoTracking()
            .Where(exercise => exercise.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public Task<Exercise?> FindOwnedByIdAsync(
        Guid exerciseId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return dbContext.Exercises
            .SingleOrDefaultAsync(
                exercise =>
                    exercise.Id == exerciseId &&
                    exercise.UserId == userId,
                cancellationToken);
    }

    public Task<bool> IsUsedByRoutineAsync(
        Guid exerciseId,
        CancellationToken cancellationToken = default)
    {
        return dbContext.RoutineExercises
            .AnyAsync(
                routineExercise => routineExercise.ExerciseId == exerciseId,
                cancellationToken);
    }

    public async Task AddAsync(
        Exercise exercise,
        CancellationToken cancellationToken = default)
    {
        await dbContext.Exercises.AddAsync(
            exercise,
            cancellationToken);
    }

    public void Remove(Exercise exercise)
    {
        dbContext.Exercises.Remove(exercise);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
