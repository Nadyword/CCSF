'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, User, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react'

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const success = await login(username, password)
    
    if (success) {
      onOpenChange(false)
      setUsername('')
      setPassword('')
    } else {
      setError('Usuario o contrasena incorrectos')
    }
    
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0 animate-scale-in">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] p-6 text-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[var(--brand-accent)]/20 blur-2xl" />
          </div>
          <div className="relative">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white font-serif">
                Bienvenido
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-white/80">
                Inicia sesion para acceder al panel de administracion
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && (
            <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive animate-slide-up border border-destructive/20">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">Usuario</Label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[var(--brand-primary)]" />
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 pl-11 rounded-xl border-2 transition-all focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)]/20"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Contrasena</Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[var(--brand-primary)]" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contrasena"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pl-11 pr-11 rounded-xl border-2 transition-all focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)]/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--brand-primary)]/30 font-semibold text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Iniciando...
              </span>
            ) : (
              'Iniciar Sesion'
            )}
          </Button>
          
        </form>
      </DialogContent>
    </Dialog>
  )
}
