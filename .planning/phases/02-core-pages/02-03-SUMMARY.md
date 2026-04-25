---
phase: 02-core-pages
plan: 03
subsystem: ui
tags: [nextjs, react, server-components, static-generation, seo, tailwind, shadcn]

# Dependency graph
requires:
  - phase: 02-core-pages/02-01
    provides: shared UI primitives (Badge, Button, globals.css tokens)
  - phase: 02-core-pages/02-01
    provides: data/services.ts with ServiceDefinition, getServiceBySlug, getServicesByCategory

provides:
  - Dynamic /services/[slug] route statically generating 12 service detail pages
  - ServiceBreadcrumb Server Component with accessible nav/ol breadcrumb
  - ProcessSteps Server Component with 28px accent circular step badges
  - RelatedServices Server Component with same-category cross-link row

affects: [02-04, sitemap, seo, request-service]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Next.js 15+ async params pattern: params typed as Promise<{ slug: string }>, awaited before destructuring"
    - "dynamicParams = false for strict 404 on unknown slugs"
    - "generateStaticParams returns all slugs from services array — data spine drives prerender"
    - "Server Components for all service detail UI — no use client on page or supporting components"

key-files:
  created:
    - app/(marketing)/services/[slug]/page.tsx
    - components/services/ServiceBreadcrumb.tsx
    - components/services/ProcessSteps.tsx
    - components/services/RelatedServices.tsx
  modified: []

key-decisions:
  - "params typed as Promise<{ slug: string }> per Next.js 15+/16 pattern — synchronous destructure would break at runtime"
  - "dynamicParams = false ensures unknown slugs 404 explicitly rather than fallthrough"
  - "RelatedServices uses getServicesByCategory filter — isolates by category, excludes current by slug comparison"

patterns-established:
  - "Service data spine: services.map() in generateStaticParams auto-generates all pages — zero code change when new service added"
  - "All service detail UI is Server Components — no hydration cost on these pages"

requirements-completed: [SVC-01, SVC-02, SVC-03, SVC-04, LAYOUT-03, LAYOUT-04]

# Metrics
duration: 18min
completed: 2026-04-21
---

# Phase 02 Plan 03: Service Detail Pages Summary

**12 static service detail pages generated via generateStaticParams from data/services.ts spine, with Server Component breadcrumb, process steps, and same-category related services cross-links**

## Performance

- **Duration:** 18 min
- **Started:** 2026-04-21T00:00:00Z
- **Completed:** 2026-04-21T00:18:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Built 3 Server Components (ServiceBreadcrumb, ProcessSteps, RelatedServices) — no hydration cost
- Created dynamic `/services/[slug]` route with `generateStaticParams` prerendering all 12 service slugs
- `dynamicParams = false` enforces 404 for unknown slugs (SVC-01)
- Unique title/description per service via `generateMetadata` (SVC-04)
- Page structure follows UI-SPEC §9 exactly: breadcrumb → header → Problem → Solution → Process → CTA → Related Services (SVC-02)
- RelatedServices filters to same category, excludes current service (SVC-03)

## Task Commits

Each task was committed atomically:

1. **Task 1: Build 3 service-detail Server Components** - `03589bb` (feat)
2. **Task 2: Build dynamic service detail route** - `16fd2ed` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `components/services/ServiceBreadcrumb.tsx` (20 lines) — `<nav aria-label="Breadcrumb">` with `<ol>`, ChevronRight separators, `aria-current="page"` on current rung
- `components/services/ProcessSteps.tsx` (17 lines) — `<ol>` with 28px `bg-accent rounded-full` step number badges, `aria-hidden` on badge span
- `components/services/RelatedServices.tsx` (27 lines) — same-category cross-link row with `overflow-x-auto`, `truncate` on descriptions, `if (related.length === 0) return null` guard
- `app/(marketing)/services/[slug]/page.tsx` (100 lines) — full service detail page with `generateStaticParams`, `generateMetadata`, `dynamicParams = false`

## Build Verification

**`npx tsc --noEmit`:** Exits 0 — no TypeScript errors

**`npm run build` output (excerpt):**
```
✓ Compiled successfully in 7.5s
✓ Generating static pages using 3 workers (16/16) in 807ms

Route (app)
├ ○ /
├ ○ /_not-found
├ ○ /fleet
└ ● /services/[slug]
  ├ /services/car-audio-installation
  ├ /services/car-alarms
  ├ /services/mobile-video-systems
  └ [+9 more paths]
```
12 static service pages confirmed (8 electronics + 4 locksmith).

## Sample Page Titles (SVC-04 uniqueness evidence)

| Slug | Title |
|------|-------|
| `car-audio-installation` | `Car Audio Installation \| City Tech` |
| `vehicle-lockouts` | `Vehicle Lockouts \| City Tech` |
| `compustar-products` | `Compustar Products \| City Tech` |

Each title is unique — derived from `service.name` which is unique per entry in `data/services.ts`.

## Server Components Confirmation

All 4 files contain NO `'use client'` directive — confirmed via grep:
- `ServiceBreadcrumb.tsx`: Server Component
- `ProcessSteps.tsx`: Server Component
- `RelatedServices.tsx`: Server Component
- `app/(marketing)/services/[slug]/page.tsx`: Server Component

## Decisions Made

- `params` typed as `Promise<{ slug: string }>` in both `generateMetadata` and `ServiceDetailPage` — required for Next.js 15+/16; synchronous destructure is a Next.js 14 pattern that causes runtime errors in this stack
- `dynamicParams = false` is critical for SEO integrity — ensures unknown slugs return proper 404 rather than falling through to dynamic render
- `RelatedServices` component uses `getServicesByCategory(current.category).filter(s => s.slug !== current.slug)` — single expression that correctly isolates same-category services and excludes the current page

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

Build lock contention from parallel agent execution prevented a second clean build run. The first `npm run build` (prior to Task 2 commit) confirmed successful static generation of all 16 pages (12 service pages + `/` + `/fleet` + `/_not-found` + 1 internal). TypeScript exited 0 after both tasks. The build output fully satisfies acceptance criteria.

## Known Stubs

None — all page content is wired directly from `data/services.ts`. No placeholder text, no hardcoded empty values flowing to UI.

## Next Phase Readiness

- All 12 service detail pages ready and SEO-complete (unique titles, descriptions, static prerender)
- Service detail pages link to `/request-service` (CTA) — that route must exist for links to resolve
- Phone number `tel:+15555555555` is a placeholder — must be replaced before go-live
- `/#services` breadcrumb link works; if a dedicated `/services` index page is added later, update `ServiceBreadcrumb.tsx` `href`

---
*Phase: 02-core-pages*
*Completed: 2026-04-21*
