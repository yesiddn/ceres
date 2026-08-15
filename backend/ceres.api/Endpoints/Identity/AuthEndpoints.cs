using ceres.api.Contracts.Common;
using ceres.application.Identity.DTOs;
using ceres.application.Identity.Enums;
using ceres.application.Identity.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ceres.api.Endpoints.Identity;

public static class AuthEndpoints
{
    private const string RefreshTokenCookieName = "ceres.refreshToken";
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

        auth.MapPost("/refresh", RefreshAsync)
            .WithName("Refresh")
            .Produces<AuthResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithSummary("Refreshes the authentication session")
            .WithDescription("Rotates the refresh token and returns a new access token");

        auth.MapPost("/logout", LogoutAsync)
            .AllowAnonymous()
            .WithName("Logout")
            .Produces(StatusCodes.Status204NoContent)
            .WithSummary("Logs out the current session")
            .WithDescription("Revokes the refresh token and removes its cookie");

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
            HttpResponse response,
            IWebHostEnvironment environment,
            CancellationToken cancellationToken
        )
    {
        var result = await authService.LoginAsync(request, cancellationToken);

        if (result.Status == LoginStatus.InvalidCredentials)
        {
            return TypedResults.Unauthorized();
        }

        if (result.Status != LoginStatus.Success)
        {
            throw new InvalidOperationException($"Unknown login status: {result.Status}");
        }

        AppendRefreshTokenCookie(
            response,
            result.RefreshToken!,
            environment.IsDevelopment());

        return TypedResults.Ok(result.Auth);
    }

    private static async Task<Results<
            Ok<AuthResponse>,
            UnauthorizedHttpResult>>
        RefreshAsync(
            HttpRequest request,
            HttpResponse response,
            IAuthService authService,
            IWebHostEnvironment environment,
            CancellationToken cancellationToken)
    {
        if (!request.Cookies.TryGetValue(
                RefreshTokenCookieName,
                out var refreshToken) ||
            string.IsNullOrWhiteSpace(refreshToken))
        {
            DeleteRefreshTokenCookie(response);

            return TypedResults.Unauthorized();
        }

        var result =
            await authService.RefreshAsync(
                refreshToken,
                cancellationToken);

        if (result.Status ==
            RefreshStatus.InvalidToken)
        {
            DeleteRefreshTokenCookie(response);

            return TypedResults.Unauthorized();
        }

        if (result.Status !=
            RefreshStatus.Success)
        {
            throw new InvalidOperationException(
                $"Unknown refresh status: {result.Status}");
        }

        AppendRefreshTokenCookie(
            response,
            result.IssuedRefreshToken!,
            environment.IsDevelopment());

        return TypedResults.Ok(
            result.Auth!);
    }

    private static async Task<NoContent> LogoutAsync(
        HttpRequest request,
        HttpResponse response,
        IAuthService authService,
        CancellationToken cancellationToken)
    {
        request.Cookies.TryGetValue(
            RefreshTokenCookieName,
            out var refreshToken);

        await authService.LogoutAsync(
            refreshToken,
            cancellationToken);

        DeleteRefreshTokenCookie(response);

        return TypedResults.NoContent();
    }

    private static void AppendRefreshTokenCookie(
        HttpResponse response,
        IssuedRefreshToken refreshToken,
        bool isDevelopment)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = !isDevelopment,
            SameSite = SameSiteMode.Lax,
            Expires = new DateTimeOffset(
                refreshToken.ExpiresAt),
            Path = "/api/auth"
        };

        response.Cookies.Append(
            RefreshTokenCookieName,
            refreshToken.Value,
            cookieOptions);
    }

    private static void DeleteRefreshTokenCookie(
        HttpResponse response)
    {
        response.Cookies.Delete(
            RefreshTokenCookieName,
            new CookieOptions
            {
                Path = "/api/auth"
            });
    }
}
