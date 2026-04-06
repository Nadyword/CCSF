namespace BackEnd.Models;

/// <summary>
/// Categoría de local comercial (ej. Gastronomía, Moda, Tecnología…).
/// Gestionada desde el panel de administración.
/// </summary>
public class Categoria
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;

    /// <summary>Color de la etiqueta en formato hex (ej. "#FF5733"). Null = color por defecto.</summary>
    public string? Color { get; set; }

    // --- Relación N:M con Local ---
    public ICollection<LocalCategoria> LocalCategorias { get; set; } = [];
}
