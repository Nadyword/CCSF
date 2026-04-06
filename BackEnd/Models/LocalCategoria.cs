namespace BackEnd.Models;

/// <summary>
/// Tabla intermedia para la relación N:M entre Local y Categoria.
/// </summary>
public class LocalCategoria
{
    public int LocalId { get; set; }
    public Local Local { get; set; } = null!;

    public int CategoriaId { get; set; }
    public Categoria Categoria { get; set; } = null!;
}
