using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Repositories;

public class PerfilCarruselRepository(AppDbContext db) : IPerfilCarruselRepository
{
    // ── Lista (sin cargar slides completos) ───────────────────────────────────

    public async Task<IEnumerable<PerfilResumenDto>> GetAllAsync() =>
        await db.PerfilesCarrusel
            .OrderByDescending(p => p.Activo)
            .ThenBy(p => p.Nombre)
            .Select(p => new PerfilResumenDto
            {
                Id          = p.Id,
                Nombre      = p.Nombre,
                Descripcion = p.Descripcion,
                Activo      = p.Activo,
                TotalSlides = p.Slides.Count,
            })
            .ToListAsync();

    // ── Detalle con slides (para el admin) ────────────────────────────────────

    public async Task<PerfilCarruselDto?> GetByIdAsync(int id) =>
        await db.PerfilesCarrusel
            .Where(p => p.Id == id)
            .Select(p => new PerfilCarruselDto
            {
                Id          = p.Id,
                Nombre      = p.Nombre,
                Descripcion = p.Descripcion,
                Activo      = p.Activo,
                Slides      = p.Slides
                    .OrderBy(s => s.Orden)
                    .Select(s => SlideToDto(s))
                    .ToList(),
            })
            .FirstOrDefaultAsync();

    // ── Perfil activo con slides activos (para el carrusel público) ───────────

    public async Task<PerfilCarruselDto?> GetActivoAsync() =>
        await db.PerfilesCarrusel
            .Where(p => p.Activo)
            .Select(p => new PerfilCarruselDto
            {
                Id          = p.Id,
                Nombre      = p.Nombre,
                Descripcion = p.Descripcion,
                Activo      = p.Activo,
                Slides      = p.Slides
                    .Where(s => s.Activo)
                    .OrderBy(s => s.Orden)
                    .Select(s => SlideToDto(s))
                    .ToList(),
            })
            .FirstOrDefaultAsync();

    // ── CRUD básico ──────────────────────────────────────────────────────────

    public async Task<int> CountAsync() =>
        await db.PerfilesCarrusel.CountAsync();

    public async Task<PerfilCarruselDto> CreateAsync(UpsertPerfilDto dto)
    {
        var perfil = new PerfilCarrusel { Nombre = dto.Nombre, Descripcion = dto.Descripcion };
        db.PerfilesCarrusel.Add(perfil);
        await db.SaveChangesAsync();
        return (await GetByIdAsync(perfil.Id))!;
    }

    public async Task<PerfilCarruselDto?> UpdateAsync(int id, UpsertPerfilDto dto)
    {
        var perfil = await db.PerfilesCarrusel.FindAsync(id);
        if (perfil is null) return null;
        perfil.Nombre      = dto.Nombre;
        perfil.Descripcion = dto.Descripcion;
        await db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var perfil = await db.PerfilesCarrusel.FindAsync(id);
        if (perfil is null) return false;
        db.PerfilesCarrusel.Remove(perfil);
        await db.SaveChangesAsync();
        return true;
    }

    // ── Activar (desactiva todos y activa solo este) ──────────────────────────

    public async Task<PerfilCarruselDto?> ActivarAsync(int id)
    {
        // Desactivar todos
        await db.PerfilesCarrusel
            .ExecuteUpdateAsync(p => p.SetProperty(x => x.Activo, false));

        // Activar el solicitado
        var perfil = await db.PerfilesCarrusel.FindAsync(id);
        if (perfil is null) return null;
        perfil.Activo = true;
        await db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    // ── Mapper slide ─────────────────────────────────────────────────────────

    private static SlideCarruselDto SlideToDto(SlideCarrusel s) => new()
    {
        Id                = s.Id,
        PerfilId          = s.PerfilId,
        UrlImagen         = s.UrlImagen,
        Titulo            = s.Titulo,
        TituloColor       = s.TituloColor,
        Subtitulo         = s.Subtitulo,
        SubtituloColor    = s.SubtituloColor,
        AnimacionEntrada  = s.AnimacionEntrada,
        EstiloTransicion  = s.EstiloTransicion,
        TiempoPermanencia = s.TiempoPermanencia,
        Orden             = s.Orden,
        Activo            = s.Activo,
    };
}
