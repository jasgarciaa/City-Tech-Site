# Roadmap: City Tech

**Project:** City Tech — Mobile Automotive Locksmith & Electronics Marketing Site
**Milestone:** v1 Launch
**Granularity:** Coarse (3 phases)
**Created:** 2026-04-19
**Coverage:** 41/41 v1 requirements mapped ✓

---

## Phases

- [ ] **Phase 1: Foundation** — Project init, services data model, global layout shell, and design system. Everything downstream depends on this.
- [ ] **Phase 2: Core Pages** — Homepage (all sections), individual service detail pages, and the fleet services page. The primary content and conversion surfaces.
- [ ] **Phase 3: Lead Capture + SEO** — Full service request form (Supabase + Resend), blog scaffold (MDX), and all SEO infrastructure (metadata, LocalBusiness schema, sitemap, robots.txt).

---

## Phase Details

### Phase 1: Foundation
**Goal**: The project runs, compiles, and deploys — with the data model, design system, and layout shell that every other phase builds on top of.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04, LAYOUT-05
**Success Criteria** (what must be TRUE):
  1. Running `next build` completes without errors and the site deploys to a Vercel preview URL
  2. Every page shares a sticky header with City Tech logo (placeholder SVG), navigation links, and a tap-to-call button that is visible without scrolling on mobile
  3. The global footer is present on every page with contact info, service links, and a footer CTA
  4. Adding a single object to `/data/services.ts` causes that service to appear automatically wherever services are listed — no other file needs editing
  5. The blue-and-white brand color system renders consistently across components and meets minimum 44px touch targets and 16px body font on mobile
**Plans**: 3 plans
**UI hint**: yes

Plans:
- [ ] 01-01-PLAN.md — Scaffold, Tailwind v4 brand tokens, root layout, directory structure, env files
- [ ] 01-02-PLAN.md — Services data model, Supabase table + RLS, Resend server action stub
- [ ] 01-03-PLAN.md — Sticky header (desktop nav + mobile Sheet drawer) and global footer

### Phase 2: Core Pages
**Goal**: Visitors can explore all services and the fleet offering — every primary conversion page is live, content-complete, and linked correctly.
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, HOME-08, HOME-09, HOME-10, SVC-01, SVC-02, SVC-03, SVC-04, FLEET-01, FLEET-02, FLEET-03, FLEET-04
**Success Criteria** (what must be TRUE):
  1. A visitor landing on the homepage sees the hero, services grid, trust signals, testimonials, fleet teaser, and footer CTA — all in one scroll without any broken sections
  2. Clicking any service in the homepage grid navigates to a dedicated service detail page with problem → solution → process → CTA structure and related service cross-links
  3. The client logo carousel scrolls infinitely on both the homepage and the fleet page — logos are grayscale by default and transition to full color on hover, and the carousel pauses on hover
  4. The fleet services page presents a B2B pitch, use cases, and a fleet-specific contact form with company name and fleet size fields
  5. Every service detail page has a unique page title and meta description derived from the services data source — no two pages share identical metadata
**Plans**: 4 plans
**UI hint**: yes

Plans:
- [x] 02-01-PLAN.md — Install Phase 2 shadcn primitives, append carousel CSS keyframes, build reusable LogoCarousel component
- [x] 02-02-PLAN.md — Build homepage: all static sections (Hero, Trust Signals, Fleet Teaser, Service Area, Footer CTA) plus Services grid+accordion and Quick Contact Form
- [x] 02-03-PLAN.md — Build dynamic service detail pages (/services/[slug]) with generateStaticParams, unique metadata, and process/related components
- [x] 02-04-PLAN.md — Build /fleet page with hero, B2B pitch, use cases, and fleet-specific contact form

### Phase 3: Lead Capture + SEO
**Goal**: Visitors can submit a service request that reaches the owner — and every page is discoverable, correctly structured for search engines, and indexable.
**Depends on**: Phase 2
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-04, REQ-05, BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06
**Success Criteria** (what must be TRUE):
  1. A visitor submits the full service request form, a row appears in the Supabase `service_requests` table with status "pending", and the owner receives an email notification via Resend with all submitted details
  2. The form shows inline validation errors before submission and a confirmation message ("Thanks — we'll reach out shortly to confirm and quote your service") after a successful submit — no silent failures
  3. The blog index at `/blog` lists posts by category; each individual post at `/blog/[slug]` renders correctly from MDX with a unique title, description, and OG tag; an unknown slug returns a 404
  4. A Google Rich Results Test run against the homepage returns a valid LocalBusiness schema with business name, DMV service area, and phone number
  5. `sitemap.xml` includes all service detail pages and all blog posts; `robots.txt` is present and references the sitemap URL
**Plans**: TBD

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/3 | Planned | - |
| 2. Core Pages | 4/4 | Complete |  |
| 3. Lead Capture + SEO | 0/? | Not started | - |

---

## Requirement Coverage

| Category | Requirements | Phase |
|----------|--------------|-------|
| Foundation & Infrastructure | FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06 | 1 |
| Layout & Global UI | LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04, LAYOUT-05 | 1 |
| Homepage | HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, HOME-08, HOME-09, HOME-10 | 2 |
| Service Detail Pages | SVC-01, SVC-02, SVC-03, SVC-04 | 2 |
| Fleet Services Page | FLEET-01, FLEET-02, FLEET-03, FLEET-04 | 2 |
| Service Request Page | REQ-01, REQ-02, REQ-03, REQ-04, REQ-05 | 3 |
| Blog | BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05 | 3 |
| SEO & Performance | SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06 | 3 |

**Total v1 mapped: 41/41 ✓**

---
*Roadmap created: 2026-04-19*
*Stack: Next.js App Router, Tailwind v4, shadcn/ui, Supabase, React Hook Form + Zod, Resend, MDX, Vercel*
