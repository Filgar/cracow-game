using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace Inzynierka.Migrations
{
    /// <inheritdoc />
    public partial class _3fixtypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Districts",
                type: "text",
                nullable: false,
                oldClrType: typeof(Geometry),
                oldType: "geometry");

            migrationBuilder.AlterColumn<Geometry>(
                name: "Geom",
                table: "Districts",
                type: "geometry",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Geometry>(
                name: "Name",
                table: "Districts",
                type: "geometry",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Geom",
                table: "Districts",
                type: "text",
                nullable: false,
                oldClrType: typeof(Geometry),
                oldType: "geometry");
        }
    }
}
