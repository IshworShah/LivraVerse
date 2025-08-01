using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStore_Backend.Migrations
{
    /// <inheritdoc />
    public partial class newpass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("01111111-2222-3333-4444-555555555555"),
                column: "PasswordHash",
                value: "Ishwor321#");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("02222222-2222-3555-4444-555555555555"),
                column: "PasswordHash",
                value: "Ishwor321#");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("01111111-2222-3333-4444-555555555555"),
                column: "PasswordHash",
                value: "$2a$12$123456789012345678901uSzbb.45xjqbUhGhVY90FzYEX3zQOfWS");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("02222222-2222-3555-4444-555555555555"),
                column: "PasswordHash",
                value: "$2a$12$123456789012345678901uSzbb.45xjqbUhGhVY90FzYEX3zQOfWS");
        }
    }
}
