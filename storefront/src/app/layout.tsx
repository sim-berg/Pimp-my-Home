import type { Metadata } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import '@/styles/globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AuroraBackground } from '@/components/effects/AuroraBackground'
import { CrystalParticles } from '@/components/effects/CrystalParticles'
import { FloatingCrystals } from '@/components/effects/FloatingCrystals'
import { LanguageProvider } from '@/lib/language-context'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Pimp your Home | 3D Gedruckte Kristalle & Deko',
  description: 'Entdecke mystische 3D-gedruckte Kristalle, Lampen und Dekoartikel für dein Zuhause. Mit Liebe handgefertigt, weltweit versendet.',
  keywords: ['3D Druck', 'Kristalle', 'Deko', 'Lampen', 'Figuren', 'mystisch', 'Geschenke'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${inter.variable} ${cinzel.variable} dark`}>
      <body className="font-sans antialiased overflow-x-hidden">
        <LanguageProvider>
          {/* Background effects */}
          <AuroraBackground />
          <CrystalParticles />
          <FloatingCrystals />

          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <CartDrawer />
        </LanguageProvider>
      </body>
    </html>
  )
}
