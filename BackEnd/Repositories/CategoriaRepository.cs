using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Repositories;

public class CategoriaRepository(AppDbContext db) : ICategoriaRepository
{
    private static CategoriaDto ToDto(Categoria c) => new() { Id = c.Id, Nombre = c.Nombre, Color = c.Color };

    public async Task<IEnumerable<CategoriaDto>> GetAllAsync() =>
        await db.Categorias
            .OrderBy(c => c.Nombre)
            .Select(c => new CategoriaDto { Id = c.Id, Nombre = c.Nombre, Color = c.Color })
            .ToListAsync();

    public async Task<CategoriaDto> CreateAsync(UpsertCategoriaDto dto)
    {
        var cat = new Categoria { Nombre = dto.Nombre.Trim(), Color = dto.Color?.Trim() };
        db.Categorias.Add(cat);
        await db.SaveChangesAsync();
        return ToDto(cat);
    }

    public async Task<CategoriaDto?> UpdateAsync(int id, UpsertCategoriaDto dto)
    {
        var cat = await db.Categorias.FindAsync(id);
        if (cat is null) return null;
        cat.Nombre = dto.Nombre.Trim();
        cat.Color  = dto.Color?.Trim();
        await db.SaveChangesAsync();
        return ToDto(cat);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var cat = await db.Categorias.FindAsync(id);
        if (cat is null) return false;
        db.Categorias.Remove(cat);
        await db.SaveChangesAsync();
        return true;
    }
}
