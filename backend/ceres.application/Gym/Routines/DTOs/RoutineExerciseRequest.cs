using System.ComponentModel.DataAnnotations;

namespace ceres.application.Gym.Routines.DTOs;

public sealed class RoutineExerciseRequest
{
    public Guid ExerciseId { get; set; }

    [Range(1, int.MaxValue)]
    public int Order { get; set; }

    [Range(1, int.MaxValue)]
    public int TargetSets { get; set; }

    [Range(1, int.MaxValue)]
    public int TargetReps { get; set; }

    [Range(0, int.MaxValue)]
    public int RestTimeSeconds { get; set;  }

    public Guid? GroupId { get; set; }
}
