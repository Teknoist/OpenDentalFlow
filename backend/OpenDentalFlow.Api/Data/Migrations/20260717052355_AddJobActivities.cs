using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OpenDentalFlow.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJobActivities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "JobActivities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    JobId = table.Column<int>(type: "INTEGER", nullable: false),
                    StepType = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "INTEGER", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobActivities_Jobs_JobId",
                        column: x => x.JobId,
                        principalTable: "Jobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Patients_ClinicId_FirstName_LastName",
                table: "Patients",
                columns: new[] { "ClinicId", "FirstName", "LastName" });

            migrationBuilder.CreateIndex(
                name: "IX_JobActivities_JobId_CreatedAt",
                table: "JobActivities",
                columns: new[] { "JobId", "CreatedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobActivities");

            migrationBuilder.DropIndex(
                name: "IX_Patients_ClinicId_FirstName_LastName",
                table: "Patients");
        }
    }
}
