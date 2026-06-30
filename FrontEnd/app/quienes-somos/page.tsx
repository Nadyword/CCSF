import { Sparkles, Heart, Leaf, ShoppingBag, UtensilsCrossed, MapPin, Star } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Quiénes Somos | Centro Comercial Santa Fe',
  description: 'Conoce nuestra identidad, propósito y estilo de vida en el Centro Comercial Santa Fe.',
}

const oferta = [
  {
    icon: ShoppingBag,
    titulo: 'Exclusividad',
    descripcion:
      'Contamos con una selección de marcas locales e internacionales de moda y hogar que subrayan la calidad y la originalidad.',
    color: 'var(--brand-primary)',
  },
  {
    icon: Heart,
    titulo: 'Conveniencia',
    descripcion:
      'Somos el lugar ideal para resolver necesidades cotidianas, ofreciendo servicios esenciales como supermercado, farmacia, bancos y centros de salud en un solo lugar.',
    color: 'var(--brand-teal)',
  },
  {
    icon: UtensilsCrossed,
    titulo: 'Gastronomía',
    descripcion:
      'Disponemos de una variada ruta gastronómica que abarca desde opciones casuales hasta experiencias sensoriales ideales para relajarse y disfrutar.',
    color: 'var(--brand-gold)',
  },
]

export default function QuienesSomosPage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F0D1A] via-[#1A1530] to-[#0F0D1A] py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-48 top-0 h-[500px] w-[500px] rounded-full bg-[var(--brand-primary)]/30 blur-[120px]" />
          <div className="absolute -right-48 bottom-0 h-[500px] w-[500px] rounded-full bg-[var(--brand-accent)]/25 blur-[120px]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
            <Sparkles className="h-4 w-4 text-[var(--brand-gold)]" />
            Wellness &amp; Relax Lifestyle
            <Star className="h-3 w-3 text-[var(--brand-gold)] fill-[var(--brand-gold)]" />
          </span>
          <h1 className="mt-8 font-serif text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Quiénes Somos
          </h1>
          <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
            Un icónico Centro Comercial en el sureste de Caracas, donde la tradición y la sofisticación se encuentran.
          </p>
        </div>
      </section>

      {/* Identidad y Propósito */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand-primary)]">
                Identidad y Propósito
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
                Un punto de referencia en Caracas
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
                Somos un icónico Centro Comercial ubicado en el sureste de Caracas, consolidado
                como un punto de referencia que combina tradición y sofisticación. Nuestro
                enfoque es personal, cercano y práctico, diseñado para ofrecer una experiencia
                memorable y única a nuestros visitantes.
              </p>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-accent)]/5 p-10 border border-[var(--brand-primary)]/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary)]/30">
                <Leaf className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-semibold text-foreground">
                Wellness &amp; Relax Lifestyle
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Nos definimos a través del concepto <em>Wellness &amp; Relax Lifestyle</em>,
                brindando un ambiente de bienestar, lujo silencioso y tranquilidad para toda
                la familia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestra Oferta */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand-accent)]">
              Lo que nos define
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Nuestra Oferta
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {oferta.map((item) => (
              <div
                key={item.titulo}
                className="group rounded-3xl bg-background p-8 border border-border transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: item.color, boxShadow: `0 8px 24px ${item.color}40` }}
                >
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-serif text-xl font-semibold text-foreground">
                  {item.titulo}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ubicación estratégica */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] mb-6">
            <MapPin className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Ubicación Estratégica
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Situados en una zona estratégica con cercanía a áreas residenciales de alto nivel,
            conectamos con la identidad local para ser el destino preferido de un público selecto
            que busca seguridad y exclusividad.
          </p>
          <Link
            href="/directorio"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/30 transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
          >
            Ver nuestras tiendas
          </Link>
        </div>
      </section>
    </main>
  )
}
