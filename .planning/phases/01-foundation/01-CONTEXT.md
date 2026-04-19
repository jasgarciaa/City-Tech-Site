# Phase 1: Foundation - Context

**Gathered:** 2026-04-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up the complete project foundation that every downstream phase builds on: Next.js App Router project init, Tailwind v4 + shadcn/ui design system with brand tokens, `/data/services.ts` single source of truth, Supabase `service_requests` table, global sticky header, and global footer. No page content is built in this phase — only the shell and data model.

</domain>

<decisions>
## Implementation Decisions

### Brand Color System
- **D-01:** Two-blue color system extracted from the City Tech logo: dark royal blue (primary) + cyan/sky blue (accent). Exact hex values to be sampled from the provided logo file at project init time. Approximate targets: primary ~`#1B3A8F`, accent ~`#00AEEF`.
- **D-02:** Light mode only. White backgrounds, dark blue text, cyan accent. No dark mode toggle.
- **D-03:** shadcn CSS custom properties: `--primary` = dark royal blue, `--accent` = cyan, `--background` = white, `--foreground` = near-black. All shadcn components inherit automatically.
- **D-04:** No additional accent colors beyond the two blues from the logo. Warm grey (`--muted`) is acceptable for section backgrounds and subtle dividers.

### Header Layout
- **D-05:** Three-zone sticky header: logo (left) / navigation (center) / "Call Now" + phone number button (right).
- **D-06:** Mobile: hamburger menu. Tap opens slide-out or full-screen nav. Phone number button remains visible in mobile header alongside hamburger.
- **D-07:** Navigation links: **Services** (dropdown), **Fleet**, **Request Service**. Blog is NOT in the nav.
- **D-08:** Services nav item opens a dropdown populated from `/data/services.ts`, grouped into two sections: **Electronics** and **Locksmith**. Clicking the group label or any service item navigates to `/services/[slug]`.
- **D-09:** Call CTA button label: **"Call Now"** with the phone number displayed alongside. Button styled in `--primary` blue with white text.

### Services Data Shape
- **D-10:** Each service object in `/data/services.ts` has these fields:
  ```ts
  {
    slug: string              // URL segment: "car-audio", "vehicle-lockout"
    name: string              // Display name: "Car Audio Installation"
    shortDescription: string  // 1-2 sentences for grid cards and nav dropdown
    category: "electronics" | "locksmith"
    featured: boolean         // Whether to highlight in homepage grid
    order: number             // Sort order within category
    pageContent: {            // Content for /services/[slug] detail page
      problem: string         // "Here's the situation you're facing..."
      solution: string        // "Here's how City Tech solves it..."
      process: string[]       // Step-by-step: ["We arrive onsite", "We assess...", ...]
    }
  }
  ```
- **D-11:** No icon field in v1 — Lucide icons from shadcn assigned per category in the UI layer (not stored in data). Electronics services get an audio/tech icon; locksmith services get a key/lock icon. Can be overridden per-service later by adding an optional `icon` field.
- **D-12:** Initial services list:
  - **Electronics:** Car Audio Installation, Car Alarms, Mobile Video Systems, Backup Cameras, Remote Start Systems, Navigation Systems, Security & Tracking Systems, Compustar Products
  - **Locksmith:** Vehicle Lockouts, Transponder Key Programming, Key Fob Replacement, Ignition Repair & Replacement

### Footer Structure
- **D-13:** Three-column layout (desktop): **Brand** (logo + tagline + "Serving DC, Maryland & Virginia") / **Services** (list of all services from data source) / **Contact** (phone, email, area statement, availability messaging).
- **D-14:** Bottom strip below columns: social icons (Facebook, Instagram, Linktree) on the left + copyright line on the right.
- **D-15:** Footer trust signals: "Est. 2016" and "NASTF background-checked employees" appear in the Brand column or below it.
- **D-16:** Copyright line: `© 2026 City Tech, LLC. All rights reserved.`
- **D-17:** Social platforms: Facebook, Instagram, Linktree. Icon links — no labels, just accessible `aria-label` text.
- **D-18:** Footer collapses to single-column on mobile (Brand → Services → Contact → Social strip stacked).

### Claude's Discretion
- Exact hex values for `--primary` and `--accent` (sampled from logo at project init)
- Lucide icon assignment per service category
- shadcn component variants used throughout (size, radius, etc.)
- Mobile hamburger animation style (slide-out drawer vs full-screen overlay)
- Exact spacing, typography scale, and border-radius values — keep clean and professional, not trendy

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project requirements
- `.planning/REQUIREMENTS.md` — Full v1 requirements; Phase 1 covers FOUND-01–06 and LAYOUT-01–05
- `.planning/PROJECT.md` — Brand direction, design tone, constraints

### Phase roadmap
- `.planning/ROADMAP.md` §Phase 1 — Success criteria and requirement list

### Brand asset
- `public/logo.svg` — Placeholder at project init; real logo file to be swapped in by owner. Two-blue color system (dark royal blue + cyan) should be sampled from the actual PNG files provided (see conversation — owner shared logo JPG/PNG).

No external ADRs or specs — all decisions captured above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet — greenfield project. This phase creates the foundational assets all other phases use.

### Established Patterns
- **shadcn/ui:** Initialize with `npx shadcn@latest init`. Components added individually with `npx shadcn@latest add [component]`. Needed for Phase 1: Button, NavigationMenu, Sheet (mobile drawer). Do not add all components upfront.
- **Tailwind v4:** No `tailwind.config.js`. Theme tokens defined in `app/globals.css` using `@theme {}` block. Entry point: `@import "tailwindcss"`.
- **Next.js App Router:** Root layout at `app/layout.tsx`. Marketing pages use a route group `app/(marketing)/layout.tsx` for shared header/footer. No `pages/` directory.

### Integration Points
- `/data/services.ts` is the spine — header dropdown, homepage grid, `generateStaticParams` in Phase 2, and `sitemap.ts` in Phase 3 all read from it.
- Supabase client initialized in `/lib/supabase/client.ts` (browser) and `/lib/supabase/server.ts` (server actions). Both read from env vars.
- shadcn theme tokens (`--primary`, `--accent`) defined in `globals.css` and consumed by every shadcn component automatically.

</code_context>

<specifics>
## Specific Ideas

- **Logo:** Two provided PNG files show the full brand. Dark royal blue for van/wordmark, cyan for key graphic and "Est. 2016". The two-tone blue IS the brand system — not a design choice but a logo match.
- **Tagline from logo:** "Mobile Automotive Locksmith and Electronics Service" — use this exact string as the official subtitle throughout the site.
- **Est. 2016** — appears in the logo and should surface in trust signals (footer + homepage trust block).
- **"Available when you need us"** — approved framing for availability. Not "24/7". Not specific hours.
- **Phone CTA:** "Call Now" is the approved label. Phone number TBD from owner — use placeholder `(555) 555-5555` during build.

</specifics>

<deferred>
## Deferred Ideas

- Google Business Profile link in footer — noted, add to v2 or when owner confirms profile URL
- Linktree URL — placeholder `#` until owner provides it; same for Facebook and Instagram URLs
- Compustar authorized dealer badge — pending badge usage rights; v2

None of the discussion introduced out-of-scope capabilities.

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-04-19*
