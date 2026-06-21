using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BackEnd.Data;

/// <summary>
/// Usada por las herramientas de EF Core (dotnet ef migrations / database update)
/// para construir el contexto en tiempo de diseño.
/// Muestra la cadena de conexión activa en la consola.
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        // Carga la configuración respetando el entorno activo (ASPNETCORE_ENVIRONMENT)
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development" ? "appsettings.Development.json" : "appsettings.json";

        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile(environment, optional: false)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = config.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "No se encontró 'DefaultConnection' en appsettings.json.");

        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("─────────────────────────────────────────────────");
        Console.WriteLine($"  Entorno        : {environment}");
        Console.WriteLine($"  Cadena activa  : {connectionString}");
        Console.WriteLine("─────────────────────────────────────────────────");
        Console.ResetColor();

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new AppDbContext(optionsBuilder.Options);
    }
}