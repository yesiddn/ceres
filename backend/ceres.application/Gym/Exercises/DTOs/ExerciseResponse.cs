namespace ceres.application.Gym.Exercises.DTOs;

public sealed record ExerciseResponse(
    Guid Id,
    string Name,
    string MuscleGroup);
