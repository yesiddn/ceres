using System.ComponentModel.DataAnnotations;

namespace ceres.application.Gym.Exercises.DTOs;

public sealed class ExerciseRequest
{
    [Required(ErrorMessage = "Exercise must have a name.")]
    [MaxLength(100, ErrorMessage = "Exercise name must be at least 100 characters.")]
    public string Name { get; set; } = null!;
    [Required(ErrorMessage = "Exercise must have a muscle group.")]
    [MaxLength(50, ErrorMessage = "Exercise muscle group must be at least 50 characters.")]
    public string MuscleGroup { get; set; } = null!;
}
