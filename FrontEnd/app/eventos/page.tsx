import { fetchEventosServer } from '@/lib/server-api'
import { EventosClient } from '@/components/eventos/eventos-client'

export default async function EventosPage() {
  const eventos = await fetchEventosServer()
  return <EventosClient eventos={eventos} />
}
