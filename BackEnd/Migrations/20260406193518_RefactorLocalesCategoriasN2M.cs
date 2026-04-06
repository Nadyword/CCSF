using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class RefactorLocalesCategoriasN2M : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Eventos_Locales_LocalId",
                table: "Eventos");

            migrationBuilder.DropIndex(
                name: "IX_Eventos_LocalId",
                table: "Eventos");

            migrationBuilder.DropColumn(
                name: "Categoria",
                table: "Locales");

            migrationBuilder.DropColumn(
                name: "LocalId",
                table: "Eventos");

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Categorias",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "LocalCategorias",
                columns: table => new
                {
                    LocalId = table.Column<int>(type: "int", nullable: false),
                    CategoriaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocalCategorias", x => new { x.LocalId, x.CategoriaId });
                    table.ForeignKey(
                        name: "FK_LocalCategorias_Categorias_CategoriaId",
                        column: x => x.CategoriaId,
                        principalTable: "Categorias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LocalCategorias_Locales_LocalId",
                        column: x => x.LocalId,
                        principalTable: "Locales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LocalCategorias_CategoriaId",
                table: "LocalCategorias",
                column: "CategoriaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LocalCategorias");

            migrationBuilder.DropColumn(
                name: "Color",
                table: "Categorias");

            migrationBuilder.AddColumn<string>(
                name: "Categoria",
                table: "Locales",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "LocalId",
                table: "Eventos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Eventos_LocalId",
                table: "Eventos",
                column: "LocalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Eventos_Locales_LocalId",
                table: "Eventos",
                column: "LocalId",
                principalTable: "Locales",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
