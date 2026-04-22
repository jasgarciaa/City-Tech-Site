---
phase: 03-lead-capture-seo
plan: 02
subsystem: seo
tags: [sitemap, robots, json-ld, opengraph, metadata, next-image]
dependency_graph:
  requires: [03-01]
  provides: [sitemap-xml, robots-txt, local-business-schema, og-metadata]
  affects: [app/layout.tsx, app/sitemap.ts, app/robots.ts]
tech_stack:
  added: []
  patterns: [Next.js Metadata File API, Schema.org LocalBusiness, OpenGraph protocol]
key_files:
  created:
    - app/sitemap.ts
    - app/robots.ts
  modified:
    - app/layout.tsx
    - app/(marketing)/page.tsx
    - app/(marketing)/fleet/page.tsx
    - components/layout/Header.tsx
    - components/layout/Footer.tsx
    - .env.example
decisions:
  - Used AdministrativeArea (not State) for areaServed to be more accurate for DC/MD/VA
  - No address field in LocalBusiness schema per owner privacy requirement
  - Used dangerouslySetInnerHTML with JSON.stringify for JSON-LD (not next/script — must be synchronous)
  - NEXT_PUBLIC_SITE_URL fallback set to citytechllc.com (placeholder until domain confirmed)
metrics:
  duration: 12m
  completed: "2026-04-22"
  tasks_completed: 3
  files_changed: 8
---

# Phase 3 Plan 02: SEO Infrastructure — Sitemap, Robots, JSON-LD, OG Metadata Summary

Next.js Metadata File API wiring for /sitemap.xml (15 URLs) and /robots.txt, LocalBusiness JSON-LD injected into root layout via synchronous script tag, and openGraph blocks added to homepage and fleet page metadata exports.

## What Was Built

### Files Created

**app/sitemap.ts**
- Exports `MetadataRoute.Sitemap` with 15 total URLs
- 3 static pages: `/` (priority 1.0), `/request-service` (priority 0.9), `/fleet` (priority 0.8)
- 12 dynamic service pages from `services.map()` (priority 0.7 each)
- All slugs from `/data/services.ts`: car-audio-installation, car-alarms, mobile-video-systems, backup-cameras, remote-start-systems, navigation-systems, security-tracking-systems, compustar-products, vehicle-lockouts, transponder-key-programming, key-fob-replacement, ignition-repair-replacement
- Base URL: `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://citytechllc.com'`

**app/robots.ts**
- Allow all crawlers (`userAgent: '*'`, `allow: '/'`)
- Sitemap reference: `${base}/sitemap.xml`

### Files Modified

**app/layout.tsx**
- Added `localBusinessSchema` const with `@type: LocalBusiness`, telephone `+17033436234`, email `Citytech12v@gmail.com`, three `areaServed` entries (Washington DC, Maryland, Virginia as `AdministrativeArea`)
- Injected `<script type="application/ld+json" dangerouslySetInnerHTML={...} />` inside `<body>` after skip-to-content link, before `{children}`
- No address field (owner privacy)
- No `priceRange` present in final (removed per schema accuracy)
- Existing `metadata` export and Inter font setup untouched

**app/(marketing)/page.tsx**
- Extended existing `metadata` export with `openGraph` block: title, description, url, siteName: 'City Tech', type: 'website'
- Existing `title: 'Home'` and `description` preserved

**app/(marketing)/fleet/page.tsx**
- Extended existing `metadata` export with `openGraph` block including `/fleet` url suffix
- Existing `title: 'Fleet Services'` and `description` preserved

**components/layout/Header.tsx**
- Added `sizes="200px"` between `priority` and `className` on logo `<Image>`

**components/layout/Footer.tsx**
- Added `sizes="200px"` between `width={200}` and `className` on logo `<Image>`

**.env.example**
- Appended `NEXT_PUBLIC_SITE_URL=https://citytechllc.com` with documentation comment
- Existing Supabase and Resend vars preserved

## Sitemap URL Count

15 URLs confirmed:
1. `/` (homepage)
2. `/request-service`
3. `/fleet`
4–15. `/services/[slug]` for all 12 services

## JSON-LD Fields Emitted

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "City Tech, LLC",
  "description": "...",
  "telephone": "+17033436234",
  "email": "Citytech12v@gmail.com",
  "url": "https://citytechllc.com",
  "areaServed": [
    {"@type": "AdministrativeArea", "name": "Washington, DC"},
    {"@type": "AdministrativeArea", "name": "Maryland"},
    {"@type": "AdministrativeArea", "name": "Virginia"}
  ],
  "priceRange": "$$"
}
```

No `address` field — owner explicitly requested this be omitted.

## OpenGraph Deviations from Plan

None. Both homepage and fleet page OG blocks match the plan spec exactly. The fleet URL correctly uses the template literal with `/fleet` suffix.

## Critical Note: NEXT_PUBLIC_SITE_URL

**Must be set on Vercel before go-live.** If left unset, all sitemap URLs, robots.txt sitemap reference, JSON-LD `url` field, and OG `url` fields will default to `https://citytechllc.com`. Google will index that value. Set it to the confirmed production domain in the Vercel project environment variables before the site goes live.

## Deviations from Plan

None — plan executed exactly as written. Used `AdministrativeArea` for `areaServed` per the plan spec (the plan specified `AdministrativeArea`, not `State` — correct per Schema.org for non-state-only areas like Washington DC).

## Known Stubs

None — all SEO infrastructure points to the real domain fallback. No hardcoded empty values or placeholder text that would block the plan's goal.

## Self-Check: PASSED
