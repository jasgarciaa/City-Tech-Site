import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | City Tech',
    default: 'City Tech — Mobile Automotive Locksmith and Electronics Service',
  },
  description: 'Mobile automotive locksmith and electronics services for the DC, Maryland, and Virginia region.',
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'City Tech, LLC',
  description:
    'Mobile automotive locksmith and electronics services for the DC, Maryland, and Virginia region.',
  telephone: '+17033436234',
  email: 'Citytech12v@gmail.com',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://citytechllc.com',
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Washington, DC' },
    { '@type': 'AdministrativeArea', name: 'Maryland' },
    { '@type': 'AdministrativeArea', name: 'Virginia' },
  ],
  priceRange: '$$',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
      </body>
    </html>
  )
}
