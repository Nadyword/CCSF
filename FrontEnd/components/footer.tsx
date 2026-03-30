'use client'

import Link from 'next/link'
import Image from 'next/image'
import { infoCC } from '@/lib/data'
import { MapPin, Phone, Clock, Facebook, Instagram, Twitter, Mail, ArrowUpRight } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/eventos', label: 'Eventos' },
    { href: '/directorio', label: 'Directorio' },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ]

  return (
    <footer className="relative overflow-hidden border-t bg-gradient-to-b from-background to-muted/30">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[var(--brand-primary)]/5 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Logo y descripcion */}
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[var(--brand-primary)]/20 blur-lg transition-all group-hover:scale-150" />
                <Image
                  src={infoCC.logo}
                  alt={infoCC.nombre}
                  width={48}
                  height={48}
                  className="relative h-12 w-12 object-contain"
                />
              </div>
              <span className="font-serif text-xl font-bold text-foreground">
                Centro Comercial Santa Fe
              </span>
            </Link>
            <p className="mt-6 max-w-md text-muted-foreground leading-relaxed">
              Tu destino de compras, entretenimiento y gastronomia. 
              Descubre experiencias unicas en un ambiente moderno y acogedor.
            </p>
            
            {/* Social links */}
            <div className="mt-8 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted/80 text-muted-foreground transition-all hover:bg-[var(--brand-primary)] hover:text-white hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Enlaces rapidos */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">Enlaces Rapidos</h3>
            <ul className="mt-6 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-[var(--brand-primary)]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]/50 transition-all group-hover:w-3 group-hover:bg-[var(--brand-primary)]" />
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">Contacto</h3>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">{infoCC.direccion}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--brand-accent)]/10 text-[var(--brand-accent)]">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">{infoCC.telefono}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--brand-teal)]/10 text-[var(--brand-teal)]">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">{infoCC.horario}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--brand-gold)]/10 text-[var(--brand-gold)]">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">info@ccsantafe.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Centro Comercial Santa Fe. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
