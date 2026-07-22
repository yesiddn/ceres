namespace ceres.application.Identity.DTOs;

public sealed class RegisterResponse
{
    public required Guid Id { get; set; }
    public required string Email { get; set; }
    public DateTime CreatedAt { get;  set; }
}
