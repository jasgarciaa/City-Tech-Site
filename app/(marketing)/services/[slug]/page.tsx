import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { services, getServiceBySlug } from '@/data/services'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ServiceBreadcrumb from '@/components/services/ServiceBreadcrumb'
import ProcessSteps from '@/components/services/ProcessSteps'
import RelatedServices from '@/components/services/RelatedServices'

// Force static generation — unknown slugs produce 404 rather than fall through to dynamic render
export const dynamicParams = false

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return {}
  return {
    title: service.name,
    description: service.shortDescription,
    openGraph: {
      title: `${service.name} | City Tech`,
      description: service.shortDescription,
    },
  }
}

export default async function ServiceDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const categoryLabel = service.category === 'electronics' ? 'Electronics' : 'Locksmith'
  const badgeClass =
    service.category === 'electronics'
      ? 'bg-primary text-primary-foreground'
      : 'bg-accent text-accent-foreground'

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <ServiceBreadcrumb currentName={service.name} />

      {/* Page header */}
      <header>
        <Badge className={`${badgeClass} text-sm font-normal uppercase tracking-[0.06em]`}>
          {categoryLabel}
        </Badge>
        <h1 className="mt-3 text-2xl md:text-3xl font-semibold text-foreground">{service.name}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{service.shortDescription}</p>
      </header>

      {/* Problem */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">The Problem</h2>
        <p className="mt-3 text-base leading-relaxed text-foreground">{service.pageContent.problem}</p>
      </section>

      {/* Solution */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">Our Solution</h2>
        <p className="mt-3 text-base leading-relaxed text-foreground">{service.pageContent.solution}</p>
      </section>

      {/* Process */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">How It Works</h2>
        <div className="mt-4">
          <ProcessSteps steps={service.pageContent.process} />
        </div>
      </section>

      {/* CTA block */}
      <section className="mt-12 rounded-lg bg-muted p-6">
        <h2 className="text-xl font-semibold text-foreground">Get a Free Quote</h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          Contact City Tech for a free, no-obligation quote on {service.name}.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="min-h-[44px] bg-primary text-primary-foreground">
            <Link href="/request-service">Request Service</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-h-[44px] border-primary text-primary hover:bg-primary/5">
            <a href="tel:+17033436234" aria-label="Call City Tech at (703) 343-6234">Call Now</a>
          </Button>
        </div>
      </section>

      {/* Related services */}
      <RelatedServices current={service} />
    </article>
  )
}
