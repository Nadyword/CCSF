using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class AddPerfilCarrusel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PerfilId",
                table: "SlidesCarrusel",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PerfilesCarrusel",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PerfilesCarrusel", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SlidesCarrusel_PerfilId",
                table: "SlidesCarrusel",
                column: "PerfilId");

            migrationBuilder.AddForeignKey(
                name: "FK_SlidesCarrusel_PerfilesCarrusel_PerfilId",
                table: "SlidesCarrusel",
                column: "PerfilId",
                principalTable: "PerfilesCarrusel",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SlidesCarrusel_PerfilesCarrusel_PerfilId",
                table: "SlidesCarrusel");

            migrationBuilder.DropTable(
                name: "PerfilesCarrusel");

            migrationBuilder.DropIndex(
                name: "IX_SlidesCarrusel_PerfilId",
                table: "SlidesCarrusel");

            migrationBuilder.DropColumn(
                name: "PerfilId",
                table: "SlidesCarrusel");
        }
    }
}
