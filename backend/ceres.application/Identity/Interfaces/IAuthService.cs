using ceres.application.Identity.DTOs;

namespace ceres.application.Identity.Interfaces;

public interface IAuthService
{
    Task<RegisterResult> RegisterAsync(RegisterRequest registerRequest, CancellationToken cancellationToken = default);
    Task<LoginResult> LoginAsync(LoginRequest loginRequest, CancellationToken cancellationToken = default);
}
