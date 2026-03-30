'use client'

import { useState } from 'react'
import { useData } from '@/contexts/data-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react'
import type { Evento } from '@/lib/types'

export default function EventosPage() {
  const { eventos } = useData()
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null)
  
  // Solo mostrar eventos activos
  const eventosActivos = eventos.filter(e => e.activo)
  
  // Agrupar por mes
  const eventosPorMes = eventosActivos.reduce((acc, evento) => {
    const fecha = new Date(evento.fecha)
    const mes = fecha.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
    if (!acc[mes]) acc[mes] = []
    acc[mes].push(evento)
    return acc
  }, {} as Record<string, Evento[]>)

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <main className="min-h-screen bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4 bg-[#4051B5]">
            <Calendar className="mr-1 h-3 w-3" />
            Calendario
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Eventos y Actividades
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Descubre todos los eventos y actividades especiales que tenemos preparados para ti
          </p>
        </div>

        {/* Lista de Eventos */}
        {Object.keys(eventosPorMes).length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 text-lg font-semibold">No hay eventos próximos</h2>
            <p className="mt-2 text-muted-foreground">
              Pronto anunciaremos nuevos eventos. ¡Mantente atento!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(eventosPorMes).map(([mes, eventosDelMes]) => (
              <div key={mes}>
                <h2 className="mb-6 text-xl font-semibold capitalize text-foreground">
                  {mes}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {eventosDelMes.map((evento) => (
                    <Card 
                      key={evento.id}
                      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
                      onClick={() => setSelectedEvento(evento)}
                    >
                      {/* Placeholder de imagen */}
                      <div className="relative h-48 bg-gradient-to-br from-[#4051B5] to-[#2d3a8c]">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Calendar className="h-16 w-16 text-white/30" />
                        </div>
                        {evento.destacado && (
                          <Badge className="absolute right-3 top-3 bg-amber-500">
                            <Sparkles className="mr-1 h-3 w-3" />
                            Destacado
                          </Badge>
                        )}
                      </div>
                      
                      <CardContent className="p-5">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-[#4051B5] transition-colors">
                          {evento.nombre}
                        </h3>
                        
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {evento.descripcion}
                        </p>
                        
                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-[#4051B5]" />
                            <span>{new Date(evento.fecha).toLocaleDateString('es-MX')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[#4051B5]" />
                            <span>{evento.hora}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      <Dialog open={!!selectedEvento} onOpenChange={() => setSelectedEvento(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedEvento?.nombre}</DialogTitle>
          </DialogHeader>
          
          {selectedEvento && (
            <div className="space-y-6">
              {/* Imagen placeholder */}
              <div className="h-48 rounded-lg bg-gradient-to-br from-[#4051B5] to-[#2d3a8c] flex items-center justify-center">
                <Calendar className="h-16 w-16 text-white/30" />
              </div>
              
              <p className="text-muted-foreground">
                {selectedEvento.descripcion}
              </p>
              
              <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#4051B5]" />
                  <span className="capitalize">{formatFecha(selectedEvento.fecha)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#4051B5]" />
                  <span>{selectedEvento.hora}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#4051B5]" />
                  <span>{selectedEvento.ubicacion}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
