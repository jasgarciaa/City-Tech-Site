import Link from 'next/link'
import { getServicesByCategory, type ServiceDefinition } from '@/data/services'

export default function RelatedServices({ current }: { current: ServiceDefinition }) {
  const related = getServicesByCategory(current.category).filter((s) => s.slug !== current.slug)
  if (related.length === 0) return null

  return (
    <section aria-label="Related services" className="mt-16">
      <h2 className="text-xl font-semibold text-foreground mb-4">Related Services</h2>
      <ul className="flex gap-4 overflow-x-auto pb-2">
        {related.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/services/${s.slug}`}
              aria-label={`View ${s.name} service details`}
              className="block min-w-[180px] rounded-md border border-border p-4 transition-all duration-150 hover:border-primary hover:shadow-sm"
            >
              <span className="block text-sm font-semibold text-foreground">{s.name}</span>
              <span className="mt-1 block truncate text-sm text-muted-foreground">{s.shortDescription}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
