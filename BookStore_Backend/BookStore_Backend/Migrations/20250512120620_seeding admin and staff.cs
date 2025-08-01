using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BookStore_Backend.Migrations
{
    /// <inheritdoc />
    public partial class seedingadminandstaff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WishLists_Users_UserId",
                table: "WishLists");

            migrationBuilder.DropIndex(
                name: "IX_WishLists_BookId",
                table: "WishLists");

            migrationBuilder.DropIndex(
                name: "IX_WishLists_UserId",
                table: "WishLists");

            migrationBuilder.DropIndex(
                name: "IX_CartItems_BookId",
                table: "CartItems");

            migrationBuilder.AddColumn<Guid>(
                name: "Book_Id",
                table: "Reviews",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CartId1",
                table: "CartItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Carts",
                columns: new[] { "Id", "DiscountPercentage", "DiscountedPrice", "TotalPrice" },
                values: new object[,]
                {
                    { new Guid("01111111-3333-2222-9999-555555555555"), 0.0, 0.0, 0.0 },
                    { new Guid("01111111-5555-8888-9999-555555555555"), 0.0, 0.0, 0.0 }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CartId", "Email", "OrderCount", "PasswordHash", "ProfileImage", "Role", "Username" },
                values: new object[,]
                {
                    { new Guid("01111111-2222-3333-4444-555555555555"), new Guid("01111111-5555-8888-9999-555555555555"), "admin@gmail.com", 0, "$2a$12$123456789012345678901uSzbb.45xjqbUhGhVY90FzYEX3zQOfWS", "", "Admin", "Admin" },
                    { new Guid("02222222-2222-3555-4444-555555555555"), new Guid("01111111-3333-2222-9999-555555555555"), "staff@gmail.com", 0, "$2a$12$123456789012345678901uSzbb.45xjqbUhGhVY90FzYEX3zQOfWS", "", "Staff", "Staff" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_WishLists_BookId",
                table: "WishLists",
                column: "BookId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_Book_Id",
                table: "Reviews",
                column: "Book_Id");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_BookId",
                table: "CartItems",
                column: "BookId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_CartId1",
                table: "CartItems",
                column: "CartId1");

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Carts_CartId1",
                table: "CartItems",
                column: "CartId1",
                principalTable: "Carts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Books_Book_Id",
                table: "Reviews",
                column: "Book_Id",
                principalTable: "Books",
                principalColumn: "Book_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WishLists_Users_Bookmark_Id",
                table: "WishLists",
                column: "Bookmark_Id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Carts_CartId1",
                table: "CartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Books_Book_Id",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_WishLists_Users_Bookmark_Id",
                table: "WishLists");

            migrationBuilder.DropIndex(
                name: "IX_WishLists_BookId",
                table: "WishLists");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_Book_Id",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_CartItems_BookId",
                table: "CartItems");

            migrationBuilder.DropIndex(
                name: "IX_CartItems_CartId1",
                table: "CartItems");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("01111111-2222-3333-4444-555555555555"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("02222222-2222-3555-4444-555555555555"));

            migrationBuilder.DeleteData(
                table: "Carts",
                keyColumn: "Id",
                keyValue: new Guid("01111111-3333-2222-9999-555555555555"));

            migrationBuilder.DeleteData(
                table: "Carts",
                keyColumn: "Id",
                keyValue: new Guid("01111111-5555-8888-9999-555555555555"));

            migrationBuilder.DropColumn(
                name: "Book_Id",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "CartId1",
                table: "CartItems");

            migrationBuilder.CreateIndex(
                name: "IX_WishLists_BookId",
                table: "WishLists",
                column: "BookId");

            migrationBuilder.CreateIndex(
                name: "IX_WishLists_UserId",
                table: "WishLists",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_BookId",
                table: "CartItems",
                column: "BookId");

            migrationBuilder.AddForeignKey(
                name: "FK_WishLists_Users_UserId",
                table: "WishLists",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
