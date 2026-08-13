using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ceres.application.Identity.DTOs;
using ceres.application.Identity.Enums;
using ceres.application.Identity.Interfaces;
using ceres.application.Identity.Mappers;
using ceres.application.Identity.Options;
using ceres.domain.Identity.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace ceres.application.Identity.Services;

public sealed class AuthService (IPasswordHasher passwordHasher, IUserRepository userRepository, IRefreshTokenRepository refreshTokenRepository, IOptions<JwtOptions> jwtOptions) : IAuthService
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

        var accessToken = GenerateJwtToken(user);
        var jwtExpiresIn = _jwtOptions.ExpiryMinutes * 60;

        var refreshToken = GenerateRefreshToken();
        var refreshTokenHash = HashRefreshToken(refreshToken);
        var refreshTokenExpiresAt = DateTime.UtcNow.AddMinutes(_jwtOptions.RefreshTokenLifetimeDays);

        var refreshTokenEntity = new RefreshToken
        {
            TokenHash = refreshTokenHash,
            UserId = user.Id,
            ExpiresAt = refreshTokenExpiresAt
        };

        await refreshTokenRepository.AddAsync(
            refreshTokenEntity,
            cancellationToken);
        await refreshTokenRepository.SaveChangesAsync(cancellationToken);

        return new LoginResult(
            LoginStatus.Success,
            new AuthResponse(accessToken, jwtExpiresIn),
            new IssuedRefreshToken(refreshToken, refreshTokenExpiresAt));
    }

    public async Task<RefreshResult> RefreshAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            return new RefreshResult(
                RefreshStatus.InvalidToken);
        }

        var tokenHash = HashRefreshToken(refreshToken);

        var storedToken = await refreshTokenRepository.FindByHashAsync(tokenHash, cancellationToken);

        if (storedToken is null
            || storedToken.RevokedAt is not null
            || storedToken.ExpiresAt <= DateTime.UtcNow)
        {
            return new RefreshResult(RefreshStatus.InvalidToken);
        }

        var newAccessToken = GenerateJwtToken(storedToken.User);
        var newAccessTokenExpiresIn = _jwtOptions.ExpiryMinutes * 60;

        var newRefreshToken = GenerateRefreshToken();
        var newRefreshTokenHash = HashRefreshToken(newRefreshToken);
        var newRefreshTokenExpiresAt = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenLifetimeDays);

        var newRefreshTokenEntity = new RefreshToken
        {
            TokenHash = newRefreshTokenHash,
            UserId = storedToken.User.Id,
            ExpiresAt = newRefreshTokenExpiresAt
        };

        refreshTokenRepository.Revoke(storedToken, DateTime.UtcNow, newRefreshTokenHash);
        await refreshTokenRepository.AddAsync(newRefreshTokenEntity, cancellationToken);
        await refreshTokenRepository.SaveChangesAsync(cancellationToken);

        return new RefreshResult(
            RefreshStatus.Success,
            new AuthResponse(newAccessToken, newAccessTokenExpiresIn),
            new IssuedRefreshToken(newRefreshToken, newRefreshTokenExpiresAt));
    }

    private string GenerateJwtToken(User user)
    {
        var issuer = _jwtOptions.Issuer;

        var audience = _jwtOptions.Audience;
        var secretKey = _jwtOptions.SecretKey;

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
            expires: DateTime.UtcNow.AddMinutes(_jwtOptions.ExpiryMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(_jwtOptions.RefreshTokenSizeInBytes);

        return Convert
            .ToBase64String(bytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }

    private static string HashRefreshToken(string refreshToken)
    {
        var bytes = Encoding.UTF8.GetBytes(refreshToken);
        var hash = SHA256.HashData(bytes);

        return Convert.ToHexString(hash);
    }
}
