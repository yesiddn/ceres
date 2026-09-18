using ceres.domain.Gym.Enums;

namespace ceres.application.Gym.Routines.DTOs;

public record RoutineResponse(
    Guid Id,
    string Name,
    DayOfWeekFlags ScheduledDays,
    IReadOnlyList<RoutineExerciseResponse> Exercises);
