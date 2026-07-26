namespace ceres.application.Identity.DTOs;

public sealed record AuthResponse(
    string AccessToken,
    UserResponse User
);
