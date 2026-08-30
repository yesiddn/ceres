namespace ceres.domain.Gym.Entities;

public class RoutineExercise
{
    public Guid Id { get; set; }

    /// <summary>
    /// Planned position of the exercise within the routine.
    /// </summary>
    public int Order { get; set; }

    public Guid? GroupId { get; set; }

    public int TargetSets { get; set; }
    public int TargetReps { get; set; }

    public int RestTimeSeconds { get; set; }

    public Guid RoutineId { get; set; }
    public Routine Routine { get; set; } = null!;

    public Guid ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;
}
