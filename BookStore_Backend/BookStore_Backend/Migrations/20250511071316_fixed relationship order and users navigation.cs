using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStore_Backend.Migrations
{
    /// <inheritdoc />
    public partial class fixedrelationshiporderandusersnavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_Order_Order_Id1",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_Order_Id1",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Order_Id1",
                table: "Order");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "Order_Id1",
                table: "Order",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Order_Order_Id1",
                table: "Order",
                column: "Order_Id1");

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Order_Order_Id1",
                table: "Order",
                column: "Order_Id1",
                principalTable: "Order",
                principalColumn: "Order_Id");
        }
    }
}
