'use client'

import { useState, useEffect } from 'react'
import { useData } from '@/contexts/data-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Sparkles, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

export function FeaturedEvent() {
  const { eventos, configuracionHome } = useData()
  const [fechaFormateada, setFechaFormateada] = useState<string>('')
  
  // Buscar el evento destacado configurado
  const eventoDestacado = configuracionHome.mostrarEventoDestacado && configuracionHome.eventoDestacadoId
    ? eventos.find(e => e.id === configuracionHome.eventoDestacadoId && e.activo)
    : null

  // Format date on client side only to avoid hydration mismatch
  useEffect(() => {
    if (eventoDestacado) {
      const formatted = new Date(eventoDestacado.fecha).toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      setFechaFormateada(formatted)
    }
  }, [eventoDestacado])

  // Si no hay evento destacado, mostrar contenido predeterminado
  if (!eventoDestacado) {
    return (
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[var(--brand-primary)]/5 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-[var(--brand-accent)]/5 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-up">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm bg-[var(--brand-gold)]/10 text-[var(--brand-primary)] border-[var(--brand-gold)]/30">
              <Sparkles className="mr-2 h-4 w-4 text-[var(--brand-gold)]" />
              Proximamente
            </Badge>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Nuevos Eventos
              <span className="block text-[var(--brand-primary)]">en Camino</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Estamos preparando experiencias increibles para ti. 
              Mantente atento a nuestros proximos eventos y actividades especiales.
            </p>
            <Button asChild className="mt-10 h-12 px-8 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:opacity-90 transition-all hover:shadow-lg hover:shadow-[var(--brand-primary)]/30 group">
              <Link href="/eventos">
                Ver Calendario de Eventos
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[var(--brand-primary)]/5 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center animate-slide-up">
          <Badge className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white px-4 py-2 text-sm">
            <Star className="mr-2 h-4 w-4" />
            Evento Destacado
          </Badge>
        </div>
        
        <div className="overflow-hidden rounded-3xl bg-card shadow-2xl shadow-black/10 border border-border/50 hover-lift animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="grid lg:grid-cols-2">
            {/* Imagen del evento */}
            <div className="relative h-72 lg:h-auto lg:min-h-[450px] bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-secondary)] to-[#1e2761] overflow-hidden">
              {/* Animated shapes */}
              <div className="absolute inset-0">
                <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-[var(--brand-accent)]/20 blur-2xl animate-float" />
                <div className="absolute left-10 bottom-10 h-40 w-40 rounded-full bg-[var(--brand-gold)]/15 blur-2xl animate-float" style={{ animationDelay: '1s' }} />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div className="relative">
                  <Calendar className="mx-auto h-20 w-20 text-white/40" />
                  <div className="absolute inset-0 animate-pulse-glow rounded-full" />
                </div>
                <p className="mt-6 text-xl font-semibold text-white/80 font-serif">Evento Especial</p>
              </div>
            </div>
            
            {/* Contenido */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {eventoDestacado.nombre}
              </h2>
              
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {eventoDestacado.descripcion}
              </p>
              
              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 transition-colors hover:bg-muted">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="capitalize text-foreground font-medium">{fechaFormateada || 'Cargando...'}</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 transition-colors hover:bg-muted">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-accent)]/10 text-[var(--brand-accent)]">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="text-foreground font-medium">{eventoDestacado.hora}</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 transition-colors hover:bg-muted">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-teal)]/10 text-[var(--brand-teal)]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-foreground font-medium">{eventoDestacado.ubicacion}</span>
                </div>
              </div>
              
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button asChild className="h-12 px-8 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:opacity-90 transition-all hover:shadow-lg hover:shadow-[var(--brand-primary)]/30 group">
                  <Link href="/eventos">
                    Ver Mas Eventos
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 px-8 rounded-xl border-2 hover:bg-muted transition-all">
                  <Link href="/directorio">Explorar Tiendas</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
