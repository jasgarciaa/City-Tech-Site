# Project Research Summary

**Project:** City Tech -- Mobile Automotive Locksmith and Electronics Marketing Site
**Domain:** Local service marketing + lead generation (DMV region)
**Researched:** 2026-04-19
**Confidence:** HIGH (stack and architecture verified against official Next.js 16.x docs; feature patterns are established convention; pitfalls are well-documented)

---

## Executive Summary

City Tech is a conversion-first marketing site for a mobile automotive locksmith and electronics business -- not a web app. Every page exists to get a stressed or interested visitor to submit a form or tap a phone number. The research confirms a clear archetype: mostly-static Next.js App Router pages, two Client Component islands (form and map), a data-driven services layer as a single source of truth, and a lightweight MDX blog for local SEO compounding. The entire site pre-renders at build time -- no SSR per request is needed on any page.

The recommended approach is to build in strict dependency order: data layer first (/data/services.ts, Zod schema, Supabase table), then the layout shell, then static Server Component pages, then Client Component islands (form, carousel, map), then the blog, and finally SEO infrastructure last (sitemap, schema, OG images). This order prevents rework -- everything downstream reads from the data layer, and the sitemap can only be correct once all routes are stable. The stack is fully resolved: Tailwind v4 (not v3), Leaflet (not Mapbox), @next/mdx with exported metadata constants (not Contentlayer, not gray-matter for frontmatter), and Server Actions for form submission (not API routes).

The top risks are operational, not technical: leads can be silently lost if the Supabase RLS INSERT policy for the anon role is missing (the insert returns { data: null, error: null } -- no error is thrown); Leaflet will crash the entire service-area route if not wrapped in dynamic({ ssr: false }); and Resend emails will land in spam if DNS records (SPF, DKIM, DMARC) are not verified before go-live. All three are straightforward to prevent if addressed in the correct phase.

---

## Key Findings

### Stack Recommendation

The stack is fixed by brief, with two decisions resolved by research. Use **Tailwind v4** (not v3) -- stable since January 2025, 3-8x faster than v3, zero config file, and CSS-native custom properties map cleanly to the blue/white brand system. Use **Leaflet** (not Mapbox) -- the requirement is a DMV service area polygon; Leaflet is MIT-licensed with no API key or billing account required. For MDX, use @next/mdx with exported metadata constants from each .mdx file -- native, TypeScript-typed, no plugin chain. Contentlayer is deprecated (abandoned 2024) and must not be used.

**Core technologies:**
- **Next.js 15/16 (App Router):** Full-stack framework -- file-based routing, native Metadata API, sitemap.ts convention, generateStaticParams pre-renders all service and blog routes at build time
- **Tailwind CSS v4:** Utility styling -- single CSS import entry point, @theme {} blocks for brand color tokens, @tailwindcss/postcss adapter (replaces tailwind.config.js entirely)
- **Supabase (PostgreSQL + RLS):** Form submission storage -- service_requests table with status enum; anon INSERT policy required; service_role key never in client code
- **React Hook Form + Zod:** Form UX and validation -- single shared Zod schema in lib/schemas/serviceRequest.ts consumed by both the Client Component (RHF resolver) and the Server Action (server-side re-validation)
- **Resend:** Owner notification email -- domain DNS verification (SPF, DKIM, DMARC) required before production; 3,000 emails/month free tier is sufficient
- **@next/mdx:** Blog compilation -- MDX files export typed metadata constants; Turbopack requires remark plugins as module name strings, not function references
- **Leaflet + react-leaflet:** Service area map -- must be wrapped in dynamic({ ssr: false }); custom SVG markers sidestep the default icon path bug in webpack
- **Vercel:** Deployment -- zero-config Next.js hosting; all env vars must be added manually in Vercel dashboard (.env.local is gitignored and never deployed)

### Table Stakes Features (Must Have)

Missing any of these and the site feels incomplete or untrustworthy:

- Tap-to-call phone number in sticky header (visible without scrolling on every page)
- Service request form (RHF + Zod + Supabase insert + Resend owner notification)
- Clear service list -- visitor determines within 5 seconds if City Tech covers their need
- Business hours displayed prominently (critical for emergency-intent callers)
- Trust signals: star rating + review count, years in business, licensed and insured statement
- Mobile-optimized layout -- 16px min body font, 44px min touch targets, single-column forms, no pop-ups
- About section with real person and real name (skilled-trade credibility requires a face)
- Footer NAP (Name, service area, phone) -- required for consistent LocalBusiness schema
- LocalBusiness JSON-LD schema (@type: AutomotiveBusiness) with areaServed and phone in E.164 format
- Page load under 3 seconds on mobile -- next/image on all images, priority on above-fold hero

### Differentiators (Should Have)

These meaningfully lift conversion and credibility above competitor sites:

- Service detail pages with problem/solution/process/FAQ structure (data-driven from /data/services.ts)
- Interactive service area map (Leaflet, DMV polygon, key jurisdictions listed by name not just "DMV")
- Fleet / B2B dedicated page with fleet-specific form (company name, fleet size, service type fields)
- Client logo carousel (CSS-only infinite scroll, grayscale-to-color hover, SSR-safe)
- Authorized Compustar dealer badge near remote start service and in footer
- Blog with local SEO content clusters (locksmith, remote start, car audio categories)
- "How it works" 3-step process section on homepage and service detail pages
- Service schema markup per service page (@type: Service, nested under LocalBusiness)
- Visible license/insurance statement ("Licensed and Insured in DC, MD, and VA")

### Anti-Features (Explicitly Exclude from v1)

| Anti-Feature | Why |
|---|---|
| Real-time chat widget | Requires staffing; unanswered chat is worse than no chat |
| Online booking / calendar scheduler | Wrong model -- jobs require a scoping call before scheduling |
| Customer login / account portal | No repeat-visit auth workflow needed for v1 |
| Payment processing | Quoting is off-site |
| Pop-ups or interstitial overlays | Block emergency-intent users from reaching phone or form |
| Fixed pricing tables | Jobs vary by vehicle and scope; published prices invite disputes |
| Social media feed embeds | Pull focus from CTAs; add external dependency and performance cost |
| Chatbot / AI assistant | Incorrect pricing info damages trust for a service business |

**Defer to v2+ or ongoing:**
- Customer form confirmation email to submitter (low effort Resend enhancement, low urgency)
- Blog content production (ongoing operational task, not a one-time build task)
- Topical content cluster expansion beyond initial scaffold
- Live Google review API integration (hard-code testimonials for v1, link to Google profile)

### Architecture Approach

The site is a static shell with isolated Client Component islands. Every page pre-renders at build time via generateStaticParams. The central architectural rule: /data/services.ts is the single source of truth. Adding one object to the services array automatically generates a service detail page, a nav entry, a homepage grid card, a sitemap entry, and a Service schema block -- no other files touched.

**Major components:**

1. `/data/services.ts` -- ServiceDefinition array; every other component reads from this; never hardcode service data elsewhere
2. `lib/actions/submitServiceRequest.ts` -- "use server" Server Action; Zod re-validate server-side, Supabase insert with .select("id") to catch silent RLS failures, Resend notification
3. `components/forms/ServiceRequestForm.tsx` -- "use client"; RHF + Zod resolver; calls Server Action; shows success/error state
4. `components/interactive/ServiceAreaMap.tsx` -- "use client"; Leaflet map; parent page always imports via dynamic({ ssr: false })
5. `components/interactive/LogoCarousel.tsx` -- "use client"; CSS-only keyframes scroll with logos array duplicated in markup; receives logos[] prop from Server Component parent
6. `app/sitemap.ts` -- reads services array + blog content directory at build time; written last when all routes are stable

**Build order (dependency-dictated layers):**

| Layer | What to Build | Why This Order |
|---|---|---|
| 0 -- Foundation | /data/services.ts, Zod schema, Supabase table + RLS anon INSERT policy | Everything reads from these |
| 1 -- Layout Shell | Root layout, marketing layout, Nav (reads services.ts), Footer | Every page needs a working shell |
| 2 -- Static Pages | Homepage, service detail pages with generateStaticParams, fleet page | Validates data flow before adding client complexity |
| 3 -- Client Islands | Service request form + Server Action, logo carousel, service area map, contact page | Builds on stable shell and data layer |
| 4 -- Blog | @next/mdx config, mdx-components.tsx, initial posts, blog index, blog post routes | Independent of forms |
| 5 -- SEO Infrastructure | sitemap.ts, robots.ts, LocalBusiness + Service schemas, canonical URLs, OG images | Written only when all routes are stable |

### Top 5 Pitfalls to Avoid

1. **Leaflet crashes the entire page on SSR.** Leaflet reads window at module load. Import ServiceAreaMap only via dynamic({ ssr: false }) with a loading skeleton prop. Also add transpilePackages: ["leaflet", "react-leaflet"] to next.config.ts. Symptom if missed: 500 on /service-area in Vercel preview; works fine in next dev.

2. **Supabase RLS silently drops inserts.** A table with RLS enabled but no INSERT policy for the anon role returns { data: null, error: null } -- no error thrown, no row written, no email fires, leads lost invisibly. Fix: add CREATE POLICY "Allow anonymous insert" ON service_requests FOR INSERT TO anon WITH CHECK (true). In the Server Action, use .insert(payload).select("id") and throw explicitly if data.length === 0.

3. **Resend emails land in spam pre-launch.** Resend API returns 200 but emails are filtered without SPF, DKIM, and DMARC DNS records. Verify the sending domain in Resend dashboard and add all three records during Phase 2, not at launch day. Test with mail-tester.com before go-live.

4. **"use client" placed too high in the tree.** Adding "use client" to a layout or page file converts the entire subtree to client rendering, bloating the JS bundle and disabling server data fetching for all children. Push "use client" only to the deepest interactive leaf.

5. **Environment variables missing from Vercel dashboard.** .env.local is gitignored and never deployed. All required vars must be added manually in Vercel. Add startup validation in instrumentation.ts that throws on missing required env vars so failures are loud, not silent broken forms.

---

## Implications for Roadmap

Based on combined research, a 4-phase structure maps cleanly to the dependency layers:

### Phase 1: Foundation + Core Static Site

**Rationale:** Establishes the data layer and layout shell that every downstream component depends on. Validates the full rendering pipeline before adding backend integration or interactivity.
**Delivers:** Working homepage, service detail pages, fleet page, and contact page shell -- fully rendered and deployed to Vercel preview -- with correct nav, SEO metadata title template, and mobile layout.
**Addresses:** Tap-to-call sticky header, services grid, trust signals, about section, footer NAP, LocalBusiness schema baseline, blue/white brand tokens in Tailwind v4.
**Avoids:** Hardcoded service data in multiple places (services.ts established from day one); "use client" scope creep (pages are pure Server Components).
**Research flag:** Standard patterns -- no research phase needed.

### Phase 2: Lead Capture (Form + Backend Integration)

**Rationale:** The service request form is the core business deliverable. Supabase and Resend must work reliably before any other feature matters. Built after static pages so the contact page shell already exists.
**Delivers:** Working service request form with client-side validation, server action, Supabase row insertion with confirmed RLS anon policy, and owner email notification via Resend with verified DNS.
**Uses:** React Hook Form, Zod (shared schema), @supabase/supabase-js (server-side only), Resend SDK, instrumentation.ts env validation.
**Avoids:** RLS silent insert failure; missing Vercel env vars; unshared Zod schema.
**Research flag:** Standard patterns -- no research phase needed. Resend DNS verification is an operational step, not a research question.

### Phase 3: Interactive Client Islands

**Rationale:** Differentiator features requiring browser APIs. Depends on static page shells from Phase 1.
**Delivers:** Service area map (Leaflet DMV polygon), client logo carousel (CSS-only), fleet-specific contact form variant with company name and fleet size fields.
**Implements:** ServiceAreaMap with mandatory dynamic({ ssr: false }), LogoCarousel with CSS keyframes scroll and markup-duplicated logo array, FleetContactForm routing to same Supabase table.
**Avoids:** Leaflet SSR crash; carousel FOUC and hydration mismatch (CSS-only animation, no JS-dependent initialization).
**Research flag:** Standard patterns -- no research phase needed.

### Phase 4: Blog + SEO Infrastructure

**Rationale:** Blog can be built independently. Full SEO infrastructure is written last because it references all stable routes.
**Delivers:** MDX blog with Zod-validated metadata, blog index, per-post OG metadata, category structure. Plus: complete app/sitemap.ts covering all service and blog slugs, robots.txt, per-service Service schema blocks, canonical URLs, OG images.
**Uses:** @next/mdx, exported metadata constants (not gray-matter for frontmatter), Zod frontmatter validation, path.join(process.cwd(), "content/blog") for blog discovery, native app/sitemap.ts (not next-sitemap package).
**Avoids:** Broken OG metadata from undefined frontmatter; sitemap missing dynamic routes; canonical URL PageRank split. Must test with next build && next start -- not just next dev.
**Research flag:** Standard patterns -- no research phase needed.

### Phase Ordering Rationale

- Data layer before everything because Nav, ServicesGrid, generateStaticParams, sitemap.ts, and Service schemas all read from /data/services.ts -- building any of those before the data shape is stable means rework.
- Static pages before Client Component islands because the form and map need their containing page shells to exist, and the simpler rendering pipeline is easier to debug first.
- Blog and SEO last because the sitemap is only correct when all routes are finalized, and blog content production is an ongoing operational task.
- Resend DNS verification must happen during Phase 2 -- propagation takes time and must be tested before the first real lead arrives.

### Research Flags

No phases require a dedicated research phase. All patterns are documented in official Next.js 16.x docs and are established community convention.

**Operational checkpoints required before marking each phase complete:**
- Phase 1: Run next build to verify Tailwind v4 postcss adapter is configured correctly
- Phase 2: Confirm Supabase anon INSERT policy active; test form end-to-end in Vercel preview; add Resend DNS records; test with mail-tester.com
- Phase 4: Run next build && next start to validate MDX frontmatter and OG metadata

---

## Open Questions for Owner

These cannot be resolved by research -- they require business owner input before or during development:

1. **Business hours:** 24/7 or specific hours? Impacts sticky header, footer, LocalBusiness schema openingHoursSpecification, and whether "24/7 Emergency Service" appears in hero copy -- a significant conversion signal.
2. **License numbers:** DC, MD, and VA each regulate locksmith licensing independently. Which license numbers to display and in which jurisdictions?
3. **Compustar authorized dealer badge:** Does Compustar supply web-use badge assets and grant permission to display them? Do not use any Compustar trademark without explicit authorization.
4. **Logo file delivery:** Build continues with SVG placeholder at /public/logo.svg. Swap is a one-file replacement with no structural rework.
5. **Client logo assets for carousel:** Build with placeholder SVG components. Swap on asset delivery -- LogoCarousel receives a logos[] prop, so swap is a data change only.
6. **Actual phone number and domain:** Required for LocalBusiness schema (E.164 format: +1XXXXXXXXXX) and canonical URLs. Use clearly marked placeholders until confirmed.

---

## Confidence Assessment

| Area | Confidence | Notes |
|---|---|---|
| Stack | HIGH | Core decisions verified against official Next.js 16.x docs and Tailwind v4 release docs; package semver ranges are MEDIUM -- confirm with npm show at install time |
| Features | HIGH | Stable conversion patterns for local service marketing sites; locksmith license display requirements are MEDIUM (owner must confirm DC/MD/VA specifics) |
| Architecture | HIGH | All patterns verified against official Next.js App Router docs; component boundaries and data flow are unambiguous |
| Pitfalls | HIGH | Leaflet SSR, Supabase RLS silent failure, and "use client" propagation are well-documented; Resend rate limits are MEDIUM (verify at resend.com/pricing) |

**Overall confidence: HIGH**

### Gaps to Address

All remaining gaps require owner input, not additional research. See Open Questions above.

---

## Sources

### Primary (HIGH confidence -- verified against official docs)
- Next.js 15/16 official docs (nextjs.org) -- App Router, Server/Client Components, MDX integration guide, Metadata API, sitemap.ts file convention, generateStaticParams, dynamic imports with ssr: false, image optimization
- Tailwind CSS v4 official docs and blog (tailwindcss.com) -- v4 stable release, @tailwindcss/postcss adapter, Next.js installation guide
- Schema.org (schema.org/AutomotiveBusiness) -- structured data type for automotive service businesses

### Secondary (MEDIUM confidence -- established community patterns)
- Supabase RLS documentation -- { data: null, error: null } behavior when INSERT policy is missing for anon role
- Leaflet + Next.js SSR -- dynamic({ ssr: false }) pattern (universally established)
- Resend documentation -- email deliverability DNS requirements, free tier limits

### Tertiary (MEDIUM confidence -- training knowledge through Aug 2025, no live verification)
- Package semver ranges for @supabase/supabase-js, react-hook-form, zod, resend, react-leaflet -- verify at install time with npm show <package> version
- DC, MD, VA locksmith licensing display requirements -- owner or legal review should confirm jurisdiction specifics

---
*Research completed: 2026-04-19*
*Ready for roadmap: yes*
