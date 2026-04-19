# Phase 2: Core Pages - Context

**Gathered:** 2026-04-19
**Status:** Ready for UI-SPEC and planning

<domain>
## Phase Boundary

Build all primary content and conversion pages: homepage (all sections), individual service detail pages (`/services/[slug]`), and the fleet services page (`/fleet`). No form backend wiring beyond what Phase 1 already built — Supabase is not yet configured. No blog, no SEO infrastructure (Phase 3).

</domain>

<decisions>
## Implementation Decisions

### Carried Forward from Phase 1 (D-01–D-18)
All Phase 1 decisions are locked and carry forward. Key ones relevant to Phase 2:
- **D-01/D-02:** Two-blue brand system (primary `#1B3A8F`, accent `#00AEEF`), light mode only
- **D-07:** Nav links: Services (dropdown), Fleet, Request Service — no Blog
- **D-10/D-11:** `ServiceDefinition` shape from `data/services.ts` drives all service pages; no icon field in data
- **D-12:** 12 services — 8 Electronics, 4 Locksmith
- **D-09:** CTA label "Call Now", phone placeholder `(555) 555-5555`

### Hero Section
- **D-19:** Dark blue gradient (`--primary`) full-width hero. White headline, cyan (`--accent`) accent on a key phrase, dual CTAs: "Request Service" (primary button) + "Call Now" (secondary/outline). No image dependency — real photography can be layered in later without layout changes.

### Homepage Section Order
- **D-20:** Sections in this order:
  1. Hero
  2. Services (Grid + Accordion combined — see D-21)
  3. Trust Signals
  4. Fleet Teaser
  5. Logo Carousel
  6. Service Area
  7. Quick Contact Form
  8. Footer CTA (before global footer)
- **D-22:** Testimonials section (HOME-08) is **removed from scope**. No testimonials block on the homepage in v1.

### Services Section (HOME-03 + HOME-04 combined)
- **D-21:** Services Grid and Accordion are one unified section. Grid provides the visual overview of all 12 services; clicking a card or service name expands its short description inline. Not two separate sections.

### Quick Contact Form (HOME-02)
- **D-23:** 3 fields: name, phone, service requested (select from services list). Wired to the existing `lib/actions/submitServiceRequest.ts` server action from Phase 1. Will show an error state until Supabase is configured (Phase 3 prerequisite). No code changes needed at Phase 3 — form is fully wired now.

### Logo Carousel (HOME-05 + FLEET-04)
- **D-24:** Three real fleet/commercial clients: **Michael and Sons**, **Zipcar**, **AVIS**. Build as placeholder tiles (company name in a styled monochrome box) until actual logo image files are provided by the owner. Tiles live in `/public/logos/`. When real logo files are added, they replace the tiles — no code changes required.
- Carousel behavior: infinite horizontal scroll, grayscale by default, full color on hover, pauses on hover.
- Same carousel component is reused on both homepage and fleet page.

### Service Detail Pages (/services/[slug])
- Generated via `generateStaticParams` from `data/services.ts`
- Page structure per SVC-02: problem → solution → process → CTA ("Contact for a free quote")
- Related services cross-links at bottom (SVC-03) — show services in same category, exclude current
- Unique metadata per page derived from `pageContent` (SVC-04)

### Fleet Page (/fleet)
- B2B pitch targeting dealerships, rental companies, delivery fleets, commercial operators (FLEET-01)
- Use cases section (FLEET-02)
- Fleet-specific form with additional fields: company name, fleet size, primary services needed (FLEET-03)
- Logo carousel reused (FLEET-04) — same 3 client tiles as homepage

### Claude's Discretion
- Exact card layout for services grid (grid columns, card shadow/border style)
- Accordion animation style (height transition vs fade)
- Trust signals visual treatment (icon + stat layout)
- Fleet teaser visual differentiation from rest of homepage
- Carousel scroll speed and animation implementation (CSS keyframes vs library)
- Related services cross-link component style
- Fleet form field layout and validation UX

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `.planning/REQUIREMENTS.md` — HOME-01–10, SVC-01–04, FLEET-01–04
- `.planning/ROADMAP.md` §Phase 2 — Success criteria
- `.planning/phases/01-foundation/01-CONTEXT.md` — All Phase 1 decisions (D-01–D-18)
- `.planning/phases/01-foundation/01-02-SUMMARY.md` — `submitServiceRequest` server action details, Supabase SQL (not yet run)
- `.planning/phases/01-foundation/01-03-SUMMARY.md` — Header/Footer component details
- `data/services.ts` — Services data shape and all 12 service objects
- `lib/actions/submitServiceRequest.ts` — Existing server action the quick form calls

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `data/services.ts` — `ServiceDefinition[]` with `pageContent.{problem, solution, process[]}` ready for SVC-02. `getServiceBySlug()` and `getServicesByCategory()` helpers exist.
- `lib/actions/submitServiceRequest.ts` — Server action for form submit (Supabase insert + Resend). Already handles RLS silent-failure guard.
- `components/ui/button.tsx` — shadcn Button component
- `components/ui/sheet.tsx` — shadcn Sheet (used by MobileNav, available for reuse)
- `components/ui/navigation-menu.tsx` — shadcn NavigationMenu
- `lib/utils.ts` — `cn()` utility for class merging

### Established Patterns
- **Server Components by default.** `"use client"` only on interactive leaf nodes (e.g. accordion expand, carousel controls, form).
- **No `"use client"` on pages or layouts.** Pages are Server Components; interactive islands are client children.
- **`generateStaticParams`** for service detail pages reads `data/services.ts` — same pattern as nav dropdown.
- **shadcn component additions:** `npx shadcn@latest add [component] --yes` (components.json already configured).
- **Tailwind v4:** `@theme inline` in `app/globals.css`. Use `bg-primary`, `text-accent`, etc. — no arbitrary color values.

### Integration Points
- `data/services.ts` drives: homepage grid, service detail `generateStaticParams`, nav dropdown, footer list, sitemap (Phase 3)
- Quick form on homepage calls `submitServiceRequest` directly — same action as full form (Phase 3)
- Logo carousel component built once, used in homepage + fleet page

### shadcn Components Likely Needed in Phase 2
- `accordion` — Services expandable section
- `card` — Services grid cards
- `form`, `input`, `select`, `textarea` — Quick form and fleet form (React Hook Form wiring in Phase 3 full form; Phase 2 forms can be simpler)
- `badge` — Optional for service category labels

</code_context>

<deferred>
## Deferred Ideas

- Testimonials (HOME-08) — removed from v1 homepage scope
- Google Business Profile link — v2 (owner to confirm profile URL)
- Compustar authorized dealer badge — v2 (pending badge usage rights)
- Real logo image files for carousel — owner to provide; placeholder tiles ship in Phase 2
- Real photography for hero — owner to provide; flat color hero ships in Phase 2
- Real social media URLs (Facebook, Instagram, Linktree) — owner to provide; placeholders in footer

</deferred>

---

*Phase: 02-core-pages*
*Context gathered: 2026-04-19*
