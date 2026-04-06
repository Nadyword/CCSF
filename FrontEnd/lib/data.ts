import type { Usuario, ConfiguracionHome } from './types'

// Usuario de ejemplo para autenticación (en producción esto vendría de una API/BD)
export const usuariosData: Usuario[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // En producción usar hash
    nombre: 'Administrador',
    rol: 'admin'
  },
  {
    id: '2',
    username: 'editor',
    password: 'editor123',
    nombre: 'Editor de Contenido',
    rol: 'editor'
  }
]

// Configuración inicial del Home
export const configuracionHomeData: ConfiguracionHome = {
  eventoDestacadoId: null,
  mostrarEventoDestacado: true
}

// Información del centro comercial
export const infoCC = {
  nombre: 'Centro Comercial Santa Fe',
  direccion: 'Av. Josè Marìa Vargas Urbanizaciòn Santa Fe, Caracas, Venezuela, 01080',
  telefono: '+58 212 979 3101',
  horario: 'Lunes a Sábados de 10:00am a 07:00pm Domingos y feriados de 01:00pm a 07:00pm',
  logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ccstafeBWoriginal%20logo%20PNG-01-Xy8ecsOZACQpBOLDhUjPDBZEbvf23S.png'
}
