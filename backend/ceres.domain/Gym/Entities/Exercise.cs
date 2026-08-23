using ceres.domain.Identity.Entities;

namespace ceres.domain.Gym.Entities;

public class Exercise
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string MuscleGroup { get; set; } = null!;
    public Guid? UserId { get; set; }
    public User? User { get; set; }
}
