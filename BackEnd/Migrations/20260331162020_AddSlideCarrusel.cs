using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class AddSlideCarrusel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SlidesCarrusel",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UrlImagen = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Titulo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Subtitulo = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    AnimacionEntrada = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    EstiloTransicion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TiempoPermanencia = table.Column<int>(type: "int", nullable: false),
                    Orden = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SlidesCarrusel", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SlidesCarrusel");
        }
    }
}
