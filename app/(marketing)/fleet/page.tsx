import type { Metadata } from 'next'
import FleetHero from '@/components/fleet/FleetHero'
import B2BPitch from '@/components/fleet/B2BPitch'
import UseCases from '@/components/fleet/UseCases'
import LogoCarousel from '@/components/shared/LogoCarousel'
import FleetContactForm from '@/components/fleet/FleetContactForm'

export const metadata: Metadata = {
  title: 'Fleet Services',
  description:
    'Mobile automotive electronics and locksmith services for dealerships, rental companies, and commercial fleets in the DC, Maryland, and Virginia region.',
  openGraph: {
    title: 'Fleet Services | CityTech',
    description:
      'Mobile automotive electronics and locksmith services for dealerships, rental companies, and commercial fleets in the DC, Maryland, and Virginia region.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://citytechllc.com'}/fleet`,
    siteName: 'CityTech',
    type: 'website',
  },
}

export default function FleetPage() {
  return (
    <>
      <FleetHero />
      <B2BPitch />
      <UseCases />
      <LogoCarousel ariaLabel="Fleet clients" />
      <FleetContactForm />
    </>
  )
}
