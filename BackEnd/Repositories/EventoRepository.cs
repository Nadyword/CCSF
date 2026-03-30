using BackEnd.Data;
using BackEnd.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Repositories;

/// <summary>
/// Implementación del repositorio de Eventos con Entity Framework Core.
/// </summary>
public class EventoRepository(AppDbContext db) : IEventoRepository
{
    public async Task<IEnumerable<EventoDto>> GetProximosAsync()
    {
        var hoy = DateTime.UtcNow;

        return await db.Eventos
            .Where(e => e.FechaFin >= hoy)           // Solo eventos que aún no han terminado
            .OrderBy(e => e.FechaInicio)             // Los más próximos primero
            .Select(e => new EventoDto
            {
                Id          = e.Id,
                Titulo      = e.Titulo,
                Descripcion = e.Descripcion,
                FechaInicio = e.FechaInicio,
                FechaFin    = e.FechaFin,
                UrlImagen   = e.UrlImagen,
                LocalId     = e.LocalId,
                // Si tiene local vinculado, usa el nombre del local; si no, el campo Lugar libre
                Lugar       = e.Local != null ? e.Local.Nombre : e.Lugar,
            })
            .ToListAsync();
    }

    public async Task<EventoDetalleDto?> GetByIdAsync(int id)
    {
        var evento = await db.Eventos
            .Include(e => e.Local)     // Eager loading del local vinculado
            .FirstOrDefaultAsync(e => e.Id == id);

        if (evento is null) return null;

        return new EventoDetalleDto
        {
            Id          = evento.Id,
            Titulo      = evento.Titulo,
            Descripcion = evento.Descripcion,
            FechaInicio = evento.FechaInicio,
            FechaFin    = evento.FechaFin,
            UrlImagen   = evento.UrlImagen,
            LocalId     = evento.LocalId,
            Lugar       = evento.Local?.Nombre ?? evento.Lugar,

            // Incluye los datos completos del local si existe
            Local = evento.Local is null ? null : new LocalDto
            {
                Id          = evento.Local.Id,
                Nombre      = evento.Local.Nombre,
                NumeroLocal = evento.Local.NumeroLocal,
                Nivel       = evento.Local.Nivel,
                Descripcion = evento.Local.Descripcion,
                UrlFoto     = evento.Local.UrlFoto,
                Categoria   = evento.Local.Categoria,
                Horario     = evento.Local.Horario,
                Telefono    = evento.Local.Telefono,
            }
        };
    }
}
