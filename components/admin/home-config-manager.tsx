'use client'

import { useData } from '@/contexts/data-context'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar, Sparkles, Eye, EyeOff } from 'lucide-react'

export function HomeConfigManager() {
  const { 
    eventos, 
    configuracionHome, 
    setEventoDestacado, 
    toggleMostrarEventoDestacado 
  } = useData()

  const eventosActivos = eventos.filter(e => e.activo)
  const eventoSeleccionado = eventos.find(e => e.id === configuracionHome.eventoDestacadoId)

  return (
    <div className="space-y-8">
      {/* Toggle para mostrar/ocultar evento destacado */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-4">
          {configuracionHome.mostrarEventoDestacado ? (
            <Eye className="h-5 w-5 text-[#4051B5]" />
          ) : (
            <EyeOff className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <Label htmlFor="mostrar-evento" className="text-base font-medium">
              Mostrar Evento Destacado
            </Label>
            <p className="text-sm text-muted-foreground">
              {configuracionHome.mostrarEventoDestacado 
                ? 'El evento destacado se muestra en la página principal'
                : 'Se mostrará contenido predeterminado en la página principal'
              }
            </p>
          </div>
        </div>
        <Switch
          id="mostrar-evento"
          checked={configuracionHome.mostrarEventoDestacado}
          onCheckedChange={toggleMostrarEventoDestacado}
        />
      </div>

      {/* Selector de evento destacado */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Seleccionar Evento Destacado</Label>
        <Select
          value={configuracionHome.eventoDestacadoId || 'none'}
          onValueChange={(value) => setEventoDestacado(value === 'none' ? null : value)}
          disabled={!configuracionHome.mostrarEventoDestacado}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin evento destacado</SelectItem>
            {eventosActivos.map((evento) => (
              <SelectItem key={evento.id} value={evento.id}>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {evento.nombre}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Solo se muestran eventos activos en la lista
        </p>
      </div>

      {/* Vista previa del evento seleccionado */}
      {configuracionHome.mostrarEventoDestacado && eventoSeleccionado && (
        <div className="rounded-lg border bg-muted/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#4051B5]" />
            <h3 className="font-semibold">Vista Previa del Evento Destacado</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#4051B5]">Destacado</Badge>
              {eventoSeleccionado.activo && (
                <Badge variant="outline" className="border-green-500 text-green-600">
                  Activo
                </Badge>
              )}
            </div>
            
            <h4 className="text-xl font-bold">{eventoSeleccionado.nombre}</h4>
            
            <p className="text-muted-foreground">{eventoSeleccionado.descripcion}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Fecha: {new Date(eventoSeleccionado.fecha).toLocaleDateString('es-MX')}</span>
              <span>Hora: {eventoSeleccionado.hora}</span>
              <span>Ubicación: {eventoSeleccionado.ubicacion}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay evento destacado */}
      {configuracionHome.mostrarEventoDestacado && !eventoSeleccionado && (
        <div className="rounded-lg border border-dashed border-amber-500 bg-amber-50 p-6 text-center dark:bg-amber-950/20">
          <Sparkles className="mx-auto h-8 w-8 text-amber-500" />
          <h3 className="mt-2 font-semibold text-amber-700 dark:text-amber-400">
            No hay evento seleccionado
          </h3>
          <p className="mt-1 text-sm text-amber-600 dark:text-amber-500">
            Selecciona un evento activo para destacarlo en la página principal
          </p>
        </div>
      )}
    </div>
  )
}
