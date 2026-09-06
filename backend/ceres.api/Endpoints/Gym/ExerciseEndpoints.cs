using System.Security.Claims;
using ceres.api.Contracts.Common;
using ceres.application.Gym.Exercises.DTOs;
using ceres.application.Gym.Exercises.Enums;
using ceres.application.Gym.Exercises.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ceres.api.Endpoints.Gym;

public static class ExerciseEndpoints
{
    private const string UserIdClaimName = "UserId";

    public static RouteGroupBuilder MapExerciseEndpoints(this RouteGroupBuilder api)
{
    var exercises = api
        .MapGroup("/exercises")
        .WithTags("Exercises")
        .RequireAuthorization();

    exercises.MapGet("/", ListExercisesAsync)
        .WithName("ListExercises")
        .WithSummary("List exercises")
        .WithDescription(
            "Returns all exercises owned by the authenticated user.")
        .Produces<IReadOnlyList<ExerciseResponse>>(
            StatusCodes.Status200OK)
        .Produces(
            StatusCodes.Status401Unauthorized);

    exercises.MapGet("/{id:guid}", GetExerciseByIdAsync)
        .WithName("GetExerciseById")
        .WithSummary("Get an exercise")
        .WithDescription(
            "Returns a specific exercise owned by the authenticated user. " +
            "Returns 404 if the exercise does not exist or belongs to another user.")
        .Produces<ExerciseResponse>(
            StatusCodes.Status200OK)
        .Produces(
            StatusCodes.Status401Unauthorized)
        .Produces(
            StatusCodes.Status404NotFound);

    exercises.MapPost("/", CreateExerciseAsync)
        .WithName("CreateExercise")
        .WithSummary("Create an exercise")
        .WithDescription(
            "Creates a new exercise for the authenticated user. " +
            "The user identifier is obtained from the access token and cannot be supplied by the client.")
        .Accepts<ExerciseRequest>("application/json")
        .Produces<ExerciseResponse>(
            StatusCodes.Status201Created)
        .ProducesValidationProblem(
            StatusCodes.Status400BadRequest)
        .Produces(
            StatusCodes.Status401Unauthorized);

    exercises.MapPut("/{id:guid}", UpdateExerciseAsync)
        .WithName("UpdateExercise")
        .WithSummary("Update an exercise")
        .WithDescription(
            "Updates an exercise owned by the authenticated user. " +
            "Returns 404 if the exercise does not exist or belongs to another user.")
        .Accepts<ExerciseRequest>("application/json")
        .Produces<ExerciseResponse>(
            StatusCodes.Status200OK)
        .ProducesValidationProblem(
            StatusCodes.Status400BadRequest)
        .Produces(
            StatusCodes.Status401Unauthorized)
        .Produces(
            StatusCodes.Status404NotFound);

    exercises.MapDelete("/{id:guid}", DeleteExerciseAsync)
        .WithName("DeleteExercise")
        .WithSummary("Delete an exercise")
        .WithDescription(
            "Deletes an exercise owned by the authenticated user. " +
            "Returns 409 if the exercise is currently referenced by a routine.")
        .Produces(
            StatusCodes.Status204NoContent)
        .Produces(
            StatusCodes.Status401Unauthorized)
        .Produces(
            StatusCodes.Status404NotFound)
        .Produces<ErrorResponse>(
            StatusCodes.Status409Conflict);

    return api;
}

    private static async Task<
            Ok<IReadOnlyList<ExerciseResponse>>>
        ListExercisesAsync(
            ClaimsPrincipal user,
            IExerciseService exerciseService,
            CancellationToken cancellationToken)
    {
        var userId = GetUserId(user);

        var exercises =
            await exerciseService.ListAsync(
                userId,
                cancellationToken);

        return TypedResults.Ok(exercises);
    }

    private static async Task<
            Results<
                Ok<ExerciseResponse>,
                NotFound>>
        GetExerciseByIdAsync(
            Guid id,
            ClaimsPrincipal user,
            IExerciseService exerciseService,
            CancellationToken cancellationToken)
    {
        var userId = GetUserId(user);

        var result =
            await exerciseService.GetByIdAsync(
                userId,
                id,
                cancellationToken);

        return result.Status switch
        {
            ExerciseStatus.Success =>
                TypedResults.Ok(
                    result.Exercise!),

            ExerciseStatus.NotFound =>
                TypedResults.NotFound(),

            _ => throw new InvalidOperationException(
                $"Unexpected exercise status: {result.Status}")
        };
    }

    private static async Task<
            Created<ExerciseResponse>>
        CreateExerciseAsync(
            ExerciseRequest request,
            ClaimsPrincipal user,
            IExerciseService exerciseService,
            CancellationToken cancellationToken)
    {
        var userId = GetUserId(user);

        var result =
            await exerciseService.CreateAsync(
                userId,
                request,
                cancellationToken);

        if (result.Status != ExerciseStatus.Success ||
            result.Exercise is null)
        {
            throw new InvalidOperationException(
                $"Unexpected exercise status: {result.Status}");
        }

        return TypedResults.Created(
            $"/api/exercises/{result.Exercise.Id}",
            result.Exercise);
    }

    private static async Task<
            Results<
                Ok<ExerciseResponse>,
                NotFound>>
        UpdateExerciseAsync(
            Guid id,
            ExerciseRequest request,
            ClaimsPrincipal user,
            IExerciseService exerciseService,
            CancellationToken cancellationToken)
    {
        var userId = GetUserId(user);

        var result =
            await exerciseService.UpdateAsync(
                userId,
                id,
                request,
                cancellationToken);

        return result.Status switch
        {
            ExerciseStatus.Success =>
                TypedResults.Ok(
                    result.Exercise!),

            ExerciseStatus.NotFound =>
                TypedResults.NotFound(),

            _ => throw new InvalidOperationException(
                $"Unexpected exercise status: {result.Status}")
        };
    }

    private static async Task<
            Results<
                NoContent,
                NotFound,
                Conflict<ErrorResponse>>>
        DeleteExerciseAsync(
            Guid id,
            ClaimsPrincipal user,
            IExerciseService exerciseService,
            CancellationToken cancellationToken)
    {
        var userId = GetUserId(user);

        var result =
            await exerciseService.DeleteAsync(
                userId,
                id,
                cancellationToken);

        return result.Status switch
        {
            ExerciseStatus.Success =>
                TypedResults.NoContent(),

            ExerciseStatus.NotFound =>
                TypedResults.NotFound(),

            ExerciseStatus.InUse =>
                TypedResults.Conflict(
                    new ErrorResponse(
                        "Exercise cannot be deleted because it is used by a routine.")),

            _ => throw new InvalidOperationException(
                $"Unexpected exercise status: {result.Status}")
        };
    }

    private static Guid GetUserId(
        ClaimsPrincipal user)
    {
        var value = user.FindFirstValue(
            UserIdClaimName);

        if (!Guid.TryParse(value, out var userId))
        {
            throw new InvalidOperationException(
                "Authenticated user does not contain a valid UserId claim.");
        }

        return userId;
    }
}
