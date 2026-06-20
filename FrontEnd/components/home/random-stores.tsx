'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useData } from '@/contexts/data-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Store, MapPin, ArrowRight, Sparkles, Star } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import type { Local } from '@/lib/types'
import { getStaticUrl } from '@/lib/utils'

function pickStableSix(list: Local[]) {
  return [...list].sort((a, b) => a.id.localeCompare(b.id)).slice(0, 6)
}

function pickRandomSix(list: Local[]) {
  const shuffled = [...list].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 6)
}

export function RandomStores() {
  const { locales, loadingLocales } = useData()

  // Mismo HTML en SSR y primer paint del cliente; aleatorizar solo tras hidratar
  const [localesAleatorios, setLocalesAleatorios] = useState(() =>
    pickStableSix(locales)
  )

  useEffect(() => {
    setLocalesAleatorios(pickRandomSix(locales))
  }, [locales])

  const getCategoryStyle = (color: string | null | undefined) => {
    if (color) {
      return { gradient: `from-gray-700 to-gray-900`, shadow: 'shadow-gray-500/30', color }
    }
    return { gradient: 'from-gray-500 to-gray-600', shadow: 'shadow-gray-500/30', color: '#6b7280' }
  }

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-background via-[var(--brand-primary)]/5 to-background">
      {/* Background decorations */}
      <div className="absolute left-0 top-1/4 h-[400px] w-[400px] rounded-full bg-[var(--brand-teal)]/10 blur-[100px]" />
      <div className="absolute right-0 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[var(--brand-gold)]/10 blur-[120px]" />
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] rounded-full bg-[var(--brand-purple)]/5 blur-[80px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center animate-slide-up">
          <Badge variant="secondary" className="mb-6 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-[var(--brand-teal)] to-[var(--brand-sky)] text-white border-0 shadow-lg shadow-[var(--brand-teal)]/30">
            <Sparkles className="mr-2 h-4 w-4" />
            Descubre
            <Star className="ml-2 h-3 w-3 fill-current" />
          </Badge>
          <h2 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Nuestras <span className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-purple)] bg-clip-text text-transparent">Tiendas</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground leading-relaxed">
            Explora una seleccion de los mejores locales del centro comercial
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loadingLocales ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-3xl border-0 bg-card card-shadow">
                <Skeleton className="h-56 w-full rounded-none" />
                <div className="p-7 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex items-center gap-3 mt-6">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            ))
          ) : localesAleatorios.map((local, index) => {
            const firstCat = local.categorias[0]
            const style = getCategoryStyle(firstCat?.color)
            return (
              <Card
                key={local.id}
                className={`group overflow-hidden border-0 bg-card card-shadow hover-lift animate-slide-up rounded-3xl`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image placeholder with gradient */}
                <div
                  className="relative h-56 overflow-hidden"
                  style={{ background: style.color ? `linear-gradient(135deg, ${style.color}cc, ${style.color}88)` : 'linear-gradient(135deg,#6b728099,#6b728066)' }}
                >
                  {local.imagen ? (
                    <>
                      <Image
                      src={getStaticUrl(local.imagen)}
                      alt={local.nombre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 44px), 390px"
                    />
                      <div className="absolute inset-0 bg-black/20" />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl">
                          <Store className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    </>
                  )}
                  {/* Primera categoría como badge */}
                  {firstCat && (
                    <Badge className="absolute right-4 top-4 bg-white/90 border-0 font-bold shadow-lg" style={{ color: style.color ?? '#6b7280' }}>
                      {firstCat.nombre}
                    </Badge>
                  )}
                  <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -top-8 -left-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />
                </div>

                <CardContent className="p-7">
                  <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-[var(--brand-primary)]">
                    {local.nombre}
                  </h3>

                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                    {local.descripcion}
                  </p>

                  <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
                      style={{ background: style.color ? `linear-gradient(135deg, ${style.color}, ${style.color}99)` : 'linear-gradient(135deg,#6b7280,#6b728099)' }}
                    >
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">{local.nivel} - Local {local.numeroLocal}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-20 text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-purple)] to-[var(--brand-primary)] bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 shadow-2xl shadow-[var(--brand-primary)]/30 hover:shadow-[var(--brand-primary)]/50 group text-lg font-bold">
            <Link href="/directorio">
              Ver Directorio Completo
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
