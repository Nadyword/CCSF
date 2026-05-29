import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readdir, stat } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const EVENTOS_DIR = path.join(process.cwd(), 'public', 'Eventos')

function ensureDir() {
  if (!existsSync(EVENTOS_DIR)) mkdirSync(EVENTOS_DIR, { recursive: true })
}

export async function GET() {
  ensureDir()
  try {
    const files = await readdir(EVENTOS_DIR)
    const items = files.filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
    const result = await Promise.all(
      items.map(async name => {
        const s = await stat(path.join(EVENTOS_DIR, name))
        return { name, url: `/Eventos/${name}`, size: s.size, modified: s.mtime.toISOString() }
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

  const archivo = formData.get('archivo') as File | null
  if (!archivo || !(archivo instanceof File)) {
    return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 })
  }

  const ext = path.extname(archivo.name).toLowerCase()
  if (!IMAGE_EXTS.includes(ext)) {
    return NextResponse.json(
      { error: `Formato no permitido: "${ext}". Solo jpg, png, webp, gif.` },
      { status: 400 }
    )
  }
  if (archivo.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `"${archivo.name}" supera el límite de 5 MB.` },
      { status: 400 }
    )
  }

  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`
  const bytes = await archivo.arrayBuffer()
  await writeFile(path.join(EVENTOS_DIR, name), Buffer.from(bytes))

  return NextResponse.json({ name, url: `/Eventos/${name}` }, { status: 201 })
}
