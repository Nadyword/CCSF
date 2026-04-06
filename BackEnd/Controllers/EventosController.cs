using BackEnd.DTOs;
using BackEnd.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers;

/// <summary>
/// Endpoints para consulta pública y administración de Eventos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class EventosController(IEventoRepository eventoRepo) : ControllerBase
{
    // ── Lectura pública ───────────────────────────────────────────────────────

    /// <summary>GET /api/eventos — próximos eventos (FechaFin >= hoy).</summary>
    [HttpGet]
    public async Task<IActionResult> GetProximos()
        => Ok(await eventoRepo.GetProximosAsync());

    /// <summary>GET /api/eventos/todos — todos los eventos (requiere autenticación).</summary>
    [Authorize]
    [HttpGet("todos")]
    public async Task<IActionResult> GetTodos()
        => Ok(await eventoRepo.GetAllAsync());

    /// <summary>GET /api/eventos/{id} — detalle de un evento.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var evento = await eventoRepo.GetByIdAsync(id);
        return evento is null
            ? NotFound(new { mensaje = $"No se encontró el evento con ID {id}." })
            : Ok(evento);
    }

    // ── Escritura (solo admin/editor autenticado) ─────────────────────────────

    /// <summary>POST /api/eventos — crear evento.</summary>
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertEventoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Titulo))
            return BadRequest("El título es requerido.");
        if (dto.FechaFin < dto.FechaInicio)
            return BadRequest("FechaFin no puede ser anterior a FechaInicio.");

        var created = await eventoRepo.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>PUT /api/eventos/{id} — actualizar evento.</summary>
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertEventoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Titulo))
            return BadRequest("El título es requerido.");
        if (dto.FechaFin < dto.FechaInicio)
            return BadRequest("FechaFin no puede ser anterior a FechaInicio.");

        var updated = await eventoRepo.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>DELETE /api/eventos/{id} — eliminar evento.</summary>
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await eventoRepo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    /// <summary>
    /// POST /api/eventos/{id}/destacar — alterna el evento destacado del Home.
    /// Si este ya era el destacado, lo desmarca. Si no, lo marca y desmarca al anterior.
    /// </summary>
    [Authorize]
    [HttpPost("{id:int}/destacar")]
    public async Task<IActionResult> Destacar(int id)
    {
        var resultado = await eventoRepo.ToggleDestacadoAsync(id);
        return resultado is null ? NotFound() : Ok(resultado);
    }
}
