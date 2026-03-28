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
  categoria: string
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

export type CategoriaLocal = 
  | 'Gastronomía'
  | 'Moda'
  | 'Tecnología'
  | 'Entretenimiento'
  | 'Servicios'
  | 'Belleza'
  | 'Hogar'
  | 'Deportes'
