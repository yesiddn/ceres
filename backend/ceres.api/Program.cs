using System.Text;
using ceres.api.Endpoints.HealthCheck;
using ceres.api.Endpoints.Identity;
using ceres.api.Exceptions;
using ceres.api.Extensions;
using ceres.application.Identity.Options;
using Microsoft.EntityFrameworkCore;
using ceres.infrastructure.persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

const string allowCeresOrigin = "AllowCeresOrigin";
var ceresOrigin = builder.Configuration.GetRequiredSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

if (ceresOrigin.Length == 0 || ceresOrigin.Any(string.IsNullOrWhiteSpace))
{
    throw new InvalidOperationException("Cors:AllowedOrigins configuration is missing or is empty");
}

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddOpenApiDocumentation();

builder.Services
    .AddOptions<JwtOptions>()
    .Bind(builder.Configuration.GetRequiredSection(JwtOptions.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

var jwtOptions = builder.Configuration
                     .GetRequiredSection(JwtOptions.SectionName)
                     .Get<JwtOptions>()!
                 ?? throw new InvalidOperationException("Jwt configuration is missing.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SecretKey)),
            ClockSkew = TimeSpan.Zero
        };
    });
builder.Services.AddAuthorization();

// Obtener el connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Registrar el DbContext de PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// DI
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowCeresOrigin, policy =>
    {
        policy.WithOrigins(ceresOrigin).AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddValidation();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApiDocumentation();
}

app.UseHttpsRedirection();

app.UseCors(allowCeresOrigin);

var api = app.MapGroup("/api");

api.MapHealthEndpoints();
api.MapAuthEndpoints();

app.Run();
