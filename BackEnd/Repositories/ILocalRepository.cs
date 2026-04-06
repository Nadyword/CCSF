using BackEnd.DTOs;

namespace BackEnd.Repositories;

public interface ILocalRepository
{
    Task<IEnumerable<LocalDto>> GetRandomAsync(int cantidad = 6);
    Task<IEnumerable<LocalDto>> GetAllAsync(string? busqueda, string? categoria);
    Task<LocalDto?> GetByIdAsync(int id);
    Task<LocalDto> CreateAsync(UpsertLocalDto dto);
    Task<LocalDto?> UpdateAsync(int id, UpsertLocalDto dto);
    Task<bool> DeleteAsync(int id);
}
