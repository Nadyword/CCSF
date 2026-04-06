namespace BackEnd.Models;

/// <summary>
/// Slide del carrusel. Pertenece a un PerfilCarrusel.
/// </summary>
public class SlideCarrusel
{
    public int Id { get; set; }

    /// <summary>FK al perfil al que pertenece este slide (nullable para compatibilidad).</summary>
    public int? PerfilId { get; set; }

    /// <summary>Navegación al perfil.</summary>
    public PerfilCarrusel? Perfil { get; set; }

    /// <summary>URL completa o ruta relativa de la imagen de fondo.</summary>
    public string UrlImagen { get; set; } = string.Empty;

    /// <summary>Título opcional superpuesto sobre la imagen.</summary>
    public string? Titulo { get; set; }

    /// <summary>Color CSS del título (ej. "#FFFFFF"). Null = color por defecto del tema.</summary>
    public string? TituloColor { get; set; }

    /// <summary>Subtítulo opcional debajo del título.</summary>
    public string? Subtitulo { get; set; }

    /// <summary>Color CSS del subtítulo. Null = color por defecto del tema.</summary>
    public string? SubtituloColor { get; set; }

    /// <summary>
    /// Animación de entrada del slide.
    /// Valores: fade | slide-derecha | slide-izquierda | slide-arriba | slide-abajo
    ///          zoom | zoom-out | flip | rotate | bounce
    /// </summary>
    public string AnimacionEntrada { get; set; } = "fade";

    /// <summary>
    /// Función de temporización (easing) de la transición.
    /// Valores: suave | lineal | rapido | salida | elastico | exponencial | anticipar
    /// </summary>
    public string EstiloTransicion { get; set; } = "suave";

    /// <summary>Tiempo que el slide permanece visible, en milisegundos.</summary>
    public int TiempoPermanencia { get; set; } = 5000;

    /// <summary>Posición dentro del perfil (menor = primero).</summary>
    public int Orden { get; set; } = 0;

    /// <summary>Si es false, este slide no se muestra aunque el perfil esté activo.</summary>
    public bool Activo { get; set; } = true;
}
