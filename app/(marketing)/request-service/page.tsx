import type { Metadata } from 'next'
import { services } from '@/data/services'
import { Button } from '@/components/ui/button'
import ServiceRequestForm from '@/components/request-service/ServiceRequestForm'

// =====================================================================
// BLOG SCOPE ACKNOWLEDGMENT (Phase 3 — D-26)
// BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05 are EXPLICITLY DEFERRED.
// No /blog route, no MDX scaffold, no blog index, no gray-matter, no
// @next/mdx integration is implemented in this phase per user decision
// D-26 in .planning/phases/03-lead-capture-seo/03-CONTEXT.md.
// Owner is not interested in text blogging for v1.
// If a future video showcase page is needed, it will be a NEW capability
// (/videos or /gallery), not a blog.
// =====================================================================

export const metadata: Metadata = {
  title: 'Request Service',
  description:
    'Submit a service request to CityTech. We come to you anywhere in the DC, Maryland, and Virginia region.',
  openGraph: {
    title: 'Request Service | CityTech',
    description:
      'Submit a service request to CityTech. We come to you anywhere in the DC, Maryland, and Virginia region.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://citytechva.com'}/request-service`,
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
      <p className="mt-3 text-base text-muted-foreground">
        <span className="font-semibold text-foreground">Can&apos;t find your service?</span>{' '}
        Tell us what you need &mdash; we&apos;ll review your request and confirm availability.
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
