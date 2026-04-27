import type { Metadata } from 'next'
import { services } from '@/data/services'
import { Button } from '@/components/ui/button'
import ServiceRequestForm from '@/components/request-service/ServiceRequestForm'

export const metadata: Metadata = {
  title: 'Request Service',
  description:
    'Submit a service request to CityTech. We come to you anywhere in the DC, Maryland, and Virginia region.',
  openGraph: {
    title: 'Request Service | CityTech',
    description:
      'Submit a service request to CityTech. We come to you anywhere in the DC, Maryland, and Virginia region.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://citytechllc.com'}/request-service`,
    siteName: 'CityTech',
    type: 'website',
  },
}

export default function RequestServicePage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-12" id="main-content">
      <h1 className="text-2xl font-semibold text-foreground">Request Service</h1>
      <p className="mt-2 text-base text-muted-foreground">
        Fill out the form below and we&apos;ll reach out to confirm and quote your service. Rather
        call? We&apos;re available when you need us.
      </p>

      {/* Intro contact block — D-30: prominent Call Now CTA + owner email */}
      <div className="mt-6 rounded-lg bg-primary/5 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="min-h-[44px] bg-primary text-primary-foreground">
            <a href="tel:+17033436234">Call Now &mdash; (703) 343-6234</a>
          </Button>
          <a
            href="mailto:Citytech12v@gmail.com"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Citytech12v@gmail.com
          </a>
        </div>
      </div>

      <hr className="my-8 border-border" />

      <ServiceRequestForm services={services} />
    </section>
  )
}
