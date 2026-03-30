'use client'

import { useState } from 'react'
import { useData } from '@/contexts/data-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2, Store, Search } from 'lucide-react'
import type { Local } from '@/lib/types'
import { categoriasLocales } from '@/lib/data'

export function LocalesManager() {
  const { locales, agregarLocal, actualizarLocal, eliminarLocal } = useData()
  const [editingLocal, setEditingLocal] = useState<Local | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState<string>('all')
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Moda' as string,
    nivel: 'Nivel 1',
    numeroLocal: '',
    imagen: '/images/locales/default.jpg',
    descripcion: '',
    horario: '',
    telefono: ''
  })

  const resetForm = () => {
    setFormData({
      nombre: '',
      categoria: 'Moda',
      nivel: 'Nivel 1',
      numeroLocal: '',
      imagen: '/images/locales/default.jpg',
      descripcion: '',
      horario: '',
      telefono: ''
    })
    setEditingLocal(null)
  }

  const handleEdit = (local: Local) => {
    setEditingLocal(local)
    setFormData({
      nombre: local.nombre,
      categoria: local.categoria,
      nivel: local.nivel,
      numeroLocal: local.numeroLocal,
      imagen: local.imagen,
      descripcion: local.descripcion,
      horario: local.horario,
      telefono: local.telefono || ''
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingLocal) {
      actualizarLocal(editingLocal.id, formData)
    } else {
      agregarLocal(formData)
    }
    
    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este local?')) {
      eliminarLocal(id)
    }
  }

  // Filtrar locales
  const filteredLocales = locales.filter(local => {
    const matchesSearch = local.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         local.numeroLocal.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = filterCategoria === 'all' || local.categoria === filterCategoria
    return matchesSearch && matchesCategoria
  })

  const getCategoryColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'Gastronomía': 'bg-orange-100 text-orange-700',
      'Moda': 'bg-pink-100 text-pink-700',
      'Tecnología': 'bg-blue-100 text-blue-700',
      'Entretenimiento': 'bg-purple-100 text-purple-700',
      'Servicios': 'bg-gray-100 text-gray-700',
      'Belleza': 'bg-rose-100 text-rose-700',
      'Hogar': 'bg-green-100 text-green-700',
      'Deportes': 'bg-emerald-100 text-emerald-700',
    }
    return colors[categoria] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Filtros y Agregar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategoria} onValueChange={setFilterCategoria}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categoriasLocales.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[#4051B5] hover:bg-[#3444a0]">
              <Plus className="h-4 w-4" />
              Agregar Local
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingLocal ? 'Editar Local' : 'Nuevo Local'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Local</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasLocales.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nivel">Nivel</Label>
                  <Select
                    value={formData.nivel}
                    onValueChange={(value) => setFormData({ ...formData, nivel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nivel 1">Nivel 1</SelectItem>
                      <SelectItem value="Nivel 2">Nivel 2</SelectItem>
                      <SelectItem value="Nivel 3">Nivel 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="numeroLocal">Número de Local</Label>
                  <Input
                    id="numeroLocal"
                    placeholder="Ej: L-201"
                    value={formData.numeroLocal}
                    onChange={(e) => setFormData({ ...formData, numeroLocal: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario">Horario</Label>
                  <Input
                    id="horario"
                    placeholder="Ej: 10:00 - 21:00"
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono (opcional)</Label>
                <Input
                  id="telefono"
                  placeholder="Ej: +52 555 123 4567"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full bg-[#4051B5] hover:bg-[#3444a0]">
                {editingLocal ? 'Guardar Cambios' : 'Crear Local'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de Locales */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Local</TableHead>
              <TableHead className="hidden sm:table-cell">Categoría</TableHead>
              <TableHead className="hidden md:table-cell">Ubicación</TableHead>
              <TableHead className="hidden lg:table-cell">Horario</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No hay locales que coincidan con la búsqueda
                </TableCell>
              </TableRow>
            ) : (
              filteredLocales.map((local) => (
                <TableRow key={local.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{local.nombre}</span>
                        <div className="flex items-center gap-2 sm:hidden">
                          <Badge className={getCategoryColor(local.categoria)} variant="secondary">
                            {local.categoria}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge className={getCategoryColor(local.categoria)} variant="secondary">
                      {local.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {local.nivel} - {local.numeroLocal}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{local.horario}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(local)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(local.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Mostrando {filteredLocales.length} de {locales.length} locales
      </p>
    </div>
  )
}
