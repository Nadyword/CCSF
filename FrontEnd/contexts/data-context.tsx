'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Evento, Local, PerfilCarrusel, ConfiguracionHome, Categoria } from '@/lib/types'
import { configuracionHomeData } from '@/lib/data'
import {
  fetchLocales, fetchEventos, fetchTodosEventos,
  fetchPerfilActivo,
  createEvento, updateEvento, deleteEvento, destacarEvento,
  createLocal, updateLocal, deleteLocal,
  fetchCategorias, createCategoria, updateCategoria, deleteCategoria,
  type UpsertEventoPayload,
  type UpsertLocalPayload,
} from '@/lib/api'

interface DataContextType {
  // Carrusel — perfil activo con sus slides
  perfilActivo: PerfilCarrusel | null
  loadingPerfilActivo: boolean
  recargarPerfilActivo: () => Promise<void>
  // Eventos
  eventos: Evento[]
  loadingEventos: boolean
  recargarEventos: () => Promise<void>
  agregarEvento: (payload: UpsertEventoPayload) => Promise<Evento>
  actualizarEvento: (id: string, payload: UpsertEventoPayload) => Promise<Evento>
  eliminarEvento: (id: string) => Promise<void>
  toggleDestacadoEvento: (id: string) => Promise<void>
  // Locales
  locales: Local[]
  loadingLocales: boolean
  recargarLocales: () => Promise<void>
  agregarLocal: (payload: UpsertLocalPayload) => Promise<Local>
  actualizarLocal: (id: string, payload: UpsertLocalPayload) => Promise<Local>
  eliminarLocal: (id: string) => Promise<void>
  // Categorías
  categorias: Categoria[]
  loadingCategorias: boolean
  recargarCategorias: () => Promise<void>
  agregarCategoria: (nombre: string, color: string | null) => Promise<Categoria>
  actualizarCategoria: (id: number, nombre: string, color: string | null) => Promise<Categoria>
  eliminarCategoria: (id: number) => Promise<void>
  // Configuración Home (legacy — mantenido por compatibilidad)
  configuracionHome: ConfiguracionHome
  setEventoDestacado: (eventoId: string | null) => void
  toggleMostrarEventoDestacado: (mostrar: boolean) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [perfilActivo, setPerfilActivo] = useState<PerfilCarrusel | null>(null)
  const [loadingPerfilActivo, setLoadingPerfilActivo] = useState(true)
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loadingEventos, setLoadingEventos] = useState(true)
  const [locales, setLocales] = useState<Local[]>([])
  const [loadingLocales, setLoadingLocales] = useState(true)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loadingCategorias, setLoadingCategorias] = useState(true)
  const [configuracionHome, setConfiguracionHome] = useState<ConfiguracionHome>(configuracionHomeData)

  // ── Cargar datos desde la API ──────────────────────────────────────────────

  const recargarPerfilActivo = async () => {
    setLoadingPerfilActivo(true)
    try { setPerfilActivo(await fetchPerfilActivo()) } catch (e) { console.error(e) }
    finally { setLoadingPerfilActivo(false) }
  }

  /**
   * Carga eventos desde la API.
   * - Con token JWT (admin): trae TODOS los eventos (sin filtro de fecha).
   * - Sin token (visitante): trae solo los próximos (FechaFin >= hoy).
   */
  const recargarEventos = useCallback(async () => {
    setLoadingEventos(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cc_token') : null
      const data = token ? await fetchTodosEventos() : await fetchEventos()
      setEventos(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingEventos(false)
    }
  }, [])

  const recargarLocales = useCallback(async () => {
    setLoadingLocales(true)
    try { setLocales(await fetchLocales()) } catch (e) { console.error(e) }
    finally { setLoadingLocales(false) }
  }, [])

  const recargarCategorias = useCallback(async () => {
    setLoadingCategorias(true)
    try { setCategorias(await fetchCategorias()) } catch (e) { console.error(e) }
    finally { setLoadingCategorias(false) }
  }, [])

  useEffect(() => { recargarPerfilActivo() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { recargarEventos() }, [recargarEventos])
  useEffect(() => { recargarLocales() }, [recargarLocales])
  useEffect(() => { recargarCategorias() }, [recargarCategorias])

  // ── Funciones para Eventos ────────────────────────────────────────────────

  const agregarEvento = async (payload: UpsertEventoPayload): Promise<Evento> => {
    const nuevo = await createEvento(payload)
    setEventos(prev => [nuevo, ...prev])
    return nuevo
  }

  const actualizarEvento = async (id: string, payload: UpsertEventoPayload): Promise<Evento> => {
    const actualizado = await updateEvento(id, payload)
    setEventos(prev => prev.map(e => e.id === id ? actualizado : e))
    return actualizado
  }

  const eliminarEvento = async (id: string): Promise<void> => {
    await deleteEvento(id)
    setEventos(prev => prev.filter(e => e.id !== id))
  }

  const toggleDestacadoEvento = async (id: string): Promise<void> => {
    const actualizado = await destacarEvento(id)
    setEventos(prev => prev.map(e =>
      e.id === id ? actualizado : { ...e, destacado: false }
    ))
  }

  // ── Funciones para Locales ────────────────────────────────────────────────

  const agregarLocal = async (payload: UpsertLocalPayload): Promise<Local> => {
    const nuevo = await createLocal(payload)
    setLocales(prev => [...prev, nuevo])
    return nuevo
  }

  const actualizarLocal = async (id: string, payload: UpsertLocalPayload): Promise<Local> => {
    const actualizado = await updateLocal(id, payload)
    setLocales(prev => prev.map(l => l.id === id ? actualizado : l))
    return actualizado
  }

  const eliminarLocal = async (id: string): Promise<void> => {
    await deleteLocal(id)
    setLocales(prev => prev.filter(l => l.id !== id))
  }

  // ── Funciones para Categorías ─────────────────────────────────────────────

  const agregarCategoria = async (nombre: string, color: string | null): Promise<Categoria> => {
    const nueva = await createCategoria(nombre, color)
    setCategorias(prev => [...prev, nueva].sort((a, b) => a.nombre.localeCompare(b.nombre)))
    return nueva
  }

  const actualizarCategoria = async (id: number, nombre: string, color: string | null): Promise<Categoria> => {
    const actualizada = await updateCategoria(id, nombre, color)
    setCategorias(prev => prev.map(c => c.id === id ? actualizada : c).sort((a, b) => a.nombre.localeCompare(b.nombre)))
    return actualizada
  }

  const eliminarCategoria = async (id: number): Promise<void> => {
    await deleteCategoria(id)
    setCategorias(prev => prev.filter(c => c.id !== id))
  }

  // ── Configuración Home ────────────────────────────────────────────────────

  const setEventoDestacado = (eventoId: string | null) =>
    setConfiguracionHome(prev => ({ ...prev, eventoDestacadoId: eventoId }))

  const toggleMostrarEventoDestacado = (mostrar: boolean) =>
    setConfiguracionHome(prev => ({ ...prev, mostrarEventoDestacado: mostrar }))

  return (
    <DataContext.Provider value={{
      perfilActivo, loadingPerfilActivo, recargarPerfilActivo,
      eventos, loadingEventos, recargarEventos,
      agregarEvento, actualizarEvento, eliminarEvento, toggleDestacadoEvento,
      locales, loadingLocales, recargarLocales, agregarLocal, actualizarLocal, eliminarLocal,
      categorias, loadingCategorias, recargarCategorias,
      agregarCategoria, actualizarCategoria, eliminarCategoria,
      configuracionHome, setEventoDestacado, toggleMostrarEventoDestacado,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) throw new Error('useData debe usarse dentro de un DataProvider')
  return context
}
