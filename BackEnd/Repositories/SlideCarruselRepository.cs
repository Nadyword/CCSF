using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Repositories;

public class SlideCarruselRepository(AppDbContext db) : ISlideCarruselRepository
{
    public async Task<IEnumerable<SlideCarruselDto>> GetAllAsync() =>
        await db.SlidesCarrusel
            .OrderBy(s => s.Orden)
            .Select(s => ToDto(s))
            .ToListAsync();

    public async Task<IEnumerable<SlideCarruselDto>> GetActivosAsync() =>
        await db.SlidesCarrusel
            .Where(s => s.Activo)
            .OrderBy(s => s.Orden)
            .Select(s => ToDto(s))
            .ToListAsync();

    public async Task<SlideCarruselDto?> GetByIdAsync(int id)
    {
        var slide = await db.SlidesCarrusel.FindAsync(id);
        return slide is null ? null : ToDto(slide);
    }

    public async Task<int> CountByPerfilAsync(int perfilId) =>
        await db.SlidesCarrusel.CountAsync(s => s.PerfilId == perfilId);

    public async Task<SlideCarruselDto> CreateAsync(UpsertSlideDto dto)
    {
        var slide = new SlideCarrusel
        {
            PerfilId          = dto.PerfilId,
            UrlImagen         = dto.UrlImagen,
            Titulo            = dto.Titulo,
            TituloColor       = dto.TituloColor,
            Subtitulo         = dto.Subtitulo,
            SubtituloColor    = dto.SubtituloColor,
            AnimacionEntrada  = dto.AnimacionEntrada,
            EstiloTransicion  = dto.EstiloTransicion,
            TiempoPermanencia = dto.TiempoPermanencia,
            Orden             = dto.Orden,
            Activo            = dto.Activo,
        };
        db.SlidesCarrusel.Add(slide);
        await db.SaveChangesAsync();
        return ToDto(slide);
    }

    public async Task<SlideCarruselDto?> UpdateAsync(int id, UpsertSlideDto dto)
    {
        var slide = await db.SlidesCarrusel.FindAsync(id);
        if (slide is null) return null;

        slide.UrlImagen         = dto.UrlImagen;
        slide.Titulo            = dto.Titulo;
        slide.TituloColor       = dto.TituloColor;
        slide.Subtitulo         = dto.Subtitulo;
        slide.SubtituloColor    = dto.SubtituloColor;
        slide.AnimacionEntrada  = dto.AnimacionEntrada;
        slide.EstiloTransicion  = dto.EstiloTransicion;
        slide.TiempoPermanencia = dto.TiempoPermanencia;
        slide.Orden             = dto.Orden;
        slide.Activo            = dto.Activo;

        await db.SaveChangesAsync();
        return ToDto(slide);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var slide = await db.SlidesCarrusel.FindAsync(id);
        if (slide is null) return false;
        db.SlidesCarrusel.Remove(slide);
        await db.SaveChangesAsync();
        return true;
    }

    private static SlideCarruselDto ToDto(SlideCarrusel s) => new()
    {
        Id                = s.Id,
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
