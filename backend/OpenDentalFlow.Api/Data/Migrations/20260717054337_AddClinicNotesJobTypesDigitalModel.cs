using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OpenDentalFlow.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddClinicNotesJobTypesDigitalModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DigitalModelRequired",
                table: "Jobs",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Clinics",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "JobTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    DefaultMaterial = table.Column<string>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobTypes_Name",
                table: "JobTypes",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobTypes");

            migrationBuilder.DropColumn(
                name: "DigitalModelRequired",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Clinics");
        }
    }
}
