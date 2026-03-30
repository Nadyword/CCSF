import type { Evento, Local, Usuario, ConfiguracionHome, CategoriaLocal } from './types'

// Datos de ejemplo para eventos
export const eventosData: Evento[] = [
  {
    id: '1',
    nombre: 'Festival de Primavera',
    descripcion: 'Celebra la llegada de la primavera con música en vivo, actividades para toda la familia y descuentos especiales en tiendas participantes. Habrá presentaciones artísticas, talleres creativos y sorpresas para los más pequeños.',
    fecha: '2026-04-15',
    hora: '10:00 - 20:00',
    ubicacion: 'Plaza Central - Nivel 1',
    imagen: '/images/eventos/festival-primavera.jpg',
    destacado: true,
    activo: true
  },
  {
    id: '2',
    nombre: 'Expo Tecnología 2026',
    descripcion: 'Descubre las últimas innovaciones tecnológicas con demostraciones en vivo de gadgets, realidad virtual y más. Conferencias con expertos del sector y oportunidades de networking.',
    fecha: '2026-04-20',
    hora: '11:00 - 21:00',
    ubicacion: 'Área de Exposiciones - Nivel 2',
    imagen: '/images/eventos/expo-tech.jpg',
    destacado: false,
    activo: true
  },
  {
    id: '3',
    nombre: 'Noche de Moda',
    descripcion: 'Pasarela exclusiva con las colecciones de temporada de nuestras boutiques. Descuentos especiales solo por esta noche y cocteles de bienvenida para asistentes VIP.',
    fecha: '2026-05-10',
    hora: '19:00 - 23:00',
    ubicacion: 'Terraza Principal - Nivel 3',
    imagen: '/images/eventos/noche-moda.jpg',
    destacado: false,
    activo: true
  },
  {
    id: '4',
    nombre: 'Día del Niño',
    descripcion: 'Actividades especiales para los más pequeños: shows infantiles, juegos inflables, pintura de caritas y regalos sorpresa. Un día lleno de diversión y alegría.',
    fecha: '2026-04-30',
    hora: '10:00 - 18:00',
    ubicacion: 'Zona Infantil - Nivel 1',
    imagen: '/images/eventos/dia-nino.jpg',
    destacado: false,
    activo: true
  },
  {
    id: '5',
    nombre: 'Feria Gastronómica',
    descripcion: 'Degustación de platillos de todos nuestros restaurantes a precios especiales. Competencia de chefs en vivo y clases de cocina para el público.',
    fecha: '2026-05-25',
    hora: '12:00 - 22:00',
    ubicacion: 'Food Court - Nivel 2',
    imagen: '/images/eventos/feria-gastronomica.jpg',
    destacado: false,
    activo: true
  }
]

// Datos de ejemplo para locales
export const localesData: Local[] = [
  // Gastronomía
  {
    id: '1',
    nombre: 'La Trattoria Italiana',
    categoria: 'Gastronomía',
    nivel: 'Nivel 2',
    numeroLocal: 'L-201',
    imagen: '/images/locales/trattoria.jpg',
    descripcion: 'Auténtica cocina italiana con pastas artesanales y pizzas al horno de leña.',
    horario: '11:00 - 22:00',
    telefono: '+52 555 123 4567'
  },
  {
    id: '2',
    nombre: 'Sushi House',
    categoria: 'Gastronomía',
    nivel: 'Nivel 2',
    numeroLocal: 'L-205',
    imagen: '/images/locales/sushi.jpg',
    descripcion: 'El mejor sushi de la ciudad con ingredientes frescos importados.',
    horario: '12:00 - 22:00',
    telefono: '+52 555 234 5678'
  },
  {
    id: '3',
    nombre: 'Café del Centro',
    categoria: 'Gastronomía',
    nivel: 'Nivel 1',
    numeroLocal: 'L-102',
    imagen: '/images/locales/cafe.jpg',
    descripcion: 'Café de especialidad, repostería artesanal y un ambiente acogedor.',
    horario: '08:00 - 21:00',
    telefono: '+52 555 345 6789'
  },
  // Moda
  {
    id: '4',
    nombre: 'Urban Style',
    categoria: 'Moda',
    nivel: 'Nivel 1',
    numeroLocal: 'L-115',
    imagen: '/images/locales/urban-style.jpg',
    descripcion: 'Moda urbana para jóvenes con las últimas tendencias streetwear.',
    horario: '10:00 - 21:00'
  },
  {
    id: '5',
    nombre: 'Eleganza',
    categoria: 'Moda',
    nivel: 'Nivel 1',
    numeroLocal: 'L-120',
    imagen: '/images/locales/eleganza.jpg',
    descripcion: 'Boutique de moda femenina con diseños exclusivos y accesorios.',
    horario: '10:00 - 21:00'
  },
  {
    id: '6',
    nombre: 'Kids Fashion',
    categoria: 'Moda',
    nivel: 'Nivel 1',
    numeroLocal: 'L-125',
    imagen: '/images/locales/kids-fashion.jpg',
    descripcion: 'Ropa y accesorios para niños de 0 a 14 años.',
    horario: '10:00 - 20:00'
  },
  // Tecnología
  {
    id: '7',
    nombre: 'TechZone',
    categoria: 'Tecnología',
    nivel: 'Nivel 2',
    numeroLocal: 'L-210',
    imagen: '/images/locales/techzone.jpg',
    descripcion: 'Lo último en smartphones, laptops, tablets y accesorios tecnológicos.',
    horario: '10:00 - 21:00',
    telefono: '+52 555 456 7890'
  },
  {
    id: '8',
    nombre: 'Gaming World',
    categoria: 'Tecnología',
    nivel: 'Nivel 2',
    numeroLocal: 'L-215',
    imagen: '/images/locales/gaming.jpg',
    descripcion: 'Consolas, videojuegos, periféricos gaming y zona de pruebas.',
    horario: '10:00 - 22:00'
  },
  // Entretenimiento
  {
    id: '9',
    nombre: 'CineStar',
    categoria: 'Entretenimiento',
    nivel: 'Nivel 3',
    numeroLocal: 'L-301',
    imagen: '/images/locales/cinestar.jpg',
    descripcion: 'Complejo de cines con 8 salas, incluyendo IMAX y 4DX.',
    horario: '11:00 - 00:00'
  },
  {
    id: '10',
    nombre: 'Fun Zone',
    categoria: 'Entretenimiento',
    nivel: 'Nivel 3',
    numeroLocal: 'L-310',
    imagen: '/images/locales/funzone.jpg',
    descripcion: 'Área de juegos y entretenimiento para toda la familia.',
    horario: '10:00 - 22:00'
  },
  // Belleza
  {
    id: '11',
    nombre: 'Beauty Lab',
    categoria: 'Belleza',
    nivel: 'Nivel 1',
    numeroLocal: 'L-130',
    imagen: '/images/locales/beauty-lab.jpg',
    descripcion: 'Salón de belleza con servicios de peluquería, maquillaje y spa.',
    horario: '09:00 - 20:00'
  },
  {
    id: '12',
    nombre: 'Perfumería Elite',
    categoria: 'Belleza',
    nivel: 'Nivel 1',
    numeroLocal: 'L-135',
    imagen: '/images/locales/perfumeria.jpg',
    descripcion: 'Perfumes y cosméticos de las mejores marcas internacionales.',
    horario: '10:00 - 21:00'
  },
  // Servicios
  {
    id: '13',
    nombre: 'Banco Nacional',
    categoria: 'Servicios',
    nivel: 'Nivel 1',
    numeroLocal: 'L-105',
    imagen: '/images/locales/banco.jpg',
    descripcion: 'Sucursal bancaria completa con cajeros automáticos 24/7.',
    horario: '09:00 - 16:00'
  },
  {
    id: '14',
    nombre: 'Farmacia Plus',
    categoria: 'Servicios',
    nivel: 'Nivel 1',
    numeroLocal: 'L-110',
    imagen: '/images/locales/farmacia.jpg',
    descripcion: 'Farmacia con servicio 24 horas y productos de salud y bienestar.',
    horario: '24 horas'
  },
  // Hogar
  {
    id: '15',
    nombre: 'Casa & Diseño',
    categoria: 'Hogar',
    nivel: 'Nivel 2',
    numeroLocal: 'L-220',
    imagen: '/images/locales/casa-diseno.jpg',
    descripcion: 'Muebles y artículos de decoración con diseño contemporáneo.',
    horario: '10:00 - 20:00'
  },
  // Deportes
  {
    id: '16',
    nombre: 'Sport Life',
    categoria: 'Deportes',
    nivel: 'Nivel 2',
    numeroLocal: 'L-225',
    imagen: '/images/locales/sport-life.jpg',
    descripcion: 'Ropa deportiva, calzado y equipamiento para todas las disciplinas.',
    horario: '10:00 - 21:00'
  }
]

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
  eventoDestacadoId: '1', // Festival de Primavera como destacado inicial
  mostrarEventoDestacado: true
}

// Lista de categorías disponibles
export const categoriasLocales: CategoriaLocal[] = [
  'Gastronomía',
  'Moda',
  'Tecnología',
  'Entretenimiento',
  'Servicios',
  'Belleza',
  'Hogar',
  'Deportes'
]

// Información del centro comercial
export const infoCC = {
  nombre: 'Centro Comercial Santa Fe',
  direccion: 'Av. Vasco de Quiroga 3800, Santa Fe, 05348 CDMX',
  telefono: '+52 55 1234 5678',
  horario: 'Lunes a Domingo: 10:00 - 21:00',
  logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ccstafeBWoriginal%20logo%20PNG-01-Xy8ecsOZACQpBOLDhUjPDBZEbvf23S.png'
}
