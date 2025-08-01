using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStore_Backend.Migrations
{
    /// <inheritdoc />
    public partial class discountamountaddedtocartitems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "discountAmount",
                table: "CartItems",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "discountAmount",
                table: "CartItems");
        }
    }
}
