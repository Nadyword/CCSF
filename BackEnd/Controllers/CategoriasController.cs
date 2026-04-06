using BackEnd.DTOs;
using BackEnd.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController(ICategoriaRepository categoriaRepo) : ControllerBase
{
    /// <summary>GET /api/categorias — lista de categorías (pública).</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await categoriaRepo.GetAllAsync());

    /// <summary>POST /api/categorias — crear categoría.</summary>
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertCategoriaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
            return BadRequest("El nombre de la categoría es requerido.");
        return Ok(await categoriaRepo.CreateAsync(dto));
    }

    /// <summary>PUT /api/categorias/{id} — renombrar categoría.</summary>
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertCategoriaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
            return BadRequest("El nombre de la categoría es requerido.");
        var updated = await categoriaRepo.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>DELETE /api/categorias/{id} — eliminar categoría.</summary>
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await categoriaRepo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
