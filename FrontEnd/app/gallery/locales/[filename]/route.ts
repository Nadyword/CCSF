import { NextRequest, NextResponse } from 'next/server'
import { unlink, stat } from 'fs/promises'
import path from 'path'

const LOCALES_DIR = path.join(process.cwd(), 'public', 'Locales')
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
    await stat(path.join(LOCALES_DIR, filename))
    await unlink(path.join(LOCALES_DIR, filename))
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: 'Archivo no encontrado.' }, { status: 404 })
  }
}
