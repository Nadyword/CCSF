namespace BackEnd.DTOs;

/// <summary>
/// DTO de respuesta para listar eventos.
/// </summary>
public class EventoDto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public string? UrlImagen { get; set; }
    public string? Lugar { get; set; }

    /// <summary>True si este es el evento destacado del Home.</summary>
    public bool Destacado { get; set; }
}

/// <summary>
/// DTO de detalle de un evento (mismo contenido que EventoDto, sin relación a Local).
/// </summary>
public class EventoDetalleDto : EventoDto { }

/// <summary>
/// DTO de entrada para crear o actualizar un evento.
/// </summary>
public class UpsertEventoDto
{
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;

    /// <summary>Fecha y hora de inicio en UTC.</summary>
    public DateTime FechaInicio { get; set; }

    /// <summary>Fecha y hora de fin en UTC.</summary>
    public DateTime FechaFin { get; set; }

    public string? UrlImagen { get; set; }
    public string? Lugar { get; set; }
}
