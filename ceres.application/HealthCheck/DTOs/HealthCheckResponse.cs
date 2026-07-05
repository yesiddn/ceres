namespace ceres.application.HealthCheck.DTOs;

public sealed class HealthCheckResponse
{
    public required string Status { get; set; }
    public required string DatabaseStatus { get; set; }
    public DateTime Timestamp { get; set; }
}
