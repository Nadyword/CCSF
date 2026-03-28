'use client'

import { useState } from 'react'
import { useData } from '@/contexts/data-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2, Calendar, Sparkles } from 'lucide-react'
import type { Evento } from '@/lib/types'

export function EventosManager() {
  const { eventos, agregarEvento, actualizarEvento, eliminarEvento, configuracionHome } = useData()
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    hora: '',
    ubicacion: '',
    imagen: '/images/eventos/default.jpg',
    destacado: false,
    activo: true
  })

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      fecha: '',
      hora: '',
      ubicacion: '',
      imagen: '/images/eventos/default.jpg',
      destacado: false,
      activo: true
    })
    setEditingEvento(null)
  }

  const handleEdit = (evento: Evento) => {
    setEditingEvento(evento)
    setFormData({
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      hora: evento.hora,
      ubicacion: evento.ubicacion,
      imagen: evento.imagen,
      destacado: evento.destacado,
      activo: evento.activo
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingEvento) {
      actualizarEvento(editingEvento.id, formData)
    } else {
      agregarEvento(formData)
    }
    
    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      eliminarEvento(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Botón Agregar */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[#4051B5] hover:bg-[#3444a0]">
              <Plus className="h-4 w-4" />
              Agregar Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingEvento ? 'Editar Evento' : 'Nuevo Evento'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Evento</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
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
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hora">Horario</Label>
                  <Input
                    id="hora"
                    placeholder="Ej: 10:00 - 20:00"
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input
                  id="ubicacion"
                  placeholder="Ej: Plaza Central - Nivel 1"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  required
                />
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="activo">Evento Activo</Label>
                <Switch
                  id="activo"
                  checked={formData.activo}
                  onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                />
              </div>
              
              <Button type="submit" className="w-full bg-[#4051B5] hover:bg-[#3444a0]">
                {editingEvento ? 'Guardar Cambios' : 'Crear Evento'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de Eventos */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead className="hidden sm:table-cell">Fecha</TableHead>
              <TableHead className="hidden md:table-cell">Ubicación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No hay eventos registrados
                </TableCell>
              </TableRow>
            ) : (
              eventos.map((evento) => (
                <TableRow key={evento.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{evento.nombre}</span>
                          {configuracionHome.eventoDestacadoId === evento.id && (
                            <Sparkles className="h-3 w-3 text-[#4051B5]" />
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground sm:hidden">
                          {new Date(evento.fecha).toLocaleDateString('es-MX')}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {new Date(evento.fecha).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{evento.ubicacion}</TableCell>
                  <TableCell>
                    <Badge variant={evento.activo ? 'default' : 'secondary'}>
                      {evento.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(evento)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(evento.id)}
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
    </div>
  )
}
