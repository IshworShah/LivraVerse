using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStore_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AnnouncementEntityUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AnnouncementId",
                table: "Books",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Books_AnnouncementId",
                table: "Books",
                column: "AnnouncementId");

            migrationBuilder.AddForeignKey(
                name: "FK_Books_Announcements_AnnouncementId",
                table: "Books",
                column: "AnnouncementId",
                principalTable: "Announcements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Books_Announcements_AnnouncementId",
                table: "Books");

            migrationBuilder.DropIndex(
                name: "IX_Books_AnnouncementId",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "AnnouncementId",
                table: "Books");
        }
    }
}
