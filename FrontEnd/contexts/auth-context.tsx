'use client'

import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react'
import type { Usuario } from '@/lib/types'
import { loginApi } from '@/lib/api'

interface AuthContextType {
  usuario: Usuario | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const SESSION_KEY = 'cc_session'
const TOKEN_KEY = 'cc_token'

const sessionListeners = new Set<() => void>()
let cachedRawSession: string | null | undefined
let cachedSessionSnapshot: Usuario | null = null

function subscribeToSession(listener: () => void) {
  sessionListeners.add(listener)
  return () => sessionListeners.delete(listener)
}

function notifySessionChange() {
  sessionListeners.forEach((listener) => listener())
}

function getSessionSnapshot(): Usuario | null {
  if (typeof window === 'undefined') return null
  const rawSession = localStorage.getItem(SESSION_KEY)

  if (rawSession === cachedRawSession) return cachedSessionSnapshot

  cachedRawSession = rawSession
  if (!rawSession) {
    cachedSessionSnapshot = null
    return null
  }

  try {
    cachedSessionSnapshot = JSON.parse(rawSession) as Usuario
    return cachedSessionSnapshot
  } catch {
    localStorage.removeItem(SESSION_KEY)
    cachedRawSession = null
    cachedSessionSnapshot = null
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const usuario = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    () => null
  )
  const isLoading = false

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const data = await loginApi(username, password)

      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        id: data.username,
        username: data.username,
        password: '',
        nombre: data.nombre,
        rol: data.rol,
      } satisfies Usuario))
      notifySessionChange()
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(TOKEN_KEY)
    notifySessionChange()
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      isAuthenticated: !!usuario,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
