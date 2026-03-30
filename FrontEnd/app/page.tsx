'use client'

import { HeroSection } from '@/components/home/hero-section'
import { FeaturedEvent } from '@/components/home/featured-event'
import { RandomStores } from '@/components/home/random-stores'
import { InfoSection } from '@/components/home/info-section'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedEvent />
      <RandomStores />
      <InfoSection />
    </main>
  )
}
