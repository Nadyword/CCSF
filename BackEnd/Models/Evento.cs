namespace BackEnd.Models;

/// <summary>
/// Representa un evento del centro comercial.
/// </summary>
public class Evento
{
    public int Id { get; set; }

    public string Titulo { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public DateTime FechaInicio { get; set; }

    public DateTime FechaFin { get; set; }

    /// <summary>URL de la imagen promocional del evento.</summary>
    public string? UrlImagen { get; set; }

    /// <summary>Texto libre del lugar del evento (ej. "Auditorio principal", "Plaza central").</summary>
    public string? Lugar { get; set; }

    /// <summary>
    /// Indica si este evento es el destacado que se muestra en el Home.
    /// Solo uno puede tener este campo en true a la vez.
    /// </summary>
    public bool Destacado { get; set; } = false;
}
