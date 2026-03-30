'use client'

import { useState, useMemo } from 'react'
import { useData } from '@/contexts/data-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Store, Search, MapPin, Clock, Phone, Building2 } from 'lucide-react'
import { categoriasLocales } from '@/lib/data'
import type { Local } from '@/lib/types'

export default function DirectorioPage() {
  const { locales } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null)

  // Filtrar locales
  const filteredLocales = useMemo(() => {
    return locales.filter(local => {
      const matchesSearch = local.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           local.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategoria = !selectedCategoria || local.categoria === selectedCategoria
      return matchesSearch && matchesCategoria
    })
  }, [locales, searchTerm, selectedCategoria])

  const getCategoryColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'Gastronomía': 'bg-orange-100 text-orange-700 border-orange-200',
      'Moda': 'bg-pink-100 text-pink-700 border-pink-200',
      'Tecnología': 'bg-blue-100 text-blue-700 border-blue-200',
      'Entretenimiento': 'bg-purple-100 text-purple-700 border-purple-200',
      'Servicios': 'bg-gray-100 text-gray-700 border-gray-200',
      'Belleza': 'bg-rose-100 text-rose-700 border-rose-200',
      'Hogar': 'bg-green-100 text-green-700 border-green-200',
      'Deportes': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    }
    return colors[categoria] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  return (
    <main className="min-h-screen bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4 bg-[#4051B5]">
            <Building2 className="mr-1 h-3 w-3" />
            Directorio
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Directorio de Tiendas
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Encuentra todas las tiendas, restaurantes y servicios del centro comercial
          </p>
        </div>

        {/* Buscador */}
        <div className="mb-8">
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-12 text-base"
            />
          </div>
        </div>

        {/* Filtros de Categoría */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedCategoria === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategoria(null)}
            className={selectedCategoria === null ? 'bg-[#4051B5] hover:bg-[#3444a0]' : ''}
          >
            Todas
          </Button>
          {categoriasLocales.map((categoria) => (
            <Button
              key={categoria}
              variant={selectedCategoria === categoria ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategoria(categoria)}
              className={selectedCategoria === categoria ? 'bg-[#4051B5] hover:bg-[#3444a0]' : ''}
            >
              {categoria}
            </Button>
          ))}
        </div>

        {/* Resultados */}
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Mostrando {filteredLocales.length} de {locales.length} locales
        </p>

        {/* Grid de Locales */}
        {filteredLocales.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Store className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 text-lg font-semibold">No se encontraron resultados</h2>
            <p className="mt-2 text-muted-foreground">
              Intenta con otros términos de búsqueda o categoría
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredLocales.map((local) => (
              <Card 
                key={local.id}
                className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
                onClick={() => setSelectedLocal(local)}
              >
                {/* Placeholder de imagen */}
                <div className="relative h-40 bg-gradient-to-br from-[#4051B5]/20 to-[#4051B5]/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Store className="h-12 w-12 text-[#4051B5]/30" />
                  </div>
                  <Badge 
                    className={`absolute right-3 top-3 ${getCategoryColor(local.categoria)}`}
                    variant="outline"
                  >
                    {local.categoria}
                  </Badge>
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
      </div>

      {/* Modal de Detalle */}
      <Dialog open={!!selectedLocal} onOpenChange={() => setSelectedLocal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Store className="h-5 w-5 text-[#4051B5]" />
              {selectedLocal?.nombre}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLocal && (
            <div className="space-y-6">
              {/* Imagen placeholder */}
              <div className="h-48 rounded-lg bg-gradient-to-br from-[#4051B5]/20 to-[#4051B5]/5 flex items-center justify-center">
                <Store className="h-16 w-16 text-[#4051B5]/30" />
              </div>
              
              <Badge className={getCategoryColor(selectedLocal.categoria)} variant="outline">
                {selectedLocal.categoria}
              </Badge>
              
              <p className="text-muted-foreground">
                {selectedLocal.descripcion}
              </p>
              
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
