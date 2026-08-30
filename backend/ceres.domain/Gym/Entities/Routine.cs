using ceres.domain.Gym.Enums;
using ceres.domain.Identity.Entities;

namespace ceres.domain.Gym.Entities;

public class Routine
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public DayOfWeekFlags ScheduledDays { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}
