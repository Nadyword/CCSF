'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle, Loader2, KeyRound } from 'lucide-react'
import { changePasswordApi } from '@/lib/api'

const PASSWORD_MIN_LENGTH = 6

export function ChangePasswordForm() {
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirmar, setPasswordConfirmar] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const resetForm = () => {
    setPasswordActual('')
    setPasswordNueva('')
    setPasswordConfirmar('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (passwordNueva.length < PASSWORD_MIN_LENGTH) {
      setError(`La nueva contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`)
      return
    }
    if (passwordNueva !== passwordConfirmar) {
      setError('La confirmación no coincide con la nueva contraseña.')
      return
    }

    setSaving(true)
    try {
      await changePasswordApi(passwordActual, passwordNueva)
      setSuccess(true)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar la contraseña.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <div className="space-y-2">
        <Label htmlFor="passwordActual">Contraseña actual</Label>
        <Input
          id="passwordActual"
          type="password"
          autoComplete="current-password"
          value={passwordActual}
          onChange={e => setPasswordActual(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="passwordNueva">Nueva contraseña</Label>
        <Input
          id="passwordNueva"
          type="password"
          autoComplete="new-password"
          value={passwordNueva}
          onChange={e => setPasswordNueva(e.target.value)}
          minLength={PASSWORD_MIN_LENGTH}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="passwordConfirmar">Confirmar nueva contraseña</Label>
        <Input
          id="passwordConfirmar"
          type="password"
          autoComplete="new-password"
          value={passwordConfirmar}
          onChange={e => setPasswordConfirmar(e.target.value)}
          minLength={PASSWORD_MIN_LENGTH}
          required
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle2 className="text-emerald-600" />
          <AlertDescription>Contraseña actualizada correctamente.</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="gap-2 bg-[#4051B5] hover:bg-[#3444a0]" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
        {saving ? 'Guardando...' : 'Cambiar contraseña'}
      </Button>
    </form>
  )
}
