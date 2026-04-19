# State: City Tech

**Last updated:** 2026-04-19
**Session:** Roadmap created

---

## Project Reference

**Core Value:** Capture service request leads — every page must make it effortless for a potential customer to submit a request or pick up the phone.

**Current Focus:** Phase 1 — Foundation (project init, services data model, global layout shell, design system)

---

## Current Position

| Field | Value |
|-------|-------|
| Phase | 1 — Foundation |
| Plan | Not started |
| Status | Ready to plan |
| Last Completed | — (nothing yet) |

**Progress:**
```
Phase 1: Foundation     [ ] Not started
Phase 2: Core Pages     [ ] Not started
Phase 3: Lead Capture   [ ] Not started

Overall: 0/3 phases complete
```

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Phases defined | 3 |
| Requirements mapped | 41/41 |
| Plans created | 0 |
| Plans complete | 0 |

---

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
