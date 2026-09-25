using System.Security.Claims;
using ceres.api.Contracts.Common;
using ceres.api.Extensions;
using ceres.application.Gym.Routines.DTOs;
using ceres.application.Gym.Routines.Enums;
using ceres.application.Gym.Routines.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ceres.api.Endpoints.Gym;

public static class RoutineEndpoints
{
    public static RouteGroupBuilder MapRoutineEndpoints(this RouteGroupBuilder api)
    {
        var routines = api
            .MapGroup("/routines")
            .WithTags("Routines")
            .RequireAuthorization();

        routines.MapGet("/", ListRoutinesAsync)
            .WithName("ListRoutines")
            .WithSummary("List routines")
            .WithDescription(
                "Returns all routines owned by the authenticated user.")
            .Produces<IReadOnlyList<RoutineListItemResponse>>(
                StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized);

        routines.MapGet("/{id:guid}", GetRoutineByIdAsync)
            .WithName("GetRoutineById")
            .WithSummary("Get a routine")
            .WithDescription(
                "Returns a routine owned by the authenticated user.")
            .Produces<RoutineResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound);

        routines.MapPost("/", CreateRoutineAsync)
            .WithName("CreateRoutine")
            .WithSummary("Create a routine")
            .WithDescription(
                "Creates a routine with its complete exercise configuration.")
            .Accepts<RoutineRequest>("application/json")
            .Produces<RoutineResponse>(StatusCodes.Status201Created)
            .ProducesValidationProblem(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces<ErrorResponse>(
                StatusCodes.Status400BadRequest);

        routines.MapPut("/{id:guid}", UpdateRoutineAsync)
            .WithName("UpdateRoutine")
            .WithSummary("Update a routine")
            .WithDescription(
                "Replaces a routine's metadata and exercise configuration.")
            .Accepts<RoutineRequest>("application/json")
            .Produces<RoutineResponse>(StatusCodes.Status200OK)
            .ProducesValidationProblem(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound)
            .Produces<ErrorResponse>(
                StatusCodes.Status400BadRequest);

        routines.MapDelete("/{id:guid}", DeleteRoutineAsync)
            .WithName("DeleteRoutine")
            .WithSummary("Delete a routine")
            .WithDescription(
                "Deletes a routine owned by the authenticated user.")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound);

        return api;
    }

    private static async Task<Ok<IReadOnlyList<RoutineListItemResponse>>>
        ListRoutinesAsync(
            ClaimsPrincipal user,
            IRoutineService routineService,
            CancellationToken cancellationToken)
    {
        var userId = user.GetUserId();

        var routines = await routineService.ListAsync(
            userId,
            cancellationToken);

        return TypedResults.Ok(routines);
    }

    private static async Task<
            Results<Ok<RoutineResponse>, NotFound>>
        GetRoutineByIdAsync(
            Guid id,
            ClaimsPrincipal user,
            IRoutineService routineService,
            CancellationToken cancellationToken)
    {
        var userId = user.GetUserId();

        var result = await routineService.GetByIdAsync(
            userId,
            id,
            cancellationToken);

        return result.Status switch
        {
            RoutineStatus.Success =>
                TypedResults.Ok(result.Routine!),

            RoutineStatus.NotFound =>
                TypedResults.NotFound(),

            _ => throw new InvalidOperationException(
                $"Unexpected routine status: {result.Status}")
        };
    }

    private static async Task<
            Results<Created<RoutineResponse>, BadRequest<ErrorResponse>>>
        CreateRoutineAsync(
            RoutineRequest request,
            ClaimsPrincipal user,
            IRoutineService routineService,
            CancellationToken cancellationToken)
    {
        var userId = user.GetUserId();

        var result = await routineService.CreateAsync(
            userId,
            request,
            cancellationToken);

        return result.Status switch
        {
            RoutineStatus.Success when result.Routine is not null =>
                TypedResults.Created(
                    $"/api/routines/{result.Routine.Id}",
                    result.Routine),

            RoutineStatus.InaccessibleExercise =>
                TypedResults.BadRequest(
                    new ErrorResponse(
                        "One or more exercises are invalid or unavailable.")),

            RoutineStatus.InvalidConfiguration =>
                TypedResults.BadRequest(
                    new ErrorResponse(
                        "Routine contains duplicate exercise IDs or orders.")),

            _ => throw new InvalidOperationException(
                $"Unexpected routine status: {result.Status}")
        };
    }

    private static async Task<
            Results<Ok<RoutineResponse>, NotFound, BadRequest<ErrorResponse>>>
        UpdateRoutineAsync(
            Guid id,
            RoutineRequest request,
            ClaimsPrincipal user,
            IRoutineService routineService,
            CancellationToken cancellationToken)
    {
        var userId = user.GetUserId();

        var result = await routineService.UpdateAsync(
            userId,
            id,
            request,
            cancellationToken);

        return result.Status switch
        {
            RoutineStatus.Success when result.Routine is not null =>
                TypedResults.Ok(result.Routine),

            RoutineStatus.NotFound =>
                TypedResults.NotFound(),

            RoutineStatus.InaccessibleExercise =>
                TypedResults.BadRequest(
                    new ErrorResponse(
                        "One or more exercises are invalid or unavailable.")),

            RoutineStatus.InvalidConfiguration =>
                TypedResults.BadRequest(
                    new ErrorResponse(
                        "Routine contains duplicate exercise IDs or orders.")),

            _ => throw new InvalidOperationException(
                $"Unexpected routine status: {result.Status}")
        };
    }

    private static async Task<
            Results<NoContent, NotFound>>
        DeleteRoutineAsync(
            Guid id,
            ClaimsPrincipal user,
            IRoutineService routineService,
            CancellationToken cancellationToken)
    {
        var userId = user.GetUserId();

        var result = await routineService.DeleteAsync(
            userId,
            id,
            cancellationToken);

        return result.Status switch
        {
            RoutineStatus.Success =>
                TypedResults.NoContent(),

            RoutineStatus.NotFound =>
                TypedResults.NotFound(),

            _ => throw new InvalidOperationException(
                $"Unexpected routine status: {result.Status}")
        };
    }

}
