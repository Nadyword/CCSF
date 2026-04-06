using BackEnd.DTOs;
using BackEnd.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers;

/// <summary>
/// Gestión de perfiles de carrusel.
/// Un perfil agrupa slides y solo uno puede estar activo a la vez.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PerfilCarruselController(IPerfilCarruselRepository repo) : ControllerBase
{
    /// <summary>GET /api/perfilcarrusel — lista de perfiles (resumen, sin slides).</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await repo.GetAllAsync());

    /// <summary>GET /api/perfilcarrusel/activo — perfil activo con slides (para el carrusel).</summary>
    [HttpGet("activo")]
    public async Task<IActionResult> GetActivo()
    {
        var perfil = await repo.GetActivoAsync();
        return perfil is null ? NoContent() : Ok(perfil);
    }

    /// <summary>GET /api/perfilcarrusel/{id} — perfil completo con todos sus slides.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var perfil = await repo.GetByIdAsync(id);
        return perfil is null ? NotFound() : Ok(perfil);
    }

    /// <summary>POST /api/perfilcarrusel — crear perfil (máx. 10).</summary>
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertPerfilDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
            return BadRequest("El nombre del perfil es requerido.");

        if (await repo.CountAsync() >= 10)
            return BadRequest("Se alcanzó el límite máximo de 10 perfiles.");

        var created = await repo.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>PUT /api/perfilcarrusel/{id} — actualizar nombre y descripción.</summary>
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertPerfilDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
            return BadRequest("El nombre del perfil es requerido.");

        var updated = await repo.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>DELETE /api/perfilcarrusel/{id} — eliminar perfil y sus slides.</summary>
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await repo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    /// <summary>POST /api/perfilcarrusel/{id}/activar — hacer activo este perfil.</summary>
    [Authorize]
    [HttpPost("{id:int}/activar")]
    public async Task<IActionResult> Activar(int id)
    {
        var perfil = await repo.ActivarAsync(id);
        return perfil is null ? NotFound() : Ok(perfil);
    }
}
