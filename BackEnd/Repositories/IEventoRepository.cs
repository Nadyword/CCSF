using BackEnd.DTOs;

namespace BackEnd.Repositories;

/// <summary>
/// Contrato del repositorio de Eventos.
/// </summary>
public interface IEventoRepository
{
    /// <summary>
    /// Devuelve todos los eventos cuya FechaFin sea mayor o igual a hoy,
    /// ordenados por FechaInicio ascendente.
    /// </summary>
    Task<IEnumerable<EventoDto>> GetProximosAsync();

    /// <summary>
    /// Devuelve el detalle de un evento por su ID, incluyendo los datos del local si aplica.
    /// Retorna null si no existe.
    /// </summary>
    Task<EventoDetalleDto?> GetByIdAsync(int id);
}
