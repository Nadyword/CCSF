import type { Local, Evento, SlideCarrusel, PerfilCarrusel, PerfilResumen, Categoria } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5081'

// ─── Auth ─────────────────────────────────────────────────────────────────────

const TOKEN_KEY = 'cc_token'

export interface LoginResponse {
  token: string
  username: string
  nombre: string
  rol: string
}

export async function loginApi(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('Credenciales inválidas.')
  return res.json() as Promise<LoginResponse>
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = sessionStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Tipos internos del BackEnd ───────────────────────────────────────────────

interface ApiCategoria {
  id: number; nombre: string; color: string | null
}

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

interface ApiPerfilResumen {
  id: number; nombre: string; descripcion: string | null
  activo: boolean; totalSlides: number
}

interface ApiPerfil {
  id: number; nombre: string; descripcion: string | null
  activo: boolean; slides: ApiSlide[]
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapLocal(d: ApiLocal): Local {
  return {
    id: String(d.id), nombre: d.nombre,
    categorias: d.categorias.map(c => ({ id: c.id, nombre: c.nombre, color: c.color })),
    nivel: d.nivel, numeroLocal: d.numeroLocal, imagen: d.urlFoto ?? '',
    descripcion: d.descripcion, horario: d.horario,
    telefono: d.telefono ?? undefined,
  }
}

function formatHora(inicio: string, fin: string): string {
  const fmt = (s: string) =>
    new Date(s)
      .toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true })
      .replace('a.\u00a0m.', 'AM')
      .replace('p.\u00a0m.', 'PM')
      .replace('a.m.', 'AM')
      .replace('p.m.', 'PM')
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

function mapCategoria(d: ApiCategoria): Categoria {
  return { id: d.id, nombre: d.nombre, color: d.color }
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

function mapPerfilResumen(d: ApiPerfilResumen): PerfilResumen {
  return {
    id: String(d.id), nombre: d.nombre, descripcion: d.descripcion,
    activo: d.activo, totalSlides: d.totalSlides,
  }
}

function mapPerfil(d: ApiPerfil): PerfilCarrusel {
  return {
    id: String(d.id), nombre: d.nombre, descripcion: d.descripcion,
    activo: d.activo, slides: d.slides.map(mapSlide),
  }
}

// ─── Locales ──────────────────────────────────────────────────────────────────

export async function fetchLocales(): Promise<Local[]> {
  const res = await fetch(`${API_BASE}/api/locales`)
  if (!res.ok) throw new Error(`Error al cargar locales: ${res.status}`)
  return (await res.json() as ApiLocal[]).map(mapLocal)
}

export interface UpsertLocalPayload {
  nombre: string
  numeroLocal: string
  nivel: string
  descripcion: string
  urlFoto: string | null
  categoriaIds: number[]
  horario: string
  telefono: string | null
}

export async function createLocal(payload: UpsertLocalPayload): Promise<Local> {
  const res = await fetch(`${API_BASE}/api/locales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Error al crear local: ${res.status}`)
  return mapLocal(await res.json() as ApiLocal)
}

export async function updateLocal(id: string, payload: UpsertLocalPayload): Promise<Local> {
  const res = await fetch(`${API_BASE}/api/locales/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Error al actualizar local: ${res.status}`)
  return mapLocal(await res.json() as ApiLocal)
}

export async function deleteLocal(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/locales/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error(`Error al eliminar local: ${res.status}`)
}

// ─── Categorías ───────────────────────────────────────────────────────────────

export async function fetchCategorias(): Promise<Categoria[]> {
  const res = await fetch(`${API_BASE}/api/categorias`)
  if (!res.ok) throw new Error(`Error al cargar categorías: ${res.status}`)
  return (await res.json() as ApiCategoria[]).map(mapCategoria)
}

export async function createCategoria(nombre: string, color: string | null): Promise<Categoria> {
  const res = await fetch(`${API_BASE}/api/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ nombre, color }),
  })
  if (!res.ok) throw new Error(`Error al crear categoría: ${res.status}`)
  return mapCategoria(await res.json() as ApiCategoria)
}

export async function updateCategoria(id: number, nombre: string, color: string | null): Promise<Categoria> {
  const res = await fetch(`${API_BASE}/api/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ nombre, color }),
  })
  if (!res.ok) throw new Error(`Error al actualizar categoría: ${res.status}`)
  return mapCategoria(await res.json() as ApiCategoria)
}

export async function deleteCategoria(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/categorias/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error(`Error al eliminar categoría: ${res.status}`)
}

// ─── Eventos ──────────────────────────────────────────────────────────────────

export async function fetchEventos(): Promise<Evento[]> {
  const res = await fetch(`${API_BASE}/api/eventos`)
  if (!res.ok) throw new Error(`Error al cargar eventos: ${res.status}`)
  return (await res.json() as ApiEvento[]).map(mapEvento)
}

/** Todos los eventos (sin filtro de fecha) — requiere token JWT. */
export async function fetchTodosEventos(): Promise<Evento[]> {
  const res = await fetch(`${API_BASE}/api/eventos/todos`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error(`Error al cargar eventos: ${res.status}`)
  return (await res.json() as ApiEvento[]).map(mapEvento)
}

export interface UpsertEventoPayload {
  titulo: string
  descripcion: string
  fechaInicio: string   // ISO 8601
  fechaFin: string      // ISO 8601
  urlImagen: string | null
  lugar: string | null
}

export async function createEvento(payload: UpsertEventoPayload): Promise<Evento> {
  const res = await fetch(`${API_BASE}/api/eventos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Error al crear evento: ${res.status}`)
  return mapEvento(await res.json() as ApiEvento)
}

export async function updateEvento(id: string, payload: UpsertEventoPayload): Promise<Evento> {
  const res = await fetch(`${API_BASE}/api/eventos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Error al actualizar evento: ${res.status}`)
  return mapEvento(await res.json() as ApiEvento)
}

export async function deleteEvento(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/eventos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error(`Error al eliminar evento: ${res.status}`)
}

/** Alterna el evento destacado del Home. Devuelve el evento actualizado. */
export async function destacarEvento(id: string): Promise<Evento> {
  const res = await fetch(`${API_BASE}/api/eventos/${id}/destacar`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error(`Error al destacar evento: ${res.status}`)
  return mapEvento(await res.json() as ApiEvento)
}

// ─── Perfiles de Carrusel ─────────────────────────────────────────────────────

export async function fetchPerfiles(): Promise<PerfilResumen[]> {
  const res = await fetch(`${API_BASE}/api/perfilcarrusel`)
  if (!res.ok) throw new Error(`Error al cargar perfiles: ${res.status}`)
  return (await res.json() as ApiPerfilResumen[]).map(mapPerfilResumen)
}

export async function fetchPerfil(id: string): Promise<PerfilCarrusel> {
  const res = await fetch(`${API_BASE}/api/perfilcarrusel/${id}`)
  if (!res.ok) throw new Error(`Error al cargar perfil: ${res.status}`)
  return mapPerfil(await res.json() as ApiPerfil)
}

export async function fetchPerfilActivo(): Promise<PerfilCarrusel | null> {
  const res = await fetch(`${API_BASE}/api/perfilcarrusel/activo`)
  if (res.status === 204) return null
  if (!res.ok) throw new Error(`Error al cargar perfil activo: ${res.status}`)
  return mapPerfil(await res.json() as ApiPerfil)
}

export async function createPerfil(nombre: string, descripcion: string | null): Promise<PerfilCarrusel> {
  const res = await fetch(`${API_BASE}/api/perfilcarrusel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ nombre, descripcion }),
  })
  if (!res.ok) throw new Error(`Error al crear perfil: ${res.status}`)
  return mapPerfil(await res.json() as ApiPerfil)
}

export async function updatePerfil(id: string, nombre: string, descripcion: string | null): Promise<PerfilCarrusel> {
  const res = await fetch(`${API_BASE}/api/perfilcarrusel/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ nombre, descripcion }),
  })
  if (!res.ok) throw new Error(`Error al actualizar perfil: ${res.status}`)
  return mapPerfil(await res.json() as ApiPerfil)
}

export async function deletePerfil(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/perfilcarrusel/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error(`Error al eliminar perfil: ${res.status}`)
}

export async function activarPerfil(id: string): Promise<PerfilCarrusel> {
  const res = await fetch(`${API_BASE}/api/perfilcarrusel/${id}/activar`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error(`Error al activar perfil: ${res.status}`)
  return mapPerfil(await res.json() as ApiPerfil)
}

// ─── Slides ───────────────────────────────────────────────────────────────────

export async function createSlide(data: Omit<SlideCarrusel, 'id'>): Promise<SlideCarrusel> {
  const body = { ...data, perfilId: data.perfilId ? Number(data.perfilId) : null }
  const res = await fetch(`${API_BASE}/api/slidecarrusel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Error al crear slide: ${res.status}`)
  return mapSlide(await res.json() as ApiSlide)
}

export async function updateSlide(id: string, data: Omit<SlideCarrusel, 'id'>): Promise<SlideCarrusel> {
  const body = { ...data, perfilId: data.perfilId ? Number(data.perfilId) : null }
  const res = await fetch(`${API_BASE}/api/slidecarrusel/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Error al actualizar slide: ${res.status}`)
  return mapSlide(await res.json() as ApiSlide)
}

export async function deleteSlide(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/slidecarrusel/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error(`Error al eliminar slide: ${res.status}`)
}

// ─── Imágenes de Locales (gestionadas por Next.js — public/Locales/) ─────────

export interface ImagenLocal {
  name: string
  url: string
  size: number
}

export async function fetchImagenesLocales(): Promise<ImagenLocal[]> {
  const res = await fetch('/gallery/locales')
  if (!res.ok) return []
  return res.json()
}

export async function uploadImagenLocal(file: File): Promise<ImagenLocal> {
  const form = new FormData()
  form.append('archivo', file)
  const res = await fetch('/gallery/locales', { method: 'POST', body: form })
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(data.error ?? `Error al subir: ${res.status}`)
  }
  return res.json()
}

export async function deleteImagenLocal(filename: string): Promise<void> {
  const res = await fetch(`/gallery/locales/${encodeURIComponent(filename)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Error al eliminar: ${res.status}`)
}

// ─── Imágenes de Eventos (gestionadas por Next.js — public/Eventos/) ─────────

export interface ImagenEvento {
  name: string
  url: string
  size: number
}

export async function fetchImagenesEventos(): Promise<ImagenEvento[]> {
  const res = await fetch('/gallery/eventos')
  if (!res.ok) return []
  return res.json()
}

export async function uploadImagenEvento(file: File): Promise<ImagenEvento> {
  const form = new FormData()
  form.append('archivo', file)
  const res = await fetch('/gallery/eventos', { method: 'POST', body: form })
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(data.error ?? `Error al subir: ${res.status}`)
  }
  return res.json()
}

export async function deleteImagenEvento(filename: string): Promise<void> {
  const res = await fetch(`/gallery/eventos/${encodeURIComponent(filename)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Error al eliminar: ${res.status}`)
}

// ─── Galería de imágenes (gestionada por Next.js — public/carrusel/) ─────────

export interface ImagenGaleria {
  name: string
  url: string
  size: number
}

export async function fetchImagenesCarrusel(): Promise<ImagenGaleria[]> {
  const res = await fetch('/gallery/carrusel')
  if (!res.ok) return []
  return res.json()
}

export async function uploadImagenesCarrusel(files: File[]): Promise<ImagenGaleria[]> {
  const form = new FormData()
  files.forEach(f => form.append('archivos', f))
  const res = await fetch('/gallery/carrusel', { method: 'POST', body: form })
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(data.error ?? `Error al subir: ${res.status}`)
  }
  return res.json()
}

export async function deleteImagenCarrusel(filename: string): Promise<void> {
  const res = await fetch(`/gallery/carrusel/${encodeURIComponent(filename)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Error al eliminar: ${res.status}`)
}

export async function renameImagenCarrusel(filename: string, newName: string): Promise<ImagenGaleria> {
  const res = await fetch(`/gallery/carrusel/${encodeURIComponent(filename)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newName }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(data.error ?? `Error al renombrar: ${res.status}`)
  }
  return res.json()
}
