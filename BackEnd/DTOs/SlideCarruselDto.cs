namespace BackEnd.DTOs;

/// <summary>DTO de respuesta para un SlideCarrusel.</summary>
public class SlideCarruselDto
{
    public int Id { get; set; }
    public int? PerfilId { get; set; }
    public string UrlImagen { get; set; } = string.Empty;
    public string? Titulo { get; set; }
    public string? TituloColor { get; set; }
    public string? Subtitulo { get; set; }
    public string? SubtituloColor { get; set; }
    public string AnimacionEntrada { get; set; } = "fade";
    public string EstiloTransicion { get; set; } = "suave";
    public int TiempoPermanencia { get; set; } = 5000;
    public int Orden { get; set; } = 0;
    public bool Activo { get; set; } = true;
}

/// <summary>DTO para crear o actualizar un SlideCarrusel.</summary>
public class UpsertSlideDto
{
    public int? PerfilId { get; set; }
    public string UrlImagen { get; set; } = string.Empty;
    public string? Titulo { get; set; }
    public string? TituloColor { get; set; }
    public string? Subtitulo { get; set; }
    public string? SubtituloColor { get; set; }
    public string AnimacionEntrada { get; set; } = "fade";
    public string EstiloTransicion { get; set; } = "suave";
    public int TiempoPermanencia { get; set; } = 5000;
    public int Orden { get; set; } = 0;
    public bool Activo { get; set; } = true;
}
