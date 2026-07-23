using ceres.application.Identity.Enums;

namespace ceres.application.Identity.DTOs;

public sealed record RegisterResult(
    RegisterStatus Status,
    RegisterResponse? User = null);
