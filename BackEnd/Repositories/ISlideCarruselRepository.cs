using BackEnd.DTOs;

namespace BackEnd.Repositories;

public interface ISlideCarruselRepository
{
    /// <summary>Todos los slides ordenados por Orden (para el panel admin).</summary>
    Task<IEnumerable<SlideCarruselDto>> GetAllAsync();

    /// <summary>Solo los slides activos, ordenados por Orden (para el carrusel público).</summary>
    Task<IEnumerable<SlideCarruselDto>> GetActivosAsync();

    Task<SlideCarruselDto?> GetByIdAsync(int id);
    Task<int> CountByPerfilAsync(int perfilId);
    Task<SlideCarruselDto> CreateAsync(UpsertSlideDto dto);
    Task<SlideCarruselDto?> UpdateAsync(int id, UpsertSlideDto dto);
    Task<bool> DeleteAsync(int id);
}
