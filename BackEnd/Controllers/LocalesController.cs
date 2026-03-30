using BackEnd.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers;

/// <summary>
/// Endpoints relacionados con los Locales del directorio.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class LocalesController(ILocalRepository localRepo) : ControllerBase
{
    /// <summary>
    /// GET /api/locales/random?cantidad=6
    /// Devuelve locales seleccionados al azar para mostrar en el Home.
    /// </summary>
    [HttpGet("random")]
    public async Task<IActionResult> GetRandom([FromQuery] int cantidad = 6)
    {
        if (cantidad <= 0 || cantidad > 50)
            return BadRequest("El parámetro 'cantidad' debe estar entre 1 y 50.");

        var locales = await localRepo.GetRandomAsync(cantidad);
        return Ok(locales);
    }

    /// <summary>
    /// GET /api/locales?busqueda=cafe&amp;categoria=Restaurante
    /// Devuelve la lista completa de locales con filtros opcionales.
    /// Ambos parámetros son opcionales; sin ellos devuelve todos los locales.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? busqueda,
        [FromQuery] string? categoria)
    {
        var locales = await localRepo.GetAllAsync(busqueda, categoria);
        return Ok(locales);
    }
}
