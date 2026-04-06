using BackEnd.DTOs;
using BackEnd.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers;

/// <summary>
/// CRUD de slides del carrusel.
/// La gestión de archivos de imagen se realiza desde el servidor Next.js (public/carrusel/).
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SlideCarruselController(ISlideCarruselRepository repo) : ControllerBase
{
    private const int MaxSlidesPorPerfil = 5;

    // ── CRUD slides ───────────────────────────────────────────────────────────

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await repo.GetAllAsync());

    [HttpGet("activos")]
    public async Task<IActionResult> GetActivos() => Ok(await repo.GetActivosAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var slide = await repo.GetByIdAsync(id);
        return slide is null ? NotFound() : Ok(slide);
    }

    /// <summary>POST /api/slidecarrusel — crear slide (máx. 5 por perfil).</summary>
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertSlideDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.UrlImagen))
            return BadRequest("UrlImagen es requerida.");

        if (dto.PerfilId.HasValue)
        {
            var count = await repo.CountByPerfilAsync(dto.PerfilId.Value);
            if (count >= MaxSlidesPorPerfil)
                return BadRequest($"El perfil ya tiene el máximo de {MaxSlidesPorPerfil} slides.");
        }

        var created = await repo.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertSlideDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.UrlImagen))
            return BadRequest("UrlImagen es requerida.");
        var updated = await repo.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await repo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
