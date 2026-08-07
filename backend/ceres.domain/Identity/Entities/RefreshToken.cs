namespace ceres.domain.Identity.Entities;

public class RefreshToken
{
    public Guid Id { get; set; }
    public string TokenHash { get; set; } = null!;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    public string? ReplacedByTokenHash { get; set; }
    public DateTime CreatedAt { get; private set; }
}
