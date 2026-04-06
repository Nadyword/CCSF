using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Repositories;

public class EventoRepository(AppDbContext db) : IEventoRepository
{
    private static EventoDto ToDto(Evento e) => new()
    {
        Id          = e.Id,
        Titulo      = e.Titulo,
        Descripcion = e.Descripcion,
        FechaInicio = e.FechaInicio,
        FechaFin    = e.FechaFin,
        UrlImagen   = e.UrlImagen,
        Lugar       = e.Lugar,
        Destacado   = e.Destacado,
    };

    public async Task<IEnumerable<EventoDto>> GetAllAsync() =>
        (await db.Eventos.OrderByDescending(e => e.FechaInicio).ToListAsync()).Select(ToDto);

    public async Task<IEnumerable<EventoDto>> GetProximosAsync()
    {
        var hoy = DateTime.UtcNow;
        return (await db.Eventos.Where(e => e.FechaFin >= hoy).OrderBy(e => e.FechaInicio).ToListAsync()).Select(ToDto);
    }

    public async Task<EventoDetalleDto?> GetByIdAsync(int id)
    {
        var evento = await db.Eventos.FirstOrDefaultAsync(e => e.Id == id);
        if (evento is null) return null;

        return new EventoDetalleDto
        {
            Id          = evento.Id,
            Titulo      = evento.Titulo,
            Descripcion = evento.Descripcion,
            FechaInicio = evento.FechaInicio,
            FechaFin    = evento.FechaFin,
            UrlImagen   = evento.UrlImagen,
            Lugar       = evento.Lugar,
            Destacado   = evento.Destacado,
        };
    }

    public async Task<EventoDto> CreateAsync(UpsertEventoDto dto)
    {
        var evento = new Evento
        {
            Titulo      = dto.Titulo.Trim(),
            Descripcion = dto.Descripcion.Trim(),
            FechaInicio = dto.FechaInicio,
            FechaFin    = dto.FechaFin,
            UrlImagen   = dto.UrlImagen,
            Lugar       = dto.Lugar?.Trim(),
        };
        db.Eventos.Add(evento);
        await db.SaveChangesAsync();
        return ToDto(evento);
    }

    public async Task<EventoDto?> UpdateAsync(int id, UpsertEventoDto dto)
    {
        var evento = await db.Eventos.FindAsync(id);
        if (evento is null) return null;

        evento.Titulo      = dto.Titulo.Trim();
        evento.Descripcion = dto.Descripcion.Trim();
        evento.FechaInicio = dto.FechaInicio;
        evento.FechaFin    = dto.FechaFin;
        evento.UrlImagen   = dto.UrlImagen;
        evento.Lugar       = dto.Lugar?.Trim();

        await db.SaveChangesAsync();
        return ToDto(evento);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var evento = await db.Eventos.FindAsync(id);
        if (evento is null) return false;
        db.Eventos.Remove(evento);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<EventoDto?> ToggleDestacadoAsync(int id)
    {
        var evento = await db.Eventos.FindAsync(id);
        if (evento is null) return null;

        var nuevoValor = !evento.Destacado;
        if (nuevoValor)
        {
            await db.Eventos
                .Where(e => e.Destacado && e.Id != id)
                .ExecuteUpdateAsync(s => s.SetProperty(e => e.Destacado, false));
        }

        evento.Destacado = nuevoValor;
        await db.SaveChangesAsync();
        return ToDto(evento);
    }
}
