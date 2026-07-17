using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OpenDentalFlow.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyJobStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Old workflow values 0-5/7 represented internal production stages.
            // Delivered (6) and cancelled (8) are closed/outgoing work; everything else stays in the lab.
            migrationBuilder.Sql("UPDATE Jobs SET Status = CASE WHEN Status IN (6, 8) THEN 1 ELSE 0 END;");
            migrationBuilder.Sql("UPDATE JobStatusHistory SET OldStatus = CASE WHEN OldStatus IN (6, 8) THEN 1 ELSE 0 END, NewStatus = CASE WHEN NewStatus IN (6, 8) THEN 1 ELSE 0 END;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE Jobs SET Status = CASE WHEN Status = 1 THEN 6 ELSE 0 END;");
            migrationBuilder.Sql("UPDATE JobStatusHistory SET OldStatus = CASE WHEN OldStatus = 1 THEN 6 ELSE 0 END, NewStatus = CASE WHEN NewStatus = 1 THEN 6 ELSE 0 END;");
        }
    }
}
