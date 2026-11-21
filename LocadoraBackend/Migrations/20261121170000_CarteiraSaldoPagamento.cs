using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LocadoraBackend.Migrations
{
    /// <inheritdoc />
    public partial class CarteiraSaldoPagamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Saldo",
                table: "Clientes",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "Pago",
                table: "Alugueis",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataPagamento",
                table: "Alugueis",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Saldo",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "Pago",
                table: "Alugueis");

            migrationBuilder.DropColumn(
                name: "DataPagamento",
                table: "Alugueis");
        }
    }
}