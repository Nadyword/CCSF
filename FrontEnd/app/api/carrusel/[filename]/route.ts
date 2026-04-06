import { NextRequest, NextResponse } from 'next/server'
import { unlink, rename, stat } from 'fs/promises'
import path from 'path'

const CARRUSEL_DIR = path.join(process.cwd(), 'public', 'carrusel')
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

function safeName(name: string): boolean {
  if (!name || name.includes('..') || name.includes('/') || name.includes('\\')) return false
  return IMAGE_EXTS.includes(path.extname(name).toLowerCase())
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  if (!safeName(filename)) {
    return NextResponse.json({ error: 'Nombre de archivo inválido.' }, { status: 400 })
  }
  try {
    await stat(path.join(CARRUSEL_DIR, filename))
    await unlink(path.join(CARRUSEL_DIR, filename))
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: 'Archivo no encontrado.' }, { status: 404 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  if (!safeName(filename)) {
    return NextResponse.json({ error: 'Nombre de archivo inválido.' }, { status: 400 })
  }
  let newName: string
  try { ({ newName } = await req.json()) } catch {
    return NextResponse.json({ error: 'Cuerpo inválido.' }, { status: 400 })
  }
  if (!safeName(newName)) {
    return NextResponse.json({ error: 'Nuevo nombre inválido.' }, { status: 400 })
  }
  try {
    await stat(path.join(CARRUSEL_DIR, filename))
    await rename(path.join(CARRUSEL_DIR, filename), path.join(CARRUSEL_DIR, newName))
    return NextResponse.json({ name: newName, url: `/carrusel/${newName}` })
  } catch {
    return NextResponse.json({ error: 'Archivo no encontrado.' }, { status: 404 })
  }
}
