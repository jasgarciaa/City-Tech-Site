import type { Metadata } from 'next'
import FleetHero from '@/components/fleet/FleetHero'
import B2BPitch from '@/components/fleet/B2BPitch'
import UseCases from '@/components/fleet/UseCases'
import LogoCarousel from '@/components/shared/LogoCarousel'
import FleetContactForm from '@/components/fleet/FleetContactForm'

export const metadata: Metadata = {
  title: 'Fleet Telematics, Cameras & Key Programming | DC, MD, VA',
  description:
    'Telematics, cameras, and key programming for commercial fleets across DC, Maryland, and Virginia. We install at your yard, so vehicles stay on route instead of sitting at a shop.',
  alternates: { canonical: '/fleet' },
  openGraph: {
    title: 'Fleet Telematics & Vehicle Upfitting | CityTech',
    description:
      'Telematics, cameras, and key programming for commercial fleets across DC, Maryland, and Virginia. We install at your yard, not at a shop.',
    url: '/fleet',
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
