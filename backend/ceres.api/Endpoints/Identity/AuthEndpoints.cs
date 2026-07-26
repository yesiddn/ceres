using ceres.api.Contracts.Common;
using ceres.application.Identity.DTOs;
using ceres.application.Identity.Enums;
using ceres.application.Identity.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ceres.api.Endpoints.Identity;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder api)
    {
        var auth = api.MapGroup("/auth").WithTags("Auth");

        auth.MapPost("/register", RegisterAsync)
            .WithName("Register")
            .Produces<RegisterResponse>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status409Conflict)
            .WithSummary("Registers a new user")
            .WithDescription("Registers a new user");

        auth.MapPost("/login", LoginAsync)
            .WithName("Login")
            .Produces<AuthResponse>()
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithSummary("Logins a user")
            .WithDescription("Logins a user");
        return api;
    }

    private static async Task<Results<
            Created<RegisterResponse>,
            Conflict<ErrorResponse>>>
        RegisterAsync(
            RegisterRequest request,
            IAuthService authService,
            CancellationToken cancellationToken)
    {
        var result = await authService.RegisterAsync(request, cancellationToken);

        return result.Status switch
        {
            RegisterStatus.Success => TypedResults.Created(
                "/api/auth/register",
                result.User!),

            RegisterStatus.EmailAlreadyExists => TypedResults.Conflict(
                new ErrorResponse(
                    Error: "Email already registered",
                    Field: "email")
                ),

            _ => throw new InvalidOperationException(
                $"Unknown registration status: {result.Status}")
        };
    }

    private static async Task<Results<
            Ok<AuthResponse>,
            UnauthorizedHttpResult>>
        LoginAsync(
            LoginRequest request,
            IAuthService authService,
            CancellationToken cancellationToken
        )
    {
        var result = await authService.LoginAsync(request, cancellationToken);

        return result.Status switch
        {
            LoginStatus.Success => TypedResults.Ok(result.Auth),
            LoginStatus.InvalidCredentials => TypedResults.Unauthorized(),
            _ => throw new InvalidOperationException($"Unknown login status: {result.Status}"),
        };
    }
}
