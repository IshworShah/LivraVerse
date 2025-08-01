using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStore_Backend.Migrations
{
    /// <inheritdoc />
    public partial class addedlanguagecolumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "languages",
                table: "Books",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "languages",
                table: "Books");
        }
    }
}
