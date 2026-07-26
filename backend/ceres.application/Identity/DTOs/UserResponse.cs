namespace ceres.application.Identity.DTOs;

public sealed record UserResponse(
    Guid Id,
    string Email,
    DateTime CreatedAt
);
