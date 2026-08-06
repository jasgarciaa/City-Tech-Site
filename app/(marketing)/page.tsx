import type { Metadata } from 'next'
import { services } from '@/data/services'
import HeroSection from '@/components/home/HeroSection'
import ServicesSection from '@/components/home/ServicesSection'
import TrustSignalsSection from '@/components/home/TrustSignalsSection'
import VehicleMakesSection from '@/components/home/VehicleMakesSection'
import FleetTeaserSection from '@/components/home/FleetTeaserSection'
import LogoCarousel from '@/components/shared/LogoCarousel'
import ServiceAreaSection from '@/components/home/ServiceAreaSection'
import QuickContactForm from '@/components/home/QuickContactForm'
import FooterCTASection from '@/components/home/FooterCTASection'

// `title.absolute` bypasses the "%s | CityTech" template so the brand name isn't
// repeated. The previous title here was "Home", which ranked for nothing.
export const metadata: Metadata = {
  title: {
    absolute:
      'Mobile Auto Locksmith & Car Key Replacement | Alexandria VA | CityTech',
  },
  description:
    'Car keys, fobs, lockouts, and auto electronics, wherever your vehicle is. Serving Alexandria, Arlington, Fairfax, DC, and Maryland since 2016. Licensed and NASTF verified.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'CityTech — Mobile Auto Locksmith & Electronics | Alexandria VA',
    description:
      'Car keys, fobs, lockouts, and auto electronics, wherever your vehicle is. Serving Alexandria, Arlington, Fairfax, DC, and Maryland since 2016.',
    url: '/',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection services={services} />
      <TrustSignalsSection />
      <VehicleMakesSection />
      <FleetTeaserSection />
      <LogoCarousel ariaLabel="Our clients" />
      <ServiceAreaSection />
      <QuickContactForm services={services} />
      <FooterCTASection />
    </>
  )
}
