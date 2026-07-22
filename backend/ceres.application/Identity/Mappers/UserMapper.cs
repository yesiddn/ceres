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
