using System.ComponentModel.DataAnnotations;
using ceres.domain.Gym.Enums;

namespace ceres.application.Gym.Routines.DTOs;

public sealed class RoutineRequest
{
    [Required(ErrorMessage = "Routine must have a name.")]
    [MaxLength(100, ErrorMessage = "Routine name must be at most 100 characters.")]
    public string Name { get; set; } = null!;

    public DayOfWeekFlags ScheduledDays { get; set; }

    [Required] public List<RoutineExerciseRequest> Exercises { get; set; } = null!;

}
