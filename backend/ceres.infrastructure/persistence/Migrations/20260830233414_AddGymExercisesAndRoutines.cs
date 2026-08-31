using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ceres.infrastructure.persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddGymExercisesAndRoutines : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "gym");

            migrationBuilder.CreateTable(
                name: "Exercises",
                schema: "gym",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    MuscleGroup = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exercises", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Exercises_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "identity",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Routines",
                schema: "gym",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ScheduledDays = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Routines_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "identity",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoutineExercises",
                schema: "gym",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    GroupId = table.Column<Guid>(type: "uuid", nullable: true),
                    TargetSets = table.Column<int>(type: "integer", nullable: false),
                    TargetReps = table.Column<int>(type: "integer", nullable: false),
                    RestTimeSeconds = table.Column<int>(type: "integer", nullable: false),
                    RoutineId = table.Column<Guid>(type: "uuid", nullable: false),
                    ExerciseId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoutineExercises", x => x.Id);
                    table.CheckConstraint("CK_RoutineExercises_Order", "\"Order\" >= 1");
                    table.CheckConstraint("CK_RoutineExercises_RestTimeSeconds", "\"RestTimeSeconds\" >= 0");
                    table.CheckConstraint("CK_RoutineExercises_TargetReps", "\"TargetReps\" >= 1");
                    table.CheckConstraint("CK_RoutineExercises_TargetSets", "\"TargetSets\" >= 1");
                    table.ForeignKey(
                        name: "FK_RoutineExercises_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalSchema: "gym",
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RoutineExercises_Routines_RoutineId",
                        column: x => x.RoutineId,
                        principalSchema: "gym",
                        principalTable: "Routines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_UserId",
                schema: "gym",
                table: "Exercises",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_RoutineExercises_ExerciseId",
                schema: "gym",
                table: "RoutineExercises",
                column: "ExerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_RoutineExercises_RoutineId_Order",
                schema: "gym",
                table: "RoutineExercises",
                columns: new[] { "RoutineId", "Order" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Routines_UserId",
                schema: "gym",
                table: "Routines",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoutineExercises",
                schema: "gym");

            migrationBuilder.DropTable(
                name: "Exercises",
                schema: "gym");

            migrationBuilder.DropTable(
                name: "Routines",
                schema: "gym");
        }
    }
}
