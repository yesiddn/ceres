using ceres.application.Gym.Exercises.Enums;

namespace ceres.application.Gym.Exercises.DTOs;

public sealed record ExerciseResult(
    ExerciseStatus Status,
    ExerciseResponse? Exercise = null);
