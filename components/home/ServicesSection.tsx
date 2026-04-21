'use client'

import Link from 'next/link'
import { ChevronDown, ArrowRight, Cpu, Key } from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ServiceDefinition } from '@/data/services'

interface ServicesSectionProps {
  services: ServiceDefinition[]
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className="bg-background py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-sm uppercase tracking-[0.08em] text-muted-foreground font-normal">
          Our Services
        </p>
        <h2 className="mt-2 text-center text-xl font-semibold text-foreground">
          Everything Your Vehicle Needs
        </h2>

        <Accordion
          type="multiple"
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = service.category === 'electronics' ? Cpu : Key
            const badgeClass =
              service.category === 'electronics'
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent text-accent-foreground'
            const categoryLabel =
              service.category === 'electronics' ? 'Electronics' : 'Locksmith'
            const iconColor =
              service.category === 'electronics' ? 'text-primary' : 'text-accent'

            return (
              <AccordionItem
                key={service.slug}
                value={service.slug}
                className="border-0"
              >
                <Card className="min-h-[200px] border-border transition-all duration-150 hover:border-primary hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-2">
                      <Badge
                        className={`${badgeClass} text-sm font-normal uppercase tracking-[0.06em]`}
                      >
                        {categoryLabel}
                      </Badge>
                      <Icon size={24} className={iconColor} aria-hidden="true" />
                    </div>
                    <CardTitle className="mt-4 text-base font-semibold text-foreground">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm leading-snug text-muted-foreground">
                      {service.shortDescription}
                    </CardDescription>
                    <AccordionTrigger className="group mt-4 flex w-full items-center justify-start gap-1 text-sm font-semibold text-primary hover:no-underline data-[state=open]:text-primary [&>svg]:hidden">
                      <span className="group-data-[state=open]:hidden">Show details</span>
                      <span className="hidden group-data-[state=open]:inline">Show less</span>
                      <ChevronDown
                        size={16}
                        className="transition-transform duration-150 group-data-[state=open]:rotate-180"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="pt-3">
                      <p className="text-sm leading-relaxed text-foreground">
                        {service.shortDescription}
                      </p>
                      <Link
                        href={`/services/${service.slug}`}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        aria-label={`View ${service.name} service details`}
                      >
                        View Service Details <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </AccordionContent>
                  </CardContent>
                </Card>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}
