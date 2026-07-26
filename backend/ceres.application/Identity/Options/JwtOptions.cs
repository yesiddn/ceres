using System.ComponentModel.DataAnnotations;

namespace ceres.application.Identity.Options;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    [Required(ErrorMessage = "Jwt:Issuer is required.")]
    public string Issuer { get; init; } = string.Empty;

    [Required(ErrorMessage = "Jwt:Audience is required.")]
    public string Audience { get; init; } = string.Empty;

    [Required(ErrorMessage = "Jwt:SecretKey is required.")]
    [MinLength(32, ErrorMessage = "Jwt:SecretKey must be at least 32 characters long.")]
    public string SecretKey { get; init; } = string.Empty;

    [Required(ErrorMessage = "Jwt:ExpiryMinutes is required.")]
    public string ExpiryMinutes  { get; set; } = string.Empty;
}
