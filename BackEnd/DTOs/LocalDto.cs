namespace BackEnd.DTOs;

/// <summary>
/// DTO de respuesta para un Local. Nunca expone la entidad de base de datos directamente.
/// </summary>
public class LocalDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string NumeroLocal { get; set; } = string.Empty;
    public string Nivel { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string? UrlFoto { get; set; }
    public string Categoria { get; set; } = string.Empty;
    public string Horario { get; set; } = string.Empty;
    public string? Telefono { get; set; }
}
