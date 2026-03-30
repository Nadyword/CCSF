using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data;

/// <summary>
/// Contexto principal de Entity Framework Core.
/// Gestiona las tablas Locales y Eventos en la base de datos.
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Local> Locales => Set<Local>();
    public DbSet<Evento> Eventos => Set<Evento>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- Configuración de Local ---
        modelBuilder.Entity<Local>(entity =>
        {
            entity.HasKey(l => l.Id);
            entity.Property(l => l.Nombre).IsRequired().HasMaxLength(150);
            entity.Property(l => l.NumeroLocal).IsRequired().HasMaxLength(20);
            entity.Property(l => l.Nivel).IsRequired().HasMaxLength(50);
            entity.Property(l => l.Categoria).IsRequired().HasMaxLength(100);
            entity.Property(l => l.Horario).IsRequired().HasMaxLength(200);
            entity.Property(l => l.Descripcion).HasMaxLength(1000);
            entity.Property(l => l.Telefono).HasMaxLength(30);
            entity.Property(l => l.UrlFoto).HasMaxLength(500);
        });

        // --- Configuración de Evento ---
        modelBuilder.Entity<Evento>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Titulo).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Descripcion).HasMaxLength(2000);
            entity.Property(e => e.UrlImagen).HasMaxLength(500);
            entity.Property(e => e.Lugar).HasMaxLength(300);

            // Relación opcional: Evento → Local (N:1, LocalId nullable)
            entity.HasOne(e => e.Local)
                  .WithMany(l => l.Eventos)
                  .HasForeignKey(e => e.LocalId)
                  .OnDelete(DeleteBehavior.SetNull) // Si se borra el local, el evento queda sin local
                  .IsRequired(false);
        });
    }
}
