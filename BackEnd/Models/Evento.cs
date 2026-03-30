namespace BackEnd.Models;

/// <summary>
/// Representa un evento que puede estar asociado opcionalmente a un Local.
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

    /// <summary>
    /// Texto libre del lugar cuando el evento no está vinculado a un local del directorio
    /// (ej. "Auditorio principal", "Plaza central").
    /// </summary>
    public string? Lugar { get; set; }

    // --- Relación opcional con Local (FK nullable = relación 1:N opcional) ---
    public int? LocalId { get; set; }
    public Local? Local { get; set; }
}
