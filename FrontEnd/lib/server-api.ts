import type { Local, Evento, PerfilCarrusel, Categoria } from './types'
import type { SlideCarrusel } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5081'
const REVALIDATE = 300 // 5 minutos

// ─── Tipos internos del BackEnd ───────────────────────────────────────────────

interface ApiCategoria { id: number; nombre: string; color: string | null }

interface ApiLocal {
  id: number; nombre: string; numeroLocal: string; nivel: string
  descripcion: string; urlFoto: string | null
  categorias: ApiCategoria[]
  horario: string; telefono: string | null
}

interface ApiEvento {
  id: number; titulo: string; descripcion: string
  fechaInicio: string; fechaFin: string; urlImagen: string | null
  lugar: string | null; destacado: boolean
}

interface ApiSlide {
  id: number; perfilId: number | null; urlImagen: string
  titulo: string | null; tituloColor: string | null
  subtitulo: string | null; subtituloColor: string | null
  animacionEntrada: string; estiloTransicion: string
  tiempoPermanencia: number; orden: number; activo: boolean
}

interface ApiPerfil {
  id: number; nombre: string; descripcion: string | null
  activo: boolean; slides: ApiSlide[]
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapCategoria(d: ApiCategoria): Categoria {
  return { id: d.id, nombre: d.nombre, color: d.color }
}

function mapLocal(d: ApiLocal): Local {
  return {
    id: String(d.id), nombre: d.nombre,
    categorias: d.categorias.map(mapCategoria),
    nivel: d.nivel, numeroLocal: d.numeroLocal, imagen: d.urlFoto ?? '',
    descripcion: d.descripcion, horario: d.horario,
    telefono: d.telefono ?? undefined,
  }
}

function formatHora(inicio: string, fin: string): string {
  const fmt = (s: string) =>
    new Date(s)
      .toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true })
      .replace('a. m.', 'AM').replace('p. m.', 'PM')
      .replace('a.m.', 'AM').replace('p.m.', 'PM')
  return `${fmt(inicio)} - ${fmt(fin)}`
}

function mapEvento(d: ApiEvento): Evento {
  return {
    id: String(d.id), nombre: d.titulo, descripcion: d.descripcion,
    fecha: d.fechaInicio.split('T')[0], hora: formatHora(d.fechaInicio, d.fechaFin),
    ubicacion: d.lugar ?? '', imagen: d.urlImagen ?? '',
    destacado: d.destacado, activo: true,
  }
}

function mapSlide(d: ApiSlide): SlideCarrusel {
  return {
    id: String(d.id), perfilId: d.perfilId !== null ? String(d.perfilId) : null,
    urlImagen: d.urlImagen,
    titulo: d.titulo, tituloColor: d.tituloColor ?? null,
    subtitulo: d.subtitulo, subtituloColor: d.subtituloColor ?? null,
    animacionEntrada: d.animacionEntrada as SlideCarrusel['animacionEntrada'],
    estiloTransicion: d.estiloTransicion as SlideCarrusel['estiloTransicion'],
    tiempoPermanencia: d.tiempoPermanencia, orden: d.orden, activo: d.activo,
  }
}

function mapPerfil(d: ApiPerfil): PerfilCarrusel {
  return {
    id: String(d.id), nombre: d.nombre, descripcion: d.descripcion,
    activo: d.activo, slides: d.slides.map(mapSlide),
  }
}

// ─── Fetch con caché ISR (solo para datos públicos) ───────────────────────────

export async function fetchLocalesServer(): Promise<Local[]> {
  try {
    const res = await fetch(`${API_BASE}/api/locales`, { next: { revalidate: REVALIDATE } })
    if (!res.ok) return []
    return (await res.json() as ApiLocal[]).map(mapLocal)
  } catch { return [] }
}

export async function fetchCategoriasServer(): Promise<Categoria[]> {
  try {
    const res = await fetch(`${API_BASE}/api/categorias`, { next: { revalidate: REVALIDATE } })
    if (!res.ok) return []
    return (await res.json() as ApiCategoria[]).map(mapCategoria)
  } catch { return [] }
}

export async function fetchEventosServer(): Promise<Evento[]> {
  try {
    const res = await fetch(`${API_BASE}/api/eventos`, { next: { revalidate: REVALIDATE } })
    if (!res.ok) return []
    return (await res.json() as ApiEvento[]).map(mapEvento)
  } catch { return [] }
}

export async function fetchPerfilActivoServer(): Promise<PerfilCarrusel | null> {
  try {
    const res = await fetch(`${API_BASE}/api/perfilcarrusel/activo`, { next: { revalidate: REVALIDATE } })
    if (res.status === 204) return null
    if (!res.ok) return null
    return mapPerfil(await res.json() as ApiPerfil)
  } catch { return null }
}
