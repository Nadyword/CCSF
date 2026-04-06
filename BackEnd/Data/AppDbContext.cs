using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Local> Locales => Set<Local>();
    public DbSet<Evento> Eventos => Set<Evento>();
    public DbSet<PerfilCarrusel> PerfilesCarrusel => Set<PerfilCarrusel>();
    public DbSet<SlideCarrusel> SlidesCarrusel => Set<SlideCarrusel>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<LocalCategoria> LocalCategorias => Set<LocalCategoria>();

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
            entity.Property(l => l.Horario).IsRequired().HasMaxLength(200);
            entity.Property(l => l.Descripcion).HasMaxLength(1000);
            entity.Property(l => l.Telefono).HasMaxLength(30);
            entity.Property(l => l.UrlFoto).HasMaxLength(500);
        });

        // --- Configuración de LocalCategoria (tabla intermedia N:M) ---
        modelBuilder.Entity<LocalCategoria>(entity =>
        {
            entity.HasKey(lc => new { lc.LocalId, lc.CategoriaId });

            entity.HasOne(lc => lc.Local)
                  .WithMany(l => l.LocalCategorias)
                  .HasForeignKey(lc => lc.LocalId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(lc => lc.Categoria)
                  .WithMany(c => c.LocalCategorias)
                  .HasForeignKey(lc => lc.CategoriaId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // --- Configuración de Evento ---
        modelBuilder.Entity<Evento>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Titulo).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Descripcion).HasMaxLength(2000);
            entity.Property(e => e.UrlImagen).HasMaxLength(500);
            entity.Property(e => e.Lugar).HasMaxLength(300);
        });

        // --- Configuración de PerfilCarrusel ---
        modelBuilder.Entity<PerfilCarrusel>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(p => p.Descripcion).HasMaxLength(500);
        });

        // --- Configuración de Categoria ---
        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Color).HasMaxLength(20);
            entity.HasIndex(c => c.Nombre).IsUnique();
        });

        // --- Configuración de Usuario ---
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
            entity.HasIndex(u => u.Username).IsUnique();
            entity.Property(u => u.PasswordHash).IsRequired().HasMaxLength(256);
            entity.Property(u => u.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Rol).IsRequired().HasMaxLength(20);
        });

        // --- Configuración de SlideCarrusel ---
        modelBuilder.Entity<SlideCarrusel>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.UrlImagen).IsRequired().HasMaxLength(500);
            entity.Property(s => s.Titulo).HasMaxLength(200);
            entity.Property(s => s.Subtitulo).HasMaxLength(300);
            entity.Property(s => s.AnimacionEntrada).IsRequired().HasMaxLength(50);
            entity.Property(s => s.EstiloTransicion).IsRequired().HasMaxLength(50);

            entity.HasOne(s => s.Perfil)
                  .WithMany(p => p.Slides)
                  .HasForeignKey(s => s.PerfilId)
                  .OnDelete(DeleteBehavior.Cascade)
                  .IsRequired(false);
        });
    }
}
