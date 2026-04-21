import type { Metadata } from 'next'
import { services } from '@/data/services'
import HeroSection from '@/components/home/HeroSection'
import ServicesSection from '@/components/home/ServicesSection'
import TrustSignalsSection from '@/components/home/TrustSignalsSection'
import FleetTeaserSection from '@/components/home/FleetTeaserSection'
import LogoCarousel from '@/components/shared/LogoCarousel'
import ServiceAreaSection from '@/components/home/ServiceAreaSection'
import QuickContactForm from '@/components/home/QuickContactForm'
import FooterCTASection from '@/components/home/FooterCTASection'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Mobile automotive electronics and locksmith services throughout the DC, Maryland, and Virginia region. Available when you need us.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection services={services} />
      <TrustSignalsSection />
      <FleetTeaserSection />
      <LogoCarousel ariaLabel="Our clients" />
      <ServiceAreaSection />
      <QuickContactForm services={services} />
      <FooterCTASection />
    </>
  )
}
