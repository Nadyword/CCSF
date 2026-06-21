import { fetchLocalesServer, fetchCategoriasServer } from '@/lib/server-api'
import { DirectorioClient } from '@/components/directorio/directorio-client'

export default async function DirectorioPage() {
  const [locales, categorias] = await Promise.all([
    fetchLocalesServer(),
    fetchCategoriasServer(),
  ])

  return <DirectorioClient locales={locales} categorias={categorias} />
}
