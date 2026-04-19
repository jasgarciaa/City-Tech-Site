# City Tech

## What This Is

A production-ready marketing and lead-generation website for City Tech, a mobile automotive locksmith and electronics service business serving the DC, Maryland, and Virginia (DMV) region. The site serves two audiences: individual consumers needing mobile locksmith or electronics services, and commercial fleet operators seeking ongoing service relationships. It is built to convert visitors into service requests and build trust through professional presentation.

## Core Value

Capture service request leads — every page must make it effortless for a potential customer to submit a request or pick up the phone.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Service request form submits to Supabase and triggers owner email notification via Resend
- [ ] Landing page with hero, services grid, trust signals, testimonials, fleet teaser, and footer CTA
- [ ] Fleet services page with B2B pitch, use cases, and fleet-specific contact form
- [ ] Individual service detail pages generated from a single services data source (/data/services.ts)
- [ ] Service area page with interactive map (Leaflet or Mapbox) centered on DMV region
- [ ] Blog scaffold with MDX content collection, SEO metadata, and category structure
- [ ] Contact / Request Service dedicated page
- [ ] Client logo carousel (infinite scroll, grayscale-to-color on hover) on homepage and fleet page
- [ ] Services data as single source of truth — new service added as one object auto-generates page + grid entry
- [ ] SEO foundations: LocalBusiness schema, Service schema, sitemap.xml, robots.txt, OG tags on every page
- [ ] Supabase service_requests table with status enum (pending, contacted, quoted, scheduled, completed, cancelled)
- [ ] Blue and white brand system — clean, professional, approachable (not hyper-modern); targets broad age range including older demographics

### Out of Scope

- Mobile native app — web-first, no app planned
- Real-time chat or booking calendar — async form + phone follow-up is the intended flow
- Customer account / login — no portal needed for v1
- Payment processing — quoting is off-site, no online payments
- Admin dashboard — owner receives email notifications; Supabase dashboard is sufficient for v1

## Context

- **Business model**: Mobile (comes to customer), serves DMV region (DC, Maryland, Virginia)
- **Client types**: Individual consumers + commercial fleet operators; existing fleet clients can be referenced on fleet page
- **Brand**: Full brand exists — blue and white logo (file to be provided; placeholder used during build)
- **Design tone**: Clean and professional, trustworthy, readable — skilled trade credibility, not startup aesthetic; must not alienate older demographics
- **Services (initial)**: Speaker/radio installation, Compustar remote start (authorized dealer), backup cameras, car alarms, mobile video systems, fleet services, locksmithing (lockouts, key replacement, key fob programming, ignition), remote start systems
- **Blog purpose**: SEO long-tail content (e.g., "How to handle a car lockout," "Signs your car alarm needs service")
- **Notification flow**: Form → Supabase → Resend email to owner → owner calls client to confirm and quote

## Constraints

- **Tech stack**: Next.js (App Router, latest stable), Tailwind CSS v4, shadcn/ui (Radix UI primitives), Supabase, React Hook Form + Zod, MDX blog, Vercel deployment
- **Logo placeholder**: Real logo file pending — build with SVG placeholder, swap on delivery
- **Map center**: DMV region (Washington DC area); service zone covers DC, Maryland, Virginia
- **Audience**: Broad age range — design accessibility and readability take priority over trendy UI patterns

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Resend for email notifications | Specified in brief; straightforward Supabase + Resend integration | — Pending |
| shadcn/ui component library | Team familiar with it from prior project (Quantifai); accelerates accessible UI — buttons, forms, accordion, select | — Pending |
| Leaflet vs Mapbox for service area map | Leaflet is free/open-source; Mapbox has better styling but requires API key | — Pending |
| Blue/white as primary color system | Matches existing logo; professional, trust-building, age-accessible | — Pending |
| Services as single data source | Enables rapid service expansion; ensures consistency across grid, nav, and detail pages | — Pending |
| MDX for blog | SEO-friendly, co-located with codebase, no CMS dependency for v1 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-19 after initialization*
