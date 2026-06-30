import { HeroSection } from '@/components/home/hero-section'
import { WelcomeStrip } from '@/components/home/welcome-strip'
import { FeaturedEvent } from '@/components/home/featured-event'
import { RandomStores } from '@/components/home/random-stores'
import { InstagramFeed } from '@/components/home/instagram-feed'
import { InfoSection } from '@/components/home/info-section'
import {
  fetchPerfilActivoServer,
  fetchEventosServer,
  fetchLocalesServer,
} from '@/lib/server-api'

export default async function HomePage() {
  const [perfil, eventos, locales] = await Promise.all([
    fetchPerfilActivoServer(),
    fetchEventosServer(),
    fetchLocalesServer(),
  ])

  const eventoDestacado = eventos.find(e => e.destacado) ?? null

  return (
    <main>
      <HeroSection perfil={perfil} />
      <WelcomeStrip />
      <FeaturedEvent eventoDestacado={eventoDestacado} />
      <RandomStores locales={locales} />
      <InstagramFeed />
      <InfoSection />
    </main>
  )
}
