using ceres.domain.Gym.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ceres.infrastructure.persistence.Configurations.Gym;

public class RoutineExerciseConfiguration
    : IEntityTypeConfiguration<RoutineExercise>
{
    public void Configure(EntityTypeBuilder<RoutineExercise> builder)
    {
        builder.ToTable(
            "RoutineExercises",
            "gym",
            tableBuilder =>
            {
                tableBuilder.HasCheckConstraint(
                    "CK_RoutineExercises_Order",
                    "\"Order\" >= 1");

                tableBuilder.HasCheckConstraint(
                    "CK_RoutineExercises_TargetSets",
                    "\"TargetSets\" >= 1");

                tableBuilder.HasCheckConstraint(
                    "CK_RoutineExercises_TargetReps",
                    "\"TargetReps\" >= 1");

                tableBuilder.HasCheckConstraint(
                    "CK_RoutineExercises_RestTimeSeconds",
                    "\"RestTimeSeconds\" >= 0");
            });

        builder.HasKey(routineExercise => routineExercise.Id);

        builder.HasOne(routineExercise => routineExercise.Routine)
            .WithMany(routine => routine.Exercises)
            .HasForeignKey(routineExercise => routineExercise.RoutineId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(routineExercise => routineExercise.Exercise)
            .WithMany()
            .HasForeignKey(routineExercise => routineExercise.ExerciseId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(routineExercise => new
            {
                routineExercise.RoutineId,
                routineExercise.Order
            })
            .IsUnique()
            .HasDatabaseName("IX_RoutineExercises_RoutineId_Order");

        builder.HasIndex(routineExercise => routineExercise.ExerciseId)
            .HasDatabaseName("IX_RoutineExercises_ExerciseId");
    }
}
