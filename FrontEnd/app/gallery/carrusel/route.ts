import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readdir, stat } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
const MAX_SIZE = 3 * 1024 * 1024
const CARRUSEL_DIR = path.join(process.cwd(), 'public', 'Carrusel')

function ensureDir() {
  if (!existsSync(CARRUSEL_DIR)) mkdirSync(CARRUSEL_DIR, { recursive: true })
}

export async function GET() {
  ensureDir()
  try {
    const files = await readdir(CARRUSEL_DIR)
    const items = files.filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
    const result = await Promise.all(
      items.map(async name => {
        const s = await stat(path.join(CARRUSEL_DIR, name))
        return { name, url: `/Carrusel/${name}`, size: s.size, modified: s.mtime.toISOString() }
      })
    )
    result.sort((a, b) => b.modified.localeCompare(a.modified))
    return NextResponse.json(result)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  ensureDir()
  let formData: FormData
  try { formData = await req.formData() } catch {
    return NextResponse.json({ error: 'Formato de solicitud inválido.' }, { status: 400 })
  }

  const archivos = formData.getAll('archivos') as File[]
  if (!archivos.length) {
    return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 })
  }

  const results: { name: string; url: string }[] = []
  for (const archivo of archivos) {
    if (!(archivo instanceof File)) continue
    const ext = path.extname(archivo.name).toLowerCase()
    if (!IMAGE_EXTS.includes(ext)) {
      return NextResponse.json(
        { error: `Formato no permitido: "${ext}". Solo jpg, png, webp, gif.` },
        { status: 400 }
      )
    }
    if (archivo.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `"${archivo.name}" supera el límite de 3 MB.` },
        { status: 400 }
      )
    }
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`
    const bytes = await archivo.arrayBuffer()
    await writeFile(path.join(CARRUSEL_DIR, name), Buffer.from(bytes))
    results.push({ name, url: `/Carrusel/${name}` })
  }

  return NextResponse.json(results, { status: 201 })
}
