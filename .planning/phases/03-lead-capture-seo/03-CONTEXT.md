# Phase 3: Lead Capture + SEO - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire up the full service request form (Supabase + Resend live), implement all SEO infrastructure (metadata, LocalBusiness schema, sitemap, robots.txt), and update real contact info sitewide. Blog is explicitly deferred — not built in this phase.

**Prerequisite (owner action required before execution):**
1. Create a Supabase project at supabase.com under the owner's account
2. Run the SQL from `.planning/phases/01-foundation/01-02-SUMMARY.md` in their SQL Editor
3. Provide the Project URL and Publishable Key → add to `.env.local` and Vercel env vars
4. Create a Resend account and provide the API key → add to `.env.local` and Vercel env vars

</domain>

<decisions>
## Implementation Decisions

### Real Contact Information (CRITICAL — replaces all placeholders)
- **D-28:** Phone number: `(703) 343-6234` — replaces `(555) 555-5555` in Header, Footer, HeroSection, /request-service page, and any other location the placeholder appears
- **D-29:** Owner email: `Citytech12v@gmail.com` — displayed in Footer Contact column and on `/request-service` intro area. Also update `OWNER_NOTIFICATION_EMAIL` in `lib/actions/submitServiceRequest.ts` from `owner@citytech.com` to `Citytech12v@gmail.com`

### Service Request Form (/request-service) — REQ-01–05
- **D-25:** Single-page layout (no wizard). Two visual tiers:
  - **Always visible (required):** Name, phone, email, service selection (multi-select from services list grouped Electronics/Locksmith), fleet toggle (yes/no checkbox or radio), vehicle make, vehicle model, vehicle year
  - **Collapsed "Add more details" section (optional, toggled open):** Description/comments, preferred datetime window, VIN, referral source ("How did you hear about us?")
- **D-30:** Above the form: prominent "Call Now" button with `(703) 343-6234` as a tap-to-call `tel:` link — customers can call without filling the form. Owner email `Citytech12v@gmail.com` also shown in this intro area.
- **D-31:** `/request-service` is the sole contact page — no separate `/contact` route. The nav "Request Service" link goes directly to this page.
- **D-32:** Form validated client-side with React Hook Form + Zod; re-validated server-side in `submitServiceRequest` server action. Success state: "Thanks — we'll reach out shortly to confirm and quote your service." Error state: "Something went wrong. Please call us directly at (703) 343-6234."

### Blog — Deferred
- **D-26:** Blog (BLOG-01–05) is **removed from Phase 3 scope entirely.** Owner is not interested in text blogging. No MDX scaffold, no `/blog` route, no blog index built in this phase.
- Backlog note: Owner may want a video showcase page in a future phase (service demonstration videos). This is NOT a blog — it would be a dedicated `/videos` or `/gallery` page built when footage is available.

### SEO Infrastructure — SEO-01–06
- **D-27:** LocalBusiness JSON-LD schema uses `areaServed` only — no `address` field published. Service area: Washington DC, Maryland, Virginia. Owner has a registered Alexandria, VA address that can be added to the schema later (no code changes needed, just add `PostalAddress` block).
- **D-33:** Every page gets Next.js Metadata API title/description/OG tags via `generateMetadata` (service detail pages already done in Phase 2; homepage, fleet, and /request-service need metadata in this phase).
- **D-34:** `sitemap.ts` auto-generates all URLs: homepage, /fleet, /request-service, and all 12 service detail pages (from `data/services.ts`). No blog URLs (blog deferred).
- **D-35:** `robots.ts` — allow all crawlers, reference sitemap URL.

### Claude's Discretion
- Exact accordion/toggle animation for the optional fields section on the form
- Form field order within each tier (maintain logical grouping)
- `areaServed` array granularity (state names vs. city names — state names sufficient)
- OG image strategy (text-based OG image or Next.js default for v1)
- sitemap changefreq and priority values

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 3 requirements
- `.planning/REQUIREMENTS.md` — REQ-01–05 (service request form), SEO-01–06 (all SEO infra); BLOG-01–05 explicitly deferred
- `.planning/ROADMAP.md` §Phase 3 — Success criteria (note: success criteria mentioning blog are superseded by D-26)

### Prior phase decisions
- `.planning/phases/01-foundation/01-CONTEXT.md` — D-01–D-18 (brand tokens, layout, data model)
- `.planning/phases/02-core-pages/02-CONTEXT.md` — D-19–D-24 (homepage sections, form wiring)
- `.planning/phases/01-foundation/01-02-SUMMARY.md` — `submitServiceRequest` server action details + Supabase SQL to run

### Existing code to read before modifying
- `lib/actions/submitServiceRequest.ts` — Server action; update `OWNER_NOTIFICATION_EMAIL` to `Citytech12v@gmail.com`
- `components/layout/Header.tsx` — Update phone placeholder `(555) 555-5555` → `(703) 343-6234`
- `components/layout/Footer.tsx` — Update phone placeholder + add email `Citytech12v@gmail.com` to Contact column
- `components/home/HeroSection.tsx` — Update phone placeholder
- `components/home/QuickContactForm.tsx` — Update error fallback phone string
- `data/services.ts` — Source for sitemap service URL generation and form service multi-select

No external ADRs or specs — all decisions captured above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/actions/submitServiceRequest.ts` — Server action already written; handles Supabase insert + Resend email + RLS guard. Phase 3 wires real Supabase credentials and builds the full form UI to call it.
- `components/ui/form.tsx`, `input.tsx`, `select.tsx`, `textarea.tsx`, `accordion.tsx` — All installed in Phase 2. Full form builds on these primitives.
- `components/home/QuickContactForm.tsx` — 3-field quick form; Phase 3 builds the full 9-field version at `/request-service` using the same action and same error/success pattern.
- `lib/supabase/server.ts` — Async server Supabase client ready; just needs real env vars.
- `data/services.ts` — `getAllServices()` / `getServicesByCategory()` available for form service multi-select and sitemap generation.

### Established Patterns
- **Server Actions over API routes** — Form submits via `submitServiceRequest` (no `/api/` routes)
- **`"use client"` at leaf nodes only** — Form component is client, page file is Server Component
- **React Hook Form + Zod** — Pattern confirmed in requirements; Phase 3 introduces it for the first time (quick form in Phase 2 was simpler, no RHF)
- **`generateStaticParams`** — Used by service detail pages; sitemap.ts follows the same pattern reading from `data/services.ts`
- **Tailwind v4** — `@theme inline` in `app/globals.css`; no `tailwind.config.js`

### Integration Points
- `app/(marketing)/request-service/page.tsx` — New route (Server Component page, client form island)
- `app/sitemap.ts` — New file at app root (not inside `(marketing)`)
- `app/robots.ts` — New file at app root
- `app/layout.tsx` — LocalBusiness JSON-LD script tag added here (root layout, not marketing layout)
- Every existing page file — Metadata API additions (homepage, fleet already missing metadata)

</code_context>

<specifics>
## Specific Ideas

- **Real phone number:** `(703) 343-6234` — use this everywhere the placeholder `(555) 555-5555` appears
- **Real email:** `Citytech12v@gmail.com` — footer Contact column + /request-service intro + `OWNER_NOTIFICATION_EMAIL` in server action
- **Service area for schema:** "Washington, DC", "Maryland", "Virginia" — three `areaServed` entries
- **Fleet toggle on form:** Simple boolean — if "Yes" is selected, the submission description should note "Fleet customer: Yes" prepended to any description text (so the owner's email notification flags fleet inquiries without a separate table field)
- **Placeholder phone in Resend email template:** The owner notification email sent via Resend should include the customer's phone number prominently at the top so the owner can call back immediately

</specifics>

<deferred>
## Deferred Ideas

- **Blog scaffold (BLOG-01–05)** — Owner not interested in text blogging. Removed from Phase 3. Future possibility: video showcase/gallery page (`/videos` or `/gallery`) when owner has service demonstration footage. This is a new capability, not a blog.
- **Alexandria, VA registered address in LocalBusiness schema** — Available to add if owner decides stronger local SEO signals are needed; no code changes required, just add `PostalAddress` block to the JSON-LD object.
- **Additional `areaServed` entries** — Owner noted willingness to drive further for demand. Can expand `areaServed` array to cover specific counties/cities when the business is ready to advertise broader reach.
- **Resend DNS (SPF/DKIM)** — Must be configured on the owner's domain before go-live or notification emails go to spam. Owner controls domain DNS records. Not a code change — owner action.

</deferred>

---

*Phase: 03-lead-capture-seo*
*Context gathered: 2026-04-21*
