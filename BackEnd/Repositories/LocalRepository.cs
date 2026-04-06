using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Repositories;

public class LocalRepository(AppDbContext db) : ILocalRepository
{
    private static LocalDto ToDto(Local l) => new()
    {
        Id          = l.Id,
        Nombre      = l.Nombre,
        NumeroLocal = l.NumeroLocal,
        Nivel       = l.Nivel,
        Descripcion = l.Descripcion,
        UrlFoto     = l.UrlFoto,
        Categorias  = l.LocalCategorias
                       .Select(lc => new CategoriaDto { Id = lc.Categoria.Id, Nombre = lc.Categoria.Nombre, Color = lc.Categoria.Color })
                       .OrderBy(c => c.Nombre)
                       .ToList(),
        Horario     = l.Horario,
        Telefono    = l.Telefono,
    };

    private IQueryable<Local> WithCategorias() =>
        db.Locales
          .Include(l => l.LocalCategorias)
          .ThenInclude(lc => lc.Categoria);

    public async Task<IEnumerable<LocalDto>> GetRandomAsync(int cantidad = 6) =>
        await WithCategorias()
            .OrderBy(_ => Guid.NewGuid())
            .Take(cantidad)
            .Select(l => ToDto(l))
            .ToListAsync();

    public async Task<IEnumerable<LocalDto>> GetAllAsync(string? busqueda, string? categoria)
    {
        var query = WithCategorias();

        if (!string.IsNullOrWhiteSpace(busqueda))
            query = query.Where(l =>
                l.Nombre.ToLower().Contains(busqueda.ToLower()) ||
                l.Descripcion.ToLower().Contains(busqueda.ToLower()));

        if (!string.IsNullOrWhiteSpace(categoria))
            query = query.Where(l =>
                l.LocalCategorias.Any(lc => lc.Categoria.Nombre.ToLower() == categoria.ToLower()));

        return (await query.OrderBy(l => l.Nombre).ToListAsync()).Select(ToDto);
    }

    public async Task<LocalDto?> GetByIdAsync(int id)
    {
        var local = await WithCategorias().FirstOrDefaultAsync(l => l.Id == id);
        return local is null ? null : ToDto(local);
    }

    public async Task<LocalDto> CreateAsync(UpsertLocalDto dto)
    {
        var local = new Local
        {
            Nombre      = dto.Nombre.Trim(),
            NumeroLocal = dto.NumeroLocal.Trim(),
            Nivel       = dto.Nivel.Trim(),
            Descripcion = dto.Descripcion.Trim(),
            UrlFoto     = dto.UrlFoto,
            Horario     = dto.Horario.Trim(),
            Telefono    = dto.Telefono?.Trim(),
        };

        db.Locales.Add(local);
        await db.SaveChangesAsync();

        // Asignar categorías
        if (dto.CategoriaIds.Count > 0)
        {
            foreach (var catId in dto.CategoriaIds.Distinct())
                db.LocalCategorias.Add(new LocalCategoria { LocalId = local.Id, CategoriaId = catId });
            await db.SaveChangesAsync();
        }

        // Recargar con categorías incluidas
        return ToDto((await WithCategorias().FirstAsync(l => l.Id == local.Id)));
    }

    public async Task<LocalDto?> UpdateAsync(int id, UpsertLocalDto dto)
    {
        var local = await WithCategorias().FirstOrDefaultAsync(l => l.Id == id);
        if (local is null) return null;

        local.Nombre      = dto.Nombre.Trim();
        local.NumeroLocal = dto.NumeroLocal.Trim();
        local.Nivel       = dto.Nivel.Trim();
        local.Descripcion = dto.Descripcion.Trim();
        local.UrlFoto     = dto.UrlFoto;
        local.Horario     = dto.Horario.Trim();
        local.Telefono    = dto.Telefono?.Trim();

        // Reemplazar categorías: borrar las actuales y agregar las nuevas
        db.LocalCategorias.RemoveRange(local.LocalCategorias);
        foreach (var catId in dto.CategoriaIds.Distinct())
            db.LocalCategorias.Add(new LocalCategoria { LocalId = local.Id, CategoriaId = catId });

        await db.SaveChangesAsync();

        // Recargar con categorías
        var updated = await WithCategorias().FirstAsync(l => l.Id == id);
        return ToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var local = await db.Locales.FindAsync(id);
        if (local is null) return false;
        db.Locales.Remove(local);
        await db.SaveChangesAsync();
        return true;
    }
}
