# Phase 2: Core Pages - Research

**Researched:** 2026-04-19
**Domain:** Next.js App Router page composition, shadcn/ui components, CSS keyframe carousel, static param generation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Carried Forward from Phase 1 (D-01–D-18)**
- D-01/D-02: Two-blue brand system (primary `#1B3A8F`, accent `#00AEEF`), light mode only
- D-07: Nav links: Services (dropdown), Fleet, Request Service — no Blog
- D-10/D-11: `ServiceDefinition` shape from `data/services.ts` drives all service pages; no icon field in data
- D-12: 12 services — 8 Electronics, 4 Locksmith
- D-09: CTA label "Call Now", phone placeholder `(555) 555-5555`

**Hero Section**
- D-19: Dark blue gradient (`--primary`) full-width hero. White headline, cyan (`--accent`) accent on key phrase "we come to you", dual CTAs: "Request Service" (primary button) + "Call Now" (secondary/outline). No image dependency.

**Homepage Section Order**
- D-20: Hero → Services Grid+Accordion → Trust Signals → Fleet Teaser → Logo Carousel → Service Area → Quick Contact Form → Footer CTA (before global footer)
- D-22: Testimonials section (HOME-08) is removed from scope — no testimonials block in v1

**Services Section (HOME-03 + HOME-04 combined)**
- D-21: Services Grid and Accordion are one unified section. Grid provides visual overview; clicking a card expands its short description inline. Not two separate sections.

**Quick Contact Form (HOME-02)**
- D-23: 3 fields: name, phone, service requested (select). Wired to `lib/actions/submitServiceRequest.ts`. Will show error state until Supabase is configured (Phase 3). No code changes needed at Phase 3.

**Logo Carousel (HOME-05 + FLEET-04)**
- D-24: Three real fleet/commercial clients: Michael and Sons, Zipcar, AVIS. Placeholder tiles (company name in styled monochrome box) in `/public/logos/`. Same carousel reused on homepage and fleet page. Infinite scroll, grayscale default, full color on hover, pauses on hover.

**Service Detail Pages**
- Generated via `generateStaticParams` from `data/services.ts`
- Page structure per SVC-02: problem → solution → process → CTA
- Related services cross-links at bottom (SVC-03) — same category, exclude current
- Unique metadata per page derived from `pageContent` (SVC-04)

**Fleet Page (/fleet)**
- B2B pitch targeting dealerships, rental companies, delivery fleets, commercial operators (FLEET-01)
- Use cases section (FLEET-02)
- Fleet-specific form with additional fields: company name, fleet size, primary services needed (FLEET-03)
- Logo carousel reused (FLEET-04)

### Claude's Discretion
- Exact card layout for services grid (grid columns, card shadow/border style)
- Accordion animation style (height transition vs fade)
- Trust signals visual treatment (icon + stat layout)
- Fleet teaser visual differentiation from rest of homepage
- Carousel scroll speed and animation implementation (CSS keyframes vs library)
- Related services cross-link component style
- Fleet form field layout and validation UX

### Deferred Ideas (OUT OF SCOPE)
- Testimonials (HOME-08) — removed from v1 homepage scope
- Google Business Profile link — v2 (owner to confirm profile URL)
- Compustar authorized dealer badge — v2 (pending badge usage rights)
- Real logo image files for carousel — owner to provide; placeholder tiles ship in Phase 2
- Real photography for hero — owner to provide; flat color hero ships in Phase 2
- Real social media URLs (Facebook, Instagram, Linktree) — owner to provide; placeholders in footer

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-01 | Hero section: value prop, "Available when you need us", dual CTAs | D-19, UI-SPEC Hero contract, gradient approach |
| HOME-02 | Quick contact form (3 fields) — submits to existing server action | D-23, `submitServiceRequest` API, React `useState` form pattern |
| HOME-03 | Services grid — all 12 services from `data/services.ts` | D-21, shadcn Card + `services.map()` over imported array |
| HOME-04 | Services accordion — each service expands short description | D-21 (unified with HOME-03), shadcn Accordion `type="multiple"` |
| HOME-05 | Logo carousel — infinite scroll, grayscale, hover color, pause on hover | D-24, CSS `@keyframes` scroll, `animation-play-state` toggle |
| HOME-06 | Trust signals block: years in business, licensed & insured, NASTF | UI-SPEC Trust Signals contract, Lucide icons, hardcoded content |
| HOME-07 | Fleet teaser block with CTA to /fleet | UI-SPEC Fleet Teaser contract, `border-l-4` accent treatment |
| HOME-08 | Testimonials — REMOVED from v1 scope per D-22 | No implementation required |
| HOME-09 | Service area statement — DMV region text only | UI-SPEC Service Area contract, no map |
| HOME-10 | Footer CTA repeating primary conversion action | UI-SPEC Footer CTA contract, blue background section |
| SVC-01 | Individual SEO page per service via `generateStaticParams` | Next.js App Router static generation pattern |
| SVC-02 | Page structure: problem → solution → process → CTA | `pageContent` fields from `data/services.ts`, UI-SPEC service detail layout |
| SVC-03 | Related services cross-links (same category, exclude current) | `getServicesByCategory()` helper already exists in `data/services.ts` |
| SVC-04 | Service-specific metadata (title, description, OG) derived from services data | Next.js `generateMetadata` export, `pageContent` fields |
| FLEET-01 | B2B pitch section for dealerships, rental companies, fleets | UI-SPEC Fleet Hero + B2B Pitch contracts |
| FLEET-02 | Use cases section for fleet-scale offerings | UI-SPEC Use Cases contract, 3-column card grid |
| FLEET-03 | Fleet-specific form: company name, fleet size, primary services needed | UI-SPEC Fleet Form contract, same server action wiring |
| FLEET-04 | Logo carousel reused on fleet page | `LogoCarousel` component built once, props for `aria-label` |

</phase_requirements>

---

## Summary

Phase 2 builds every content and conversion page that visitors see. The entire stack is already installed and configured — no new npm packages are required. All 12 services, the server action for form submission, and the global layout shell (Header, Footer) are complete from Phase 1. This phase is pure component and page composition work.

The most consequential structural pattern is the `"use client"` boundary discipline: pages and layouts stay Server Components; only interactive islands (accordion expansion, carousel animation pause, form state) get the directive. The homepage is the most complex file — 8 distinct content sections assembled from a mix of static server-rendered content and 2-3 client islands. The correct approach is to build each section as its own component file, keeping the page.tsx as a thin orchestrator.

The logo carousel is the one technically novel piece in this phase. The UI-SPEC mandates CSS `@keyframes` (no animation library), tile duplication for seamless looping, `animation-play-state: paused` on hover, and `prefers-reduced-motion` support. This is well-understood but requires careful DOM structure: two identical sets of tiles in a single flex container, animated as one track, with only the first set visible to assistive technology.

**Primary recommendation:** Organize implementation in 3 sequential waves — (1) shared components (LogoCarousel, ServiceCard, QuickContactForm), (2) homepage page.tsx assembling all sections, (3) dynamic service detail pages and fleet page. Each wave builds on the previous with no backtracking.

---

## Standard Stack

### Core (already installed — Phase 1)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.4 | App Router, `generateStaticParams`, `generateMetadata` | Already scaffolded |
| React | 19.2.5 | Component model, `useState`/`useRef` for client islands | Already installed |
| Tailwind CSS v4 | 4.2.2 | Utility-first styling, `@theme inline` tokens | Already configured |
| tw-animate-css | 1.4.0 | Accordion height animation support | Already installed |
| lucide-react | 1.8.0 | Icons (Calendar, ShieldCheck, BadgeCheck, ChevronDown, ArrowRight, etc.) | Already installed |

### shadcn/ui Components Needed in Phase 2

| Component | Install Command | Purpose |
|-----------|----------------|---------|
| accordion | `npx shadcn@latest add accordion --yes` | Services expandable cards (HOME-03/04) |
| card | `npx shadcn@latest add card --yes` | Service grid cards, related service links |
| badge | `npx shadcn@latest add badge --yes` | Category labels (Electronics/Locksmith) |
| form | `npx shadcn@latest add form --yes` | Quick contact form, fleet form field structure |
| input | `npx shadcn@latest add input --yes` | Text and tel input fields |
| select | `npx shadcn@latest add select --yes` | Service selector (quick form), fleet size selector |
| textarea | `npx shadcn@latest add textarea --yes` | Fleet form "primary services needed" field |

Already installed from Phase 1 (do not re-add): `button`, `navigation-menu`, `sheet`

**Installation (run individually, not as one command — reduces risk of partial install failure):**
```bash
npx shadcn@latest add accordion --yes
npx shadcn@latest add card --yes
npx shadcn@latest add badge --yes
npx shadcn@latest add form --yes
npx shadcn@latest add input --yes
npx shadcn@latest add select --yes
npx shadcn@latest add textarea --yes
```

### No New npm Packages Required

The infinite carousel is implemented with CSS `@keyframes` — no Embla, Swiper, or Framer Motion. The UI-SPEC explicitly mandates this. No animation library is needed.

React Hook Form and Zod are Phase 3 concerns. Phase 2 forms use simple `useState` for controlled fields — intentionally minimal to avoid unnecessary complexity before Supabase is wired (Phase 3).

---

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)

```
app/
├── (marketing)/
│   ├── page.tsx                        # Homepage — Server Component, assembles 8 sections
│   ├── services/
│   │   └── [slug]/
│   │       └── page.tsx               # Service detail — Server Component + generateStaticParams
│   └── fleet/
│       └── page.tsx                   # Fleet page — Server Component
components/
├── layout/                            # Already exists (Header, Footer, DesktopNav, MobileNav)
├── home/                              # New — homepage-specific section components
│   ├── HeroSection.tsx                # Server Component (pure markup)
│   ├── ServicesSection.tsx            # "use client" — accordion expand state
│   ├── TrustSignalsSection.tsx        # Server Component
│   ├── FleetTeaserSection.tsx         # Server Component
│   ├── ServiceAreaSection.tsx         # Server Component
│   ├── FooterCTASection.tsx           # Server Component
│   └── QuickContactForm.tsx           # "use client" — form state + server action call
├── services/                          # New — service detail page components
│   ├── ServiceBreadcrumb.tsx          # Server Component
│   ├── ProcessSteps.tsx               # Server Component
│   └── RelatedServices.tsx            # Server Component
├── fleet/                             # New — fleet page specific
│   └── FleetContactForm.tsx           # "use client" — fleet form state + server action call
└── shared/                            # New — cross-page reusable
    └── LogoCarousel.tsx               # "use client" — animation pause on hover
```

### Pattern 1: Static Service Page Generation

**What:** `generateStaticParams` reads `data/services.ts` at build time and emits one static page per service slug.
**When to use:** Any route with a dynamic segment driven by a known data set.

```typescript
// app/(marketing)/services/[slug]/page.tsx
import { services, getServiceBySlug } from '@/data/services'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug)
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

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug)
  if (!service) notFound()
  // render page content from service.pageContent
}
```

### Pattern 2: Server Component Page with Client Islands

**What:** The page file is a Server Component that imports and renders client islands in the appropriate positions. Client components receive only the data they need as props — no prop drilling through server→client→server.
**When to use:** Every page in this phase. The `"use client"` directive only appears on interactive leaf components.

```typescript
// app/(marketing)/page.tsx — Server Component, NO "use client"
import HeroSection from '@/components/home/HeroSection'
import ServicesSection from '@/components/home/ServicesSection'  // "use client" internally
import QuickContactForm from '@/components/home/QuickContactForm'  // "use client"
import LogoCarousel from '@/components/shared/LogoCarousel'  // "use client"
import { services } from '@/data/services'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection services={services} />
      {/* ... other sections */}
      <LogoCarousel aria-label="Our clients" />
      <QuickContactForm services={services} />
    </>
  )
}
```

### Pattern 3: CSS Keyframe Infinite Carousel

**What:** Infinite scroll via CSS animation on a doubled tile set. Pure CSS, no JS animation library. Hover pause via `animation-play-state`.
**When to use:** The LogoCarousel component for both homepage and fleet page.

```typescript
// components/shared/LogoCarousel.tsx
'use client'

// CSS keyframes defined in globals.css or a <style> tag:
// @keyframes scroll-x {
//   from { transform: translateX(0); }
//   to { transform: translateX(-50%); }   /* -50% because track is 2x width */
// }

// Track structure: two identical sets of tiles side by side
// [tile1][tile2][tile3] [tile1][tile2][tile3]
// Animation moves track left by 50% (one full set width) then loops seamlessly

// Pause on hover: track gets `[data-paused]` attribute on mouseenter
// CSS: [data-paused] .carousel-track { animation-play-state: paused; }

// prefers-reduced-motion:
// @media (prefers-reduced-motion: reduce) { .carousel-track { animation: none; } }
```

Key implementation detail: the second tile set must have `aria-hidden="true"` — it is purely visual duplication.

### Pattern 4: Form with Server Action (Phase 2 lightweight version)

**What:** Simple `useState`-based form calling the existing `submitServiceRequest` server action. No React Hook Form or Zod in Phase 2 — those are Phase 3 concerns for the full request form. Only client-side required-field checks before calling the action.
**When to use:** QuickContactForm (homepage) and FleetContactForm (fleet page).

```typescript
// components/home/QuickContactForm.tsx
'use client'
import { submitServiceRequest } from '@/lib/actions/submitServiceRequest'
import { useState } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function QuickContactForm({ services }: { services: ServiceDefinition[] }) {
  const [state, setState] = useState<FormState>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    try {
      // extract name, phone, service from form data
      await submitServiceRequest({ name, phone, services_requested: [service] })
      setState('success')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') return <SuccessMessage />
  // render form with loading/error states per UI-SPEC
}
```

The form WILL throw from `submitServiceRequest` in Phase 2 because Supabase is not yet configured. The error state showing the phone number fallback is the expected behavior. This is by design (D-23).

### Anti-Patterns to Avoid

- **`"use client"` on page.tsx or layout.tsx:** Makes the entire route tree client-side. Push it to leaf components only.
- **Hardcoded service names anywhere outside `data/services.ts`:** Every service name, slug, or list must come from the imported `services` array.
- **`import` of `next/navigation` in a Server Component that re-exports:** `notFound()` and `redirect()` work fine in Server Components but cause issues if components using them are inadvertently made client components.
- **Accordion `type="single"` when `type="multiple"` is required:** The UI-SPEC specifies `type="multiple"` — expanding one card must NOT collapse others.
- **Duplicate tile set without `aria-hidden`:** Screen readers would announce all carousel content twice.
- **`<optgroup>` in shadcn Select:** The shadcn Select component uses Radix UI and does not support native `<optgroup>`. Group services using `SelectGroup` + `SelectLabel` from `@/components/ui/select` instead.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accordion expand/collapse | Custom height animation with JS | shadcn `Accordion` | Radix UI handles WAI-ARIA `aria-expanded`, keyboard nav, and height animation via `data-state` |
| Service cards | Custom card div with manual styles | shadcn `Card`, `CardTitle`, `CardDescription` | Consistent border radius, shadow, and color token usage |
| Category labels | Colored `<span>` elements | shadcn `Badge` | Consistent pill shape, padding, and variant handling |
| Form fields | Raw `<input>` with manual border styles | shadcn `Input`, `Select`, `Textarea` | Consistent ring/focus states that match design tokens |
| Carousel pause on hover | JS `setInterval` / `requestAnimationFrame` | CSS `animation-play-state` toggle via `data-*` attribute | Pure CSS is simpler, more performant, and works without re-renders |

**Key insight:** Every shadcn component is a thin, styled wrapper around Radix UI primitives that already implement full WCAG accessibility. Building custom replacements means re-implementing `aria-*` attributes, keyboard navigation, and focus management from scratch — high risk of subtle accessibility failures.

---

## Common Pitfalls

### Pitfall 1: Accordion `type="multiple"` vs `type="single"`

**What goes wrong:** If `type="single"` is used (shadcn default), opening card B automatically closes card A. The UI-SPEC requires all cards to be independently expandable.
**Why it happens:** shadcn Accordion defaults to `type="single"`. The prop must be explicitly set to `type="multiple"`.
**How to avoid:** Set `<Accordion type="multiple">` in ServicesSection. Add a comment referencing D-21.
**Warning signs:** During browser testing, clicking a second card collapses the first.

### Pitfall 2: `generateStaticParams` Not Returning All Slugs

**What goes wrong:** Some service detail pages 404 in production even though they work in dev. Dev server falls back to dynamic rendering; production does not.
**Why it happens:** `generateStaticParams` must return ALL slugs from `data/services.ts`. If `services` is not fully exported or the map is filtered, slugs get dropped.
**How to avoid:** Return `services.map((s) => ({ slug: s.slug }))` with no filter. Add `export const dynamicParams = false` to the route so unknown slugs get explicit 404s rather than falling through.
**Warning signs:** Works in `next dev`, 404s appear after `next build` and `next start`.

### Pitfall 3: `"use client"` Creeping to Page Files

**What goes wrong:** A developer places `"use client"` on `app/(marketing)/page.tsx` to use the accordion or form. This turns the entire homepage into a client bundle, inflating JavaScript payload and losing server rendering benefits.
**Why it happens:** VS Code auto-import or frustration with "cannot use hook in Server Component" errors.
**How to avoid:** Accordion expand state and form state must live inside child components (`ServicesSection.tsx`, `QuickContactForm.tsx`) that have their own `"use client"` directive. The page.tsx passes data as props.
**Warning signs:** `page.tsx` gains a `"use client"` directive at any point.

### Pitfall 4: shadcn Select Does Not Support `<optgroup>`

**What goes wrong:** The UI-SPEC requires service options grouped by category (Electronics / Locksmith). A developer uses native `<optgroup>` inside the Radix-based Select — this does not render correctly.
**Why it happens:** Radix Select renders a custom listbox, not a native `<select>`. Native HTML inside it is ignored.
**How to avoid:** Use `SelectGroup` and `SelectLabel` from `@/components/ui/select`:
```tsx
import { SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select'
// Group electronics services under one SelectGroup, locksmith under another
```
**Warning signs:** Options appear but grouping headings are missing or layout breaks.

### Pitfall 5: Carousel Track Width Calculation

**What goes wrong:** The carousel tile set doesn't loop seamlessly — there's a visible jump or gap when the animation resets.
**Why it happens:** The `@keyframes` animation must translate exactly `-50%` of the track width. If the track does not contain exactly two identical sets of tiles, the reset point is wrong.
**How to avoid:** Render tiles exactly twice in JSX (no JavaScript-based infinite cloning). The track's total width is 2× the width of one set. Translate to `-50%` brings the start of set 2 to position 0, then the animation loops to `0%` — seamless because set 2 looks identical to set 1.
**Warning signs:** Flash of white or a jump visible in the carousel at the loop point.

### Pitfall 6: `notFound()` on Service Pages Without `getServiceBySlug`

**What goes wrong:** If `getServiceBySlug` returns `undefined` (unknown slug somehow reaches the page), the component crashes rather than showing a 404.
**Why it happens:** `generateStaticParams` + `dynamicParams = false` should prevent this, but defensive coding is still required.
**How to avoid:** Always call `if (!service) notFound()` immediately after `getServiceBySlug(params.slug)` in the page component.

### Pitfall 7: `submitServiceRequest` Signature Mismatch for Quick Form

**What goes wrong:** The quick form sends `service` (singular string) but the server action expects `services_requested: string[]`.
**Why it happens:** The quick form collects one service via a select; the action expects an array.
**How to avoid:** Wrap the selected service in an array before calling: `services_requested: [selectedService]`. The fleet form similarly maps `services_needed` textarea content to `description` since it's freeform, not a services array.

---

## Code Examples

Verified patterns from existing codebase and Phase 1 SUMMARY files:

### generateStaticParams + generateMetadata (SVC-01, SVC-04)
```typescript
// app/(marketing)/services/[slug]/page.tsx
import { services, getServiceBySlug } from '@/data/services'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

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
  // render page...
}
```

Note: In Next.js 15+, `params` is a Promise and must be awaited. This is already the pattern in the codebase (see `server.ts` using `await cookies()`).

### CSS Keyframe Carousel (HOME-05, FLEET-04)
```css
/* In app/globals.css, add after the @theme block: */
@keyframes carousel-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.carousel-track {
  animation: carousel-scroll 30s linear infinite;
}

.carousel-track[data-paused="true"] {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    animation: none;
  }
}
```

```tsx
// components/shared/LogoCarousel.tsx
'use client'
import { useRef } from 'react'

const CLIENTS = [
  { name: 'Michael and Sons' },
  { name: 'Zipcar' },
  { name: 'AVIS' },
]

export default function LogoCarousel({ ariaLabel = 'Our clients' }: { ariaLabel?: string }) {
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <section aria-label={ariaLabel} className="overflow-hidden py-10">
      <div
        ref={trackRef}
        className="carousel-track flex gap-6 w-max"
        onMouseEnter={() => trackRef.current?.setAttribute('data-paused', 'true')}
        onMouseLeave={() => trackRef.current?.removeAttribute('data-paused')}
      >
        {/* First set */}
        {CLIENTS.map((c) => <CarouselTile key={c.name} name={c.name} />)}
        {/* Duplicate set — aria-hidden for seamless visual loop */}
        <span aria-hidden="true" className="contents">
          {CLIENTS.map((c) => <CarouselTile key={`dup-${c.name}`} name={c.name} />)}
        </span>
      </div>
    </section>
  )
}
```

### Related Services (SVC-03) — using existing helper
```typescript
// components/services/RelatedServices.tsx — Server Component
import { getServicesByCategory } from '@/data/services'
import type { ServiceDefinition } from '@/data/services'
import Link from 'next/link'

export default function RelatedServices({ current }: { current: ServiceDefinition }) {
  const related = getServicesByCategory(current.category)
    .filter((s) => s.slug !== current.slug)

  if (related.length === 0) return null

  return (
    <section aria-label="Related services">
      <h2 className="text-xl font-semibold text-foreground mb-4">Related Services</h2>
      <ul className="flex gap-4 overflow-x-auto">
        {related.map((s) => (
          <li key={s.slug}>
            <Link href={`/services/${s.slug}`}
              className="block border border-border rounded-md p-4 hover:border-primary hover:shadow-sm transition-all duration-150 min-w-[160px]"
              aria-label={`View ${s.name} service details`}
            >
              <span className="block text-sm font-semibold text-foreground">{s.name}</span>
              <span className="block text-sm text-muted-foreground truncate">{s.shortDescription}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

### Hero Gradient Background (HOME-01)
```tsx
// Inline style needed for gradient — Tailwind v4 does not support linear-gradient as a utility out of box
// Use CSS custom property approach or inline style:
<section
  style={{ background: 'linear-gradient(135deg, #1B3A8F 0%, #152E72 100%)' }}
  className="w-full"
>
```

Note: Tailwind v4 supports arbitrary gradient values via `bg-[linear-gradient(...)]` syntax, but inline style is cleaner and more readable for a one-off complex gradient. Either approach is acceptable.

---

## Environment Availability

Step 2.6: Confirmed from Phase 1 SUMMARY (01-01-SUMMARY.md) — all tools available and verified.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js / npm | shadcn add, next dev/build | ✓ | Installed (Next.js 16 running) | — |
| Next.js | All page generation | ✓ | 16.2.4 | — |
| shadcn CLI | Adding new components | ✓ | Latest (4.3+, confirmed working in Phase 1) | — |
| lucide-react | All icons | ✓ | 1.8.0 | — |
| data/services.ts | All page generation | ✓ | Present, 12 services verified | — |
| submitServiceRequest | Form wiring | ✓ | Present at lib/actions/submitServiceRequest.ts | — |
| Supabase (live) | Form actual submission | ✗ | Not configured until Phase 3 | Error state with phone CTA (by design, D-23) |

**Missing dependencies with no fallback:** None that block Phase 2 build.

**Missing dependencies with fallback:** Supabase (not configured) → form shows error state with phone number per UI-SPEC. This is intentional design, not a blocker.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `params` as plain object in page props | `params` as `Promise<{...}>` requiring `await` | Next.js 15 | Must `await params` in both `generateMetadata` and page component |
| `tailwind.config.js` with custom colors | `@theme inline {}` in globals.css | Tailwind v4 (Jan 2025) | No config file — tokens are CSS custom properties |
| shadcn `--radius` as `0.5rem` | `--radius: 0.375rem` (already set in globals.css) | shadcn new-york style | Already correct in this project |
| shadcn `npx shadcn-ui@latest` | `npx shadcn@latest` | shadcn 2024 CLI rename | Use `shadcn` not `shadcn-ui` |

**Key confirmed fact:** `lucide-react` 1.8.0 (installed) does NOT include Facebook or Instagram icons. Confirmed in Phase 1 (01-03-SUMMARY.md). For Phase 2 all required icons are available: `Calendar`, `ShieldCheck`, `BadgeCheck`, `ChevronDown`, `ChevronRight`, `ArrowRight`, `Loader2`, `CheckCircle2`, `Cpu`, `Key`. Verify any specific icon name at https://lucide.dev/icons before use.

---

## Open Questions

1. **Fleet use cases content**
   - What we know: FLEET-02 requires a "use cases" section with a 3-column card grid per UI-SPEC
   - What's unclear: Specific use case titles and body copy for the 3 cards are not defined in CONTEXT.md or UI-SPEC — only the layout is specified
   - Recommendation: Planner should include use case copy as a task-level decision (executor writes placeholder copy that is factually accurate per REQUIREMENTS.md company context: "multi-vehicle electronics installation", "fleet key programming", "bulk remote start installation")

2. **`params` async pattern in Next.js 16 vs 15**
   - What we know: In Next.js 15 `params` became a Promise. Next.js 16 is installed.
   - What's unclear: Whether Next.js 16 changed this further (training knowledge ends August 2025, Next.js 16 may be very new)
   - Recommendation: Use `await params` pattern as confirmed by the existing `server.ts` which uses `await cookies()`. This is the safe pattern regardless of minor version.

3. **Accordion + Card interaction — shadcn Accordion wrapping shadcn Card**
   - What we know: UI-SPEC says clicking the card body toggles expand; the chevron is the explicit affordance. shadcn Accordion uses `AccordionTrigger` as the clickable element.
   - What's unclear: Making the entire card surface the trigger requires either making the whole Card an `AccordionTrigger` or using a CSS overlay approach.
   - Recommendation: Use `AccordionTrigger` as the card wrapper (replacing default shadcn AccordionTrigger styling) rather than a CSS overlay. This preserves Radix UI's keyboard and accessibility handling.

---

## Sources

### Primary (HIGH confidence)
- Phase 1 SUMMARY files (01-01, 01-02, 01-03) — confirmed what was built, what's installed, what deviations occurred
- `data/services.ts` — read directly, 12 services confirmed, `getServicesByCategory` and `getServiceBySlug` helpers confirmed present
- `lib/actions/submitServiceRequest.ts` — read directly, `ServiceRequestPayload` interface confirmed, `services_requested: string[]` type confirmed
- `app/globals.css` — read directly, all CSS custom property tokens confirmed live
- `package.json` — read directly, all dependency versions confirmed
- `components/ui/` — listed directly, confirms button/navigation-menu/sheet installed, accordion/card/badge/form/input/select/textarea NOT yet installed
- `02-CONTEXT.md` — all locked decisions (D-19 through D-24) read verbatim
- `02-UI-SPEC.md` — all component contracts read in full (status: approved)

### Secondary (MEDIUM confidence)
- Next.js App Router `generateStaticParams` + `generateMetadata` patterns — consistent with Phase 1 research and existing project structure
- shadcn `SelectGroup`/`SelectLabel` for grouped options — standard Radix UI Select API; `<optgroup>` not supported in Radix custom listbox

### Tertiary (LOW confidence — flag for validation)
- Next.js 16 specific behavior of `params` as Promise — pattern derived from Next.js 15 behavior confirmed in Phase 1 research; Next.js 16 changelog not directly verified (training cutoff)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages read directly from package.json; shadcn components needed derived from UI-SPEC and confirmed not yet installed
- Architecture patterns: HIGH — derived from locked decisions in CONTEXT.md and existing Phase 1 code patterns
- Pitfalls: HIGH — most derived from reading actual code (server action signature, shadcn component APIs) and Phase 1 lessons
- Carousel implementation: HIGH — CSS keyframe approach mandated by UI-SPEC; pattern is standard CSS

**Research date:** 2026-04-19
**Valid until:** 2026-05-19 (stable stack; shadcn component APIs rarely change within a minor version)
