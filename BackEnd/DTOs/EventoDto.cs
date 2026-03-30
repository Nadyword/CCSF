namespace BackEnd.DTOs;

/// <summary>
/// DTO de respuesta para listar eventos (vista resumida).
/// </summary>
public class EventoDto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public string? UrlImagen { get; set; }

    /// <summary>
    /// Lugar resuelto: si hay un Local vinculado se usa su nombre,
    /// de lo contrario se usa el campo Lugar de texto libre.
    /// </summary>
    public string? Lugar { get; set; }

    /// <summary>ID del local vinculado, null si no aplica.</summary>
    public int? LocalId { get; set; }
}

/// <summary>
/// DTO de respuesta para el detalle de un evento (incluye datos del local si existe).
/// </summary>
public class EventoDetalleDto : EventoDto
{
    public LocalDto? Local { get; set; }
}
