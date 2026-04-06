namespace BackEnd.DTOs;

public class CategoriaDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;

    /// <summary>Color en formato hex (ej. "#FF5733"). Null = color por defecto.</summary>
    public string? Color { get; set; }
}

public record UpsertCategoriaDto(string Nombre, string? Color);
