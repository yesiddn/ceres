using Microsoft.EntityFrameworkCore;

namespace ceres.infrastructure.persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options);
