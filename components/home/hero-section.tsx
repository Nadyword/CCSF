'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, MapPin, Clock, Calendar, Sparkles, Star } from 'lucide-react'
import { infoCC } from '@/lib/data'

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#3730A3] to-[#1E1B4B]">
      {/* Animated background elements - mas vibrantes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[var(--brand-accent)]/30 blur-[100px] animate-float" />
        <div className="absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full bg-[var(--brand-gold)]/25 blur-[120px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] rounded-full bg-[var(--brand-teal)]/20 blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute right-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-[var(--brand-purple)]/20 blur-[60px] animate-float" style={{ animationDelay: '1.5s' }} />
      </div>
      
      {/* Decorative shapes */}
      <div className="absolute top-20 right-20 h-4 w-4 rounded-full bg-[var(--brand-gold)] shadow-glow-gold animate-pulse" />
      <div className="absolute bottom-40 left-32 h-3 w-3 rounded-full bg-[var(--brand-accent)] shadow-glow-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/2 right-1/4 h-2 w-2 rounded-full bg-[var(--brand-teal)] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="flex flex-col items-center text-center">
          {/* Floating badge con glow */}
          <div className="mb-8 animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
              <Sparkles className="h-4 w-4 text-[var(--brand-gold)]" />
              Bienvenidos al mejor centro comercial
              <Star className="h-3 w-3 text-[var(--brand-gold)] fill-[var(--brand-gold)]" />
            </span>
          </div>
          
          {/* Logo with intense glow effect */}
          <div className="mb-10 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-white/40 rounded-full scale-150 animate-pulse" />
              <div className="absolute inset-0 blur-xl bg-[var(--brand-gold)]/30 rounded-full scale-125" />
              <Image
                src={infoCC.logo}
                alt={infoCC.nombre}
                width={160}
                height={160}
                className="relative h-32 w-32 sm:h-40 sm:w-40 object-contain brightness-0 invert drop-shadow-2xl"
              />
            </div>
          </div>
          
          <h1 className="animate-slide-up text-balance font-serif text-6xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl text-shadow" style={{ animationDelay: '0.3s' }}>
            Centro Comercial
            <br />
            <span className="bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-accent)] to-[var(--brand-gold)] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Santa Fe
            </span>
          </h1>
          
          <p className="mt-8 max-w-2xl animate-slide-up text-pretty text-xl text-white/90 sm:text-2xl leading-relaxed font-light" style={{ animationDelay: '0.4s' }}>
            Tu destino de compras, entretenimiento y gastronomia. 
            Descubre mas de <span className="font-bold text-[var(--brand-gold)]">100 tiendas</span>, restaurantes y experiencias unicas.
          </p>
          
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
          
          {/* Info Cards with hover effects and colors */}
          <div className="mt-24 grid w-full max-w-5xl gap-6 sm:grid-cols-3 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="group rounded-3xl bg-gradient-to-br from-[var(--brand-accent)]/20 to-[var(--brand-accent)]/5 p-8 backdrop-blur-md border border-white/10 transition-all duration-500 hover:bg-[var(--brand-accent)]/30 hover:border-[var(--brand-accent)]/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--brand-accent)]/20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-accent)] text-white transition-all duration-300 group-hover:scale-110 shadow-lg shadow-[var(--brand-accent)]/50">
                <MapPin className="h-8 w-8" />
              </div>
              <p className="mt-6 text-lg font-bold text-white">Ubicacion</p>
              <p className="mt-2 text-sm text-white/70 font-medium">Av. Vasco de Quiroga, Santa Fe</p>
            </div>
            <div className="group rounded-3xl bg-gradient-to-br from-[var(--brand-gold)]/20 to-[var(--brand-gold)]/5 p-8 backdrop-blur-md border border-white/10 transition-all duration-500 hover:bg-[var(--brand-gold)]/30 hover:border-[var(--brand-gold)]/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--brand-gold)]/20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-gold)] text-[var(--brand-secondary)] transition-all duration-300 group-hover:scale-110 shadow-lg shadow-[var(--brand-gold)]/50">
                <Clock className="h-8 w-8" />
              </div>
              <p className="mt-6 text-lg font-bold text-white">Horario</p>
              <p className="mt-2 text-sm text-white/70 font-medium">10:00 - 21:00 hrs</p>
            </div>
            <div className="group rounded-3xl bg-gradient-to-br from-[var(--brand-teal)]/20 to-[var(--brand-teal)]/5 p-8 backdrop-blur-md border border-white/10 transition-all duration-500 hover:bg-[var(--brand-teal)]/30 hover:border-[var(--brand-teal)]/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--brand-teal)]/20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-teal)] text-white transition-all duration-300 group-hover:scale-110 shadow-lg shadow-[var(--brand-teal)]/50">
                <Calendar className="h-8 w-8" />
              </div>
              <p className="mt-6 text-lg font-bold text-white">Abierto</p>
              <p className="mt-2 text-sm text-white/70 font-medium">Todos los dias del año</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto fill-background">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  )
}
