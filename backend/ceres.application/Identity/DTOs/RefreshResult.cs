using ceres.application.Identity.Enums;

namespace ceres.application.Identity.DTOs;

public sealed record RefreshResult(
    RefreshStatus Status,
    AuthResponse? Auth = null,
    IssuedRefreshToken? IssuedRefreshToken = null);
