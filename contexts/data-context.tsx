'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Evento, Local, ConfiguracionHome } from '@/lib/types'
import { eventosData, localesData, configuracionHomeData } from '@/lib/data'

interface DataContextType {
  // Eventos
  eventos: Evento[]
  agregarEvento: (evento: Omit<Evento, 'id'>) => void
  actualizarEvento: (id: string, evento: Partial<Evento>) => void
  eliminarEvento: (id: string) => void
  // Locales
  locales: Local[]
  agregarLocal: (local: Omit<Local, 'id'>) => void
  actualizarLocal: (id: string, local: Partial<Local>) => void
  eliminarLocal: (id: string) => void
  // Configuración Home
  configuracionHome: ConfiguracionHome
  setEventoDestacado: (eventoId: string | null) => void
  toggleMostrarEventoDestacado: (mostrar: boolean) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [eventos, setEventos] = useState<Evento[]>(eventosData)
  const [locales, setLocales] = useState<Local[]>(localesData)
  const [configuracionHome, setConfiguracionHome] = useState<ConfiguracionHome>(configuracionHomeData)

  // Funciones para Eventos
  const agregarEvento = (evento: Omit<Evento, 'id'>) => {
    const nuevoEvento: Evento = {
      ...evento,
      id: Date.now().toString()
    }
    setEventos(prev => [...prev, nuevoEvento])
  }

  const actualizarEvento = (id: string, eventoData: Partial<Evento>) => {
    setEventos(prev =>
      prev.map(e => (e.id === id ? { ...e, ...eventoData } : e))
    )
  }

  const eliminarEvento = (id: string) => {
    setEventos(prev => prev.filter(e => e.id !== id))
    // Si el evento eliminado era el destacado, limpiar configuración
    if (configuracionHome.eventoDestacadoId === id) {
      setConfiguracionHome(prev => ({ ...prev, eventoDestacadoId: null }))
    }
  }

  // Funciones para Locales
  const agregarLocal = (local: Omit<Local, 'id'>) => {
    const nuevoLocal: Local = {
      ...local,
      id: Date.now().toString()
    }
    setLocales(prev => [...prev, nuevoLocal])
  }

  const actualizarLocal = (id: string, localData: Partial<Local>) => {
    setLocales(prev =>
      prev.map(l => (l.id === id ? { ...l, ...localData } : l))
    )
  }

  const eliminarLocal = (id: string) => {
    setLocales(prev => prev.filter(l => l.id !== id))
  }

  // Funciones para Configuración Home
  const setEventoDestacado = (eventoId: string | null) => {
    setConfiguracionHome(prev => ({ ...prev, eventoDestacadoId: eventoId }))
  }

  const toggleMostrarEventoDestacado = (mostrar: boolean) => {
    setConfiguracionHome(prev => ({ ...prev, mostrarEventoDestacado: mostrar }))
  }

  return (
    <DataContext.Provider value={{
      eventos,
      agregarEvento,
      actualizarEvento,
      eliminarEvento,
      locales,
      agregarLocal,
      actualizarLocal,
      eliminarLocal,
      configuracionHome,
      setEventoDestacado,
      toggleMostrarEventoDestacado
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData debe usarse dentro de un DataProvider')
  }
  return context
}
