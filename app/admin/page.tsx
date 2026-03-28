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
import { Calendar, Store, Settings, LayoutDashboard } from 'lucide-react'

export default function AdminPage() {
  const { isAuthenticated, isLoading, usuario } = useAuth()
  const { eventos, locales } = useData()
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
    <main className="min-h-screen bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Panel de Administración
          </h1>
          <p className="mt-2 text-muted-foreground">
            Bienvenido, {usuario?.nombre}. Gestiona el contenido del centro comercial.
          </p>
        </div>

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
                Estado del Sistema
              </CardTitle>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Activo</div>
              <p className="text-xs text-muted-foreground">funcionando correctamente</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
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
