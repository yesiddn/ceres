using ceres.domain.Gym.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ceres.infrastructure.persistence.Configurations.Gym;

public class ExerciseConfiguration : IEntityTypeConfiguration<Exercise>
{
    public void Configure(EntityTypeBuilder<Exercise> builder)
    {
        builder.ToTable("Exercises", "gym");

        builder.HasKey(exercise => exercise.Id);

        builder.Property(exercise => exercise.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(exercise => exercise.MuscleGroup)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasOne(exercise => exercise.User)
            .WithMany()
            .HasForeignKey(exercise => exercise.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(exercise => exercise.UserId)
            .HasDatabaseName("IX_Exercises_UserId");
    }
}
