using BackEnd.DTOs;

namespace BackEnd.Repositories;

public interface IPerfilCarruselRepository
{
    /// <summary>Lista de perfiles con conteo de slides (sin cargar cada slide).</summary>
    Task<IEnumerable<PerfilResumenDto>> GetAllAsync();

    /// <summary>Perfil completo con sus slides ordenados.</summary>
    Task<PerfilCarruselDto?> GetByIdAsync(int id);

    /// <summary>Perfil activo con sus slides activos (para el carrusel público).</summary>
    Task<PerfilCarruselDto?> GetActivoAsync();

    Task<int> CountAsync();
    Task<PerfilCarruselDto> CreateAsync(UpsertPerfilDto dto);
    Task<PerfilCarruselDto?> UpdateAsync(int id, UpsertPerfilDto dto);
    Task<bool> DeleteAsync(int id);

    /// <summary>Marca este perfil como activo y desactiva todos los demás.</summary>
    Task<PerfilCarruselDto?> ActivarAsync(int id);
}
