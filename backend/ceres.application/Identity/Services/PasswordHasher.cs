using ceres.application.Identity.Interfaces;

namespace ceres.application.Identity.Services;

public class PasswordHasher : IPasswordHasher
{
    public string Hash(string password)
    {
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        return passwordHash;
    }

    public bool Verify(string password, string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}
