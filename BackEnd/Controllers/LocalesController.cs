using BackEnd.DTOs;
using BackEnd.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocalesController(ILocalRepository localRepo) : ControllerBase
{
    // ── Lectura pública ───────────────────────────────────────────────────────

    /// <summary>GET /api/locales/random?cantidad=6</summary>
    [HttpGet("random")]
    public async Task<IActionResult> GetRandom([FromQuery] int cantidad = 6)
    {
        if (cantidad <= 0 || cantidad > 50)
            return BadRequest("El parámetro 'cantidad' debe estar entre 1 y 50.");
        return Ok(await localRepo.GetRandomAsync(cantidad));
    }

    /// <summary>GET /api/locales?busqueda=&categoria=</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? busqueda,
        [FromQuery] string? categoria)
        => Ok(await localRepo.GetAllAsync(busqueda, categoria));

    /// <summary>GET /api/locales/{id}</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var local = await localRepo.GetByIdAsync(id);
        return local is null ? NotFound() : Ok(local);
    }

    // ── Escritura (requiere autenticación) ───────────────────────────────────

    /// <summary>POST /api/locales</summary>
    [Authorize]
    [HttpPost("locales")]
    public async Task<IActionResult> Create([FromBody] UpsertLocalDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
            return BadRequest("El nombre es requerido.");
        var created = await localRepo.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>PUT /api/locales/{id}</summary>
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertLocalDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
            return BadRequest("El nombre es requerido.");
        var updated = await localRepo.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>DELETE /api/locales/{id}</summary>
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await localRepo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}