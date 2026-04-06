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
  description: 'Tu destino de compras, entretenimiento y gastronomía en Ciudad de México. Descubre más de 170 tiendas, restaurantes y experiencias únicas.',
  keywords: ['centro comercial', 'santa fe', 'cdmx', 'tiendas', 'restaurantes', 'entretenimiento'],
  icons: {
    icon: [
      {
        url: '/Favicon.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/Favicon.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/Favicon.ico',
        type: 'image/ico',
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
        <div className="page-bg" aria-hidden="true">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="orb orb-c" />
          <div className="orb orb-d" />
          <div className="orb orb-e" />
          <div className="orb orb-f" />
        </div>
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
