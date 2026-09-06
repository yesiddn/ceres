using ceres.api.OpenApi;
using Scalar.AspNetCore;

namespace ceres.api.Extensions;

public static class OpenApiExtensions
{
    public static IServiceCollection AddOpenApiDocumentation(this IServiceCollection services)
    {
        services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer((document, context, cancellationToken) =>
            {
                document.Info = new()
                {
                    Title = "Ceres API",
                    Version = "v1",
                    Description = "API documentation for Ceres."
                };

                return Task.CompletedTask;
            });

            options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();

            options.AddOperationTransformer<BearerSecurityRequirementTransformer>();
        });
        return services;
    }

    public static IEndpointRouteBuilder MapOpenApiDocumentation(this IEndpointRouteBuilder app)
    {
        app.MapOpenApi();

        app.MapScalarApiReference(options =>
        {
            options.WithTitle("Ceres API");
        });

        return app;
    }
}
