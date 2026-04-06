namespace BackEnd.DTOs;

/// <summary>Resumen de un perfil (sin slides) — para la lista del admin.</summary>
public class PerfilResumenDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; }
    public int TotalSlides { get; set; }
}

/// <summary>Perfil completo con sus slides — para el detalle y el carrusel.</summary>
public class PerfilCarruselDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; }
    public List<SlideCarruselDto> Slides { get; set; } = [];
}

/// <summary>DTO para crear o actualizar un perfil (solo nombre y descripción).</summary>
public class UpsertPerfilDto
{
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
}
