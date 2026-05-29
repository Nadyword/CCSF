'use client'

import { useData } from '@/contexts/data-context'
import { Badge } from '@/components/ui/badge'
import { Calendar, Sparkles, Star, Info } from 'lucide-react'
import Image from 'next/image'
import { getStaticUrl } from '@/lib/utils'

export function HomeConfigManager() {
  const { eventos } = useData()

  const eventoDestacado = eventos.find(e => e.destacado) ?? null

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
        <p>
          Para cambiar el evento destacado en el Home, ve a la pestaña{' '}
          <strong className="text-foreground">Eventos</strong> y haz clic en la estrella{' '}
          <Star className="inline h-3.5 w-3.5 text-amber-400 fill-amber-400" /> de la columna{' '}
          <strong className="text-foreground">Activo en Home</strong>.
          Solo puede haber un evento destacado a la vez.
        </p>
      </div>

      {eventoDestacado ? (
        <div className="overflow-hidden rounded-xl border shadow-sm">
          {/* Imagen del evento */}
          {eventoDestacado.imagen && (
            <div className="relative h-48 w-full bg-gradient-to-br from-indigo-600 to-purple-700">
              <Image
                src={getStaticUrl(eventoDestacado.imagen)}
                alt={eventoDestacado.nombre}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 640px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <Badge className="bg-amber-400 text-amber-900 font-semibold">
                  <Star className="mr-1 h-3 w-3 fill-current" /> Activo en Home
                </Badge>
              </div>
            </div>
          )}

          <div className="p-5 space-y-3">
            {!eventoDestacado.imagen && (
              <Badge className="bg-amber-400 text-amber-900 font-semibold">
                <Star className="mr-1 h-3 w-3 fill-current" /> Activo en Home
              </Badge>
            )}

            <h3 className="text-xl font-bold">{eventoDestacado.nombre}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{eventoDestacado.descripcion}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(eventoDestacado.fecha + 'T12:00:00').toLocaleDateString('es-MX', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
              <span>{eventoDestacado.hora}</span>
              <span>{eventoDestacado.ubicacion}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-amber-400 bg-amber-50/50 p-8 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-amber-400" />
          <h3 className="mt-3 font-semibold text-amber-700">Sin evento destacado</h3>
          <p className="mt-1 text-sm text-amber-600">
            Ningún evento está marcado como activo en el Home. El Home mostrará el mensaje de
            &quot;Próximamente&quot;.
          </p>
        </div>
      )}
    </div>
  )
}
