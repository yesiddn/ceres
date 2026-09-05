using ceres.application.Gym.Exercises.DTOs;
using ceres.domain.Gym.Entities;

namespace ceres.application.Gym.Exercises.Mappers;

public static class ExerciseMapper
{
    public static ExerciseResponse ToResponse(this Exercise exercise)
    {
        return new ExerciseResponse(
            exercise.Id,
            exercise.Name,
            exercise.MuscleGroup);
    }
}
