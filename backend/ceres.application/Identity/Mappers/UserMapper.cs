using ceres.application.Identity.DTOs;
using ceres.domain.Identity.Entities;

namespace ceres.application.Identity.Mappers;

public static class UserMapper
{
    public static User ToEntity(
        this RegisterRequest request,
        string passwordHash)
    {
        return new User
        {
            Email = request.Email!,
            PasswordHash = passwordHash
        };
    }

    private static UserResponse ToUserResponse(this User user)
    {
        return new UserResponse(user.Id, user.Email, user.CreatedAt);
    }

    public static AuthResponse ToAuthResponse(this User user, string accessToken)
    {
        return new AuthResponse(accessToken, user.ToUserResponse());
    }

    // TODO: remove when register flow implement jwt
    public static RegisterResponse ToResponse(this User user)
    {
        return new RegisterResponse
        {
            Id = user.Id,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        };
    }
}
