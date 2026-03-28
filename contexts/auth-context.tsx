'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Usuario } from '@/lib/types'
import { usuariosData } from '@/lib/data'

interface AuthContextType {
  usuario: Usuario | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedUser = localStorage.getItem('cc_session')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setUsuario(user)
      } catch {
        localStorage.removeItem('cc_session')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simular llamada a API - en producción esto sería un fetch a tu API
    const user = usuariosData.find(
      u => u.username === username && u.password === password
    )
    
    if (user) {
      const userWithoutPassword = { ...user, password: '' }
      setUsuario(userWithoutPassword as Usuario)
      localStorage.setItem('cc_session', JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const logout = () => {
    setUsuario(null)
    localStorage.removeItem('cc_session')
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
