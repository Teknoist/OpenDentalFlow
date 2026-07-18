using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OpenDentalFlow.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPhotoThumbnails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThumbnailStoredFileName",
                table: "JobPhotos",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThumbnailStoredFileName",
                table: "JobPhotos");
        }
    }
}
