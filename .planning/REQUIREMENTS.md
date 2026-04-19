# Requirements: City Tech

**Defined:** 2026-04-19
**Core Value:** Capture service request leads — every page must make it effortless for a potential customer to submit a request or pick up the phone.

---

## Company Context (for copy/content)

**City Tech, LLC** is a mobile electronics service and car audio installation company. Services include: car audio installation, car alarms, mobile video, backup cameras, remote starters, navigation systems, and security/tracking systems.

City Tech also specializes in automotive locksmith services: vehicle lockouts, transponder key programming, key fob replacement, and ignition repair or replacement.

All employees undergo background checks by NASTF (National Automotive Service Task Force).

Service emphasis: electronics/car audio is the primary business; locksmith is secondary specialization.

---

## v1 Requirements

### Foundation & Infrastructure

- [ ] **FOUND-01**: Next.js App Router project initialized with TypeScript, Tailwind v4, shadcn/ui, ESLint, and Vercel deployment configuration
- [ ] **FOUND-02**: `/data/services.ts` single source of truth — adding one service object auto-generates its detail page, appears in homepage grid, nav, and sitemap
- [ ] **FOUND-03**: Supabase `service_requests` table created with fields: name, phone, email, vehicle_year, vehicle_make, vehicle_model, services_requested (array), service_location, preferred_datetime, description, referral_source, status enum (pending/contacted/quoted/scheduled/completed/cancelled), created_at
- [ ] **FOUND-04**: Resend integration — server action sends owner notification email on every new service request submission
- [ ] **FOUND-05**: Environment variable structure documented in `.env.example` (Supabase URL, anon key, Resend API key)
- [ ] **FOUND-06**: Project directory structure established: `/components`, `/data`, `/lib`, `/content/blog`, `/public/logos`

### Layout & Global UI

- [ ] **LAYOUT-01**: Sticky header with City Tech logo (placeholder SVG until real logo provided), navigation links, and prominent tap-to-call button
- [ ] **LAYOUT-02**: Global footer with contact info, service links, and footer CTA
- [ ] **LAYOUT-03**: Responsive, mobile-first layout — minimum 44px touch targets, 16px minimum body font, single-column forms on mobile
- [ ] **LAYOUT-04**: Blue and white brand color system — clean, professional, accessible; no hyper-modern patterns that alienate older demographics
- [ ] **LAYOUT-05**: Availability messaging framed as "Available when you need us" (not "24/7" — conveys responsiveness without hard hours commitment)

### Homepage (/)

- [ ] **HOME-01**: Hero section with primary value proposition, "Available when you need us" messaging, and dual CTAs (request service form, call now)
- [ ] **HOME-02**: Quick contact form (name, phone, service requested) — shorter version that submits to Supabase; full form lives at /request-service
- [ ] **HOME-03**: Services grid showing all services from `/data/services.ts`
- [ ] **HOME-04**: Services expandable accordion section — each service has a short description that expands on click
- [ ] **HOME-05**: Client logo carousel — infinite horizontal scroll, grayscale by default, full color on hover, pauses on hover; logos from `/public/logos/` (placeholder SVGs until real assets delivered)
- [ ] **HOME-06**: Trust signals block: years in business, licensed & insured, NASTF background-checked employees
- [ ] **HOME-07**: Fleet services teaser block with CTA linking to /fleet
- [ ] **HOME-08**: Testimonials section with 3–5 hardcoded client quotes
- [ ] **HOME-09**: Service area statement — "Serving the DC, Maryland, and Virginia region" (no map or city list)
- [ ] **HOME-10**: Footer CTA repeating primary conversion action

### Service Detail Pages (/services/[service])

- [ ] **SVC-01**: Individual SEO page per service, auto-generated from `/data/services.ts` via `generateStaticParams`
- [ ] **SVC-02**: Page structure per service: problem → solution → process → CTA (no pricing — "contact for a free quote")
- [ ] **SVC-03**: Related services cross-links at bottom of each service page
- [ ] **SVC-04**: Service-specific SEO metadata (title, description, OG tags) derived from services data

### Fleet Services Page (/fleet)

- [ ] **FLEET-01**: B2B pitch section targeting dealerships, rental companies, delivery fleets, and commercial vehicle operators
- [ ] **FLEET-02**: Use cases section explaining fleet-scale service offerings
- [ ] **FLEET-03**: Fleet-specific service request form with additional fields: company name, fleet size, primary services needed
- [ ] **FLEET-04**: Client logo carousel (same reusable component as homepage) showing existing fleet clients

### Service Request Page (/request-service)

- [ ] **REQ-01**: Full service request form with fields: name, phone, email, vehicle year/make/model, services requested (multi-select from services list), preferred service location (address), preferred date/time window, description/additional details, how they heard about us (optional)
- [ ] **REQ-02**: Form validated client-side with React Hook Form + Zod, re-validated server-side in server action
- [ ] **REQ-03**: On submit: row inserted into Supabase `service_requests`, Resend notification sent to owner with all request details
- [ ] **REQ-04**: Success state: "Thanks — we'll reach out shortly to confirm and quote your service"
- [ ] **REQ-05**: Supabase RLS policy allows anonymous INSERT on `service_requests` table

### Blog (/blog)

- [ ] **BLOG-01**: MDX blog scaffold — blog index page at /blog, individual post pages at /blog/[slug]
- [ ] **BLOG-02**: Posts use `@next/mdx` with gray-matter for frontmatter (title, description, date, category, slug)
- [ ] **BLOG-03**: Category structure: Locksmith, Electronics, Fleet, Tips & Guides
- [ ] **BLOG-04**: SEO metadata on each post (title, description, OG tags, canonical URL)
- [ ] **BLOG-05**: `generateStaticParams` from content directory — 404 on unknown slugs (`dynamicParams = false`)

### SEO & Performance

- [ ] **SEO-01**: Next.js Metadata API on every page — title (with template `%s | City Tech`), description, OG tags
- [ ] **SEO-02**: LocalBusiness JSON-LD schema in root layout (business name, address, DMV service area, phone, description)
- [ ] **SEO-03**: Auto-generated `sitemap.ts` (all pages finalized, including service detail pages and blog posts)
- [ ] **SEO-04**: `robots.ts` — allow all, reference sitemap
- [ ] **SEO-05**: Semantic HTML throughout — correct heading hierarchy, landmark elements, alt text on all images
- [ ] **SEO-06**: `next/image` for all images with `priority` on hero, `sizes` attribute, and WebP optimization

---

## v2 Requirements

### Notifications & CRM
- **NOTF-01**: In-app notification or SMS to owner on new request (Twilio or similar)
- **NOTF-02**: Auto-reply email to customer confirming request received
- **NOTF-03**: Admin dashboard to manage and update service request status

### Content
- **CONT-01**: Seed blog articles (3–5 posts at launch)
- **CONT-02**: RSS feed for blog
- **CONT-03**: About page with technician profiles and company story

### SEO Expansion
- **SEO-V2-01**: Service schema JSON-LD on individual service pages
- **SEO-V2-02**: FAQ schema on service pages
- **SEO-V2-03**: Review/rating schema once review integration exists

### Features
- **FEAT-01**: Compustar authorized dealer badge (pending badge usage rights confirmation)
- **FEAT-02**: Response time estimates by zone
- **FEAT-03**: Interactive service area map (Leaflet) — if user research shows it's needed

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mobile native app | Web-first; app not planned |
| Real-time chat / live booking calendar | Async form + phone follow-up is the intended flow |
| Customer account / login portal | No portal needed for v1 |
| Payment processing | Quoting is off-site; no online payments |
| Admin dashboard | Owner uses Supabase dashboard for v1 |
| Fixed/published pricing on service pages | Prices vary by vehicle; publish invites misquote disputes |
| Service area interactive map | Owner confirmed: simple region statement is sufficient |
| Specific city/county list | Owner confirmed: DMV region statement is sufficient |
| Live Google Reviews API | Hardcoded testimonials are sufficient and simpler for v1 |
| Callback request floating widget | Tap-to-call covers this use case |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 — Foundation | Pending |
| FOUND-02 | Phase 1 — Foundation | Pending |
| FOUND-03 | Phase 1 — Foundation | Pending |
| FOUND-04 | Phase 1 — Foundation | Pending |
| FOUND-05 | Phase 1 — Foundation | Pending |
| FOUND-06 | Phase 1 — Foundation | Pending |
| LAYOUT-01 | Phase 1 — Foundation | Pending |
| LAYOUT-02 | Phase 1 — Foundation | Pending |
| LAYOUT-03 | Phase 1 — Foundation | Pending |
| LAYOUT-04 | Phase 1 — Foundation | Pending |
| LAYOUT-05 | Phase 1 — Foundation | Pending |
| HOME-01 | Phase 2 — Core Pages | Pending |
| HOME-02 | Phase 2 — Core Pages | Pending |
| HOME-03 | Phase 2 — Core Pages | Pending |
| HOME-04 | Phase 2 — Core Pages | Pending |
| HOME-05 | Phase 2 — Core Pages | Pending |
| HOME-06 | Phase 2 — Core Pages | Pending |
| HOME-07 | Phase 2 — Core Pages | Pending |
| HOME-08 | Phase 2 — Core Pages | Pending |
| HOME-09 | Phase 2 — Core Pages | Pending |
| HOME-10 | Phase 2 — Core Pages | Pending |
| SVC-01 | Phase 2 — Core Pages | Pending |
| SVC-02 | Phase 2 — Core Pages | Pending |
| SVC-03 | Phase 2 — Core Pages | Pending |
| SVC-04 | Phase 2 — Core Pages | Pending |
| FLEET-01 | Phase 2 — Core Pages | Pending |
| FLEET-02 | Phase 2 — Core Pages | Pending |
| FLEET-03 | Phase 2 — Core Pages | Pending |
| FLEET-04 | Phase 2 — Core Pages | Pending |
| REQ-01 | Phase 3 — Lead Capture + SEO | Pending |
| REQ-02 | Phase 3 — Lead Capture + SEO | Pending |
| REQ-03 | Phase 3 — Lead Capture + SEO | Pending |
| REQ-04 | Phase 3 — Lead Capture + SEO | Pending |
| REQ-05 | Phase 3 — Lead Capture + SEO | Pending |
| BLOG-01 | Phase 3 — Lead Capture + SEO | Pending |
| BLOG-02 | Phase 3 — Lead Capture + SEO | Pending |
| BLOG-03 | Phase 3 — Lead Capture + SEO | Pending |
| BLOG-04 | Phase 3 — Lead Capture + SEO | Pending |
| BLOG-05 | Phase 3 — Lead Capture + SEO | Pending |
| SEO-01 | Phase 3 — Lead Capture + SEO | Pending |
| SEO-02 | Phase 3 — Lead Capture + SEO | Pending |
| SEO-03 | Phase 3 — Lead Capture + SEO | Pending |
| SEO-04 | Phase 3 — Lead Capture + SEO | Pending |
| SEO-05 | Phase 3 — Lead Capture + SEO | Pending |
| SEO-06 | Phase 3 — Lead Capture + SEO | Pending |

**Coverage:**
- v1 requirements: 41 total
- Mapped to phases: 41
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-19*
*Last updated: 2026-04-19 after roadmap creation — expanded traceability to individual requirements*
