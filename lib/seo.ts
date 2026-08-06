/**
 * Central SEO configuration and structured-data builders.
 *
 * Everything that Google reads about the business is defined here once, so the
 * business facts (name, phone, service area) have a single source of truth.
 *
 * Geo targeting note: CityTech will travel well beyond the area below when a job
 * justifies it, but proximity is what ranks. Target the Alexandria ring; do not
 * dilute these signals with the full will-travel range.
 */

/**
 * Canonical host, www included.
 *
 * citytechva.com issues a 308 to www.citytechva.com, so www is the real primary.
 * The previous non-www default meant every sitemap URL and canonical pointed at a
 * redirect. Keep this in step with the Vercel domain configuration.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.citytechva.com'

export const BUSINESS = {
  name: 'CityTech',
  legalName: 'CityTech, LLC',
  phone: '+17033436234',
  phoneDisplay: '(703) 343-6234',
  email: 'Citytech12v@gmail.com',
  founded: '2016',
  /** Home base. Address is intentionally unpublished — service-area business. */
  city: 'Alexandria',
  region: 'VA',
  /** Alexandria, VA. Anchors the GeoCircle below. */
  latitude: 38.8048,
  longitude: -77.0469,
  /** ~45 miles covers the Alexandria ring, DC, and inner Maryland suburbs. */
  serviceRadiusMeters: 72000,
} as const

/** Cities we actively target, highest priority first. Mirrors seo/keyword-map.md. */
export const TARGET_CITIES = [
  'Alexandria',
  'Arlington',
  'Springfield',
  'Fairfax',
  'Annandale',
  'Falls Church',
  'Woodbridge',
  'Washington, DC',
] as const

/** Stable @id so every other schema node can reference this one entity. */
export const BUSINESS_ID = `${SITE_URL}/#business`

/**
 * Site-wide business entity.
 *
 * Typed as AutoRepair + Locksmith rather than bare LocalBusiness: both are valid
 * schema.org types and the specific pair describes what they actually do.
 * areaServed is a GeoCircle because a mobile business is a radius, not a polygon.
 */
export const businessSchema = {
  '@context': 'https://schema.org',
  '@type': ['AutoRepair', 'Locksmith'],
  '@id': BUSINESS_ID,
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  description:
    'Mobile automotive locksmith and electronics services based in Alexandria, Virginia, serving Northern Virginia, Washington DC, and Maryland. Licensed, NASTF verified, and we come to you.',
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  image: `${SITE_URL}/opengraph-image`,
  foundingDate: BUSINESS.founded,
  priceRange: '$$',
  currenciesAccepted: 'USD',
  /**
   * Service-area business: no street address is published, but the city and region
   * still need to be declared or Google has no proximity signal to work with.
   */
  address: {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.city,
    addressRegion: BUSINESS.region,
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: BUSINESS.latitude,
    longitude: BUSINESS.longitude,
  },
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    geoRadius: BUSINESS.serviceRadiusMeters,
  },
  knowsAbout: [
    'automotive locksmith',
    'car key replacement',
    'transponder key programming',
    'vehicle lockouts',
    'fleet telematics installation',
    'mobile video systems',
  ],
  // TODO once GBP is live: add `sameAs` (GBP + social profiles) and `hasMap`.
  // TODO once reviews exist: add `aggregateRating`. Never before — inventing one
  // is a manual action.
}

/** Per-service node. `provider` points at the single business entity above. */
export function buildServiceSchema(opts: {
  name: string
  description: string
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    serviceType: opts.name,
    url: `${SITE_URL}/services/${opts.slug}`,
    provider: { '@id': BUSINESS_ID },
    areaServed: TARGET_CITIES.map((city) => ({ '@type': 'City', name: city })),
  }
}

/** Mirrors the visual breadcrumb in ServiceBreadcrumb.tsx. Keep the two in step. */
export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

/** Renderable <script> payload. Use as {...jsonLd(schema)} on a <script> tag. */
export function jsonLd(schema: object) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
  } as const
}
