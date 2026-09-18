namespace ceres.application.Gym.Routines.DTOs;

public record RoutineExerciseResponse(
    Guid ExerciseId,
    string Name,
    string MuscleGroup,
    int Order,
    int TargetSets,
    int TargetReps,
    int RestTimeSeconds,
    Guid? GroupId);
