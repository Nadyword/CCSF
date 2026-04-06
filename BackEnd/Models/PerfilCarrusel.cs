namespace BackEnd.Models;

/// <summary>
/// Perfil de carrusel: agrupa un conjunto de slides bajo un nombre.
/// Solo un perfil puede estar activo a la vez; ese es el que se muestra en el home.
/// </summary>
public class PerfilCarrusel
{
    public int Id { get; set; }

    /// <summary>Nombre descriptivo del perfil (ej. "Verano 2026").</summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>Descripción opcional del propósito del perfil.</summary>
    public string? Descripcion { get; set; }

    /// <summary>Solo un perfil debe tener Activo = true a la vez.</summary>
    public bool Activo { get; set; } = false;

    /// <summary>Slides que pertenecen a este perfil.</summary>
    public ICollection<SlideCarrusel> Slides { get; set; } = [];
}
