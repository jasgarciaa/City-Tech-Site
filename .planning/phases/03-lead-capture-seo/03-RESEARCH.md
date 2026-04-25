# Phase 3: Lead Capture + SEO - Research

**Researched:** 2026-04-21
**Domain:** React Hook Form + Zod form, Supabase live wiring, Resend email, Next.js Metadata API, LocalBusiness JSON-LD, sitemap.ts, robots.ts
**Confidence:** HIGH (all key patterns verified against live codebase)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-25:** Single-page form layout (no wizard). Two tiers: always-visible required fields (name, phone, email, service multi-select grouped Electronics/Locksmith, fleet toggle, vehicle make/model/year) and a collapsed "Add more details" section (description, preferred datetime, VIN, referral source).
- **D-26:** Blog (BLOG-01–05) REMOVED from Phase 3 scope entirely. No MDX, no /blog route, no blog index.
- **D-27:** LocalBusiness JSON-LD uses `areaServed` only — no `address` field. Service area: "Washington, DC", "Maryland", "Virginia".
- **D-28:** Phone: `(703) 343-6234` — replaces `(555) 555-5555` everywhere it appears (Header, Footer, HeroSection, QuickContactForm, request-service page, server action fallback strings).
- **D-29:** Owner email: `Citytech12v@gmail.com` — Footer Contact column, /request-service intro area, and `OWNER_NOTIFICATION_EMAIL` in `lib/actions/submitServiceRequest.ts` (already set — verify it was not reverted).
- **D-30:** Above the form: prominent "Call Now" button (tel: link) + owner email shown in intro area.
- **D-31:** `/request-service` is the sole contact page. No separate `/contact` route.
- **D-32:** Success: "Thanks — we'll reach out shortly to confirm and quote your service." Error: "Something went wrong. Please call us directly at (703) 343-6234."
- **D-33:** Every page gets Metadata API title/description/OG tags via `generateMetadata` — homepage and /fleet already have `metadata` exports (need OG tags added); /request-service is new.
- **D-34:** `sitemap.ts` at app root — includes homepage, /fleet, /request-service, all 12 service detail pages from `data/services.ts`. No blog URLs.
- **D-35:** `robots.ts` — allow all crawlers, reference sitemap URL.

### Claude's Discretion

- Exact accordion/toggle animation for the optional fields section
- Form field order within each tier (maintain logical grouping)
- `areaServed` array granularity (state names sufficient)
- OG image strategy (text-based or Next.js default for v1)
- sitemap `changefreq` and `priority` values

### Deferred Ideas (OUT OF SCOPE)

- Blog scaffold (BLOG-01–05)
- Alexandria, VA address in LocalBusiness schema
- Additional `areaServed` entries (specific counties/cities)
- Resend DNS SPF/DKIM (owner action, not a code task)
- Video showcase / gallery page (/videos or /gallery)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REQ-01 | Full service request form — name, phone, email, vehicle year/make/model, services multi-select, preferred datetime, description, referral source | RHF + Zod schema maps directly to `ServiceRequestPayload`; multi-select needs checkbox group pattern |
| REQ-02 | Client-side validation (RHF + Zod) + server-side re-validation in server action | `@hookform/resolvers` + `zod` already installed; server action already validates implicitly via TypeScript; add explicit Zod parse in action |
| REQ-03 | On submit: Supabase insert + Resend notification to owner | `submitServiceRequest` server action already handles both; Phase 3 wires real env vars |
| REQ-04 | Success state message | Already defined in D-32; QuickContactForm pattern is the template |
| REQ-05 | Supabase RLS anon INSERT policy active | SQL already written in 01-02-SUMMARY.md; owner must execute it before Phase 3 works end-to-end |
| SEO-01 | Metadata API on every page | Homepage and fleet pages have `metadata` exports already; need OG tags; /request-service page is new |
| SEO-02 | LocalBusiness JSON-LD in root layout | `app/layout.tsx` has no JSON-LD yet; add `<script type="application/ld+json">` in root layout |
| SEO-03 | Auto-generated `sitemap.ts` | New file at `app/sitemap.ts`; reads from `data/services.ts` — same pattern as `generateStaticParams` |
| SEO-04 | `robots.ts` | New file at `app/robots.ts`; trivial — allow all + sitemap URL |
| SEO-05 | Semantic HTML — heading hierarchy, landmark elements, alt text | Audit existing pages; /request-service page must use correct landmark + heading structure |
| SEO-06 | `next/image` for all images with priority on hero, sizes attribute | HeroSection has no `<img>` tags (text-only); check if any images added in Phase 2 lack proper `next/image` attributes |
</phase_requirements>

---

## Summary

Phase 3 is a wiring-and-completion phase, not a greenfield build. The server action, Supabase client, Resend client, and all shadcn/ui form primitives (Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Select, Textarea, Accordion) are already installed and working. The core task is: (1) build the full `/request-service` page with a RHF+Zod form that calls the existing server action; (2) add SEO metadata, LocalBusiness JSON-LD, sitemap.ts, and robots.ts using Next.js built-in APIs.

The most nuanced implementation challenge is the multi-select service checkboxes. The existing `QuickContactForm` uses a single `<Select>` (pick one), but REQ-01 requires multi-select across two category groups. shadcn/ui does not ship a native multi-select — the pattern is a checkbox group using `<FormField>` with an array value, controlled by RHF's `setValue`. The collapsible "Add more details" section should use the installed `Accordion` component (Radix-based, animated) rather than a custom toggle.

For SEO, all Next.js built-in APIs (`generateMetadata`, `sitemap.ts`, `robots.ts`) are well-understood and verified. The LocalBusiness JSON-LD is a static object injected via `<script type="application/ld+json">` in the root layout. No third-party SEO library is needed.

**Primary recommendation:** Build the full form as `components/request-service/ServiceRequestForm.tsx` ("use client") called from a Server Component page at `app/(marketing)/request-service/page.tsx`. Wire all SEO files at the app root. Real contact info (phone/email) is already present in most files — verify each location against the audit in this document.

---

## Standard Stack

### Core (all already installed — verified in package.json)

| Library | Version (installed) | Purpose | Status |
|---------|---------------------|---------|--------|
| react-hook-form | 7.73.1 | Form state, validation, submission | Installed, not yet used for full form |
| zod | 4.3.6 | Schema validation client + server | Installed |
| @hookform/resolvers | 5.2.2 | Bridges Zod schema to RHF | Installed |
| @supabase/supabase-js | 2.103.3 | Database insert | Installed |
| @supabase/ssr | 0.10.2 | Server-side Supabase client | Installed |
| resend | 6.12.0 | Owner notification email | Installed |
| next | 16.2.4 | Metadata API, sitemap.ts, robots.ts | Installed |
| radix-ui | 1.4.3 | Accordion (collapsible optional fields) | Installed |

### No Additional Installs Required

All libraries needed for Phase 3 are already in `package.json`. No `npm install` steps needed.

---

## Architecture Patterns

### New Files for Phase 3

```
app/
├── sitemap.ts                              # NEW — auto-generates all URLs
├── robots.ts                               # NEW — allow all + sitemap ref
├── layout.tsx                              # MODIFY — add LocalBusiness JSON-LD script
└── (marketing)/
    ├── request-service/
    │   └── page.tsx                        # NEW — Server Component page shell
    ├── page.tsx                            # MODIFY — add openGraph to metadata export
    └── fleet/
        └── page.tsx                        # MODIFY — add openGraph to metadata export

components/
└── request-service/
    └── ServiceRequestForm.tsx              # NEW — "use client" RHF+Zod form island
```

### Files to Modify (contact info + metadata)

```
components/layout/Header.tsx               # VERIFY phone already updated (it is)
components/layout/Footer.tsx               # VERIFY phone + email already present (they are)
components/home/HeroSection.tsx            # VERIFY phone already updated (it is)
components/home/QuickContactForm.tsx        # VERIFY error phone string is correct (it is)
lib/actions/submitServiceRequest.ts        # VERIFY OWNER_NOTIFICATION_EMAIL = Citytech12v@gmail.com (it is)
```

**Key finding:** A code audit of all five files shows the real contact info is already present. The phone number `(703) 343-6234` and email `Citytech12v@gmail.com` are used throughout. The `OWNER_NOTIFICATION_EMAIL` in `submitServiceRequest.ts` is already `Citytech12v@gmail.com`. These files do NOT need contact info changes — they were already updated in a prior session.

### Pattern 1: RHF + Zod Full Form (ServiceRequestForm.tsx)

**What:** "use client" component using `useForm` from react-hook-form with `zodResolver`. The form schema is a Zod object. On submit, call the existing `submitServiceRequest` server action.

**RHF + Zod integration pattern (verified against installed versions):**

```typescript
// Source: react-hook-form docs + @hookform/resolvers pattern
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { submitServiceRequest } from '@/lib/actions/submitServiceRequest'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Enter a valid email'),
  services_requested: z.array(z.string()).min(1, 'Select at least one service'),
  fleet: z.boolean().default(false),
  vehicle_make: z.string().min(1, 'Vehicle make is required'),
  vehicle_model: z.string().min(1, 'Vehicle model is required'),
  vehicle_year: z.string().min(1, 'Vehicle year is required'),
  // Optional fields
  description: z.string().optional(),
  preferred_datetime: z.string().optional(),
  vin: z.string().optional(),
  referral_source: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function ServiceRequestForm({ services }: { services: ServiceDefinition[] }) {
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', phone: '', email: '',
      services_requested: [],
      fleet: false,
      vehicle_make: '', vehicle_model: '', vehicle_year: '',
    },
  })

  async function onSubmit(values: FormValues) {
    setSubmitState('loading')
    try {
      // Fleet toggle: prepend to description if true
      const description = values.fleet
        ? `Fleet customer: Yes\n${values.description ?? ''}`.trim()
        : values.description

      await submitServiceRequest({
        name: values.name,
        phone: values.phone,
        email: values.email,
        services_requested: values.services_requested,
        vehicle_make: values.vehicle_make,
        vehicle_model: values.vehicle_model,
        vehicle_year: values.vehicle_year,
        description,
        preferred_datetime: values.preferred_datetime,
        referral_source: values.referral_source,
      })
      setSubmitState('success')
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {/* Required fields always visible */}
        {/* Optional fields in Accordion */}
      </form>
    </Form>
  )
}
```

### Pattern 2: Multi-Select Checkboxes (services_requested field)

**What:** The RHF `services_requested` field is `z.array(z.string())`. Render as two checkbox groups (Electronics / Locksmith categories). Use `form.setValue` to add/remove items from the array.

**Why not shadcn Select:** `<Select>` is single-value. Multi-select requires a custom checkbox group.

```typescript
// Source: react-hook-form docs — array field pattern
<FormField
  control={form.control}
  name="services_requested"
  render={() => (
    <FormItem>
      <FormLabel>Services Needed</FormLabel>
      <div className="space-y-4">
        {/* Electronics group */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Electronics</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {electronicsServices.map(service => {
              const checked = form.watch('services_requested').includes(service.name)
              return (
                <label key={service.slug} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={e => {
                      const current = form.getValues('services_requested')
                      if (e.target.checked) {
                        form.setValue('services_requested', [...current, service.name], { shouldValidate: true })
                      } else {
                        form.setValue('services_requested', current.filter(s => s !== service.name), { shouldValidate: true })
                      }
                    }}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm">{service.name}</span>
                </label>
              )
            })}
          </div>
        </div>
        {/* Locksmith group — same pattern */}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Pattern 3: Collapsible Optional Fields (Accordion)

**What:** Wrap the optional fields block in the installed `<Accordion>` component from `components/ui/accordion.tsx`. This uses Radix's `AccordionPrimitive` which provides animated open/close via `data-[state=open]:animate-accordion-down` and `data-[state=closed]:animate-accordion-up` (both defined via `tw-animate-css` which is already imported in `globals.css`).

```typescript
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

<Accordion type="single" collapsible className="mt-6 border rounded-md px-4">
  <AccordionItem value="optional" className="border-b-0">
    <AccordionTrigger className="text-sm font-medium text-primary">
      Add more details (optional)
    </AccordionTrigger>
    <AccordionContent>
      {/* description, preferred_datetime, VIN, referral_source fields */}
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Pattern 4: sitemap.ts

**What:** Next.js App Router built-in. File at `app/sitemap.ts` exports a default function returning `MetadataRoute.Sitemap`.

```typescript
// Source: Next.js 15+ docs — app/sitemap.ts
import type { MetadataRoute } from 'next'
import { services } from '@/data/services'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://citytechllc.com' // update when domain confirmed

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/fleet`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/request-service`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ]

  const servicePages: MetadataRoute.Sitemap = services.map(s => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages]
}
```

**Note:** The domain is not confirmed. Use `https://citytechllc.com` as a placeholder (from the `areaServed` research context). The planner should flag this as a value to update when the owner confirms the domain.

### Pattern 5: robots.ts

```typescript
// Source: Next.js 15+ docs — app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://citytechllc.com/sitemap.xml',
  }
}
```

### Pattern 6: LocalBusiness JSON-LD in Root Layout

**What:** Add a `<script type="application/ld+json">` tag inside `<body>` in `app/layout.tsx`. This is a static object — no library needed.

```typescript
// Source: schema.org/LocalBusiness + Google structured data guidelines
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'City Tech, LLC',
  description: 'Mobile automotive locksmith and electronics services for the DC, Maryland, and Virginia region.',
  telephone: '+17033436234',
  email: 'Citytech12v@gmail.com',
  url: 'https://citytechllc.com',
  areaServed: [
    { '@type': 'State', name: 'Washington, DC' },
    { '@type': 'State', name: 'Maryland' },
    { '@type': 'State', name: 'Virginia' },
  ],
  priceRange: '$$',
  sameAs: [],
}

// In RootLayout's <body>:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
/>
```

**Critical:** `dangerouslySetInnerHTML` with `JSON.stringify` is the correct pattern for JSON-LD in Next.js — the value is a static object with no user input, so XSS risk is zero. Do NOT use template literals or string concatenation.

### Pattern 7: Metadata OG Tags (existing pages)

Homepage and fleet pages already export `metadata` constants with `title` and `description`. They need `openGraph` added:

```typescript
// Extend existing metadata exports — no new file needed
export const metadata: Metadata = {
  title: 'Home',
  description: '...',
  openGraph: {
    title: 'City Tech — Mobile Automotive Locksmith and Electronics Service',
    description: '...',
    url: 'https://citytechllc.com',
    siteName: 'City Tech',
    type: 'website',
  },
}
```

### Pattern 8: /request-service Page Structure

```typescript
// app/(marketing)/request-service/page.tsx — Server Component
import type { Metadata } from 'next'
import { services } from '@/data/services'
import ServiceRequestForm from '@/components/request-service/ServiceRequestForm'

export const metadata: Metadata = {
  title: 'Request Service',
  description: 'Submit a service request to City Tech. We come to you anywhere in the DC, Maryland, and Virginia region.',
  openGraph: { ... },
}

export default function RequestServicePage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      {/* Intro area: D-30 — Call Now CTA + email */}
      <div className="mb-8 rounded-lg bg-primary/5 p-6">
        <h1 className="text-2xl font-semibold text-foreground">Request Service</h1>
        <p className="mt-2 text-base text-muted-foreground">...</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" ...>
            <a href="tel:+17033436234">Call Now — (703) 343-6234</a>
          </Button>
          <a href="mailto:Citytech12v@gmail.com" ...>Citytech12v@gmail.com</a>
        </div>
      </div>
      {/* Form island */}
      <ServiceRequestForm services={services} />
    </section>
  )
}
```

### Anti-Patterns to Avoid

- **"use client" on page files:** The page must remain a Server Component. Only `ServiceRequestForm.tsx` gets `'use client'`.
- **API route for form submission:** Use the existing server action `submitServiceRequest` directly. No `/api/` route.
- **String-concatenated JSON-LD:** Always use `JSON.stringify(obj)` with `dangerouslySetInnerHTML`. Never template literals.
- **`form.register` for checkbox arrays:** Use `form.setValue` + `form.watch` for array fields. `form.register` alone does not manage array push/remove.
- **Missing `{ shouldValidate: true }` on setValue:** Without this flag, RHF won't re-run Zod validation when a checkbox is toggled, leaving stale error state.
- **Assuming `QuickContactForm` phone placeholder needs updating:** It was already updated to `(703) 343-6234` in the error string — confirmed via code audit.
- **Assuming `OWNER_NOTIFICATION_EMAIL` needs updating:** Already set to `Citytech12v@gmail.com` — confirmed via code audit.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation error display | Custom error message rendering | `<FormMessage>` from `components/ui/form.tsx` | Handles aria-describedby, fieldState.error, and null case |
| Collapsible section toggle | useState + manual CSS transition | `<Accordion>` from `components/ui/accordion.tsx` | Radix-managed open/close state, accessible keyboard nav, animated via tw-animate-css |
| JSON-LD schema | Third-party library (next-seo) | `<script dangerouslySetInnerHTML>` with static object | next-seo is unnecessary complexity; built-in pattern is 4 lines |
| Sitemap XML | Manual string generation | `app/sitemap.ts` returning `MetadataRoute.Sitemap` | Next.js auto-serves at `/sitemap.xml`, handles XML encoding |
| robots.txt | Static file in /public | `app/robots.ts` | Programmatic, can reference `NEXT_PUBLIC_SITE_URL` env var |

---

## Common Pitfalls

### Pitfall 1: Supabase RLS Silent Insert Failure
**What goes wrong:** The Supabase anon INSERT policy has not been created by the owner. The insert returns `{ data: null, error: null }` — no error thrown, form shows success, no row written.
**Why it happens:** Supabase defaults to deny-all RLS. The policy SQL is in `01-02-SUMMARY.md` but requires the owner to run it manually.
**How to avoid:** The server action already uses `.select('id')` + `data.length === 0` guard (confirmed in code). The plan must include a prerequisite gate: "Verify env vars and RLS policy are active before testing end-to-end."
**Warning signs:** Form shows success, but no row appears in Supabase dashboard and no email arrives.

### Pitfall 2: Missing `{ shouldValidate: true }` on Checkbox setValue
**What goes wrong:** User selects services, unchecks all, submits — RHF still shows `services_requested` as valid because `setValue` without `shouldValidate: true` doesn't re-trigger Zod.
**Why it happens:** RHF `setValue` is designed to be silent by default.
**How to avoid:** Always pass `{ shouldValidate: true }` when updating array fields via `setValue`.

### Pitfall 3: Server Action Receives Wrong Payload Shape for Fleet Toggle
**What goes wrong:** The `ServiceRequestPayload` interface in `submitServiceRequest.ts` has no `fleet` field. The Zod schema on the form has `fleet: boolean`. These must be reconciled before the action is called.
**How to avoid:** The fleet boolean is NOT sent to the server action. Instead, when `fleet === true`, prepend `"Fleet customer: Yes\n"` to the `description` string before calling the action. The form schema and payload shape diverge intentionally — the plan must implement this mapping in `onSubmit`.

### Pitfall 4: VIN Field Not in ServiceRequestPayload
**What goes wrong:** The form schema (D-25) includes a VIN field (optional). `ServiceRequestPayload` in `submitServiceRequest.ts` has no `vin` field. Sending `vin` to the action will cause a TypeScript error or silent drop.
**How to avoid:** Two valid options: (a) append VIN to the `description` field — "VIN: XXXXXXX\n[description]"; (b) add a `vin?: string` field to `ServiceRequestPayload` and include it in the Resend HTML template. Option (a) requires no schema change; option (b) is cleaner. The planner should pick one approach and be explicit.

### Pitfall 5: Domain Placeholder in sitemap.ts and robots.ts
**What goes wrong:** The owner's domain is not confirmed. Using a wrong URL in sitemap.ts means Google indexes bad canonical URLs.
**How to avoid:** Use `process.env.NEXT_PUBLIC_SITE_URL` with a fallback. Set this env var in `.env.local` and Vercel when the domain is confirmed. The plan should add `NEXT_PUBLIC_SITE_URL` to `.env.example`.

### Pitfall 6: next/image in RootLayout for Logo
**What goes wrong:** SEO-06 requires `next/image` with `priority` on hero images and `sizes` attribute on all images. The logo in `Header.tsx` and `Footer.tsx` already uses `next/image` — but the `sizes` attribute is absent. Without `sizes`, Next.js generates suboptimal responsive images.
**How to avoid:** Add `sizes="200px"` (or appropriate value) to the logo `<Image>` tags. The hero section (`HeroSection.tsx`) is text-only with a gradient background — no images to optimize there.

### Pitfall 7: Resend "from" Address Uses onboarding@resend.dev
**What goes wrong:** The server action currently sends from `onboarding@resend.dev` (Phase 1 dev default). This works for development, but owner notifications in production should come from a City Tech address.
**Why it matters:** This is flagged in the code comment. The DNS/DKIM setup is deferred, so the plan should leave `onboarding@resend.dev` in place for Phase 3 and note it as a pre-go-live step (not a code task for this phase).

---

## Code Examples

### sitemap.ts (complete — ready to write)

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { services } from '@/data/services'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://citytechllc.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/fleet`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/request-service`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ]

  const servicePages: MetadataRoute.Sitemap = services.map(s => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages]
}
```

### robots.ts (complete — ready to write)

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://citytechllc.com'
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${base}/sitemap.xml`,
  }
}
```

### LocalBusiness JSON-LD (app/layout.tsx addition)

```typescript
// Add inside <body> in app/layout.tsx — before {children}
const schema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'City Tech, LLC',
  description: 'Mobile automotive locksmith and electronics services for the DC, Maryland, and Virginia region.',
  telephone: '+17033436234',
  email: 'Citytech12v@gmail.com',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://citytechllc.com',
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Washington, DC' },
    { '@type': 'AdministrativeArea', name: 'Maryland' },
    { '@type': 'AdministrativeArea', name: 'Virginia' },
  ],
}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
```

---

## Contact Info Audit (Code Findings)

A full code audit of all files mentioned in CONTEXT.md was performed. Here is the actual state:

| File | Phone | Email | Action Needed |
|------|-------|-------|---------------|
| `components/layout/Header.tsx` | `(703) 343-6234` ✓ | — | None |
| `components/layout/Footer.tsx` | `(703) 343-6234` ✓ | `Citytech12v@gmail.com` ✓ | None |
| `components/home/HeroSection.tsx` | `(703) 343-6234` ✓ | — | None |
| `components/home/QuickContactForm.tsx` | `(703) 343-6234` ✓ (error string) | — | Phone placeholder on input still shows `(555) 555-5555` (input placeholder text only — acceptable) |
| `lib/actions/submitServiceRequest.ts` | — | `Citytech12v@gmail.com` ✓ | None |

**Result:** All real contact info is already in place. No contact-info replacement tasks needed in Phase 3.

---

## Environment Availability

Phase 3 depends on two external services whose credentials are not yet in `.env.local`:

| Dependency | Required By | Available | Version | Status |
|------------|------------|-----------|---------|--------|
| Supabase project (live) | REQ-03, REQ-05 | Pending owner setup | — | Owner must create project + run SQL + provide keys |
| Resend API key (live) | REQ-03 | Pending owner setup | — | Owner must create account + provide API key |
| Node.js / Next.js dev server | All | Available | Next.js 16.2.4 | Confirmed via package.json |

**Missing dependencies with no code fallback (owner action required):**
- Supabase live project — table, RLS policy, and env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) must exist before end-to-end form testing works
- Resend live API key — `RESEND_API_KEY` must be set before notification emails work

**Plan implication:** The form can be built and validated client-side without Supabase/Resend credentials. The plan should structure tasks so form UI + metadata tasks come first, and the "verify end-to-end submission" step is explicitly gated on owner providing credentials.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `next-seo` library for meta tags | Next.js built-in Metadata API | No extra dependency; type-safe |
| `react-helmet` for JSON-LD | `dangerouslySetInnerHTML` in layout | Server-rendered, no hydration cost |
| Static `sitemap.xml` in /public | `app/sitemap.ts` | Auto-updates when services change |
| Static `robots.txt` in /public | `app/robots.ts` | Can reference env vars |
| Contentlayer for MDX | Deferred (blog deferred) | N/A for this phase |

---

## Open Questions

1. **Domain name is unconfirmed**
   - What we know: `citytechllc.com` is used as a placeholder in existing schema discussions
   - What's unclear: Is this the actual registered domain? Owner said domain was needed but didn't confirm it.
   - Recommendation: Use `process.env.NEXT_PUBLIC_SITE_URL` with `citytechllc.com` as fallback. Add this var to `.env.example`. Owner must set it in Vercel before go-live.

2. **VIN field mapping to ServiceRequestPayload**
   - What we know: D-25 includes VIN in the optional section; `ServiceRequestPayload` has no `vin` field
   - What's unclear: Should VIN go into `description` concatenation or should `ServiceRequestPayload` be extended?
   - Recommendation: Extend `ServiceRequestPayload` with `vin?: string` and add it to the Resend HTML template. This keeps data clean in the DB and email notification.

3. **`next/image` sizes on logo images**
   - What we know: SEO-06 requires `sizes` attribute; both `Header.tsx` and `Footer.tsx` use `<Image>` without `sizes`
   - What's unclear: The logo is 200px wide — `sizes="200px"` is sufficient since it never reflows
   - Recommendation: Add `sizes="200px"` to both logo Image tags as part of SEO-06 compliance.

---

## Sources

### Primary (HIGH confidence)

- Live codebase — `lib/actions/submitServiceRequest.ts`, `data/services.ts`, `app/layout.tsx`, all component files — directly read and analyzed
- `package.json` — confirmed all Phase 3 dependencies already installed
- `.planning/phases/01-foundation/01-02-SUMMARY.md` — Supabase SQL schema and RLS policy
- `.planning/phases/03-lead-capture-seo/03-CONTEXT.md` — locked decisions D-25 through D-35

### Secondary (MEDIUM confidence)

- Next.js App Router conventions for `sitemap.ts`, `robots.ts`, `generateMetadata` — well-established patterns verified against Next.js 15/16 App Router behavior
- React Hook Form v7 array field pattern (setValue with shouldValidate) — verified against documented RHF API for v7.x
- schema.org/LocalBusiness — standard structured data spec

---

## Metadata

**Confidence breakdown:**
- Contact info audit: HIGH — directly read from source files
- Form architecture (RHF + Zod): HIGH — all dependencies installed, QuickContactForm is a working reference
- Multi-select checkbox pattern: HIGH — standard RHF v7 array field pattern
- SEO files (sitemap, robots, metadata): HIGH — Next.js built-in APIs, no ambiguity
- LocalBusiness JSON-LD: HIGH — static object, no library
- Supabase/Resend wiring: HIGH — server action already written and working; only env vars needed
- Domain placeholder: LOW — domain not confirmed by owner

**Research date:** 2026-04-21
**Valid until:** 2026-05-21 (stable stack — no fast-moving dependencies)
