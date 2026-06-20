'use client'

import { useState } from 'react'
import { useData } from '@/contexts/data-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import type { Evento } from '@/lib/types'
import { getStaticUrl } from '@/lib/utils'

export default function EventosPage() {
  const { eventos, loadingEventos } = useData()
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
    <main className="min-h-screen pb-12">
      {/* ── Banner de cabecera ───────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-pink-600 to-indigo-700 pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-12 left-10 h-60 w-60 rounded-full bg-rose-300/20 blur-2xl" />
          <div className="absolute top-6 left-1/3 h-44 w-44 rounded-full bg-pink-300/15 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Calendar className="mr-1 h-3 w-3" />
            Calendario
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl drop-shadow">
            Eventos y Actividades
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-rose-100">
            Descubre todos los eventos y actividades especiales que tenemos preparados para ti
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        {/* Lista de Eventos */}
        {loadingEventos ? (
          <div className="space-y-12">
            {Array.from({ length: 2 }).map((_, gi) => (
              <div key={gi}>
                <Skeleton className="h-6 w-40 mb-6" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-lg border bg-card">
                      <Skeleton className="h-48 w-full rounded-none" />
                      <div className="p-5 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-3 w-1/3" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-3 w-1/4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : Object.keys(eventosPorMes).length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 text-lg font-semibold">No hay eventos próximos</h2>
            <p className="mt-2 text-muted-foreground">
              Pronto anunciaremos nuevos eventos. ¡Mantente atento!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(eventosPorMes).map(([mes, eventosDelMes], mesIdx) => (
              <div key={mes}>
                <h2 className="mb-6 text-xl font-semibold capitalize text-foreground">
                  {mes}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {eventosDelMes.map((evento, eventoIdx) => (
                    <Card
                      key={evento.id}
                      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
                      onClick={() => setSelectedEvento(evento)}
                    >
                      {/* Imagen del evento */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#4051B5] to-[#2d3a8c]">
                        {evento.imagen ? (
                          <Image
                            src={getStaticUrl(evento.imagen)}
                            alt={evento.nombre}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 40px), 390px"
                            priority={mesIdx === 0 && eventoIdx < 3}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Calendar className="h-16 w-16 text-white/30" />
                          </div>
                        )}
                        {evento.destacado && (
                          <Badge className="absolute right-3 top-3 bg-amber-500 z-10">
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
              {/* Imagen del evento */}
              <div className="relative h-52 overflow-hidden rounded-xl bg-gradient-to-br from-[#4051B5] to-[#2d3a8c]">
                {selectedEvento.imagen ? (
                  <Image
                    src={getStaticUrl(selectedEvento.imagen)}
                    alt={selectedEvento.nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 512px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-white/30" />
                  </div>
                )}
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
