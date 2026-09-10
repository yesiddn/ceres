using ceres.application.Gym.Exercises.Interfaces;
using ceres.domain.Gym.Entities;
using ceres.infrastructure.persistence;
using Microsoft.EntityFrameworkCore;

namespace ceres.infrastructure.Repositories.Gym;

public sealed class RoutineRepository(AppDbContext dbContext) : IRoutineRepository
{
    public async Task<IReadOnlyList<Routine>> ListByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await dbContext.Routines
            .AsNoTracking()
            .Where(routine => routine.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public Task<Routine?> FindOwnedByIdAsync(
        Guid routineId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return OwnedAggregateQuery(userId)
            .AsNoTracking()
            .SingleOrDefaultAsync(
                routine => routine.Id == routineId,
                cancellationToken);
    }

    public Task<Routine?> FindOwnedByIdForWriteAsync(
        Guid routineId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return OwnedAggregateQuery(userId)
            .SingleOrDefaultAsync(
                routine => routine.Id == routineId,
                cancellationToken);
    }

    public async Task AddAsync(
        Routine routine,
        CancellationToken cancellationToken = default)
    {
        await dbContext.Routines.AddAsync(
            routine,
            cancellationToken);
    }

    public void Remove(Routine routine)
    {
        dbContext.Routines.Remove(routine);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private IQueryable<Routine> OwnedAggregateQuery(Guid userId)
    {
        return dbContext.Routines
            .Where(routine => routine.UserId == userId)
            .Include(routine =>
                routine.Exercises.OrderBy(routineExercise => routineExercise.Order))
            .ThenInclude(routineExercise => routineExercise.Exercise);
    }
}
