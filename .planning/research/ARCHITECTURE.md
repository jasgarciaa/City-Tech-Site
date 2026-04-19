# Architecture Patterns

**Domain:** Marketing and lead-generation website — automotive locksmith and electronics (DMV region)
**Project:** City Tech
**Researched:** 2026-04-19
**Confidence:** HIGH (all major patterns verified against official Next.js 16.x docs)

---

## Recommended Architecture

### System Overview

```
/data/services.ts  ←──────────────────── Single Source of Truth
       │
       ├── generateStaticParams()         → /services/[slug]/page.tsx (static HTML at build)
       ├── HomepageServicesGrid           → server component, reads services array
       ├── NavMenu                        → server component, reads services array
       └── app/sitemap.ts                 → programmatic sitemap includes /services/[slug]

/content/blog/       ←──────────────────── MDX files with frontmatter exports
       │
       ├── generateStaticParams()         → /blog/[slug]/page.tsx (static HTML at build)
       └── BlogIndexPage                  → fs.readdirSync + metadata export iteration

Supabase
       │
       ├── service_requests table         ← server action writes on form submit
       └── Resend trigger                 ← called inside same server action

```

---

## Folder Structure

```
app/
├── layout.tsx                    # Root layout — HTML shell, font, global CSS, OG defaults
├── page.tsx                      # Homepage (Server Component, static)
├── sitemap.ts                    # Programmatic sitemap — reads services + blog slugs
├── robots.ts                     # robots.txt generation
├── opengraph-image.tsx           # Default OG image (ImageResponse)
│
├── (marketing)/                  # Route group — shares marketing layout (nav + footer)
│   ├── layout.tsx                # Nav + Footer wrapper; NO shared root layout conflict
│   ├── services/
│   │   └── [slug]/
│   │       └── page.tsx          # Dynamic service detail — generateStaticParams from /data/services.ts
│   ├── fleet/
│   │   └── page.tsx              # Fleet page (Server Component)
│   ├── service-area/
│   │   └── page.tsx              # Service area map page
│   ├── contact/
│   │   └── page.tsx              # Contact / Request Service page
│   └── blog/
│       ├── page.tsx              # Blog index (Server Component, reads MDX frontmatter)
│       └── [slug]/
│           └── page.tsx          # Blog post (Server Component, dynamic import of MDX)
│
├── (api)/                        # Route group — no shared layout
│   └── actions/
│       └── submit-request.ts     # Server action (NOT a route file — colocated action)
│
data/
├── services.ts                   # Single source of truth for all service definitions
│
content/
└── blog/                         # MDX blog posts (co-located with project, no CMS)
    ├── how-to-handle-a-lockout.mdx
    └── signs-your-alarm-needs-service.mdx
│
components/
├── ui/                           # Primitive, stateless components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── SectionHeading.tsx
├── layout/                       # Structural components
│   ├── Nav.tsx                   # Server Component — reads services for dropdown
│   ├── Footer.tsx                # Server Component — static
│   └── PageWrapper.tsx
├── forms/                        # Client Components — React Hook Form + Zod
│   ├── ServiceRequestForm.tsx    # 'use client' — RHF, Zod, calls server action
│   └── FleetContactForm.tsx      # 'use client' — variant for fleet leads
├── sections/                     # Page section components (mostly Server Components)
│   ├── HeroSection.tsx
│   ├── ServicesGrid.tsx          # Server Component — receives services[] as props
│   ├── TrustSignals.tsx
│   ├── Testimonials.tsx
│   ├── FleetTeaser.tsx
│   └── FooterCTA.tsx
└── interactive/                  # Client Components requiring browser APIs
    ├── LogoCarousel.tsx          # 'use client' — infinite scroll, SSR-safe
    └── ServiceAreaMap.tsx        # 'use client' — Leaflet requires window

lib/
├── supabase/
│   ├── server.ts                 # createServerClient (uses cookies() — server-only)
│   └── client.ts                 # createBrowserClient (for future client-side use)
├── actions/
│   └── submitServiceRequest.ts   # 'use server' — validates, inserts, triggers Resend
└── schema/
    └── serviceRequest.ts         # Zod schema shared by form client + server action

public/
├── logo.svg                      # SVG placeholder; swap on brand delivery
└── images/
    └── services/                 # Static service images referenced by /data/services.ts
```

---

## Component Boundaries

| Component | Type | Responsibility | Communicates With |
|-----------|------|---------------|-------------------|
| `app/layout.tsx` | Server | HTML shell, fonts, global metadata defaults | All pages via children |
| `(marketing)/layout.tsx` | Server | Nav + Footer wrapper | Nav.tsx, Footer.tsx, children |
| `Nav.tsx` | Server | Renders nav links including services dropdown | Reads `/data/services.ts` directly |
| `ServicesGrid.tsx` | Server | Renders service cards for homepage | Receives `services[]` prop from page.tsx |
| `services/[slug]/page.tsx` | Server | Service detail page, per-service metadata | Reads `/data/services.ts` by slug |
| `ServiceRequestForm.tsx` | Client (`'use client'`) | RHF form, Zod validation, loading state | Calls `submitServiceRequest` server action |
| `FleetContactForm.tsx` | Client (`'use client'`) | Fleet lead form variant | Calls same or variant server action |
| `LogoCarousel.tsx` | Client (`'use client'`) | Infinite scroll, grayscale hover, SSR-safe | No external data; receives logos[] as prop from parent Server Component |
| `ServiceAreaMap.tsx` | Client (`'use client'`) | Leaflet map render | No server data; coordinates are static constants |
| `blog/[slug]/page.tsx` | Server | Renders MDX post, per-post metadata | Dynamic import of MDX file by slug |
| `blog/page.tsx` | Server | Blog index listing | `fs.readdirSync` + MDX metadata exports |
| `submitServiceRequest.ts` | Server Action | Validate, insert to Supabase, call Resend | Supabase server client, Resend API |
| `app/sitemap.ts` | Route Handler (cached) | Generates sitemap XML | Reads `/data/services.ts` + blog content dir |

---

## Data Flow

### 1. Services Single Source of Truth

```
/data/services.ts
  exports: ServiceDefinition[]
  fields: slug, name, shortDescription, description, icon, imagePath, keywords

  ↓ consumed by (build-time):
    generateStaticParams() in /services/[slug]/page.tsx  → pre-generates all service routes
    generateMetadata() in /services/[slug]/page.tsx       → per-service <title>, description, OG
    app/sitemap.ts                                         → /services/[slug] entries

  ↓ consumed by (render-time, server):
    Nav.tsx                     → services dropdown links
    ServicesGrid.tsx            → homepage services cards
    FleetTeaser section         → may filter to fleet-relevant services
```

**Rule:** Nothing about a service is hardcoded in a page. Every service entry in the data array automatically gets a page, a nav entry, and a sitemap entry with zero additional code.

### 2. Form Submission Flow

```
User fills ServiceRequestForm (Client Component)
  → RHF + Zod validates client-side
  → form action calls submitServiceRequest() server action
      → server re-validates with Zod (defense in depth)
      → supabase.from('service_requests').insert(data)
      → resend.emails.send({ to: OWNER_EMAIL, ... })
      → returns { success: true } | { success: false, error: string }
  → Client Component shows success state or error message
```

Server actions are called directly — no API route file needed. The server action file uses `'use server'` directive and imports the Supabase server client (which calls `cookies()` server-side). Zod schema is defined once in `/lib/schema/serviceRequest.ts` and imported by both the client form (for RHF resolver) and the server action (for server-side validation).

### 3. MDX Blog Flow

```
/content/blog/*.mdx  (each file exports: metadata object with title, date, description, category)

Build time:
  generateStaticParams() reads fs.readdirSync('/content/blog')
    → returns array of { slug } objects
  For each slug:
    dynamic import(`@/content/blog/${slug}.mdx`)
    MDX compiled to RSC by @next/mdx at build time
    generateMetadata() reads exported metadata object
      → sets <title>, description, OG tags per post

Render:
  blog/[slug]/page.tsx  → dynamically imports MDX module → renders as Server Component
  blog/page.tsx         → iterates all MDX files, reads metadata export → blog index listing
```

**No gray-matter needed.** `@next/mdx` supports exporting named constants directly from `.mdx` files (`export const metadata = { ... }`). This is cleaner than gray-matter parsing for a statically typed setup — metadata is a real JS object, not a string parse.

### 4. Logo Carousel (SSR-Safe)

```
Parent Server Component (homepage or fleet page)
  → fetches/defines logos[] array (static data or future Supabase fetch)
  → passes logos[] as serializable prop to LogoCarousel

LogoCarousel ('use client')
  → receives logos[] as prop — no server data access inside client component
  → CSS animation or requestAnimationFrame for infinite scroll
  → grayscale → color on hover via Tailwind group/hover utilities
  → SSR-safe: no window access at module level; animation starts on mount via useEffect
```

Passing static data as a prop from Server to Client avoids the SSR hydration mismatch that occurs when a Client Component tries to read from browser APIs during render.

### 5. SEO Metadata Flow

```
Root layout.tsx:
  export const metadata = {
    title: { template: '%s | City Tech', default: 'City Tech — Mobile Automotive Services' },
    description: '...',
    openGraph: { ... default OG ... },
  }

Each page:
  Static pages (fleet, contact, service-area):
    export const metadata: Metadata = { title: 'Fleet Services', description: '...' }

  Dynamic pages (services/[slug], blog/[slug]):
    export async function generateMetadata({ params }): Promise<Metadata> {
      const service = services.find(s => s.slug === params.slug)
      return {
        title: service.name,
        description: service.shortDescription,
        openGraph: { images: [service.imagePath] },
      }
    }

Structured data (LocalBusiness, Service schemas):
  Injected as <script type="application/ld+json"> in page.tsx or layout.tsx
  using next/head is NOT used — use script tag directly in Server Component JSX
```

The title template on the root layout (`%s | City Tech`) propagates automatically — child pages only need to set the segment title, Next.js concatenates.

---

## Rendering Decisions by Page

| Page | Rendering | Rationale |
|------|-----------|-----------|
| Homepage | Static (prerendered) | Pure marketing content, no per-user data |
| `/services/[slug]` | Static with `generateStaticParams` | All slugs known at build from `/data/services.ts` |
| `/fleet` | Static (prerendered) | Marketing page, no dynamic content |
| `/service-area` | Static shell + Client Component | Page is static; map is a Client Component island |
| `/contact` | Static shell + Client Component | Page is static; form is a Client Component island |
| `/blog` | Static (prerendered) | Blog index from MDX files — known at build |
| `/blog/[slug]` | Static with `generateStaticParams` | All slugs known from content directory at build |

**No page requires full server-side rendering (SSR) per request.** The entire site can be prerendered at build time (ISR not needed for v1). Interactive behavior (forms, map, carousel) is handled by Client Component islands within otherwise-static pages.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Making the Service Request Form a Server Component
**What happens:** Form requires `useState` for controlled inputs, loading state, error display. Server Components cannot use these.
**Prevention:** `ServiceRequestForm.tsx` must be `'use client'`. The containing page (`/contact/page.tsx`) stays a Server Component — the form is an island.

### Anti-Pattern 2: Importing Supabase server client into a Client Component
**What happens:** `createServerClient` from `@supabase/ssr` uses the `cookies()` API, which is server-only. Importing it into a Client Component causes a build error.
**Prevention:** Keep `/lib/supabase/server.ts` server-only. Database access happens only inside server actions (which execute on the server) or Server Components. Mark the file with `import 'server-only'`.

### Anti-Pattern 3: Accessing `window` in LogoCarousel at module level
**What happens:** SSR renders the component on the server where `window` is undefined. Module-level `window` access throws during server render.
**Prevention:** Any browser API access goes inside `useEffect(() => { ... }, [])`. CSS-only animation approaches (Tailwind `animate-*` or custom keyframes) avoid this entirely.

### Anti-Pattern 4: Hardcoding service slugs in multiple places
**What happens:** Adding a new service requires updating the data file, the nav, the sitemap, and any other reference separately — they drift.
**Prevention:** `/data/services.ts` is the only place a service is defined. `generateStaticParams`, `Nav.tsx`, `ServicesGrid.tsx`, and `sitemap.ts` all read from it. Adding one object to the array propagates everywhere automatically.

### Anti-Pattern 5: Using gray-matter for MDX frontmatter when `@next/mdx` is already configured
**What happens:** Two parsing systems for the same data; gray-matter strips frontmatter as YAML and returns untyped strings.
**Prevention:** Export a typed `metadata` constant from each `.mdx` file. `@next/mdx` compiles MDX to a module — named exports work natively. TypeScript can type-check the metadata shape.

### Anti-Pattern 6: Putting Leaflet map in a Server Component
**What happens:** Leaflet requires `window` and `document`. Importing it in a Server Component throws during build.
**Prevention:** `ServiceAreaMap.tsx` is always `'use client'`. The parent page imports it normally — Next.js handles the client boundary automatically when the child has `'use client'`.

---

## SEO Infrastructure

### LocalBusiness Schema (inject in root layout or homepage)

```tsx
// app/layout.tsx or app/page.tsx — Server Component
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "City Tech",
  "description": "Mobile automotive locksmith and electronics services in the DC, Maryland, and Virginia region.",
  "areaServed": ["Washington DC", "Maryland", "Virginia"],
  "serviceType": ["Locksmith", "Automotive Electronics"],
  "telephone": "+1-XXX-XXX-XXXX",
  "url": "https://citytech.com"
}

// In JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
/>
```

### Service Schema (inject in `/services/[slug]/page.tsx`)

```tsx
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": { "@type": "LocalBusiness", "name": "City Tech" }
}
```

### Sitemap generation

`app/sitemap.ts` is a TypeScript file that exports a default function returning `MetadataRoute.Sitemap`. It reads service slugs from `/data/services.ts` and blog slugs from the content directory at build time. Priority: homepage (1.0) > services (0.9) > blog (0.7) > static pages (0.8).

---

## Suggested Build Order

Dependencies dictate order — each layer must exist before the layers that consume it.

### Layer 0: Foundation (no dependencies)
1. `/data/services.ts` — define ServiceDefinition type and initial services array
2. `/lib/schema/serviceRequest.ts` — Zod schema for form + server action
3. Supabase project setup — create `service_requests` table with status enum

**Why first:** Everything else reads from services.ts. Schema must exist before form or action is built.

### Layer 1: Layout Shell (depends on Layer 0)
4. `app/layout.tsx` — root layout, fonts, global metadata template
5. `(marketing)/layout.tsx` — nav + footer wrapper
6. `components/layout/Nav.tsx` — reads services.ts for dropdown
7. `components/layout/Footer.tsx` — static

**Why second:** Every page needs a working layout. Nav needs services.ts (Layer 0).

### Layer 2: Static Server Component Pages (depends on Layer 1)
8. `app/page.tsx` — homepage with HeroSection, ServicesGrid, TrustSignals, Testimonials, FooterCTA
9. `app/(marketing)/services/[slug]/page.tsx` — service detail with generateStaticParams + generateMetadata
10. `app/(marketing)/fleet/page.tsx` — fleet marketing page

**Why third:** Pure server rendering, no client interactivity, no form. Validates layout and data flow first.

### Layer 3: Client Component Islands (depends on Layer 1)
11. `components/forms/ServiceRequestForm.tsx` — RHF + Zod client form
12. `lib/actions/submitServiceRequest.ts` — server action (Supabase insert + Resend)
13. `app/(marketing)/contact/page.tsx` — static shell wrapping the form
14. `components/interactive/LogoCarousel.tsx` — client carousel island
15. `components/interactive/ServiceAreaMap.tsx` — Leaflet client island
16. `app/(marketing)/service-area/page.tsx` — static shell wrapping the map

**Why fourth:** Forms and interactive components can only be built once layout and data layer are stable.

### Layer 4: Blog (depends on Layer 1)
17. Configure `@next/mdx` in `next.config.mjs`, add `mdx-components.tsx`
18. Create initial MDX posts in `/content/blog/`
19. `app/(marketing)/blog/page.tsx` — blog index
20. `app/(marketing)/blog/[slug]/page.tsx` — blog post with generateStaticParams + generateMetadata

**Why fourth (parallel with Layer 3):** MDX configuration is independent of forms. Can be built in parallel if multiple engineers, or sequentially after forms are done.

### Layer 5: SEO Infrastructure (depends on Layers 2, 4)
21. `app/sitemap.ts` — programmatic sitemap (needs all routes stable)
22. `app/robots.ts` — robots.txt
23. LocalBusiness + Service schema injection in layout and service pages
24. `opengraph-image.tsx` at root and per-route as needed

**Why last:** Sitemap references all routes. Schema injection requires knowing final page structure.

---

## Image Optimization Strategy

### Service Images (in `/public/images/services/`)
- Use `next/image` with static `import` — Next.js infers width, height, blurDataURL automatically
- Set `priority={true}` on the hero/above-fold image of each service page
- Set `sizes` prop to match actual layout breakpoints (e.g., `"(max-width: 768px) 100vw, 50vw"`)
- All service images are local — no `remotePatterns` config needed

### Blog Post Images
- Store in `/content/blog/images/` alongside MDX files
- In `mdx-components.tsx`, override the `img` element to render `next/image` with `sizes="100vw"` and `style={{ width: '100%', height: 'auto' }}`
- Dynamic import pattern: `await import(`@/content/blog/images/${filename}`)` in a server async component gives automatic width/height

### Logo Carousel Images
- Client logos are SVGs or small PNGs — store in `/public/images/logos/`
- Pass a `logos: { src: string; alt: string }[]` prop from a Server Component parent to `LogoCarousel`
- Inside LogoCarousel (Client Component), use standard `<img>` tags or next/image with fixed dimensions — avoid `fill` prop in an overflow-hidden scroll container

### Placeholder while real logo is pending
- Use an inline SVG placeholder component (`components/ui/LogoPlaceholder.tsx`) — replace the import path when the real file is delivered, no other changes needed

---

## Sources

- Next.js Route Groups: https://nextjs.org/docs/app/api-reference/file-conventions/route-groups (verified 2026-04-15)
- Next.js Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components (verified 2026-04-15)
- Next.js Dynamic Routes and generateStaticParams: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes (verified 2026-04-15)
- Next.js MDX Guide: https://nextjs.org/docs/app/guides/mdx (verified 2026-04-15)
- Next.js Metadata and OG Images: https://nextjs.org/docs/app/getting-started/metadata-and-og-images (verified 2026-04-15)
- Next.js Image Optimization: https://nextjs.org/docs/app/getting-started/images (verified 2026-04-15)
- Next.js Sitemap API: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap (verified 2026-04-15)
- Next.js Caching (Cache Components / PPR): https://nextjs.org/docs/app/getting-started/caching (verified 2026-04-15)
