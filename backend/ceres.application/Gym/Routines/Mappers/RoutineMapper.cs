using ceres.application.Gym.Routines.DTOs;
using ceres.domain.Gym.Entities;

namespace ceres.application.Gym.Routines.Mappers;

public static class RoutineMapper
{
    public static RoutineListItemResponse ToListItemResponse(this Routine routine)
    {
        return new RoutineListItemResponse(
            routine.Id,
            routine.Name,
            routine.ScheduledDays);
    }

    public static RoutineResponse ToResponse(this Routine routine)
    {
        var exercises = routine.Exercises
            .OrderBy(routineExercise => routineExercise.Order)
            .Select(routineExercise =>
                new RoutineExerciseResponse(
                    routineExercise.ExerciseId,
                    routineExercise.Exercise.Name,
                    routineExercise.Exercise.MuscleGroup,
                    routineExercise.Order,
                    routineExercise.TargetSets,
                    routineExercise.TargetReps,
                    routineExercise.RestTimeSeconds,
                    routineExercise.GroupId))
            .ToList();

        return new RoutineResponse(
            routine.Id,
            routine.Name,
            routine.ScheduledDays,
            exercises);
    }
}
