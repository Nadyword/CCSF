namespace BackEnd.DTOs;

/// <summary>
/// DTO de respuesta para un Local (incluye sus categorías).
/// </summary>
public class LocalDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string NumeroLocal { get; set; } = string.Empty;
    public string Nivel { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string? UrlFoto { get; set; }
    public List<CategoriaDto> Categorias { get; set; } = [];
    public string Horario { get; set; } = string.Empty;
    public string? Telefono { get; set; }
}

/// <summary>
/// DTO de entrada para crear o actualizar un Local.
/// </summary>
public class UpsertLocalDto
{
    public string Nombre { get; set; } = string.Empty;
    public string NumeroLocal { get; set; } = string.Empty;
    public string Nivel { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string? UrlFoto { get; set; }

    /// <summary>IDs de las categorías asignadas al local.</summary>
    public List<int> CategoriaIds { get; set; } = [];

    public string Horario { get; set; } = string.Empty;
    public string? Telefono { get; set; }
}
