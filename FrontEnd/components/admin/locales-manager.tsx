'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useData } from '@/contexts/data-context'
import { fetchImagenesLocales, uploadImagenLocal, deleteImagenLocal, type ImagenLocal } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Pencil, Trash2, Store, Search, Tag, Upload, ImageIcon, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import type { Local, Categoria } from '@/lib/types'
import type { UpsertLocalPayload } from '@/lib/api'
import { getStaticUrl } from '@/lib/utils'

// ─── Helper de estilo de badge ───────────────────────────────────────────────

function catStyle(cat: Categoria): React.CSSProperties {
  if (!cat.color) return {}
  const hex = cat.color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return {
    backgroundColor: `rgba(${r},${g},${b},0.15)`,
    color: cat.color,
    borderColor: `rgba(${r},${g},${b},0.4)`,
  }
}

// ─── Uploader de foto de local ───────────────────────────────────────────────

function ImagePickerLocal({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
  const [galeria, setGaleria] = useState<ImagenLocal[]>([])
  const [loadingGaleria, setLoadingGaleria] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [showGaleria, setShowGaleria] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const cargarGaleria = useCallback(async () => {
    setLoadingGaleria(true)
    try { setGaleria(await fetchImagenesLocales()) } catch { /* ignorar */ }
    finally { setLoadingGaleria(false) }
  }, [])

  useEffect(() => { if (showGaleria) cargarGaleria() }, [showGaleria, cargarGaleria])

  const handleFile = async (file: File) => {
    setUploadError(null)
    setUploading(true)
    try {
      const result = await uploadImagenLocal(file)
      onChange(result.url)
      setGaleria(prev => [result, ...prev])
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir la imagen.')
    } finally { setUploading(false) }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleDeleteFromGaleria = async (img: ImagenLocal) => {
    try {
      await deleteImagenLocal(img.name)
      setGaleria(prev => prev.filter(i => i.name !== img.name))
      if (value === img.url) onChange(null)
    } catch { /* ignorar */ }
  }

  return (
    <div className="space-y-3">
      <Label>Foto del Local</Label>

      {/* Drop zone / preview */}
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
            <Image src={getStaticUrl(value)} alt="Vista previa" fill className="object-cover" sizes="480px" />
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
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
      </div>

      {uploadError && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <X className="h-3 w-3" />{uploadError}
        </p>
      )}

      {/* Botones de acción */}
      <div className="flex gap-2">
        {value && (
          <Button type="button" variant="outline" size="sm" onClick={() => onChange(null)} className="gap-1 text-destructive hover:text-destructive">
            <X className="h-3 w-3" /> Quitar foto
          </Button>
        )}
        <Button
          type="button" variant="outline" size="sm"
          onClick={() => { setShowGaleria(v => !v) }}
          className="gap-1"
        >
          <ImageIcon className="h-3 w-3" />
          {showGaleria ? 'Ocultar galería' : 'Ver galería'}
        </Button>
      </div>

      {/* Galería */}
      {showGaleria && (
        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Fotos guardadas — clic para seleccionar</p>
          {loadingGaleria ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : galeria.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No hay fotos guardadas.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {galeria.map(img => (
                <div
                  key={img.name}
                  className={`group relative aspect-square cursor-pointer overflow-hidden rounded-md border-2 transition-all ${value === img.url ? 'border-indigo-500' : 'border-transparent hover:border-indigo-300'}`}
                  onClick={() => onChange(img.url)}
                >
                  <Image src={getStaticUrl(img.url)} alt={img.name} fill className="object-cover" sizes="120px" />
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); handleDeleteFromGaleria(img) }}
                    className="absolute right-0.5 top-0.5 hidden rounded-full bg-black/60 p-0.5 text-white group-hover:flex"
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

// ─── Formulario de Local ─────────────────────────────────────────────────────

const EMPTY_FORM: UpsertLocalPayload = {
  nombre: '', numeroLocal: '', nivel: 'Nivel 1',
  descripcion: '', urlFoto: null, categoriaIds: [], horario: '', telefono: null,
}

function LocalForm({
  initial, categorias, onSave, onClose, loading,
}: {
  initial: UpsertLocalPayload
  categorias: Categoria[]
  onSave: (data: UpsertLocalPayload) => Promise<void>
  onClose: () => void
  loading: boolean
}) {
  const [form, setForm] = useState<UpsertLocalPayload>(initial)

  const toggleCat = (id: number) =>
    setForm(prev => ({
      ...prev,
      categoriaIds: prev.categoriaIds.includes(id)
        ? prev.categoriaIds.filter(c => c !== id)
        : [...prev.categoriaIds, id],
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave({ ...form, telefono: form.telefono?.trim() || null, urlFoto: form.urlFoto?.trim() || null })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del Local</Label>
        <Input id="nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Nivel</Label>
          <Select value={form.nivel} onValueChange={v => setForm({ ...form, nivel: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Nivel 1">Nivel 1</SelectItem>
              <SelectItem value="Nivel 2">Nivel 2</SelectItem>
              <SelectItem value="Nivel 3">Nivel 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="numeroLocal">Número de Local</Label>
          <Input id="numeroLocal" placeholder="Ej: L-201" value={form.numeroLocal}
            onChange={e => setForm({ ...form, numeroLocal: e.target.value })} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Categorías</Label>
        {categorias.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay categorías disponibles.</p>
        ) : (
          <div className="flex flex-wrap gap-2 rounded-md border p-3">
            {categorias.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCat(cat.id)}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-all"
                style={
                  form.categoriaIds.includes(cat.id)
                    ? { ...(cat.color ? { backgroundColor: cat.color, borderColor: cat.color, color: '#fff' } : { backgroundColor: '#4051B5', borderColor: '#4051B5', color: '#fff' }) }
                    : { ...(cat.color ? { borderColor: cat.color, color: cat.color } : {}) }
                }
              >
                <span>{cat.nombre}</span>
              </button>
            ))}
          </div>
        )}
        {form.categoriaIds.length === 0 && (
          <p className="text-xs text-muted-foreground">Selecciona al menos una categoría.</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="horario">Horario</Label>
          <Input id="horario" placeholder="Ej: 10:00 - 21:00" value={form.horario}
            onChange={e => setForm({ ...form, horario: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono (opcional)</Label>
          <Input id="telefono" placeholder="Ej: +58 212 123 4567" value={form.telefono ?? ''}
            onChange={e => setForm({ ...form, telefono: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" value={form.descripcion} rows={3}
          onChange={e => setForm({ ...form, descripcion: e.target.value })} required />
      </div>

      <ImagePickerLocal
        value={form.urlFoto ?? null}
        onChange={url => setForm({ ...form, urlFoto: url })}
      />

      <Button type="submit" disabled={loading} className="w-full bg-[#4051B5] hover:bg-[#3444a0]">
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  )
}

// ─── Gestión de Categorías (con selector de color) ───────────────────────────

const PRESET_COLORS = [
  '#f97316', '#ec4899', '#3b82f6', '#a855f7',
  '#6b7280', '#f43f5e', '#22c55e', '#10b981',
  '#eab308', '#14b8a6', '#8b5cf6', '#ef4444',
]

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>Color</Label>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
            style={{
              backgroundColor: c,
              borderColor: value === c ? '#1e1e1e' : 'transparent',
              outline: value === c ? `2px solid ${c}` : 'none',
              outlineOffset: '2px',
            }}
          />
        ))}
        {/* Input manual */}
        <input
          type="color"
          value={value || '#6b7280'}
          onChange={e => onChange(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded-full border border-border"
          title="Color personalizado"
        />
      </div>
    </div>
  )
}

function CategoriasManager() {
  const { categorias, loadingCategorias, agregarCategoria, actualizarCategoria, eliminarCategoria } = useData()
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoColor, setNuevoColor] = useState('#6b7280')
  const [editingCat, setEditingCat] = useState<Categoria | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [editColor, setEditColor] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoNombre.trim()) return
    setSaving(true); setError(null)
    try {
      await agregarCategoria(nuevoNombre.trim(), nuevoColor)
      setNuevoNombre(''); setNuevoColor('#6b7280')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear categoría')
    } finally { setSaving(false) }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCat || !editNombre.trim()) return
    setSaving(true); setError(null)
    try {
      await actualizarCategoria(editingCat.id, editNombre.trim(), editColor || null)
      setEditingCat(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar categoría')
    } finally { setSaving(false) }
  }

  const handleDelete = async (cat: Categoria) => {
    if (!confirm(`¿Eliminar la categoría "${cat.nombre}"?\nLos locales perderán esta categoría.`)) return
    try { await eliminarCategoria(cat.id) }
    catch (err) { setError(err instanceof Error ? err.message : 'Error al eliminar') }
  }

  const startEdit = (cat: Categoria) => {
    setEditingCat(cat); setEditNombre(cat.nombre); setEditColor(cat.color ?? '#6b7280')
  }

  return (
    <div className="space-y-6">
      {/* ── Agregar nueva ── */}
      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <Tag className="h-4 w-4 text-[#4051B5]" />
          Nueva Categoría
        </h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Nombre de la categoría"
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
              className="flex-1"
            />
          </div>
          <ColorPicker value={nuevoColor} onChange={setNuevoColor} />
          {/* Preview */}
          {nuevoNombre && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Vista previa:</span>
              <Badge
                variant="outline"
                style={{
                  backgroundColor: `${nuevoColor}22`,
                  color: nuevoColor,
                  borderColor: `${nuevoColor}66`,
                }}
              >
                {nuevoNombre}
              </Badge>
            </div>
          )}
          <Button type="submit" disabled={saving || !nuevoNombre.trim()} className="bg-[#4051B5] hover:bg-[#3444a0]">
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </form>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {/* ── Lista ── */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingCategorias ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">Cargando…</TableCell>
              </TableRow>
            ) : categorias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  No hay categorías. Agrega la primera arriba.
                </TableCell>
              </TableRow>
            ) : (
              categorias.map(cat => (
                <TableRow key={cat.id}>
                  <TableCell>
                    {editingCat?.id === cat.id ? (
                      <form onSubmit={handleUpdate} className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            value={editNombre}
                            onChange={e => setEditNombre(e.target.value)}
                            className="h-8 flex-1"
                            autoFocus
                          />
                        </div>
                        <ColorPicker value={editColor} onChange={setEditColor} />
                        {editNombre && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Vista previa:</span>
                            <Badge
                              variant="outline"
                              style={{
                                backgroundColor: `${editColor}22`,
                                color: editColor,
                                borderColor: `${editColor}66`,
                              }}
                            >
                              {editNombre}
                            </Badge>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button type="submit" size="sm" disabled={saving} className="bg-[#4051B5] hover:bg-[#3444a0]">
                            Guardar
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={() => setEditingCat(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <Badge variant="outline" style={catStyle(cat)}>
                        {cat.nombre}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingCat?.id !== cat.id && (
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(cat)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => handleDelete(cat)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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

// ─── Componente principal ────────────────────────────────────────────────────

export function LocalesManager() {
  const { locales, loadingLocales, categorias, agregarLocal, actualizarLocal, eliminarLocal } = useData()
  const [editingLocal, setEditingLocal] = useState<Local | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState<string>('all')

  const filteredLocales = locales.filter(local => {
    const matchesSearch =
      local.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      local.numeroLocal.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria =
      filterCategoria === 'all' || local.categorias.some(c => c.nombre === filterCategoria)
    return matchesSearch && matchesCategoria
  })

  const handleSave = async (data: UpsertLocalPayload) => {
    setSaving(true)
    try {
      if (editingLocal) await actualizarLocal(editingLocal.id, data)
      else await agregarLocal(data)
    } finally { setSaving(false) }
  }

  const handleClose = () => { setIsDialogOpen(false); setEditingLocal(null) }

  const handleEdit = (local: Local) => { setEditingLocal(local); setIsDialogOpen(true) }

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar el local "${nombre}"?`)) return
    await eliminarLocal(id)
  }

  const initialForm: UpsertLocalPayload = editingLocal
    ? {
        nombre: editingLocal.nombre,
        categoriaIds: editingLocal.categorias.map(c => c.id),
        nivel: editingLocal.nivel,
        numeroLocal: editingLocal.numeroLocal,
        urlFoto: editingLocal.imagen || null,
        descripcion: editingLocal.descripcion,
        horario: editingLocal.horario,
        telefono: editingLocal.telefono ?? null,
      }
    : { ...EMPTY_FORM }

  return (
    <Tabs defaultValue="locales" className="space-y-6">
      <TabsList>
        <TabsTrigger value="locales" className="gap-2">
          <Store className="h-4 w-4" />
          Locales
        </TabsTrigger>
        <TabsTrigger value="categorias" className="gap-2">
          <Tag className="h-4 w-4" />
          Categorías
        </TabsTrigger>
      </TabsList>

      {/* ── Pestaña Locales ── */}
      <TabsContent value="locales" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar local..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat.id} value={cat.nombre}>{cat.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={open => { if (!open) handleClose() }}>
            <DialogTrigger asChild>
              <Button
                className="gap-2 bg-[#4051B5] hover:bg-[#3444a0]"
                onClick={() => { setEditingLocal(null); setIsDialogOpen(true) }}
              >
                <Plus className="h-4 w-4" />
                Agregar Local
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingLocal ? 'Editar Local' : 'Nuevo Local'}</DialogTitle>
              </DialogHeader>
              <LocalForm
                key={editingLocal?.id ?? 'new'}
                initial={initialForm}
                categorias={categorias}
                onSave={handleSave}
                onClose={handleClose}
                loading={saving}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabla */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Local</TableHead>
                <TableHead className="hidden sm:table-cell">Categorías</TableHead>
                <TableHead className="hidden md:table-cell">Ubicación</TableHead>
                <TableHead className="hidden lg:table-cell">Horario</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingLocales ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">Cargando locales...</TableCell>
                </TableRow>
              ) : filteredLocales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay locales que coincidan
                  </TableCell>
                </TableRow>
              ) : (
                filteredLocales.map(local => (
                  <TableRow key={local.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium">{local.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {local.categorias.map(cat => (
                          <Badge key={cat.id} variant="outline" className="text-xs" style={catStyle(cat)}>
                            {cat.nombre}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {local.nivel} - {local.numeroLocal}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{local.horario}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(local)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => handleDelete(local.id, local.nombre)}
                          className="text-destructive hover:text-destructive"
                        >
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

        <p className="text-sm text-muted-foreground">
          Mostrando {filteredLocales.length} de {locales.length} locales
        </p>
      </TabsContent>

      {/* ── Pestaña Categorías ── */}
      <TabsContent value="categorias">
        <CategoriasManager />
      </TabsContent>
    </Tabs>
  )
}
