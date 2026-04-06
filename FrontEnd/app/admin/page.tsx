'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useData } from '@/contexts/data-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EventosManager } from '@/components/admin/eventos-manager'
import { LocalesManager } from '@/components/admin/locales-manager'
import { HomeConfigManager } from '@/components/admin/home-config-manager'
import { SlidesManager } from '@/components/admin/slides-manager'
import { Calendar, Store, Settings, LayoutDashboard, Images } from 'lucide-react'

export default function AdminPage() {
  const { isAuthenticated, isLoading, usuario } = useAuth()
  const { eventos, locales, perfilActivo } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4051B5] border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const eventosActivos = eventos.filter(e => e.activo).length
  const totalLocales = locales.length

  return (
    <main className="min-h-screen pb-8">
      {/* ── Banner de cabecera ───────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-indigo-800 to-slate-900 pt-28 pb-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-10 right-20 h-52 w-52 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute top-10 right-1/3 h-36 w-36 rounded-full bg-teal-400/10 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-indigo-300 text-sm font-medium uppercase tracking-widest mb-2">Panel de Control</p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl drop-shadow">
            Panel de Administración
          </h1>
          <p className="mt-2 text-slate-300">
            Bienvenido, {usuario?.nombre}. Gestiona el contenido del centro comercial.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Eventos Activos
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventosActivos}</div>
              <p className="text-xs text-muted-foreground">de {eventos.length} totales</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Locales Registrados
              </CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLocales}</div>
              <p className="text-xs text-muted-foreground">en directorio</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rol de Usuario
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{usuario?.rol}</div>
              <p className="text-xs text-muted-foreground">acceso completo</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Slides Carrusel
              </CardTitle>
              <Images className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{perfilActivo?.slides.length ?? 0}</div>
              <p className="text-xs text-muted-foreground">slides en perfil activo</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="carrusel" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="carrusel" className="gap-2">
              <Images className="h-4 w-4" />
              <span className="hidden sm:inline">Carrusel</span>
            </TabsTrigger>
            <TabsTrigger value="home" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Configurar Home</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="eventos" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Gestión de Eventos</span>
              <span className="sm:hidden">Eventos</span>
            </TabsTrigger>
            <TabsTrigger value="locales" className="gap-2">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Gestión de Locales</span>
              <span className="sm:hidden">Locales</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="carrusel">
            <Card>
              <CardHeader>
                <CardTitle>Carrusel de Inicio</CardTitle>
                <CardDescription>
                  Gestiona los slides del carrusel: imágenes, animaciones, transiciones y tiempos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SlidesManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="home">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Home</CardTitle>
                <CardDescription>
                  Selecciona el evento destacado que se mostrará en la página principal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HomeConfigManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eventos">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Eventos</CardTitle>
                <CardDescription>
                  Administra los eventos del centro comercial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EventosManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locales">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Locales</CardTitle>
                <CardDescription>
                  Administra el directorio de tiendas y servicios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LocalesManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
