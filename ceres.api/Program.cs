using ceres.api.Endpoints;
using ceres.api.Extensions;
using Microsoft.EntityFrameworkCore;
using ceres.infrastructure.persistence;

var builder = WebApplication.CreateBuilder(args);

const string allowCeresOrigin = "AllowCeresOrigin";
var ceresOrigin = builder.Configuration.GetRequiredSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

if (ceresOrigin.Length == 0 || ceresOrigin.Any(string.IsNullOrWhiteSpace))
{
    throw new InvalidOperationException("Cors:AllowedOrigins configuration is missing or is empty");
}

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApiDocumentation();

// Obtener el connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Registrar el DbContext de PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// DI
builder.Services.AddApplicationServices();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowCeresOrigin, policy =>
    {
        policy.WithOrigins(ceresOrigin).AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApiDocumentation();
}

app.UseHttpsRedirection();

app.UseCors(allowCeresOrigin);

var api = app.MapGroup("/api");

api.MapHealthEndpoints();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
    {
        var forecast = Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast
                (
                    DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    Random.Shared.Next(-20, 55),
                    summaries[Random.Shared.Next(summaries.Length)]
                ))
            .ToArray();
        return forecast;
    })
    .WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
