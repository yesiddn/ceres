using ceres.domain.Gym.Enums;

namespace ceres.application.Gym.Routines.DTOs;

public sealed record RoutineListItemResponse(
    Guid Id,
    string Name,
    DayOfWeekFlags ScheduledDays);
