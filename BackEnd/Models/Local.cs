namespace BackEnd.Models;

/// <summary>
/// Representa un local comercial dentro del directorio.
/// </summary>
public class Local
{
    public int Id { get; set; }

    /// <summary>Nombre visible del local (ej. "Cafetería El Sol").</summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>Identificador físico del local (ej. "L-23").</summary>
    public string NumeroLocal { get; set; } = string.Empty;

    /// <summary>Nivel o piso donde se encuentra (ej. "1", "2", "Sótano").</summary>
    public string Nivel { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    /// <summary>URL de la imagen/foto representativa del local.</summary>
    public string? UrlFoto { get; set; }

    /// <summary>Horario de atención en texto libre (ej. "Lun-Vie 9:00-18:00").</summary>
    public string Horario { get; set; } = string.Empty;

    public string? Telefono { get; set; }

    // --- Relación N:M con Categoria ---
    public ICollection<LocalCategoria> LocalCategorias { get; set; } = [];
}
