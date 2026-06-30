'use client'

import Script from 'next/script'

export function InstagramFeed() {
  return (
    <section className="w-full">
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      <div
        className="elfsight-app-9dc9887e-fe0e-41b6-ad65-f0ddc699818c"
        data-elfsight-app-lazy
      />
    </section>
  )
}
