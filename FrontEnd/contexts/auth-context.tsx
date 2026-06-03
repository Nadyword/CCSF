'use client'

import { createContext, useContext, useEffect, useCallback, useSyncExternalStore, type ReactNode } from 'react'
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
const TOKEN_EXP_KEY = 'cc_token_exp'

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

function decodeJwtExp(token: string): number | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64)) as Record<string, unknown>
    return typeof payload.exp === 'number' ? payload.exp : null
  } catch {
    return null
  }
}

function clearSessionStorage() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXP_KEY)
  cachedRawSession = null
  cachedSessionSnapshot = null
}

function getSessionSnapshot(): Usuario | null {
  if (typeof window === 'undefined') return null

  // Si el token ya venció, limpiar sesión inmediatamente (cubre recarga de página)
  const expRaw = localStorage.getItem(TOKEN_EXP_KEY)
  if (expRaw && Number(expRaw) * 1000 <= Date.now()) {
    clearSessionStorage()
    return null
  }

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

  const logout = useCallback(() => {
    clearSessionStorage()
    notifySessionChange()
  }, [])

  // Programa el cierre de sesión automático cuando vence el JWT
  useEffect(() => {
    if (!usuario) return
    const expRaw = localStorage.getItem(TOKEN_EXP_KEY)
    if (!expRaw) return
    const remaining = Number(expRaw) * 1000 - Date.now()
    if (remaining <= 0) {
      logout()
      return
    }
    const timer = setTimeout(logout, remaining)
    return () => clearTimeout(timer)
  }, [usuario, logout])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const data = await loginApi(username, password)
      const exp = decodeJwtExp(data.token)
      localStorage.setItem(TOKEN_KEY, data.token)
      if (exp) localStorage.setItem(TOKEN_EXP_KEY, String(exp))
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
