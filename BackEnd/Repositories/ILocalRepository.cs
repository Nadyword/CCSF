using BackEnd.DTOs;

namespace BackEnd.Repositories;

/// <summary>
/// Contrato del repositorio de Locales.
/// </summary>
public interface ILocalRepository
{
    /// <summary>
    /// Devuelve <paramref name="cantidad"/> locales seleccionados al azar.
    /// Usado por el endpoint del Home.
    /// </summary>
    Task<IEnumerable<LocalDto>> GetRandomAsync(int cantidad = 6);

    /// <summary>
    /// Devuelve todos los locales con filtro opcional por nombre o categoría.
    /// Usado por el Directorio.
    /// </summary>
    Task<IEnumerable<LocalDto>> GetAllAsync(string? busqueda, string? categoria);
}
