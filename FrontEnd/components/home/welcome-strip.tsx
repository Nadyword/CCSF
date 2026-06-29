import { MapPin, Clock, Calendar, Sparkles, Star } from 'lucide-react'

export function WelcomeStrip() {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-[#0F0D1A] via-[#1A1530] to-[#0F0D1A]">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 top-0 h-[400px] w-[400px] rounded-full bg-[var(--brand-primary)]/30 blur-[120px] animate-float" />
        <div className="absolute -right-48 bottom-0 h-[400px] w-[400px] rounded-full bg-[var(--brand-accent)]/25 blur-[120px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-gold)]/15 blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
      </div>
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-10">
        {/* Badge */}
        <div className="animate-slide-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
            <Sparkles className="h-4 w-4 text-[var(--brand-gold)]" />
            Bienvenidos al mejor centro comercial
            <Star className="h-3 w-3 text-[var(--brand-gold)] fill-[var(--brand-gold)]" />
          </span>
        </div>

        {/* Tarjetas */}
        <div className="grid w-full gap-6 sm:grid-cols-3 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="group rounded-3xl bg-gradient-to-br from-[var(--brand-accent)]/20 to-[var(--brand-accent)]/5 p-8 backdrop-blur-md border border-white/10 transition-all duration-500 hover:bg-[var(--brand-accent)]/30 hover:border-[var(--brand-accent)]/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--brand-accent)]/20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-accent)] text-white transition-all duration-300 group-hover:scale-110 shadow-lg shadow-[var(--brand-accent)]/50">
              <MapPin className="h-8 w-8" />
            </div>
            <p className="mt-6 text-lg font-bold text-white text-center">Ubicación</p>
            <p className="mt-2 text-sm text-white/70 font-medium text-center">Av. José María Vargas, Santa Fe</p>
          </div>
          <div className="group rounded-3xl bg-gradient-to-br from-[var(--brand-gold)]/20 to-[var(--brand-gold)]/5 p-8 backdrop-blur-md border border-white/10 transition-all duration-500 hover:bg-[var(--brand-gold)]/30 hover:border-[var(--brand-gold)]/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--brand-gold)]/20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-gold)] text-[var(--brand-secondary)] transition-all duration-300 group-hover:scale-110 shadow-lg shadow-[var(--brand-gold)]/50">
              <Clock className="h-8 w-8" />
            </div>
            <p className="mt-6 text-lg font-bold text-white text-center">Horario</p>
            <p className="mt-2 text-sm text-white/70 font-medium text-center">10:00 - 21:00 hrs</p>
          </div>
          <div className="group rounded-3xl bg-gradient-to-br from-[var(--brand-teal)]/20 to-[var(--brand-teal)]/5 p-8 backdrop-blur-md border border-white/10 transition-all duration-500 hover:bg-[var(--brand-teal)]/30 hover:border-[var(--brand-teal)]/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--brand-teal)]/20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-teal)] text-white transition-all duration-300 group-hover:scale-110 shadow-lg shadow-[var(--brand-teal)]/50">
              <Calendar className="h-8 w-8" />
            </div>
            <p className="mt-6 text-lg font-bold text-white text-center">Abierto</p>
            <p className="mt-2 text-sm text-white/70 font-medium text-center">Todos los días del año</p>
          </div>
        </div>
      </div>
    </section>
  )
}
