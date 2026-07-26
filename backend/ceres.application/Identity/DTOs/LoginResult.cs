using ceres.application.Identity.Enums;

namespace ceres.application.Identity.DTOs;

public record LoginResult(LoginStatus Status, AuthResponse? Auth = null);
