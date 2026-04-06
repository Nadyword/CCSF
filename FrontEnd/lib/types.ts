export interface Evento {
  id: string
  nombre: string
  descripcion: string
  fecha: string
  hora: string
  ubicacion: string
  imagen: string
  destacado: boolean
  activo: boolean
}

export interface Local {
  id: string
  nombre: string
  categorias: Categoria[]
  nivel: string
  numeroLocal: string
  imagen: string
  descripcion: string
  horario: string
  telefono?: string
}

export interface Usuario {
  id: string
  username: string
  password: string
  nombre: string
  rol: 'admin' | 'editor'
}

export interface ConfiguracionHome {
  eventoDestacadoId: string | null
  mostrarEventoDestacado: boolean
}

// ─── Carrusel ─────────────────────────────────────────────────────────────────

export type AnimacionEntrada =
  | 'fade'
  | 'slide-derecha'   // entra desde la izquierda
  | 'slide-izquierda' // entra desde la derecha
  | 'slide-arriba'    // entra desde abajo
  | 'slide-abajo'     // entra desde arriba
  | 'zoom'            // zoom hacia afuera
  | 'zoom-out'        // zoom hacia adentro
  | 'flip'            // volteo 3D horizontal
  | 'rotate'          // rotación + fade
  | 'bounce'          // rebote desde arriba

export type EstiloTransicion =
  | 'suave'        // ease-in-out — natural y elegante
  | 'lineal'       // linear — velocidad constante
  | 'rapido'       // ease-in — arranca despacio, termina rápido
  | 'salida'       // ease-out — arranca rápido, termina suave
  | 'elastico'     // cubic-bezier spring — efecto elástico
  | 'exponencial'  // expo ease-out — aceleración exponencial
  | 'anticipar'    // back ease — anticipa el movimiento

export interface SlideCarrusel {
  id: string
  perfilId: string | null
  urlImagen: string
  titulo: string | null
  tituloColor: string | null
  subtitulo: string | null
  subtituloColor: string | null
  animacionEntrada: AnimacionEntrada
  estiloTransicion: EstiloTransicion
  tiempoPermanencia: number // ms
  orden: number
  activo: boolean
}

export interface PerfilCarrusel {
  id: string
  nombre: string
  descripcion: string | null
  activo: boolean
  slides: SlideCarrusel[]
}

export interface PerfilResumen {
  id: string
  nombre: string
  descripcion: string | null
  activo: boolean
  totalSlides: number
}

// ─── Directorio ───────────────────────────────────────────────────────────────

export interface Categoria {
  id: number
  nombre: string
  color: string | null
}
