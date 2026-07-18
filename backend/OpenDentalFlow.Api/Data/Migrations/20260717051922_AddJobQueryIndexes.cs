using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OpenDentalFlow.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJobQueryIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Jobs_CreatedAt",
                table: "Jobs",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_DueDate",
                table: "Jobs",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_Status",
                table: "Jobs",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Jobs_CreatedAt",
                table: "Jobs");

            migrationBuilder.DropIndex(
                name: "IX_Jobs_DueDate",
                table: "Jobs");

            migrationBuilder.DropIndex(
                name: "IX_Jobs_Status",
                table: "Jobs");
        }
    }
}
