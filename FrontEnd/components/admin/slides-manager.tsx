'use client'

import { useState, useEffect, useRef } from 'react'
import {
  fetchPerfiles, fetchPerfil, createPerfil, updatePerfil, deletePerfil, activarPerfil,
  createSlide, updateSlide, deleteSlide,
  fetchImagenesCarrusel, uploadImagenesCarrusel, deleteImagenCarrusel, renameImagenCarrusel,
  type ImagenGaleria,
} from '@/lib/api'
import { useData } from '@/contexts/data-context'
import type { PerfilCarrusel, PerfilResumen, SlideCarrusel, AnimacionEntrada, EstiloTransicion } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Plus, Pencil, Trash2, ImageIcon, ChevronUp, ChevronDown,
  Upload, Zap, Check, Layers, Eye, EyeOff, Images, TriangleAlert,
} from 'lucide-react'

// ─── Catálogos ────────────────────────────────────────────────────────────────

const ANIMACIONES: { value: AnimacionEntrada; label: string; desc: string }[] = [
  { value: 'fade',            label: 'Fundido',       desc: 'Aparece gradualmente'        },
  { value: 'slide-derecha',   label: '← Izquierda',   desc: 'Entra desde la izquierda'    },
  { value: 'slide-izquierda', label: '→ Derecha',     desc: 'Entra desde la derecha'      },
  { value: 'slide-arriba',    label: '↑ Abajo',       desc: 'Sube desde abajo'            },
  { value: 'slide-abajo',     label: '↓ Arriba',      desc: 'Baja desde arriba'           },
  { value: 'zoom',            label: 'Zoom +',        desc: 'Crece desde el centro'       },
  { value: 'zoom-out',        label: 'Zoom −',        desc: 'Se contrae hasta tamaño real'},
  { value: 'flip',            label: 'Volteo 3D',     desc: 'Giro horizontal en 3D'       },
  { value: 'rotate',          label: 'Rotación',      desc: 'Gira y aparece'              },
  { value: 'bounce',          label: 'Rebote',        desc: 'Cae y rebota'                },
]

const TRANSICIONES: { value: EstiloTransicion; label: string; desc: string }[] = [
  { value: 'suave',       label: 'Suave',        desc: 'Natural y fluida'           },
  { value: 'lineal',      label: 'Lineal',       desc: 'Velocidad constante'        },
  { value: 'rapido',      label: 'Rápido',       desc: 'Arranca despacio'           },
  { value: 'salida',      label: 'Salida',       desc: 'Desacelera al final'        },
  { value: 'elastico',    label: 'Elástico',     desc: 'Efecto resorte'             },
  { value: 'exponencial', label: 'Exponencial',  desc: 'Aceleración progresiva'     },
  { value: 'anticipar',   label: 'Anticipar',    desc: 'Retrocede antes de avanzar' },
]

const TIEMPOS = [
  { value: 3000,  label: '3 s'  },
  { value: 5000,  label: '5 s'  },
  { value: 7000,  label: '7 s'  },
  { value: 10000, label: '10 s' },
]

const SLIDE_VACIO: Omit<SlideCarrusel, 'id'> = {
  perfilId: null, urlImagen: '',
  titulo: null, tituloColor: null,
  subtitulo: null, subtituloColor: null,
  animacionEntrada: 'fade', estiloTransicion: 'suave',
  tiempoPermanencia: 5000, orden: 0, activo: true,
}

const MAX_PERFILES = 10
const MAX_SLIDES   = 5

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`
  return `${(b / (1024 * 1024)).toFixed(1)} MB`
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SlidesManager() {
  const { recargarPerfilActivo } = useData()

  // ── Galería ────────────────────────────────────────────────────────────────
  const [imagenes, setImagenes]         = useState<ImagenGaleria[]>([])
  const [loadingGal, setLoadingGal]     = useState(true)
  const [uploading, setUploading]       = useState(false)
  const [uploadError, setUploadError]   = useState<string | null>(null)
  const [delImg, setDelImg]             = useState<ImagenGaleria | null>(null)
  const [renameImg, setRenameImg]       = useState<ImagenGaleria | null>(null)
  const [renameBase, setRenameBase]     = useState('')
  const [renameError, setRenameError]   = useState<string | null>(null)
  const [renameSaving, setRenameSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Perfiles ───────────────────────────────────────────────────────────────
  const [perfiles, setPerfiles]         = useState<PerfilResumen[]>([])
  const [perfilSel, setPerfilSel]       = useState<PerfilCarrusel | null>(null)
  const [loadingPerfiles, setLoadingPerfiles] = useState(true)
  const [loadingDetalle, setLoadingDetalle]   = useState(false)

  const [dialogPerfil, setDialogPerfil] = useState(false)
  const [editPerfil, setEditPerfil]     = useState<PerfilResumen | null>(null)
  const [formPerfil, setFormPerfil]     = useState({ nombre: '', descripcion: '' })

  // ── Slides ─────────────────────────────────────────────────────────────────
  const [dialogSlide, setDialogSlide]   = useState(false)
  const [editSlide, setEditSlide]       = useState<SlideCarrusel | null>(null)
  const [formSlide, setFormSlide]       = useState<Omit<SlideCarrusel, 'id'>>(SLIDE_VACIO)

  // ── Confirmaciones borrado ─────────────────────────────────────────────────
  const [delPerfil, setDelPerfil]       = useState<PerfilResumen | null>(null)
  const [delSlide, setDelSlide]         = useState<SlideCarrusel | null>(null)

  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState<string | null>(null)

  // ── Cargar datos al montar ─────────────────────────────────────────────────
  useEffect(() => {
    cargarGaleria()
    cargarPerfiles()
  }, [])

  const cargarGaleria = async () => {
    setLoadingGal(true)
    try { setImagenes(await fetchImagenesCarrusel()) } catch { /* silencioso */ }
    finally { setLoadingGal(false) }
  }

  const cargarPerfiles = async () => {
    setLoadingPerfiles(true)
    try { setPerfiles(await fetchPerfiles()) } catch { /* silencioso */ }
    finally { setLoadingPerfiles(false) }
  }

  const seleccionarPerfil = async (p: PerfilResumen) => {
    setLoadingDetalle(true)
    try { setPerfilSel(await fetchPerfil(p.id)) } catch { /* silencioso */ }
    finally { setLoadingDetalle(false) }
  }

  // ── Galería: upload múltiple ───────────────────────────────────────────────

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true); setUploadError(null)
    try {
      const nuevas = await uploadImagenesCarrusel(files)
      setImagenes(prev => [...nuevas, ...prev])
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // ── Galería: eliminar imagen ───────────────────────────────────────────────

  const confirmarEliminarImagen = async () => {
    if (!delImg) return
    try {
      await deleteImagenCarrusel(delImg.name)
      setImagenes(prev => prev.filter(i => i.name !== delImg.name))
    } catch { /* silencioso */ }
    finally { setDelImg(null) }
  }

  // ── Galería: renombrar imagen ──────────────────────────────────────────────

  const abrirRenombrar = (img: ImagenGaleria) => {
    const ext = img.name.lastIndexOf('.')
    setRenameBase(ext !== -1 ? img.name.slice(0, ext) : img.name)
    setRenameImg(img)
    setRenameError(null)
  }

  const guardarRename = async () => {
    if (!renameImg) return
    const base = renameBase.trim()
    if (!base) { setRenameError('El nombre no puede estar vacío.'); return }
    if (/[/\\.]/.test(base)) { setRenameError('El nombre no puede contener /, \\ ni puntos.'); return }
    const ext = renameImg.name.slice(renameImg.name.lastIndexOf('.'))
    const newName = `${base}${ext}`
    if (newName === renameImg.name) { setRenameImg(null); return }
    setRenameSaving(true); setRenameError(null)
    try {
      const actualizada = await renameImagenCarrusel(renameImg.name, newName)
      setImagenes(prev => prev.map(i => i.name === renameImg.name
        ? { ...actualizada, size: i.size }
        : i
      ))
      setRenameImg(null)
    } catch (err) {
      setRenameError(err instanceof Error ? err.message : 'Error al renombrar.')
    } finally { setRenameSaving(false) }
  }

  // ── CRUD Perfiles ──────────────────────────────────────────────────────────

  const abrirCrearPerfil = () => {
    setEditPerfil(null)
    setFormPerfil({ nombre: '', descripcion: '' })
    setError(null)
    setDialogPerfil(true)
  }

  const abrirEditarPerfil = (p: PerfilResumen) => {
    setEditPerfil(p)
    setFormPerfil({ nombre: p.nombre, descripcion: p.descripcion ?? '' })
    setError(null)
    setDialogPerfil(true)
  }

  const guardarPerfil = async () => {
    if (!formPerfil.nombre.trim()) { setError('El nombre es obligatorio.'); return }
    if (!editPerfil && perfiles.length >= MAX_PERFILES) {
      setError(`Límite de ${MAX_PERFILES} perfiles alcanzado.`); return
    }
    setSaving(true); setError(null)
    try {
      if (editPerfil) {
        await updatePerfil(editPerfil.id, formPerfil.nombre, formPerfil.descripcion || null)
      } else {
        await createPerfil(formPerfil.nombre, formPerfil.descripcion || null)
      }
      await cargarPerfiles()
      if (editPerfil && perfilSel?.id === editPerfil.id)
        setPerfilSel(await fetchPerfil(editPerfil.id))
      setDialogPerfil(false)
    } catch { setError('No se pudo guardar. Verifica que el backend esté activo.') }
    finally { setSaving(false) }
  }

  const confirmarEliminarPerfil = async () => {
    if (!delPerfil) return
    try {
      await deletePerfil(delPerfil.id)
      if (perfilSel?.id === delPerfil.id) setPerfilSel(null)
      await cargarPerfiles()
      await recargarPerfilActivo()
    } catch { /* silencioso */ }
    finally { setDelPerfil(null) }
  }

  const handleActivar = async (p: PerfilResumen) => {
    try {
      await activarPerfil(p.id)
      await cargarPerfiles()
      await recargarPerfilActivo()
      if (perfilSel?.id === p.id)
        setPerfilSel(await fetchPerfil(p.id))
    } catch { /* silencioso */ }
  }

  // ── CRUD Slides ────────────────────────────────────────────────────────────

  const abrirCrearSlide = () => {
    if (!perfilSel) return
    setEditSlide(null)
    setFormSlide({ ...SLIDE_VACIO, perfilId: perfilSel.id, orden: perfilSel.slides.length })
    setError(null)
    setDialogSlide(true)
  }

  const abrirEditarSlide = (s: SlideCarrusel) => {
    setEditSlide(s)
    setFormSlide({
      perfilId: s.perfilId, urlImagen: s.urlImagen, titulo: s.titulo, subtitulo: s.subtitulo,
      animacionEntrada: s.animacionEntrada, estiloTransicion: s.estiloTransicion,
      tiempoPermanencia: s.tiempoPermanencia, orden: s.orden, activo: s.activo,
    })
    setError(null)
    setDialogSlide(true)
  }

  const guardarSlide = async () => {
    if (!formSlide.urlImagen.trim()) { setError('La imagen es obligatoria.'); return }
    if (!editSlide && perfilSel && perfilSel.slides.length >= MAX_SLIDES) {
      setError(`Este perfil ya tiene el máximo de ${MAX_SLIDES} slides.`); return
    }
    setSaving(true); setError(null)
    try {
      if (editSlide) { await updateSlide(editSlide.id, formSlide) }
      else           { await createSlide(formSlide) }
      if (perfilSel) setPerfilSel(await fetchPerfil(perfilSel.id))
      await cargarPerfiles()
      await recargarPerfilActivo()
      setDialogSlide(false)
    } catch { setError('No se pudo guardar el slide.') }
    finally { setSaving(false) }
  }

  const confirmarEliminarSlide = async () => {
    if (!delSlide || !perfilSel) return
    try {
      await deleteSlide(delSlide.id)
      setPerfilSel(await fetchPerfil(perfilSel.id))
      await cargarPerfiles()
      await recargarPerfilActivo()
    } catch { /* silencioso */ }
    finally { setDelSlide(null) }
  }

  const moverSlide = async (slide: SlideCarrusel, dir: -1 | 1) => {
    if (!perfilSel) return
    const vecino = perfilSel.slides.find(s => s.orden === slide.orden + dir)
    if (!vecino) return
    await Promise.all([
      updateSlide(slide.id,  { ...slide,  orden: vecino.orden }),
      updateSlide(vecino.id, { ...vecino, orden: slide.orden  }),
    ])
    setPerfilSel(await fetchPerfil(perfilSel.id))
    await recargarPerfilActivo()
  }

  const sf = <K extends keyof typeof formSlide>(k: K, v: typeof formSlide[K]) =>
    setFormSlide(prev => ({ ...prev, [k]: v }))

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Tabs defaultValue="galeria" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="galeria" className="gap-2">
          <Images className="h-4 w-4" />
          <span>Galería de Imágenes</span>
          <Badge variant="secondary" className="text-[10px] px-1.5">{imagenes.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="perfiles" className="gap-2">
          <Layers className="h-4 w-4" />
          <span>Perfiles de Carrusel</span>
          <Badge variant="secondary" className="text-[10px] px-1.5">{perfiles.length}/{MAX_PERFILES}</Badge>
        </TabsTrigger>
      </TabsList>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: GALERÍA
      ══════════════════════════════════════════════════════════════════════ */}
      <TabsContent value="galeria" className="space-y-4">

        {/* Zona de carga */}
        <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border p-4">
          <div className="flex-1">
            <p className="text-sm font-medium">Subir imágenes</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, GIF · Máx. 3 MB por archivo · Múltiples archivos permitidos</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="gap-2 shrink-0"
            disabled={uploading}
            onClick={() => { setUploadError(null); fileRef.current?.click() }}
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Subiendo...' : 'Seleccionar archivos'}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {uploadError && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2">
            <TriangleAlert className="h-4 w-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{uploadError}</p>
          </div>
        )}

        {/* Grid de imágenes */}
        {loadingGal ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-video animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : imagenes.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">La galería está vacía.<br />Sube imágenes para comenzar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {imagenes.map(img => (
              <div
                key={img.name}
                className="group relative aspect-video overflow-hidden rounded-lg border bg-muted"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="h-full w-full object-cover"
                />
                {/* Overlay con acciones */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/60 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <p className="max-w-full truncate px-2 text-[10px] font-medium text-white">
                    {img.name}
                  </p>
                  <p className="text-[10px] text-white/70">{formatBytes(img.size)}</p>
                  <div className="flex gap-1.5 mt-1">
                    <button
                      onClick={() => abrirRenombrar(img)}
                      className="flex items-center gap-1 rounded-md bg-white/20 px-2 py-1 text-[10px] font-medium text-white hover:bg-white/35 transition-colors"
                    >
                      <Pencil className="h-3 w-3" /> Renombrar
                    </button>
                    <button
                      onClick={() => setDelImg(img)}
                      className="flex items-center gap-1 rounded-md bg-red-500/70 px-2 py-1 text-[10px] font-medium text-white hover:bg-red-500/90 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: PERFILES
      ══════════════════════════════════════════════════════════════════════ */}
      <TabsContent value="perfiles">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ── Panel izquierdo: lista de perfiles ───────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Perfiles</p>
                <p className={`text-xs font-medium ${
                  perfiles.length >= MAX_PERFILES
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                }`}>
                  {perfiles.length}/{MAX_PERFILES}
                  {perfiles.length >= MAX_PERFILES && ' · Límite alcanzado'}
                </p>
              </div>
              <Button
                size="sm"
                onClick={abrirCrearPerfil}
                disabled={perfiles.length >= MAX_PERFILES}
                className="gap-1 h-8 bg-[#4051B5] hover:bg-[#3444a0] text-xs disabled:opacity-50"
              >
                <Plus className="h-3 w-3" /> Nuevo
              </Button>
            </div>

            {loadingPerfiles ? (
              <p className="text-sm text-muted-foreground">Cargando...</p>
            ) : perfiles.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed p-6 text-center">
                <Layers className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">Sin perfiles.<br />Crea el primero.</p>
              </div>
            ) : (
              perfiles.map(p => (
                <div
                  key={p.id}
                  onClick={() => seleccionarPerfil(p)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all hover:shadow-md ${
                    perfilSel?.id === p.id
                      ? 'border-[#4051B5] bg-[#4051B5]/5 shadow-sm'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm">{p.nombre}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {p.totalSlides}/{MAX_SLIDES} slide{p.totalSlides !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {p.activo && (
                        <Badge className="h-5 bg-green-500 text-white text-[10px] px-1.5">Activo</Badge>
                      )}
                      <Button size="icon" variant="ghost" className="h-6 w-6"
                        onClick={e => { e.stopPropagation(); abrirEditarPerfil(p) }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={e => { e.stopPropagation(); setDelPerfil(p) }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {!p.activo && (
                    <Button size="sm" variant="outline" className="mt-2 h-7 w-full text-xs gap-1"
                      onClick={e => { e.stopPropagation(); handleActivar(p) }}>
                      <Zap className="h-3 w-3" /> Activar
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* ── Panel derecho: detalle del perfil ────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {!perfilSel ? (
              <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed text-center">
                <div>
                  <Eye className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">Selecciona un perfil para ver sus slides</p>
                </div>
              </div>
            ) : loadingDetalle ? (
              <p className="text-sm text-muted-foreground py-4">Cargando detalle...</p>
            ) : (
              <>
                {/* Header del perfil */}
                <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                  <div>
                    <p className="font-semibold">{perfilSel.nombre}</p>
                    {perfilSel.descripcion && (
                      <p className="text-sm text-muted-foreground">{perfilSel.descripcion}</p>
                    )}
                  </div>
                  {perfilSel.activo ? (
                    <Badge className="bg-green-500 text-white gap-1">
                      <Check className="h-3 w-3" /> Perfil activo
                    </Badge>
                  ) : (
                    <Button size="sm" className="gap-1 bg-[#4051B5] hover:bg-[#3444a0]"
                      onClick={() => handleActivar(perfiles.find(p => p.id === perfilSel.id)!)}>
                      <Zap className="h-4 w-4" /> Activar perfil
                    </Button>
                  )}
                </div>

                {/* Lista de slides */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Slides</p>
                      <p className={`text-xs font-medium ${
                        perfilSel.slides.length >= MAX_SLIDES
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                      }`}>
                        {perfilSel.slides.length}/{MAX_SLIDES}
                        {perfilSel.slides.length >= MAX_SLIDES && ' · Límite alcanzado'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={abrirCrearSlide}
                      disabled={perfilSel.slides.length >= MAX_SLIDES}
                      className="gap-1 h-8 bg-[#4051B5] hover:bg-[#3444a0] text-xs disabled:opacity-50"
                    >
                      <Plus className="h-3 w-3" /> Agregar slide
                    </Button>
                  </div>

                  {perfilSel.slides.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed p-8 text-center">
                      <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground">Sin slides. Agrega el primero.</p>
                    </div>
                  ) : (
                    perfilSel.slides.map((slide, idx) => (
                      <div key={slide.id} className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
                        {/* Miniatura */}
                        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {slide.urlImagen
                            ? <img src={slide.urlImagen} alt="" className="h-full w-full object-cover" />
                            : <div className="flex h-full items-center justify-center"><ImageIcon className="h-5 w-5 text-muted-foreground/40" /></div>
                          }
                        </div>
                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {slide.titulo ?? <span className="italic text-muted-foreground">Sin título</span>}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {ANIMACIONES.find(a => a.value === slide.animacionEntrada)?.label}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {TRANSICIONES.find(t => t.value === slide.estiloTransicion)?.label}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">{slide.tiempoPermanencia / 1000}s</span>
                            {!slide.activo && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Oculto</Badge>}
                          </div>
                        </div>
                        {/* Reordenar */}
                        <div className="flex flex-col gap-0.5">
                          <button disabled={idx === 0} onClick={() => moverSlide(slide, -1)}
                            className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-25">
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button disabled={idx === perfilSel.slides.length - 1} onClick={() => moverSlide(slide, 1)}
                            className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-25">
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                        {/* Acciones */}
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => abrirEditarSlide(slide)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDelSlide(slide)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </TabsContent>

      {/* ══ DIALOG: Renombrar imagen ════════════════════════════════════════════ */}
      <Dialog open={!!renameImg} onOpenChange={open => { if (!open) setRenameImg(null) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Renombrar imagen</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {renameImg && (
              <div className="h-24 overflow-hidden rounded-lg bg-muted">
                <img src={renameImg.url} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Nombre <span className="text-xs text-muted-foreground">(sin extensión)</span></Label>
              <Input
                value={renameBase}
                onChange={e => setRenameBase(e.target.value)}
                placeholder="nombre-de-imagen"
                onKeyDown={e => e.key === 'Enter' && guardarRename()}
              />
              {renameImg && (
                <p className="text-xs text-muted-foreground">
                  Extensión: <span className="font-mono">{renameImg.name.slice(renameImg.name.lastIndexOf('.'))}</span>
                </p>
              )}
            </div>
            <p className="text-xs text-amber-600 flex items-start gap-1.5">
              <TriangleAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              Los slides que usen esta imagen no se actualizan automáticamente.
            </p>
            {renameError && <p className="text-sm text-destructive">{renameError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameImg(null)}>Cancelar</Button>
            <Button disabled={renameSaving} onClick={guardarRename} className="bg-[#4051B5] hover:bg-[#3444a0]">
              {renameSaving ? 'Guardando...' : 'Renombrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══ DIALOG: Perfil ══════════════════════════════════════════════════════ */}
      <Dialog open={dialogPerfil} onOpenChange={setDialogPerfil}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editPerfil ? 'Editar perfil' : 'Nuevo perfil de carrusel'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nombre <span className="text-destructive">*</span></Label>
              <Input placeholder="Ej. Verano 2026" value={formPerfil.nombre}
                onChange={e => setFormPerfil(p => ({ ...p, nombre: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción <span className="text-xs text-muted-foreground">(opcional)</span></Label>
              <Input placeholder="Nota interna sobre este perfil" value={formPerfil.descripcion}
                onChange={e => setFormPerfil(p => ({ ...p, descripcion: e.target.value }))} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogPerfil(false)}>Cancelar</Button>
            <Button disabled={saving} onClick={guardarPerfil} className="bg-[#4051B5] hover:bg-[#3444a0]">
              {saving ? 'Guardando...' : editPerfil ? 'Guardar' : 'Crear perfil'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══ DIALOG: Slide ═══════════════════════════════════════════════════════ */}
      <Dialog open={dialogSlide} onOpenChange={setDialogSlide}>
        <DialogContent className="sm:max-w-2xl flex flex-col max-h-[90vh] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>{editSlide ? 'Editar slide' : 'Nuevo slide'}</DialogTitle>
          </DialogHeader>

          {/* Área scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

            {/* ① Imagen */}
            <section className="space-y-3">
              <p className="text-sm font-semibold flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4051B5] text-white text-[10px] font-bold">1</span>
                Imagen <span className="text-destructive text-xs font-normal">*</span>
              </p>

              {imagenes.length === 0 ? (
                <p className="text-xs text-amber-600 flex items-center gap-1.5">
                  <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
                  No hay imágenes en la galería. Súbelas desde la pestaña <strong>Galería de Imágenes</strong>.
                </p>
              ) : (
                <Select
                  value={formSlide.urlImagen || ''}
                  onValueChange={val => sf('urlImagen', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una imagen…" />
                  </SelectTrigger>
                  <SelectContent>
                    {imagenes.map(img => (
                      <SelectItem key={img.name} value={img.url}>
                        <span className="flex items-center gap-2">
                          <img src={img.url} alt={img.name} className="h-6 w-10 rounded object-cover shrink-0" />
                          <span className="truncate max-w-[260px] text-sm">{img.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Preview de la imagen seleccionada */}
              {formSlide.urlImagen && (
                <div className="h-36 overflow-hidden rounded-xl border bg-muted">
                  <img src={formSlide.urlImagen} alt="preview" className="h-full w-full object-cover" />
                </div>
              )}
            </section>

            {/* ② Contenido */}
            <section className="space-y-3">
              <p className="text-sm font-semibold flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4051B5] text-white text-[10px] font-bold">2</span>
                Contenido <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
              </p>
              <Input placeholder="Título principal sobre la imagen"
                value={formSlide.titulo ?? ''}
                onChange={e => sf('titulo', e.target.value || null)} />
              <Input placeholder="Subtítulo descriptivo"
                value={formSlide.subtitulo ?? ''}
                onChange={e => sf('subtitulo', e.target.value || null)} />
            </section>

            {/* ③ Animación de entrada */}
            <section className="space-y-3">
              <p className="text-sm font-semibold flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4051B5] text-white text-[10px] font-bold">3</span>
                Animación de entrada
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {ANIMACIONES.map(a => (
                  <button key={a.value} type="button" onClick={() => sf('animacionEntrada', a.value)}
                    title={a.desc}
                    className={`rounded-lg border px-2 py-2 text-center text-xs font-medium transition-all hover:shadow-sm ${
                      formSlide.animacionEntrada === a.value
                        ? 'border-[#4051B5] bg-[#4051B5] text-white shadow-md'
                        : 'border-border bg-card text-foreground hover:border-[#4051B5]/50'
                    }`}>
                    {a.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">
                {ANIMACIONES.find(a => a.value === formSlide.animacionEntrada)?.desc}
              </p>
            </section>

            {/* ④ Estilo de transición */}
            <section className="space-y-3">
              <p className="text-sm font-semibold flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4051B5] text-white text-[10px] font-bold">4</span>
                Estilo de transición
              </p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {TRANSICIONES.map(t => (
                  <button key={t.value} type="button" onClick={() => sf('estiloTransicion', t.value)}
                    title={t.desc}
                    className={`rounded-lg border px-2 py-2 text-center text-xs font-medium transition-all hover:shadow-sm ${
                      formSlide.estiloTransicion === t.value
                        ? 'border-[#4051B5] bg-[#4051B5] text-white shadow-md'
                        : 'border-border bg-card text-foreground hover:border-[#4051B5]/50'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">
                {TRANSICIONES.find(t => t.value === formSlide.estiloTransicion)?.desc}
              </p>
            </section>

            {/* ⑤ Tiempo en pantalla */}
            <section className="space-y-3">
              <p className="text-sm font-semibold flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4051B5] text-white text-[10px] font-bold">5</span>
                Tiempo en pantalla
              </p>
              <div className="flex items-center gap-2">
                {TIEMPOS.map(t => (
                  <button key={t.value} type="button" onClick={() => sf('tiempoPermanencia', t.value)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      formSlide.tiempoPermanencia === t.value
                        ? 'border-[#4051B5] bg-[#4051B5] text-white shadow-md'
                        : 'border-border bg-card hover:border-[#4051B5]/50'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </section>

            {/* ⑥ Visibilidad */}
            <section>
              <button type="button" onClick={() => sf('activo', !formSlide.activo)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${
                  formSlide.activo
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-border bg-muted text-muted-foreground'
                }`}>
                {formSlide.activo
                  ? <><Eye className="h-4 w-4" /> Visible en el carrusel</>
                  : <><EyeOff className="h-4 w-4" /> Oculto (desactivado)</>
                }
              </button>
            </section>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {/* Footer siempre visible */}
          <div className="flex justify-end gap-2 border-t px-6 py-4 shrink-0">
            <Button variant="outline" onClick={() => setDialogSlide(false)}>Cancelar</Button>
            <Button disabled={saving} onClick={guardarSlide} className="bg-[#4051B5] hover:bg-[#3444a0] px-8">
              {saving ? 'Guardando...' : editSlide ? 'Guardar cambios' : 'Guardar slide'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══ Confirmar eliminar imagen ════════════════════════════════════════════ */}
      <AlertDialog open={!!delImg} onOpenChange={() => setDelImg(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará <span className="font-mono font-medium">{delImg?.name}</span> de la carpeta.
              Los slides que la usen mostrarán una imagen rota. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEliminarImagen}
              className="bg-destructive text-white hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ══ Confirmar eliminar perfil ════════════════════════════════════════════ */}
      <AlertDialog open={!!delPerfil} onOpenChange={() => setDelPerfil(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar perfil &quot;{delPerfil?.nombre}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminarán también todos sus slides. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEliminarPerfil}
              className="bg-destructive text-white hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ══ Confirmar eliminar slide ═════════════════════════════════════════════ */}
      <AlertDialog open={!!delSlide} onOpenChange={() => setDelSlide(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este slide?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEliminarSlide}
              className="bg-destructive text-white hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  )
}
