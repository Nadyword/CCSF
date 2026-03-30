using BackEnd.Data;
using BackEnd.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Repositories;

/// <summary>
/// Implementación del repositorio de Locales con Entity Framework Core.
/// </summary>
public class LocalRepository(AppDbContext db) : ILocalRepository
{
    public async Task<IEnumerable<LocalDto>> GetRandomAsync(int cantidad = 6)
    {
        // ORDER BY RANDOM() en SQLite / NEWID() en SQL Server — EF Core lo abstrae con Guid.NewGuid()
        return await db.Locales
            .OrderBy(_ => Guid.NewGuid())
            .Take(cantidad)
            .Select(l => ToDto(l))
            .ToListAsync();
    }

    public async Task<IEnumerable<LocalDto>> GetAllAsync(string? busqueda, string? categoria)
    {
        var query = db.Locales.AsQueryable();

        // Filtro por nombre (búsqueda parcial, insensible a mayúsculas)
        if (!string.IsNullOrWhiteSpace(busqueda))
            query = query.Where(l => l.Nombre.ToLower().Contains(busqueda.ToLower()));

        // Filtro exacto por categoría
        if (!string.IsNullOrWhiteSpace(categoria))
            query = query.Where(l => l.Categoria.ToLower() == categoria.ToLower());

        return await query
            .OrderBy(l => l.Nombre)
            .Select(l => ToDto(l))
            .ToListAsync();
    }

    // Expresión de proyección Local → LocalDto reutilizable
    private static LocalDto ToDto(Models.Local l) => new()
    {
        Id          = l.Id,
        Nombre      = l.Nombre,
        NumeroLocal = l.NumeroLocal,
        Nivel       = l.Nivel,
        Descripcion = l.Descripcion,
        UrlFoto     = l.UrlFoto,
        Categoria   = l.Categoria,
        Horario     = l.Horario,
        Telefono    = l.Telefono,
    };
}
