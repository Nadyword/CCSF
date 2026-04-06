'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useData } from '@/contexts/data-context'
import { Skeleton } from '@/components/ui/skeleton'
import type { SlideCarrusel } from '@/lib/types'

// ─── Mapeo de opciones a valores CSS ──────────────────────────────────────────

const EASING_MAP: Record<SlideCarrusel['estiloTransicion'], string> = {
  suave:       'ease-in-out',
  lineal:      'linear',
  rapido:      'ease-in',
  salida:      'ease-out',
  elastico:    'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  exponencial: 'cubic-bezier(0.19, 1, 0.22, 1)',
  anticipar:   'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
}

const ANIM_CLASS: Record<SlideCarrusel['animacionEntrada'], string> = {
  'fade':            'carousel-enter-fade',
  'slide-derecha':   'carousel-enter-slide-derecha',
  'slide-izquierda': 'carousel-enter-slide-izquierda',
  'slide-arriba':    'carousel-enter-slide-arriba',
  'slide-abajo':     'carousel-enter-slide-abajo',
  'zoom':            'carousel-enter-zoom',
  'zoom-out':        'carousel-enter-zoom-out',
  'flip':            'carousel-enter-flip',
  'rotate':          'carousel-enter-rotate',
  'bounce':          'carousel-enter-bounce',
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function HeroCarousel() {
  const { perfilActivo, loadingPerfilActivo } = useData()
  const slides = perfilActivo?.slides ?? []

  const [activeIdx, setActiveIdx]     = useState(0)
  const [prevIdx, setPrevIdx]         = useState<number | null>(null)
  const [animKey, setAnimKey]         = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback((idx: number) => {
    if (transitioning || slides.length === 0) return
    setTransitioning(true)
    setPrevIdx(prev => prev !== null ? prev : activeIdx)
    setActiveIdx(idx)
    setAnimKey(k => k + 1)
    setTimeout(() => { setPrevIdx(null); setTransitioning(false) }, 750)
  }, [activeIdx, transitioning, slides.length])

  const next = useCallback(() => goTo((activeIdx + 1) % slides.length), [activeIdx, goTo, slides.length])
  const prev = useCallback(() => goTo((activeIdx - 1 + slides.length) % slides.length), [activeIdx, goTo, slides.length])

  // Auto-avance: espera el tiempo de permanencia del slide activo + duración de la animación
  useEffect(() => {
    if (slides.length <= 1) return
    const delay = (slides[activeIdx]?.tiempoPermanencia ?? 5000) + 750
    timerRef.current = setTimeout(next, delay)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [activeIdx, slides, next])

  // Reiniciar índice si el perfil cambia
  useEffect(() => { setActiveIdx(0); setAnimKey(0) }, [perfilActivo?.id])

  // ── Loading
  if (loadingPerfilActivo) {
    return (
      <section className="relative h-[65vh] min-h-[420px] overflow-hidden bg-muted">
        <Skeleton className="h-full w-full rounded-none" />
      </section>
    )
  }

  // ── Sin perfil activo o sin slides: no renderiza nada
  if (slides.length === 0) return null

  const activeSlide = slides[activeIdx]
  const prevSlide   = prevIdx !== null ? slides[prevIdx] : null

  return (
    <section className="relative h-[65vh] min-h-[420px] overflow-hidden bg-[var(--brand-secondary)]">

      {/* Slide saliente (fade-out) */}
      {prevSlide && (
        <div key={`prev-${prevIdx}`} className="carousel-exit absolute inset-0 z-10">
          <SlideContent slide={prevSlide} />
        </div>
      )}

      {/* Slide activo (animación de entrada) */}
      <div
        key={`active-${animKey}`}
        className={`absolute inset-0 z-20 ${ANIM_CLASS[activeSlide.animacionEntrada]}`}
        style={{
          '--ce': EASING_MAP[activeSlide.estiloTransicion],
          '--cd': '700ms',
        } as React.CSSProperties}
      >
        <SlideContent slide={activeSlide} />
      </div>

      {/* Flechas */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} aria-label="Anterior"
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 hover:scale-110">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={next} aria-label="Siguiente"
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 hover:scale-110">
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Indicadores */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeIdx ? 'h-3 w-8 bg-white shadow-lg' : 'h-3 w-3 bg-white/50 hover:bg-white/75'
              }`} />
          ))}
        </div>
      )}
    </section>
  )
}

// ─── Contenido visual de un slide ────────────────────────────────────────────

function SlideContent({ slide }: { slide: SlideCarrusel }) {
  return (
    <div className="relative h-full w-full">
      <Image src={slide.urlImagen} alt={slide.titulo ?? 'Slide'} fill
        className="object-cover" priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      {(slide.titulo || slide.subtitulo) && (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-6 text-center">
          {slide.titulo && (
            <h2 className="font-serif text-3xl font-bold text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
              {slide.titulo}
            </h2>
          )}
          {slide.subtitulo && (
            <p className="mt-3 max-w-2xl text-lg text-white/90 drop-shadow sm:text-xl">
              {slide.subtitulo}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
