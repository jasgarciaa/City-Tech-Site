# Feature Landscape

**Domain:** Local mobile automotive locksmith + car electronics installer (DMV region)
**Researched:** 2026-04-19
**Confidence:** MEDIUM — based on established patterns for local service marketing sites; web search tools unavailable for live verification, but these patterns are well-documented in training data through Aug 2025 and are stable conventions.

---

## Table Stakes

Features users expect. Missing = product feels incomplete or untrustworthy. Visitors leave or call a competitor.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Phone number in header (tap-to-call) | Emergency intent users — lockout callers do not scroll | Low | Must be `<a href="tel:+1...">`. Sticky header on mobile keeps it always visible. |
| Service request / contact form | Users who can't call (at work, hearing impaired, price-shoppers) need an async path | Medium | React Hook Form + Zod; submits to Supabase; triggers Resend email. Already in PROJECT.md. |
| Clear list of services offered | Visitors must know within 5 seconds if this business does what they need | Low | Handled by services grid on homepage and service detail pages. |
| Service area statement | Local services have strict geographic limits; users must know if you come to them | Low | At minimum: "Serving DC, Maryland, and Virginia." More useful: dedicated service area page with map. |
| Business hours | Critical for emergency services — user needs to know if you answer at 2am | Low | Display in header, footer, and contact page. Include "24/7" or specific hours prominently. |
| Trust signals (review count + star rating) | Google Maps generation expects to see social proof before calling a stranger | Medium | Aggregate review count + stars from Google. Testimonial quotes with attribution. |
| Mobile-optimized layout | Majority of lockout calls originate on a phone, outdoors, one-handed, under stress | Medium | Responsive design; large tap targets; no pop-ups that block the phone number; font size >= 16px body. |
| About / Who We Are section | Skilled-trade trust depends on knowing there is a real person behind the site | Low | Owner name, photo or team photo, years in business, mission statement. |
| SSL / HTTPS | Users see browser warnings without it; Google ranks HTTP sites lower | Low | Handled by Vercel automatically. |
| Footer with NAP (Name, Address, Phone) | Google Local Pack and LocalBusiness schema require consistent NAP across web | Low | Name, service area (not physical address if home-based), phone, email, social links. |
| LocalBusiness JSON-LD schema | Google uses this for rich results and Local Pack eligibility | Low | Already in PROJECT.md. `@type: Locksmith` or `AutomotiveBusiness`. |
| Page load under 3 seconds on mobile | LCP > 3s causes ~53% of mobile users to abandon | Medium | Next.js image optimization, font display: swap, no render-blocking scripts. |

---

## Differentiators

Features that set City Tech apart from generic locksmith directories and low-effort competitor sites. Not universally expected, but meaningfully increases conversion and credibility.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Service detail pages (per-service) | SEO long-tail capture + conversion clarity; competitor sites list services as bullet points only | Medium | Data-driven from `/data/services.ts`. Problem/solution/process/pricing structure per service. Already in PROJECT.md. |
| Interactive service area map | Removes friction: visitor self-serves whether City Tech covers their location | Medium | Leaflet (free, no API key) centered on DMV. Display polygon or radius around service zone rather than just a point. |
| Fleet / B2B dedicated page | Most competitors ignore commercial clients entirely; separate page signals serious B2B capability | Medium | Separate pitch, fleet use cases (car dealers, delivery fleets, rideshare operators), fleet-specific form with volume/fleet-size field. Already in PROJECT.md. |
| Client logo carousel | Proof that businesses trust City Tech; builds B2B credibility instantly without text claims | Low-Medium | Grayscale-to-color on hover; infinite scroll animation; accessible (pause on focus). Already in PROJECT.md. |
| Authorized dealer badge (Compustar) | Third-party brand association transfers trust — customers recognize the brand even if they don't know City Tech | Low | Display Compustar authorized dealer badge near remote start service and in footer. Static image + link. |
| Blog with local SEO content | Captures users earlier in the funnel before they are in an emergency; compounds over time | Medium | MDX scaffold; categories (Car Audio, Locksmith, Remote Start, Fleet Tips); SEO metadata per post. Already in PROJECT.md. |
| "How it works" process section | Reduces anxiety about hiring a mobile service — addresses "will they actually show up?" | Low | 3-step: Request → Confirm → We Come To You. Applies to homepage and service detail pages. |
| Service schema markup per service | Enables rich snippets for individual services in search results | Low | `@type: Service` nested under LocalBusiness; one schema block generated per service from data source. Already in PROJECT.md. |
| Callback / form confirmation email to customer | Most local services send nothing — a confirmation email sets City Tech apart and reduces "did my form go through?" anxiety | Low-Medium | Resend can send a confirmation copy to the submitter alongside the owner notification. Requires capturing email in form (already expected). |
| Visible license / insurance statement | DCMVA jurisdictions require locksmith licensing; displaying it filters out scam-wary customers' objections | Low | Static text: "Licensed & Insured in DC, MD, and VA" near contact and about sections. |
| Years in business / founding year | "Established 20XX" is a low-effort trust signal that many competitors omit | Low | Display in About section and potentially hero subtext. |

---

## Anti-Features

Features to explicitly NOT build in v1. These would consume disproportionate effort relative to conversion impact, introduce complexity, or contradict the intended async workflow.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Real-time chat widget (LiveChat, Intercom, Tawk.to) | Requires staffing to be useful; an unanswered chat is worse than no chat; already declared Out of Scope | Prominent phone number + form is the intended flow |
| Online booking / calendar scheduler | Locksmith and electronics jobs require a call to assess scope, location, and quote before scheduling; a calendar implies fixed-price, fixed-time jobs which is not this model | Service request form → owner calls to confirm and quote |
| Customer login / account portal | No repeat-visit workflow that needs authentication; adds auth complexity, security surface, and maintenance burden | Form submission with email confirmation covers the customer's informational need |
| Payment processing | Out of scope per PROJECT.md; quoting is off-site | Note in form: "We will contact you to confirm and provide a quote" |
| Review gating widget (only happy customers get review link) | Violates Google's review policies; risks penalty | Display authentic testimonials; link directly to Google Business Profile for honest reviews |
| Live GPS technician tracking | Consumer expectation for delivery apps, not skilled trades; complexity far exceeds conversion value for v1 | ETA communicated by phone during the owner callback |
| Pop-up / interstitial overlays | Interrupt emergency-intent users trying to find the phone number or form; penalty from Google on mobile | Use persistent header CTA instead |
| Social media feed embed | Pulls focus away from conversion CTAs; adds external dependency and performance cost | Link to social profiles in footer; do not embed live feeds |
| Chatbot / AI assistant | Underdelivers on expectations; incorrect information about pricing or availability damages trust for a service business | Phone + form handles the same job better |
| Pricing tables with fixed rates | Automotive locksmith and electronics jobs vary significantly by vehicle, scope, and location; published prices invite dispute and misquotation | Use "Contact us for a free quote" with a strong form and fast callback promise |

---

## Feature Dependencies

```
Service request form
  → Supabase (table + insert)
  → Resend (owner notification email)
  → [Optional v1+] Resend (customer confirmation copy)

Service detail pages
  → /data/services.ts (single source of truth)
  → Service schema (JSON-LD generated from same data)
  → Services grid on homepage (same data)
  → Navigation service listing (same data)

Blog
  → MDX content collection
  → SEO metadata (OG tags, canonical, sitemap.xml)
  → Category structure (defines nav and filtering)

Service area map
  → Leaflet (no API key dependency)
  → Defined polygon/radius data (hardcoded DMV region)

Client logo carousel
  → Logo asset files (client must supply or placeholder used)
  → Fleet page (appears there too)
  → Homepage (appears there too)

Fleet page
  → Fleet-specific form (separate from consumer form OR same form with fleet flag field)
  → Client logo carousel (social proof for B2B audience)
  → Supabase (same table, fleet inquiry type distinguishable via form field)

Trust signals
  → Testimonial content (must be supplied by owner or sourced from Google reviews)
  → Authorized dealer badge asset (Compustar supplies to authorized dealers)
  → License/insurance statement text (owner confirms specifics)

LocalBusiness + Service schema
  → NAP data (name, phone, service area — must be accurate and consistent)
  → Services data source (Service schema derived from same objects)
  → sitemap.xml (must include all service detail page URLs)
```

---

## Feature Analysis by Research Area

### 1. Lead Capture

**Table stakes:** Phone number (tap-to-call) in sticky header, service request form on every page or reachable within one tap/click. Emergency-intent users will not dig.

**Differentiator:** Form UX quality matters. Most competitor forms are ugly, broken on mobile, or ask too many irrelevant fields. City Tech's React Hook Form + Zod implementation with real-time validation and a clean layout is itself a differentiator. Keep the initial form short: Name, Phone, Service needed (dropdown), Location/ZIP, optional notes. Full details gathered by owner callback.

**Do not build:** Chat widget, booking calendar. The owner's async callback loop is the correct model for this business.

**Complexity note:** The Supabase + Resend integration is the core backend task. The form itself is low-complexity UI; integration is medium-complexity backend.

### 2. Trust Signals

**Table stakes:** Star rating + review count (aggregate display), years in business, licensed and insured statement, real phone number with area code (not an 800 number — local area code signals local presence).

**Differentiator:** Authorized dealer badge (Compustar), named owner/technician with photo, specific license numbers if regulations require public display (DC and MD have specific locksmith licensing laws), specific fleet client logos.

**Confidence note:** DC, MD, and VA all regulate locksmith licensing. Displaying license number is both a legal transparency requirement in some jurisdictions and a trust signal. Owner should confirm which specific license numbers to display. MEDIUM confidence on exact regulatory requirements — owner or legal review should verify.

**Complexity:** Low for static trust signals. Medium if pulling live Google review data via API (not recommended for v1 — hard-code testimonials + link to Google profile instead).

### 3. Service Area Display

**Table stakes:** Text statement of coverage area on homepage and contact page.

**Differentiator:** Dedicated service area page with interactive Leaflet map. Display counties/jurisdictions covered rather than just "DMV" — many users do not know if their suburb is in the service zone. Consider listing key cities/jurisdictions: DC, Montgomery County MD, Prince George's County MD, Fairfax County VA, Arlington VA, Alexandria VA, etc.

**Do not build:** Zip code lookup tool or real-time coverage checker for v1. List-based or map-based display achieves the goal without the complexity.

**Complexity:** Low for text list. Medium for interactive Leaflet map with polygon overlay. Map dependency: Leaflet is free and has no API key requirement; preferred over Mapbox for v1.

### 4. Fleet / B2B Page Patterns

**Table stakes (for B2B audience):** Separate page (not a section) signaling this is a primary offering, not an afterthought. B2B buyers will not submit a consumer "I'm locked out" form — they need a form with fleet size, company name, and service type fields.

**Differentiator:** Use-case specificity. Name the industries served: car dealerships (key cutting and fob programming for inventory), delivery fleets (key replacement, lockouts, fleet-wide remote start), rideshare/TNC operators, government vehicles. Specific use cases convert better than generic "we serve businesses" copy.

**Client logo carousel:** Appears on both homepage and fleet page. On fleet page it carries maximum weight as direct B2B social proof.

**Complexity:** Medium. Requires distinct form with additional fields (company name, fleet size, service interest). Form routes to same Supabase table but with fleet_inquiry boolean or type field. Page itself is a new route with its own layout but shared components.

### 5. Blog / SEO Content Patterns

**Table stakes:** Structured content with proper metadata (title, description, canonical, OG). Each post must have: author, date published, date modified, category, and structured data.

**Differentiator:** Topical authority through content clusters. A single blog is not enough — the site needs content clusters around each core service. Examples:
- Locksmith cluster: "Car lockout guide," "Lost key fob replacement cost," "How transponder keys work"
- Remote start cluster: "Compustar vs competitors," "Remote start installation process," "Remote start troubleshooting"
- Car audio cluster: "Backup camera installation guide," "Best speakers for [car model]"

Each cluster drives long-tail traffic and links back to the relevant service detail page.

**Do not build:** A CMS-managed blog for v1. MDX with Git is sufficient and removes external dependency. Owner or contractor writes posts as MDX files.

**Complexity:** Low for MDX scaffold. Medium for SEO metadata automation and sitemap generation. High for content production (not a build task — an ongoing operational task).

### 6. Client Logo Carousel

**Table stakes:** None — this is a differentiator for a local service business. Most competitors do not have recognizable B2B clients to display. If City Tech has fleet clients, this is a meaningful proof point.

**Differentiator:** Grayscale-to-color hover interaction signals design quality. Infinite scroll keeps it compact. Framer Motion or pure CSS animation (no library dependency for v1 preferred).

**Accessibility requirement:** Must pause on keyboard focus (`prefers-reduced-motion` media query respected). `aria-label` on each logo image. If using `marquee`-style animation, ensure screen readers get a static list alternative.

**Complexity:** Low-Medium. CSS-only infinite scroll is achievable without a library. Grayscale filter is a single CSS rule. The main complexity is sourcing logo assets from clients and handling different aspect ratios gracefully.

**Dependency:** Requires logo files from clients or owner. Build with placeholder lorem-ipsum logos; swap on asset delivery.

### 7. Service Detail Pages

**Table stakes:** Each service needs at minimum: what it is, who it is for, and how to request it (CTA).

**Differentiator:** Problem/solution/process/FAQ structure per service converts significantly better than a paragraph description. Structure:
1. Problem statement (empathy — "Locked out at night in an unfamiliar area?")
2. Solution statement (what City Tech does about it)
3. How it works (3-step process)
4. What's included (specific deliverables — e.g., "New key cut, programmed, and tested on-site")
5. FAQ (3-5 questions addressing price anxiety, time expectations, compatibility)
6. CTA (form or phone)

**Pricing on service pages:** Do NOT publish fixed prices (anti-feature). Use "Contact for a free quote" with a clear rationale: "Pricing varies by vehicle make, model, and service complexity." This is honest and avoids misquote disputes.

**Data-driven generation:** Single `/data/services.ts` source generates: service detail page, homepage grid entry, nav listing, Service schema. Adding a new service is one object addition. High leverage, low ongoing maintenance.

**Complexity:** Medium per page pattern (design + content structure). Low for data-driven generation once the pattern is established. High for content writing (operator task, not a build task).

### 8. Mobile UX Patterns

**Table stakes for emergency-intent users:**
- Phone number visible without scrolling on every page (sticky header)
- Tap-to-call link (not just displayed text)
- Form completable one-handed: single column layout, large touch targets (min 44px), no dropdowns requiring fine motor precision
- Font size minimum 16px for body copy (prevents iOS zoom-on-focus behavior)
- No interstitials or pop-ups blocking the primary CTA
- Page weight under 300KB transferred on first load where possible

**Differentiator:** Most locksmith competitor sites were built in WordPress with cheap themes and perform poorly on mobile. A Next.js site with proper image optimization, font display, and no unnecessary JavaScript will load faster and feel more trustworthy by comparison alone.

**Older demographic accessibility:** Blue/white brand system already addresses contrast. Additionally: avoid icon-only buttons (label everything), avoid hover-only interactions (touch devices have no hover), avoid carousel auto-advance without user control (disorienting), and use plain language over jargon.

**Complexity:** Low if designed mobile-first from the start. Medium if retrofitted after desktop design. This project brief specifies mobile-first consideration, so design guidance must enforce it from the first component.

---

## MVP Recommendation

**Phase 1 priority (table stakes + highest-ROI differentiators):**

1. Tap-to-call in sticky header
2. Service request form (Supabase + Resend integration)
3. Homepage with hero, services grid, trust signals, testimonials, and footer CTA
4. Service detail pages (data-driven from services.ts)
5. Contact page
6. LocalBusiness schema + Service schema + sitemap
7. Mobile-optimized layout throughout

**Phase 2 (differentiators that require content or assets):**

8. Fleet / B2B page with fleet-specific form
9. Service area page with Leaflet map
10. Client logo carousel (blocked on asset delivery)
11. Blog scaffold with first 2-3 posts
12. Authorized dealer badge placement

**Defer to v2 or ongoing:**

- Blog content production (operational, not build)
- Customer form confirmation email (Resend enhancement, low effort but low urgency)
- Topical content cluster expansion

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Lead capture patterns | HIGH | Established conversion patterns, well-documented; no live data needed |
| Trust signals | HIGH | Stable conventions; locksmith licensing regulatory detail is MEDIUM (owner must verify jurisdiction specifics) |
| Service area display | HIGH | Map + city list is standard; Leaflet preference is HIGH confidence (free, no API key) |
| Fleet/B2B page patterns | MEDIUM | B2B service site patterns are established; specific DMV fleet market nuances unverified |
| Blog/SEO patterns | HIGH | Local SEO content cluster strategy is well-established |
| Client logo carousel | HIGH | Interaction pattern is standard; dependency on client asset delivery is operational, not technical |
| Service detail pages | HIGH | Problem/solution/process structure is a known conversion pattern |
| Mobile UX patterns | HIGH | Emergency-intent mobile patterns are well-documented; iOS zoom-on-focus is a known behavior |

---

## Sources

- Training knowledge through August 2025 on local service marketing website conventions (web search tools unavailable during this research session)
- Project context: `.planning/PROJECT.md` (read directly)
- Web fetch and web search tools denied; findings based on established industry patterns
- Owner should verify: DC, MD, VA locksmith license display requirements; Compustar authorized dealer badge usage rights
