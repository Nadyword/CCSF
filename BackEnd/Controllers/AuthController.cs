using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BackEnd.DTOs;
using BackEnd.Models;
using BackEnd.Repositories;
using BackEnd.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace BackEnd.Controllers;

/// <summary>
/// Autenticación — genera un JWT válido por 24 horas.
/// POST /api/auth/login  →  { token, username, nombre, rol }
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController(IUsuarioRepository usuarioRepo, IConfiguration config) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var usuario = await usuarioRepo.GetByUsernameAsync(dto.Username);

        if (usuario is null || !PasswordService.Verify(dto.Password, usuario.PasswordHash))
            return Unauthorized(new { mensaje = "Credenciales inválidas." });

        var token = GenerateToken(usuario);
        return Ok(new LoginResponseDto(token, usuario.Username, usuario.Nombre, usuario.Rol));
    }

    private string GenerateToken(Usuario usuario)
    {
        var jwtSection = config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, usuario.Username),
            new Claim(ClaimTypes.Role, usuario.Rol),
            new Claim("nombre", usuario.Nombre),
        };

        var token = new JwtSecurityToken(
            issuer: jwtSection["Issuer"],
            audience: jwtSection["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
