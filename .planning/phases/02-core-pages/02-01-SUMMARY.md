---
phase: 02-core-pages
plan: 01
subsystem: ui
tags: [shadcn, tailwind, carousel, css-animation, react, typescript]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "Next.js App Router setup, Tailwind v4 config, brand tokens in globals.css, button/navigation-menu/sheet shadcn components"
provides:
  - "7 shadcn/ui components: accordion, card, badge, form, input, select, textarea (+ label transitive dep)"
  - "Carousel CSS keyframes + data-paused + reduced-motion rules in globals.css"
  - "LogoCarousel client component with three D-24 tiles, duplicated, aria-hidden on duplicate, pointer/focus pause"
affects: [02-02-homepage, 02-03-service-detail, 02-04-fleet, 03-forms-backend]

# Tech tracking
tech-stack:
  added:
    - "shadcn/ui accordion@latest (via shadcn CLI 4.4.0)"
    - "shadcn/ui card@latest"
    - "shadcn/ui badge@latest (class-variance-authority added)"
    - "shadcn/ui form@latest"
    - "shadcn/ui input@latest"
    - "shadcn/ui select@latest"
    - "shadcn/ui textarea@latest"
    - "react-hook-form@7.73.1 (transitive from form)"
    - "@hookform/resolvers@5.2.2 (transitive from form)"
    - "zod@4.3.6 (transitive from form)"
  patterns:
    - "CSS-only carousel animation — @keyframes translateX(-50%) on doubled tile set for seamless loop"
    - "data-paused attribute toggle (no useState) for hover/focus pause — avoids React re-render on every hover"
    - "aria-hidden duplicate tile set pattern — AT reads first set only, loop is decorative"
    - "useRef for DOM mutation in client component — ref.current?.setAttribute instead of state"

key-files:
  created:
    - components/ui/accordion.tsx
    - components/ui/card.tsx
    - components/ui/badge.tsx
    - components/ui/form.tsx
    - components/ui/input.tsx
    - components/ui/label.tsx
    - components/ui/select.tsx
    - components/ui/textarea.tsx
    - components/shared/LogoCarousel.tsx
  modified:
    - app/globals.css (carousel keyframes appended)
    - package.json (react-hook-form, @hookform/resolvers, zod added)
    - package-lock.json

key-decisions:
  - "Carousel animation uses translateX(-50%) not translateX(-100%) — track width is 2x single set, so -50% equals exactly one full set width (seamless loop)"
  - "data-paused attribute chosen over useState — avoids React re-render on every hover event while still enabling keyboard pause via focus/blur"
  - "aria-hidden on duplicate tile set wrapper div (not span or fragment) — wrapper must be a real flex container with gap-6 to preserve tile spacing across the seam"
  - "react-hook-form/zod/hookform-resolvers installed as Phase 2 side effect of form component — expected and intended for Phase 3 use"

patterns-established:
  - "CSS-only carousel: doubled tile set + translateX(-50%) for seamless infinite loop"
  - "data-paused attribute toggle for animation control without React state"
  - "Duplicate tile set wrapped in aria-hidden flex container (not fragment) to preserve gap spacing at loop seam"

requirements-completed: [HOME-05, FLEET-04, LAYOUT-03, LAYOUT-04]

# Metrics
duration: 4min
completed: 2026-04-21
---

# Phase 02 Plan 01: Shared UI Primitives Summary

**7 shadcn/ui components installed and LogoCarousel client component built with infinite CSS scroll, hover/focus pause, and reduced-motion fallback — Wave 2 plans (homepage, service detail, fleet) are unblocked**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-21T15:47:19Z
- **Completed:** 2026-04-21T15:51:02Z
- **Tasks:** 3
- **Files modified:** 12

## Accomplishments

- 7 shadcn/ui components installed individually (accordion, card, badge, form, input, select, textarea) via shadcn CLI 4.4.0 — all resolve from `@/components/ui/*`
- Carousel CSS (@keyframes carousel-scroll, .carousel-track, data-paused, prefers-reduced-motion) appended to globals.css — existing Phase 1 token system untouched
- LogoCarousel client component with three D-24 tiles (Michael and Sons, Zipcar, AVIS), duplicated for seamless loop, aria-hidden on duplicate, pointer/focus-driven pause via data attribute

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Phase 2 shadcn components** - `a024195` (feat)
2. **Task 2: Add carousel CSS keyframes and hover/reduced-motion rules** - `b7ee9e3` (feat)
3. **Task 3: Build LogoCarousel reusable component** - `187f83a` (feat)

**Plan metadata:** _(docs commit follows this SUMMARY creation)_

## Files Created/Modified

- `components/ui/accordion.tsx` - Radix Accordion primitives (AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent)
- `components/ui/card.tsx` - Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- `components/ui/badge.tsx` - Badge with variants (class-variance-authority)
- `components/ui/form.tsx` - Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage
- `components/ui/input.tsx` - Input primitive
- `components/ui/label.tsx` - Label (transitive dep from form)
- `components/ui/select.tsx` - Select, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectContent, SelectValue
- `components/ui/textarea.tsx` - Textarea primitive
- `components/shared/LogoCarousel.tsx` - Infinite scroll carousel with 3 placeholder tiles
- `app/globals.css` - Carousel @keyframes + .carousel-track + data-paused + reduced-motion rules appended
- `package.json` - react-hook-form@7.73.1, @hookform/resolvers@5.2.2, zod@4.3.6 added
- `package-lock.json` - Updated lock file

## Decisions Made

- Carousel animation uses `translateX(-50%)` not `translateX(-100%)` because the track width is 2x a single tile set; at -50% the loop seam aligns exactly with the viewport origin.
- `data-paused` attribute toggle chosen over `useState` to avoid React re-render on every hover event; DOM mutation via `ref.current?.setAttribute` achieves same behavior.
- Duplicate tile set wrapped in a `<div aria-hidden="true" className="flex items-center gap-6">` (not a fragment) — a real flex container with matching gap-6 is required to preserve tile spacing at the loop seam.
- react-hook-form, @hookform/resolvers, and zod installed as side effect of `shadcn add form` — these are expected Phase 3 dependencies; early installation is acceptable.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. All 7 shadcn installs succeeded individually. The `form` component correctly skipped overwriting `button.tsx` (Phase 1 artifact preserved). TypeScript compiled with 0 errors at every verification step. `npm run build` completed with 0 errors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All Wave 2 plans (02-02 homepage, 02-03 service detail, 02-04 fleet) can now run in parallel
- `@/components/ui/accordion`, `card`, `badge`, `form`, `input`, `select`, `textarea` are importable in any plan
- `@/components/shared/LogoCarousel` is ready to drop into homepage hero or fleet page sections
- `public/logos/.gitkeep` preserved — actual logo assets will be swapped in when delivered

---
*Phase: 02-core-pages*
*Completed: 2026-04-21*

## Self-Check: PASSED

All files confirmed present on disk. All commits confirmed in git log.

| Check | Result |
|-------|--------|
| components/ui/accordion.tsx | FOUND |
| components/ui/card.tsx | FOUND |
| components/ui/badge.tsx | FOUND |
| components/ui/form.tsx | FOUND |
| components/ui/input.tsx | FOUND |
| components/ui/label.tsx | FOUND |
| components/ui/select.tsx | FOUND |
| components/ui/textarea.tsx | FOUND |
| components/shared/LogoCarousel.tsx | FOUND |
| public/logos/.gitkeep | FOUND |
| .planning/phases/02-core-pages/02-01-SUMMARY.md | FOUND |
| commit a024195 | FOUND |
| commit b7ee9e3 | FOUND |
| commit 187f83a | FOUND |
