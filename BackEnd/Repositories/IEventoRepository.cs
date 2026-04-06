using BackEnd.DTOs;

namespace BackEnd.Repositories;

/// <summary>
/// Contrato del repositorio de Eventos.
/// </summary>
public interface IEventoRepository
{
    /// <summary>Todos los eventos (para el panel admin), ordenados por FechaInicio desc.</summary>
    Task<IEnumerable<EventoDto>> GetAllAsync();

    /// <summary>Eventos próximos (FechaFin >= hoy), ordenados por FechaInicio asc.</summary>
    Task<IEnumerable<EventoDto>> GetProximosAsync();

    /// <summary>Detalle de un evento por ID, incluyendo datos del local si aplica.</summary>
    Task<EventoDetalleDto?> GetByIdAsync(int id);

    /// <summary>Crea un nuevo evento y devuelve su DTO.</summary>
    Task<EventoDto> CreateAsync(UpsertEventoDto dto);

    /// <summary>Actualiza un evento existente. Devuelve null si no existe.</summary>
    Task<EventoDto?> UpdateAsync(int id, UpsertEventoDto dto);

    /// <summary>Elimina un evento. Devuelve false si no existe.</summary>
    Task<bool> DeleteAsync(int id);

    /// <summary>
    /// Alterna Destacado del evento. Si pasa a true, quita el destacado de los demás.
    /// Devuelve el DTO actualizado, o null si no existe.
    /// </summary>
    Task<EventoDto?> ToggleDestacadoAsync(int id);
}
