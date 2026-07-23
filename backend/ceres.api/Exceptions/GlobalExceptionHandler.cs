using ceres.api.Contracts.Common;
using Microsoft.AspNetCore.Diagnostics;

namespace ceres.api.Exceptions;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is not BadHttpRequestException) return false;

        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;

        await httpContext.Response.WriteAsJsonAsync(
            new ErrorResponse("Invalid request body."),
            cancellationToken);

        return true;
    }
}
