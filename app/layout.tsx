import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { SITE_URL, businessSchema, jsonLd } from '@/lib/seo'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  // Required for canonical and OG URLs to resolve from relative paths.
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | CityTech',
    default: 'Mobile Auto Locksmith & Car Key Replacement | Alexandria VA | CityTech',
  },
  description:
    'Mobile automotive locksmith and electronics service in Alexandria, VA. Car key replacement, key fob programming, and lockouts across Northern Virginia, DC, and Maryland. We come to you.',
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'CityTech',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <script {...jsonLd(businessSchema)} />
        {children}
      </body>
    </html>
  )
}
