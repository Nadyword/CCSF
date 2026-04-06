using BackEnd.DTOs;

namespace BackEnd.Repositories;

public interface ICategoriaRepository
{
    Task<IEnumerable<CategoriaDto>> GetAllAsync();
    Task<CategoriaDto> CreateAsync(UpsertCategoriaDto dto);
    Task<CategoriaDto?> UpdateAsync(int id, UpsertCategoriaDto dto);
    Task<bool> DeleteAsync(int id);
}
