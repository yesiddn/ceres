using ceres.application.Gym.Routines.Enums;

namespace ceres.application.Gym.Routines.DTOs;

public sealed record RoutineResult(
    RoutineStatus Status,
    RoutineResponse? Routine = null);
