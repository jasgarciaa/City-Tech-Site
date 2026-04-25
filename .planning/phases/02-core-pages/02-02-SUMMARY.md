---
phase: 02-core-pages
plan: 02
subsystem: homepage
tags: [homepage, hero, services, accordion, form, trust-signals, server-component]
dependency_graph:
  requires:
    - 02-01 (LogoCarousel, shadcn accordion/select/card/badge, submitServiceRequest action, data/services.ts)
  provides:
    - Homepage route / fully assembled with 8 sections
    - ServicesSection accordion (client island)
    - QuickContactForm wired to submitServiceRequest (client island)
  affects:
    - All traffic entering site — primary conversion surface
tech_stack:
  added: []
  patterns:
    - Server Component page orchestrating client islands (push use client to leaf)
    - Accordion type=multiple for independently expandable service cards
    - SelectGroup/SelectLabel for grouped service select (no native optgroup)
    - useState-only validation for quick form (no React Hook Form/Zod — Phase 3)
    - Inline style gradient for hero (CSS-native, avoids Tailwind v4 arbitrary-value verbosity)
key_files:
  created:
    - app/(marketing)/page.tsx (31 lines — replaced)
    - components/home/HeroSection.tsx (45 lines)
    - components/home/TrustSignalsSection.tsx (36 lines)
    - components/home/FleetTeaserSection.tsx (33 lines)
    - components/home/ServiceAreaSection.tsx (13 lines)
    - components/home/FooterCTASection.tsx (34 lines)
    - components/home/ServicesSection.tsx (96 lines)
    - components/home/QuickContactForm.tsx (181 lines)
  modified: []
decisions:
  - "Inline style for hero gradient — one-off gradient cleaner than Tailwind v4 arbitrary syntax"
  - "group class on AccordionTrigger + group-data-[state=open] for Show details/Show less toggle — avoids React state on each card"
  - "services_requested: [service] array-wrap in QuickContactForm — matches server action signature per plan Pitfall 7"
metrics:
  duration: "~25 minutes"
  completed: "2026-04-21"
  tasks_completed: 2
  files_created: 8
  files_modified: 0
---

# Phase 02 Plan 02: Homepage Assembly Summary

**One-liner:** Eight-section homepage Server Component with ServicesSection accordion (type=multiple) and QuickContactForm wired to submitServiceRequest, all exact UI-SPEC copy, 0 TypeScript errors, next build passes.

---

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Build 5 static sections + replace page.tsx | 92a398f | HeroSection, TrustSignalsSection, FleetTeaserSection, ServiceAreaSection, FooterCTASection, page.tsx, stubs |
| 2 | Build ServicesSection + QuickContactForm | c2d0d12 | ServicesSection.tsx, QuickContactForm.tsx |

---

## Section Order (D-20 confirmed)

| Position | Component | Type | File |
|----------|-----------|------|------|
| 1 | HeroSection | Server Component | components/home/HeroSection.tsx |
| 2 | ServicesSection | Client Component (accordion state) | components/home/ServicesSection.tsx |
| 3 | TrustSignalsSection | Server Component | components/home/TrustSignalsSection.tsx |
| 4 | FleetTeaserSection | Server Component | components/home/FleetTeaserSection.tsx |
| 5 | LogoCarousel | Client Component (from Plan 02-01) | components/shared/LogoCarousel.tsx |
| 6 | ServiceAreaSection | Server Component | components/home/ServiceAreaSection.tsx |
| 7 | QuickContactForm | Client Component (form state) | components/home/QuickContactForm.tsx |
| 8 | FooterCTASection | Server Component | components/home/FooterCTASection.tsx |

---

## Server Component Confirmation

`app/(marketing)/page.tsx` contains **zero** `'use client'` directives. It is a pure Server Component that imports two client islands (ServicesSection, QuickContactForm) and one pre-existing client component (LogoCarousel).

---

## Testimonials (HOME-08)

**Not built per D-22.** Zero occurrences of "testimonial" or "Testimonial" in any file created by this plan.

---

## Key Implementation Details

### HeroSection
- Inline gradient: `linear-gradient(135deg, #1B3A8F 0%, #152E72 100%)`
- `we come to you` wrapped in `<span className="text-accent">`
- Availability copy: "Available when you need us" (NOT "24/7" per CLAUDE.md)
- Dual CTAs: `/request-service` (Button) + `tel:+15555555555` (outline Button)
- Touch target min-h-[44px] on all buttons

### ServicesSection
- `<Accordion type="multiple">` — all 12 cards independently expandable
- Category icons: `Cpu` for electronics, `Key` for locksmith — chosen at UI layer, not in data/services.ts
- "Show details" / "Show less" toggle via `group` class on AccordionTrigger + `group-data-[state=open]` on child spans
- `[&>svg]:hidden` on AccordionTrigger hides shadcn's default ChevronDown; custom rotating ChevronDown provided
- `services.map()` — no hardcoded service names

### QuickContactForm
- `services_requested: [service]` — single select value wrapped in array per server action signature
- `SelectGroup` + `SelectLabel` for Electronics/Locksmith grouping (no native `<optgroup>`)
- `noValidate` on form — custom error display, no browser native validation conflict
- Error state shows phone fallback: "Something went wrong. Please call us directly at (555) 555-5555."
- No React Hook Form or Zod imports (Phase 3)
- Form WILL throw in Phase 2 (Supabase not configured) — error state is designed UX per D-23

---

## Build Output

```
npx tsc --noEmit → exit 0 (0 TypeScript errors)

npm run build output:
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /fleet
└ ● /services/[slug]  (12 static paths)
○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML
```

Homepage `/` route builds successfully as static content.

---

## Deviations from Plan

### Minor — Grep Pattern Mismatch (no code change needed)

The plan's verify script checks for `grep -q "electronics ? Cpu : Key"` but the actual code correctly uses `=== 'electronics' ? Cpu : Key`. The ternary logic is functionally correct and matches the plan's intent. The grep pattern in the verify script was slightly abbreviated. All other 17 of 18 verify checks pass exactly.

No other deviations. Plan executed as written.

---

## Known Stubs

None. All 8 sections render real data from `data/services.ts`. The QuickContactForm shows an error state (by design, D-23) when Supabase is not configured — this is documented expected behavior, not a stub.

---

## Self-Check: PASSED

All created files confirmed present via Read tool:
- FOUND: components/home/HeroSection.tsx
- FOUND: components/home/TrustSignalsSection.tsx
- FOUND: components/home/FleetTeaserSection.tsx
- FOUND: components/home/ServiceAreaSection.tsx
- FOUND: components/home/FooterCTASection.tsx
- FOUND: components/home/ServicesSection.tsx
- FOUND: components/home/QuickContactForm.tsx
- FOUND: app/(marketing)/page.tsx (replaced)

Commits confirmed present in git log:
- FOUND: 92a398f feat(02-02): build static section components and replace homepage
- FOUND: c2d0d12 feat(02-02): build ServicesSection and QuickContactForm client components
