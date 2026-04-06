'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { LoginModal } from './login-modal'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Calendar, 
  Building2,
  Home,
  ChevronRight
} from 'lucide-react'
import { infoCC } from '@/lib/data'

export function Navbar() {
  const { usuario, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [loginOpen, setLoginOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/eventos', label: 'Eventos', icon: Calendar },
    { href: '/directorio', label: 'Directorio', icon: Building2 },
  ]

  return (
    <>
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-background/95 backdrop-blur-md shadow-lg shadow-black/5 border-b'
          : 'bg-transparent'
      }`}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${scrolled || !isHome ? 'bg-[var(--brand-primary)]/10' : 'bg-white/20'} blur-lg group-hover:scale-125`} />
              <Image
                src={infoCC.logo}
                alt={infoCC.nombre}
                width={44}
                height={44}
                className={`relative h-11 w-11 object-contain transition-all duration-300 ${scrolled || !isHome ? '' : 'brightness-0 invert'}`}
              />
            </div>
            <span className={`hidden font-semibold transition-colors duration-300 sm:block ${
              scrolled || !isHome ? 'text-foreground' : 'text-white'
            }`}>
              Centro Comercial Santa Fe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${
                  scrolled || !isHome
                    ? 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-[var(--brand-accent)] transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4 rounded-full" />
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`gap-2 transition-all duration-300 ${
                      scrolled || !isHome
                        ? 'border-border bg-background hover:bg-muted'
                        : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white text-xs font-semibold">
                      {usuario?.nombre?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{usuario?.nombre}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 animate-scale-in">
                  <div className="px-2 py-2 border-b">
                    <p className="text-sm font-medium">{usuario?.nombre}</p>
                    <p className="text-xs text-muted-foreground capitalize">{usuario?.rol}</p>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer mt-1">
                    <Link href="/admin" className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Panel de Gestion
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLoginOpen(true)}
                className={`gap-2 transition-all duration-300 hover:scale-105 ${
                  scrolled || !isHome
                    ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white'
                    : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Acceso Admin</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden transition-colors ${scrolled || !isHome ? '' : 'text-white hover:bg-white/10'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className={`overflow-hidden transition-all duration-300 md:hidden ${
          mobileMenuOpen ? 'max-h-64 border-t bg-background/95 backdrop-blur-md' : 'max-h-0'
        }`}>
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-[var(--brand-primary)]/10 hover:text-[var(--brand-primary)] animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  )
}
