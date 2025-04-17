using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace incident_service.Migrations
{
    /// <inheritdoc />
    public partial class RemoveLikeAndDislike : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Dislike",
                table: "Incident");

            migrationBuilder.DropColumn(
                name: "Like",
                table: "Incident");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "UserIncidentVotes",
                type: "char(36)",
                nullable: false,
                collation: "ascii_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "UserIncidentVotes",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AddColumn<int>(
                name: "Dislike",
                table: "Incident",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Like",
                table: "Incident",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
