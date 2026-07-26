using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ceres.application.Identity.DTOs;
using ceres.application.Identity.Enums;
using ceres.application.Identity.Interfaces;
using ceres.application.Identity.Mappers;
using ceres.application.Identity.Options;
using ceres.domain.Identity.Entities;
using ceres.infrastructure.Repositories.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace ceres.application.Identity.Services;

public sealed class AuthService (IPasswordHasher passwordHasher, IUserRepository userRepository, IOptions<JwtOptions> jwtOptions) : IAuthService
{
    private const string DummyPasswordHash = "$2a$11$HpQAYQHVck/O1zYZPMuoPeibQAFCpwN60WXJTlS766/RvW1NML5ny";
    private readonly JwtOptions _jwtOptions = jwtOptions.Value;

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

    public async Task<LoginResult> LoginAsync(LoginRequest loginRequest, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.FindByEmailAsync(loginRequest.Email, cancellationToken);

        // Tiempo constante: si no existe el usuario, verificamos contra dummy
        // para que el tiempo de respuesta sea idéntico al caso donde sí existe.
        if (user is null)
        {
            passwordHasher.Verify(loginRequest.Password, DummyPasswordHash);
            return new LoginResult(LoginStatus.InvalidCredentials);
        }

        var isPasswordValid = passwordHasher.Verify(loginRequest.Password, user.PasswordHash);

        if (!isPasswordValid)
            return new LoginResult(LoginStatus.InvalidCredentials);

        var token = GenerateJwtToken(user);

        return new LoginResult(LoginStatus.Success, user.ToAuthResponse(token));
    }

    private string GenerateJwtToken(User user)
    {
        var issuer = _jwtOptions.Issuer;

        var audience = _jwtOptions.Audience;
        var secretKey = _jwtOptions.SecretKey;

        var expirationTime = _jwtOptions.ExpiryMinutes;

        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("UserId", user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // ID único del token
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(expirationTime)),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
