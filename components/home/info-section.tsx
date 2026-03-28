'use client'

import { infoCC } from '@/lib/data'
import { MapPin, Phone, Clock, Car, Wifi, Shield, Sparkles, CreditCard, Accessibility, Coffee, Star } from 'lucide-react'

export function InfoSection() {
  const servicios = [
    { icon: Car, label: 'Estacionamiento', descripcion: '3,000+ espacios', color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/40' },
    { icon: Wifi, label: 'WiFi Gratis', descripcion: 'Todo el centro', color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/40' },
    { icon: Shield, label: 'Seguridad 24/7', descripcion: 'Vigilancia total', color: 'from-orange-500 to-red-500', shadow: 'shadow-orange-500/40' },
    { icon: CreditCard, label: 'Pagos Faciles', descripcion: 'Todas las tarjetas', color: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/40' },
    { icon: Accessibility, label: 'Accesibilidad', descripcion: 'Instalaciones inclusivas', color: 'from-teal-500 to-cyan-600', shadow: 'shadow-teal-500/40' },
    { icon: Coffee, label: 'Food Court', descripcion: 'Amplia variedad', color: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/40' },
  ]

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-br from-[#0F0D1A] via-[#1A1530] to-[#0F0D1A]">
      {/* Animated background elements - mas intensos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 top-0 h-[500px] w-[500px] rounded-full bg-[var(--brand-primary)]/30 blur-[120px] animate-float" />
        <div className="absolute -right-48 bottom-0 h-[500px] w-[500px] rounded-full bg-[var(--brand-accent)]/25 blur-[120px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-gold)]/15 blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute right-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-[var(--brand-purple)]/20 blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Decorative dots */}
      <div className="absolute top-20 left-20 h-3 w-3 rounded-full bg-[var(--brand-gold)] shadow-glow-gold animate-pulse" />
      <div className="absolute bottom-32 right-32 h-4 w-4 rounded-full bg-[var(--brand-accent)] shadow-glow-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/2 left-1/4 h-2 w-2 rounded-full bg-[var(--brand-teal)] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20 text-center animate-slide-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 px-6 py-3 text-sm font-bold text-white/90 backdrop-blur-md border border-white/10 shadow-xl">
            <Sparkles className="h-5 w-5 text-[var(--brand-gold)]" />
            Todo en un solo lugar
            <Star className="h-4 w-4 text-[var(--brand-gold)] fill-[var(--brand-gold)]" />
          </span>
          <h2 className="mt-8 font-serif text-5xl font-bold tracking-tight text-white sm:text-6xl text-shadow">
            Informacion y <span className="bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-accent)] bg-clip-text text-transparent">Servicios</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-white/70 leading-relaxed">
            Disfruta de todas las comodidades durante tu visita al centro comercial
          </p>
        </div>
        
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Informacion de Contacto */}
          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-10 backdrop-blur-md border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white">
                Visitanos
              </h3>
              <p className="mt-2 text-white/60 text-base">
                Todo lo que necesitas saber para tu visita
              </p>
              
              <div className="mt-10 space-y-6">
                <div className="group flex items-start gap-5 p-4 rounded-2xl transition-all duration-300 hover:bg-white/10">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-accent)] to-rose-600 shadow-xl shadow-[var(--brand-accent)]/40 transition-transform group-hover:scale-110">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Ubicacion</p>
                    <p className="mt-1 text-base text-white/60">{infoCC.direccion}</p>
                  </div>
                </div>
                
                <div className="group flex items-start gap-5 p-4 rounded-2xl transition-all duration-300 hover:bg-white/10">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-gold)] to-amber-600 shadow-xl shadow-[var(--brand-gold)]/40 transition-transform group-hover:scale-110">
                    <Phone className="h-6 w-6 text-[var(--brand-secondary)]" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Telefono</p>
                    <p className="mt-1 text-base text-white/60">{infoCC.telefono}</p>
                  </div>
                </div>
                
                <div className="group flex items-start gap-5 p-4 rounded-2xl transition-all duration-300 hover:bg-white/10">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-teal)] to-emerald-600 shadow-xl shadow-[var(--brand-teal)]/40 transition-transform group-hover:scale-110">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Horario</p>
                    <p className="mt-1 text-base text-white/60">{infoCC.horario}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Servicios Grid */}
          <div className="lg:col-span-3">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {servicios.map((servicio, index) => (
                <div 
                  key={servicio.label}
                  className="group rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-md border border-white/10 transition-all duration-500 hover:bg-white/15 hover:border-white/20 hover:-translate-y-2 hover:shadow-2xl animate-slide-up"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${servicio.color} ${servicio.shadow} shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <servicio.icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="mt-5 font-bold text-white text-lg">{servicio.label}</p>
                  <p className="mt-2 text-sm text-white/50">{servicio.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
