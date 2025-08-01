using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStore_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedCreateAddfieldinWishlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookMarks_Books_BookId",
                table: "BookMarks");

            migrationBuilder.DropForeignKey(
                name: "FK_BookMarks_Users_UserId",
                table: "BookMarks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BookMarks",
                table: "BookMarks");

            migrationBuilder.RenameTable(
                name: "BookMarks",
                newName: "WishLists");

            migrationBuilder.RenameIndex(
                name: "IX_BookMarks_UserId",
                table: "WishLists",
                newName: "IX_WishLists_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_BookMarks_BookId",
                table: "WishLists",
                newName: "IX_WishLists_BookId");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "WishLists",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_WishLists",
                table: "WishLists",
                column: "Bookmark_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WishLists_Books_BookId",
                table: "WishLists",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Book_Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WishLists_Users_UserId",
                table: "WishLists",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WishLists_Books_BookId",
                table: "WishLists");

            migrationBuilder.DropForeignKey(
                name: "FK_WishLists_Users_UserId",
                table: "WishLists");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WishLists",
                table: "WishLists");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "WishLists");

            migrationBuilder.RenameTable(
                name: "WishLists",
                newName: "BookMarks");

            migrationBuilder.RenameIndex(
                name: "IX_WishLists_UserId",
                table: "BookMarks",
                newName: "IX_BookMarks_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_WishLists_BookId",
                table: "BookMarks",
                newName: "IX_BookMarks_BookId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BookMarks",
                table: "BookMarks",
                column: "Bookmark_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BookMarks_Books_BookId",
                table: "BookMarks",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Book_Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BookMarks_Users_UserId",
                table: "BookMarks",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
