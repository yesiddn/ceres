namespace ceres.api.Contracts.Common;

public sealed record ErrorResponse(
    string Error,
    string? Field = null);
