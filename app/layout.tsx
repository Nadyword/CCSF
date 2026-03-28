import type { Metadata, Viewport } from 'next'
import { Montserrat, DM_Serif_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { DataProvider } from '@/contexts/data-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat' 
})
const dmSerif = DM_Serif_Display({ 
  subsets: ['latin'], 
  weight: ['400'],
  variable: '--font-dm-serif' 
})

export const metadata: Metadata = {
  title: 'Centro Comercial Santa Fe',
  description: 'Tu destino de compras, entretenimiento y gastronomía en Ciudad de México. Descubre más de 100 tiendas, restaurantes y experiencias únicas.',
  keywords: ['centro comercial', 'santa fe', 'cdmx', 'tiendas', 'restaurantes', 'entretenimiento'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#4051B5',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen font-sans antialiased bg-background text-foreground">
        <AuthProvider>
          <DataProvider>
            <Navbar />
            {children}
            <Footer />
          </DataProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
