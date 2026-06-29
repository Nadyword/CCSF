'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PerfilCarrusel, SlideCarrusel } from '@/lib/types'
import { getStaticUrl } from '@/lib/utils'

// ─── Mapeo de opciones a valores CSS ─────────────────────────────────────────

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

interface HeroSectionProps { perfil: PerfilCarrusel | null }

export function HeroSection({ perfil }: HeroSectionProps) {
  const slides = perfil?.slides ?? []

  const [activeIdx, setActiveIdx]         = useState(0)
  const [prevIdx, setPrevIdx]             = useState<number | null>(null)
  const [animKey, setAnimKey]             = useState(0)
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

  useEffect(() => {
    if (slides.length <= 1) return
    const delay = (slides[activeIdx]?.tiempoPermanencia ?? 5000) + 750
    timerRef.current = setTimeout(next, delay)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [activeIdx, slides, next])

  useEffect(() => { setActiveIdx(0); setAnimKey(0) }, [perfil?.id])

  const activeSlide = slides[activeIdx] ?? null
  const prevSlide   = prevIdx !== null ? slides[prevIdx] : null

  // ── Titulos dinámicos del slide activo ────────────────────────────────────
  const titulo    = activeSlide?.titulo    ?? null
  const subtitulo = activeSlide?.subtitulo ?? null

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#3730A3] to-[#1E1B4B]">

      {/* ── FONDO: slides del carrusel ─────────────────────────────────────── */}
      {prevSlide && (
        <div key={`prev-${prevIdx}`} className="carousel-exit absolute inset-0 z-0">
          <Image src={getStaticUrl(prevSlide.urlImagen)} alt="" fill className="object-cover" priority sizes="100vw" />
        </div>
      )}

      {activeSlide && (
        <div
          key={`active-${animKey}`}
          className={`absolute inset-0 z-[1] ${ANIM_CLASS[activeSlide.animacionEntrada]}`}
          style={{
            '--ce': EASING_MAP[activeSlide.estiloTransicion],
            '--cd': '700ms',
          } as React.CSSProperties}
        >
          <Image src={getStaticUrl(activeSlide.urlImagen)} alt="" fill className="object-cover" priority sizes="100vw" />
        </div>
      )}


      {/* ── CONTENIDO PRINCIPAL ────────────────────────────────────────────── */}
      <div className="relative z-[2] mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="flex flex-col items-center text-center">

          {/* Título — dinámico si el slide tiene titulo, fijo si no */}
          <h1
            key={`titulo-${animKey}`}
            className="animate-slide-up text-balance font-serif text-6xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl text-shadow"
            style={{ animationDelay: '0.3s' }}
          >
            {titulo ? (
              <span className="bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-accent)] to-[var(--brand-gold)] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                {titulo}
              </span>
            ) : (
              <>
                Centro Comercial
                <br />
                <span className="bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-accent)] to-[var(--brand-gold)] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Santa Fe
                </span>
              </>
            )}
          </h1>

          {/* Subtítulo — dinámico si el slide tiene subtitulo, fijo si no */}
          <p
            key={`subtitulo-${animKey}`}
            className="mt-8 max-w-2xl animate-slide-up text-pretty text-xl text-white/90 sm:text-2xl leading-relaxed font-light"
            style={{ animationDelay: '0.4s' }}
          >
            {subtitulo ?? (
              <>
                Tu destino de compras, entretenimiento y gastronomia.{' '}
                Descubre mas de <span className="font-bold text-[var(--brand-gold)]">170 tiendas</span>, restaurantes y experiencias unicas.
              </>
            )}
          </p>

          {/* Botones */}
          <div className="mt-12 flex flex-col gap-5 sm:flex-row animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <Button
              asChild
              size="lg"
              className="group relative h-14 px-10 overflow-hidden bg-white text-[var(--brand-primary)] hover:bg-white/95 shadow-2xl shadow-black/30 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)] rounded-2xl text-lg font-bold"
            >
              <Link href="/directorio">
                <span className="relative z-10 flex items-center">
                  Explorar Directorio
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-10 border-2 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 backdrop-blur-md transition-all duration-300 rounded-2xl text-lg font-semibold"
            >
              <Link href="/eventos">
                Ver Eventos
              </Link>
            </Button>
          </div>

        </div>
      </div>

      {/* ── CONTROLES DEL CARRUSEL ─────────────────────────────────────────── */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} aria-label="Anterior"
            className="absolute left-4 top-1/2 z-[3] -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 hover:scale-110">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={next} aria-label="Siguiente"
            className="absolute right-4 top-1/2 z-[3] -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 hover:scale-110">
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-16 left-1/2 z-[3] flex -translate-x-1/2 items-center gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIdx ? 'h-3 w-8 bg-white shadow-lg' : 'h-3 w-3 bg-white/50 hover:bg-white/75'
                }`} />
            ))}
          </div>
        </>
      )}

    </section>
  )
}
