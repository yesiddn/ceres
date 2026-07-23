using ceres.application.Identity.DTOs;
using ceres.application.Identity.Enums;
using ceres.application.Identity.Interfaces;
using ceres.application.Identity.Mappers;
using ceres.infrastructure.Repositories.Identity;

namespace ceres.application.Identity.Services;

public sealed class AuthService (IPasswordHasher passwordHasher, IUserRepository userRepository) : IAuthService
{
    public async Task<RegisterResult> RegisterAsync(RegisterRequest registerRequest, CancellationToken cancellationToken = default)
    {
        var emailAlreadyExists = await userRepository.FindByEmailAsync(registerRequest.Email!,  cancellationToken);

        if (emailAlreadyExists != null)
        {
            return new RegisterResult(RegisterStatus.EmailAlreadyExists);
        }

        var passwordHash = passwordHasher.Hash(registerRequest.Password!);

        var newUser = registerRequest.ToEntity(passwordHash);

        await userRepository.AddAsync(newUser, cancellationToken);

        return new RegisterResult(RegisterStatus.Success, newUser.ToResponse());
    }
}
