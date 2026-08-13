namespace ceres.application.Identity.DTOs;

public sealed record IssuedRefreshToken(
    string Value,
    DateTime ExpiresAt
    );
