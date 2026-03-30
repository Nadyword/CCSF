using BackEnd.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers;

/// <summary>
/// Endpoints relacionados con los Eventos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class EventosController(IEventoRepository eventoRepo) : ControllerBase
{
    /// <summary>
    /// GET /api/eventos
    /// Devuelve todos los eventos próximos (FechaFin >= hoy), ordenados por fecha.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetProximos()
    {
        var eventos = await eventoRepo.GetProximosAsync();
        return Ok(eventos);
    }

    /// <summary>
    /// GET /api/eventos/{id}
    /// Devuelve el detalle de un evento específico, incluyendo los datos del local si está vinculado.
    /// Retorna 404 si el evento no existe.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var evento = await eventoRepo.GetByIdAsync(id);

        if (evento is null)
            return NotFound(new { mensaje = $"No se encontró el evento con ID {id}." });

        return Ok(evento);
    }
}
