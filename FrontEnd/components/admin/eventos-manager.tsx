'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useData } from '@/contexts/data-context'
import { fetchImagenesEventos, uploadImagenEvento, deleteImagenEvento, type ImagenEvento } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Plus, Pencil, Trash2, Calendar, Sparkles,
  Upload, ImageIcon, X, CheckCircle2, Loader2, AlertCircle, Star,
} from 'lucide-react'
import Image from 'next/image'
import type { Evento } from '@/lib/types'

// ─── Utilidades de fecha/hora ─────────────────────────────────────────────────

/** Construye un ISO 8601 UTC combinando fecha (YYYY-MM-DD) y hora (HH:MM). */
function toISO(fecha: string, hora: string): string {
  return new Date(`${fecha}T${hora}:00`).toISOString()
}

/** Extrae la parte de hora HH:MM de un string ISO. */
function horaDeISO(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-MX', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

/** Extrae la parte de fecha YYYY-MM-DD de un string ISO. */
function fechaDeISO(iso: string): string {
  return new Date(iso).toISOString().split('T')[0]
}

// ─── Sub-componente: Uploader de imagen ──────────────────────────────────────

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
}

function ImagePicker({ value, onChange }: ImagePickerProps) {
  const [galeria, setGaleria] = useState<ImagenEvento[]>([])
  const [loadingGaleria, setLoadingGaleria] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [showGaleria, setShowGaleria] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const cargarGaleria = useCallback(async () => {
    setLoadingGaleria(true)
    try { setGaleria(await fetchImagenesEventos()) } catch { /* ignorar */ }
    finally { setLoadingGaleria(false) }
  }, [])

  useEffect(() => { if (showGaleria) cargarGaleria() }, [showGaleria, cargarGaleria])

  const handleFile = async (file: File) => {
    setUploadError(null)
    setUploading(true)
    try {
      const result = await uploadImagenEvento(file)
      onChange(result.url)
      setGaleria(prev => [result, ...prev])
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir la imagen.')
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleDeleteFromGaleria = async (imagen: ImagenEvento) => {
    try {
      await deleteImagenEvento(imagen.name)
      setGaleria(prev => prev.filter(i => i.name !== imagen.name))
      if (value === imagen.url) onChange('')
    } catch { /* ignorar */ }
  }

  return (
    <div className="space-y-3">
      <Label>Imagen del Evento</Label>

      <div
        className={`relative flex h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors
          ${dragging ? 'border-indigo-500 bg-indigo-50' : 'border-border bg-muted/30 hover:border-indigo-400 hover:bg-indigo-50/40'}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <span className="text-sm">Subiendo imagen…</span>
          </div>
        ) : value ? (
          <>
            <Image src={value} alt="Vista previa" fill className="object-cover" sizes="480px" />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium flex items-center gap-1">
                <Upload className="h-4 w-4" /> Cambiar imagen
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-10 w-10 text-indigo-300" />
            <span className="text-sm font-medium">Arrastra una imagen o haz clic</span>
            <span className="text-xs">JPG, PNG, WEBP · máx. 5 MB</span>
          </div>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleInputChange} />

      {uploadError && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <X className="h-3 w-3" /> {uploadError}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => fileRef.current?.click()} disabled={uploading}>
          <Upload className="h-3.5 w-3.5" /> Subir imagen
        </Button>
        <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => setShowGaleria(v => !v)}>
          <ImageIcon className="h-3.5 w-3.5" /> Galería
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => onChange('')}>
            <X className="h-3.5 w-3.5" /> Quitar
          </Button>
        )}
      </div>

      {showGaleria && (
        <div className="rounded-xl border bg-muted/20 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Imágenes en /public/Eventos</p>
          {loadingGaleria ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando…
            </div>
          ) : galeria.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">No hay imágenes subidas aún.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {galeria.map(img => (
                <div
                  key={img.name}
                  className={`group relative aspect-video cursor-pointer overflow-hidden rounded-lg border-2 transition-all
                    ${value === img.url ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-transparent hover:border-indigo-300'}`}
                  onClick={() => onChange(img.url)}
                >
                  <Image src={img.url} alt={img.name} fill className="object-cover" sizes="120px" />
                  {value === img.url && (
                    <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white drop-shadow" />
                    </div>
                  )}
                  <button
                    type="button"
                    className="absolute right-1 top-1 hidden group-hover:flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white shadow"
                    onClick={e => { e.stopPropagation(); handleDeleteFromGaleria(img) }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Formulario de evento ─────────────────────────────────────────────────────

interface FormState {
  nombre: string
  descripcion: string
  fecha: string
  horaInicio: string
  horaFin: string
  ubicacion: string
  imagen: string
}

const FORM_VACIO: FormState = {
  nombre: '', descripcion: '', fecha: '',
  horaInicio: '10:00', horaFin: '20:00',
  ubicacion: '', imagen: '',
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function EventosManager() {
  const { eventos, loadingEventos, agregarEvento, actualizarEvento, eliminarEvento, toggleDestacadoEvento } = useData()
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<FormState>(FORM_VACIO)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const set = (field: Partial<FormState>) => setFormData(prev => ({ ...prev, ...field }))

  const resetForm = () => {
    setFormData(FORM_VACIO)
    setEditingEvento(null)
    setSaveError(null)
  }

  const handleEdit = (evento: Evento) => {
    // evento.fecha viene de la API como ISO; hora la derivamos del campo hora del evento
    // que es "HH:MM - HH:MM" (construido en mapEvento → formatHora)
    const partes = evento.hora.split(' - ')
    setEditingEvento(evento)
    setFormData({
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      fecha: evento.fecha,          // YYYY-MM-DD
      horaInicio: partes[0] ?? '10:00',
      horaFin: partes[1] ?? '20:00',
      ubicacion: evento.ubicacion,
      imagen: evento.imagen,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError(null)
    setSaving(true)

    try {
      const payload = {
        titulo: formData.nombre,
        descripcion: formData.descripcion,
        fechaInicio: toISO(formData.fecha, formData.horaInicio),
        fechaFin: toISO(formData.fecha, formData.horaFin),
        urlImagen: formData.imagen || null,
        lugar: formData.ubicacion || null,
      }

      if (editingEvento) {
        await actualizarEvento(editingEvento.id, payload)
      } else {
        await agregarEvento(payload)
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error al guardar el evento.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return
    try {
      await eliminarEvento(id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el evento.')
    }
  }

  const handleToggleDestacado = async (id: string) => {
    setTogglingId(id)
    try {
      await toggleDestacadoEvento(id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar el evento.')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Botón Agregar */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[#4051B5] hover:bg-[#3444a0]">
              <Plus className="h-4 w-4" />
              Agregar Evento
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingEvento ? 'Editar Evento' : 'Nuevo Evento'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pb-2">
              {/* Imagen */}
              <ImagePicker value={formData.imagen} onChange={url => set({ imagen: url })} />

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Evento</Label>
                <Input id="nombre" value={formData.nombre} onChange={e => set({ nombre: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea id="descripcion" value={formData.descripcion} onChange={e => set({ descripcion: e.target.value })} rows={3} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" type="date" value={formData.fecha} onChange={e => set({ fecha: e.target.value })} required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="horaInicio">Hora de inicio</Label>
                  <Input id="horaInicio" type="time" value={formData.horaInicio} onChange={e => set({ horaInicio: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaFin">Hora de fin</Label>
                  <Input id="horaFin" type="time" value={formData.horaFin} onChange={e => set({ horaFin: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input id="ubicacion" placeholder="Ej: Plaza Central - Nivel 1" value={formData.ubicacion} onChange={e => set({ ubicacion: e.target.value })} required />
              </div>

              {saveError && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {saveError}
                </div>
              )}

              <Button type="submit" className="w-full bg-[#4051B5] hover:bg-[#3444a0]" disabled={saving}>
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando…</> : (editingEvento ? 'Guardar Cambios' : 'Crear Evento')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de Eventos */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead className="hidden sm:table-cell">Fecha</TableHead>
              <TableHead className="hidden md:table-cell">Horario</TableHead>
              <TableHead className="hidden md:table-cell">Ubicación</TableHead>
              <TableHead className="text-center">
                <span className="flex items-center justify-center gap-1">
                  <Star className="h-3.5 w-3.5" /> Activo en Home
                </span>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingEventos ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  <Loader2 className="inline h-4 w-4 animate-spin mr-2" />Cargando eventos…
                </TableCell>
              </TableRow>
            ) : eventos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No hay eventos registrados
                </TableCell>
              </TableRow>
            ) : (
              eventos.map((evento) => (
                <TableRow key={evento.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        {evento.imagen ? (
                          <Image src={evento.imagen} alt={evento.nombre} fill className="object-cover" sizes="64px" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Calendar className="h-4 w-4 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{evento.nombre}</span>
                          {evento.destacado && (
                            <Sparkles className="h-3 w-3 text-amber-400" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground sm:hidden">
                          {new Date(evento.fecha).toLocaleDateString('es-MX')}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {new Date(evento.fecha + 'T12:00:00').toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {evento.hora}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{evento.ubicacion}</TableCell>

                  {/* Columna Activo en Home */}
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleToggleDestacado(evento.id)}
                      disabled={togglingId === evento.id}
                      title={evento.destacado ? 'Quitar del Home' : 'Mostrar en Home'}
                      className="inline-flex items-center justify-center rounded-full p-1 transition-colors hover:bg-muted disabled:opacity-50"
                    >
                      {togglingId === evento.id ? (
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      ) : (
                        <Star
                          className={`h-5 w-5 transition-colors ${
                            evento.destacado
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground hover:text-amber-400'
                          }`}
                        />
                      )}
                    </button>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(evento)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(evento.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
