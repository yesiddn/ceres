using ceres.domain.Gym.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ceres.infrastructure.persistence.Configurations.Gym;

public class RoutineConfiguration : IEntityTypeConfiguration<Routine>
{
    public void Configure(EntityTypeBuilder<Routine> builder)
    {
        builder.ToTable("Routines", "gym");

        builder.HasKey(routine => routine.Id);

        builder.Property(routine => routine.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(routine => routine.ScheduledDays)
            .HasConversion<int>();

        builder.HasOne(routine => routine.User)
            .WithMany()
            .HasForeignKey(routine => routine.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(routine => routine.UserId)
            .HasDatabaseName("IX_Routines_UserId");
    }
}
