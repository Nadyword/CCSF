'use client'

import { useState, useMemo } from 'react'
import { useData } from '@/contexts/data-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Store, Search, MapPin, Clock, Phone, Building2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import type { Categoria, Local } from '@/lib/types'

const PAGE_SIZE_OPTIONS = [10, 20] as const

/** Convierte un color hex en clases Tailwind inline de badge */
function categoriaBadgeStyle(cat: Categoria): React.CSSProperties {
  if (!cat.color) return {}
  // Generar fondo semitransparente del color de la categoría
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

export default function DirectorioPage() {
  const { locales, loadingLocales, categorias } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<10 | 20>(20)

  const filteredLocales = useMemo(() => {
    return locales.filter(local => {
      const matchesSearch =
        local.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        local.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategoria =
        !selectedCategoria ||
        local.categorias.some(c => c.nombre === selectedCategoria)
      return matchesSearch && matchesCategoria
    })
  }, [locales, searchTerm, selectedCategoria])

  const totalPages = Math.max(1, Math.ceil(filteredLocales.length / pageSize))
  const paginatedLocales = filteredLocales.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSearch = (value: string) => { setSearchTerm(value); setCurrentPage(1) }
  const handleCategoria = (cat: string | null) => { setSelectedCategoria(cat); setCurrentPage(1) }
  const handlePageSize = (value: string) => { setPageSize(Number(value) as 10 | 20); setCurrentPage(1) }

  return (
    <main className="min-h-screen pb-12">
      {/* ── Banner ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-600 to-purple-700 pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 right-10 h-56 w-56 rounded-full bg-indigo-300/20 blur-2xl" />
          <div className="absolute top-8 right-1/4 h-40 w-40 rounded-full bg-purple-300/15 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Building2 className="mr-1 h-3 w-3" />
            Directorio
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl drop-shadow">
            Directorio de Tiendas
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
            Encuentra todas las tiendas, restaurantes y servicios del centro comercial
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        {/* Buscador */}
        <div className="mb-8">
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-12 pl-12 text-base"
            />
          </div>
        </div>

        {/* Filtros de Categoría */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedCategoria === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoria(null)}
            className={selectedCategoria === null ? 'bg-[#4051B5] hover:bg-[#3444a0]' : ''}
          >
            Todas
          </Button>
          {categorias.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategoria === cat.nombre ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoria(cat.nombre)}
              style={
                selectedCategoria === cat.nombre && cat.color
                  ? { backgroundColor: cat.color, borderColor: cat.color, color: '#fff' }
                  : selectedCategoria !== cat.nombre && cat.color
                    ? { borderColor: cat.color, color: cat.color }
                    : undefined
              }
            >
              {cat.nombre}
            </Button>
          ))}
        </div>

        {/* Barra de resultados */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {loadingLocales
              ? 'Cargando locales...'
              : `Mostrando ${paginatedLocales.length} de ${filteredLocales.length} locales`}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Por página:</span>
            <Select value={String(pageSize)} onValueChange={handlePageSize}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map(n => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        {loadingLocales ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border bg-card">
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedLocales.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Store className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 text-lg font-semibold">No se encontraron resultados</h2>
            <p className="mt-2 text-muted-foreground">Intenta con otros términos o categoría</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedLocales.map((local) => (
              <Card
                key={local.id}
                className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
                onClick={() => setSelectedLocal(local)}
              >
                <div className="relative h-40 bg-gradient-to-br from-[#4051B5]/20 to-[#4051B5]/5 overflow-hidden">
                  {local.imagen ? (
                    <Image src={local.imagen} alt={local.nombre} fill className="object-cover" sizes="320px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Store className="h-12 w-12 text-[#4051B5]/30" />
                    </div>
                  )}
                  {/* Categorías — máximo 2 en la tarjeta */}
                  <div className="absolute right-2 top-2 flex flex-col gap-1 items-end">
                    {local.categorias.slice(0, 2).map(cat => (
                      <Badge
                        key={cat.id}
                        variant="outline"
                        className="text-xs"
                        style={categoriaBadgeStyle(cat)}
                      >
                        {cat.nombre}
                      </Badge>
                    ))}
                    {local.categorias.length > 2 && (
                      <Badge variant="outline" className="text-xs bg-muted/80">
                        +{local.categorias.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-[#4051B5] transition-colors">
                    {local.nombre}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {local.descripcion}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{local.nivel} - {local.numeroLocal}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Paginación */}
        {!loadingLocales && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline" size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? 'bg-[#4051B5] hover:bg-[#3444a0] min-w-9' : 'min-w-9'}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline" size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Modal Detalle */}
      <Dialog open={!!selectedLocal} onOpenChange={() => setSelectedLocal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Store className="h-5 w-5 text-[#4051B5]" />
              {selectedLocal?.nombre}
            </DialogTitle>
          </DialogHeader>
          {selectedLocal && (
            <div className="space-y-4">
              <div className="relative h-48 rounded-lg bg-gradient-to-br from-[#4051B5]/20 to-[#4051B5]/5 overflow-hidden flex items-center justify-center">
                {selectedLocal.imagen ? (
                  <Image src={selectedLocal.imagen} alt={selectedLocal.nombre} fill className="object-cover" sizes="480px" />
                ) : (
                  <Store className="h-16 w-16 text-[#4051B5]/30" />
                )}
              </div>

              {/* Todas las categorías */}
              <div className="flex flex-wrap gap-2">
                {selectedLocal.categorias.map(cat => (
                  <Badge key={cat.id} variant="outline" style={categoriaBadgeStyle(cat)}>
                    {cat.nombre}
                  </Badge>
                ))}
              </div>

              <p className="text-muted-foreground">{selectedLocal.descripcion}</p>

              <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#4051B5]" />
                  <span>{selectedLocal.nivel} - Local {selectedLocal.numeroLocal}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#4051B5]" />
                  <span>{selectedLocal.horario}</span>
                </div>
                {selectedLocal.telefono && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#4051B5]" />
                    <span>{selectedLocal.telefono}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
