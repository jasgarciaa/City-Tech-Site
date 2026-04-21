---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: unknown
last_updated: "2026-04-21T16:16:10.113Z"
progress:
  total_phases: 3
  completed_phases: 2
  total_plans: 7
  completed_plans: 7
---

# State: City Tech

**Last updated:** 2026-04-21
**Session:** Completed 02-04-PLAN.md — Fleet page

---

## Project Reference

**Core Value:** Capture service request leads — every page must make it effortless for a potential customer to submit a request or pick up the phone.

**Current Focus:** Phase 02 — core-pages

---

## Current Position

Phase: 3
Plan: Not started

## Performance Metrics

| Metric | Value |
|--------|-------|
| Phases defined | 3 |
| Requirements mapped | 41/41 |
| Plans created | 0 |
| Plans complete | 0 |

---
| Phase 02-core-pages P01 | 4 | 3 tasks | 12 files |
| Phase 02-core-pages P03 | 18 | 2 tasks | 4 files |
| Phase 02-core-pages P04 | 12 | 2 tasks | 5 files |

## Accumulated Context

### Decisions Made

| Decision | Rationale |
|----------|-----------|
| Tailwind v4 (not v3) | Stable since Jan 2025; 3-8x faster; CSS-native custom properties suit blue/white brand tokens |
| Leaflet (not Mapbox) | DMV polygon only; MIT-licensed; no API key or billing account needed |
| @next/mdx with exported metadata constants | Native, TypeScript-typed; Contentlayer is abandoned (2024) |
| Server Actions for form submission (not API routes) | Official App Router pattern; co-located with form |
| Hardcoded testimonials (not Google Reviews API) | Simpler for v1; link to Google profile for live reviews |
| Services as single source of truth (/data/services.ts) | One object addition auto-generates page, nav entry, grid card, sitemap entry |

- [Phase 02-core-pages]: Carousel animation translateX(-50%) not -100%: doubled track, -50% equals one full set width for seamless loop
- [Phase 02-core-pages]: data-paused attribute toggle over useState for carousel pause: avoids React re-render on every hover event
- [Phase 02-core-pages]: aria-hidden duplicate tile set in real flex container (not fragment): preserves gap-6 spacing at loop seam
- [Phase 02-core-pages]: Next.js 15+/16 async params pattern: params typed as Promise<{ slug: string }>, awaited before destructuring
- [Phase 02-core-pages]: dynamicParams = false enforces strict 404 for unknown slugs — SEO integrity
- [Phase 02-core-pages]: Service data spine: services.map() in generateStaticParams auto-generates all pages with zero code change when new service added
- [Phase 02-core-pages P02]: Inline style for hero gradient — one-off gradient cleaner than Tailwind v4 arbitrary syntax
- [Phase 02-core-pages P02]: group class on AccordionTrigger + group-data-[state=open] for Show details/Show less toggle — avoids per-card React state
- [Phase 02-core-pages P02]: services_requested: [service] array-wrap in QuickContactForm — matches server action signature
- [Phase 02-core-pages P04]: Fleet form uses services_requested: [] (empty array) with FLEET REQUEST description prefix — distinguishes fleet vs individual requests in DB
- [Phase 02-core-pages P04]: Explicit React.ChangeEvent types on Input/Textarea handlers required in strict TypeScript — inline arrow functions need explicit types when component prop types aren't narrowed by inference

### Critical Pitfalls (from research)

1. **Supabase RLS silent insert failure** — Must add anon INSERT policy; use `.insert(payload).select("id")` and throw if data.length === 0
2. **Leaflet SSR crash** — Always import ServiceAreaMap via `dynamic({ ssr: false })`; add transpilePackages in next.config.ts
3. **Resend DNS not verified** — SPF, DKIM, DMARC records must be verified before go-live; test with mail-tester.com during Phase 3
4. **"use client" scope creep** — Push to deepest interactive leaf only; never place on layout or page files
5. **Missing Vercel env vars** — .env.local is gitignored; add startup validation in instrumentation.ts

### Open Owner Questions (block go-live, not build)

1. Business hours — impacts hero copy ("24/7"?), header, footer, LocalBusiness schema
2. License numbers for DC, MD, VA locksmith licensing display
3. Compustar dealer badge — web-use authorization and asset delivery required
4. Real logo file — build with SVG placeholder at /public/logo.svg
5. Client logo assets — build with placeholder SVGs; LogoCarousel accepts logos[] prop
6. Actual phone number and domain — needed for LocalBusiness schema and canonical URLs

### Todos

- [ ] Confirm Mapbox vs Leaflet decision with owner (research recommends Leaflet)
- [ ] Get phone number and domain before Phase 3 (needed for schema and canonical URLs)
- [ ] Plan Phase 1 before starting build

### Blockers

None currently.

---

## Session Continuity

**To resume:** Read ROADMAP.md for phase structure. Read this file for current position and open decisions. Run `/gsd:plan-phase 1` to generate the Phase 1 plan before starting implementation.

**Next action:** `/gsd:plan-phase 1`

---
*State initialized: 2026-04-19 after roadmap creation*
