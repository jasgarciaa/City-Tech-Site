# Phase 1: Foundation - Research

**Researched:** 2026-04-19
**Domain:** Next.js 16 App Router + Tailwind v4 + shadcn/ui + Supabase + Resend
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (D-01 through D-18)

**Brand Color System**
- D-01: Two-blue color system: dark royal blue (`--primary` ~`#1B3A8F`) + cyan (`--accent` ~`#00AEEF`). Exact hex sampled from logo at project init.
- D-02: Light mode only. No dark mode toggle. No `prefers-color-scheme`. No `dark:` Tailwind variants.
- D-03: shadcn CSS custom properties: `--primary` = dark royal blue, `--accent` = cyan, `--background` = white, `--foreground` = near-black.
- D-04: No additional accent colors. Warm grey (`--muted`) acceptable for section backgrounds.

**Header Layout**
- D-05: Three-zone sticky header: logo (left) / navigation (center) / "Call Now" + phone (right).
- D-06: Mobile: hamburger + phone number always visible. Slide-out drawer on tap.
- D-07: Nav links: Services (dropdown), Fleet, Request Service. Blog NOT in nav.
- D-08: Services dropdown populated from `/data/services.ts`, two groups: Electronics / Locksmith.
- D-09: CTA label: "Call Now". Button styled `--primary` blue with white text.

**Services Data Shape**
- D-10: Service object fields: `slug`, `name`, `shortDescription`, `category: "electronics" | "locksmith"`, `featured: boolean`, `order: number`, `pageContent: { problem, solution, process: string[] }`.
- D-11: No icon field in v1. Lucide icons assigned per category in UI layer.
- D-12: Initial services: Electronics (Car Audio Installation, Car Alarms, Mobile Video Systems, Backup Cameras, Remote Start Systems, Navigation Systems, Security & Tracking Systems, Compustar Products) + Locksmith (Vehicle Lockouts, Transponder Key Programming, Key Fob Replacement, Ignition Repair & Replacement).

**Footer Structure**
- D-13: Three-column desktop: Brand (logo + tagline + service area) / Services (all from data source) / Contact (phone, email, availability).
- D-14: Bottom strip: social icons left (Facebook, Instagram, Linktree) + copyright right.
- D-15: Trust signals: "Est. 2016" and "NASTF background-checked employees" in Brand column.
- D-16: Copyright: `© 2026 City Tech, LLC. All rights reserved.`
- D-17: Social platforms: Facebook, Instagram, Linktree. Icon links with `aria-label` only.
- D-18: Mobile footer: single-column stack (Brand → Services → Contact → Social).

### Claude's Discretion
- Exact hex values for `--primary` and `--accent` (sampled from logo at project init)
- Lucide icon assignment per service category
- shadcn component variants used throughout (size, radius, etc.)
- Mobile hamburger animation style (slide-out drawer vs full-screen overlay)
- Exact spacing, typography scale, and border-radius values — keep clean and professional, not trendy

### Deferred Ideas (OUT OF SCOPE)
- Google Business Profile link in footer — v2 when owner confirms profile URL
- Linktree URL — placeholder `#` until owner provides it; same for Facebook and Instagram URLs
- Compustar authorized dealer badge — pending badge usage rights; v2

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Next.js App Router + TypeScript + Tailwind v4 + shadcn/ui + ESLint + Vercel config | create-next-app command, shadcn init flow, postcss config, components.json |
| FOUND-02 | `/data/services.ts` single source of truth | TypeScript shape from D-10, ServiceDefinition type, initial 12 services from D-12 |
| FOUND-03 | Supabase `service_requests` table with all specified fields and status enum | Supabase JS v2 client setup, RLS INSERT policy SQL, exact table DDL |
| FOUND-04 | Resend server action — owner notification on new request | Resend SDK init, Server Action pattern, email.send() API |
| FOUND-05 | `.env.example` with all required env vars | New Supabase key names (publishable vs anon), Resend key name |
| FOUND-06 | Directory structure: /components, /data, /lib, /content/blog, /public/logos | Folder layout from ARCHITECTURE.md + route group pattern |
| LAYOUT-01 | Sticky header with logo / nav / Call Now; mobile hamburger | shadcn NavigationMenu + Sheet patterns, three-zone layout |
| LAYOUT-02 | Global footer: 3-column + social strip | Footer component structure from UI-SPEC |
| LAYOUT-03 | Responsive, mobile-first, 44px touch targets, 16px min font | CSS approach, min-h-[44px] pattern, spacing from UI-SPEC |
| LAYOUT-04 | Blue + white brand system (`--primary #1B3A8F`, `--accent #00AEEF`) | Tailwind v4 `@theme inline` globals.css structure |
| LAYOUT-05 | "Available when you need us" availability messaging | Copy locked in UI-SPEC Copywriting Contract |

</phase_requirements>

---

## Summary

Phase 1 establishes the entire project foundation — no page content, only the shell. The stack is fully resolved with no open choices: Next.js 16 (App Router), Tailwind v4 with CSS-native `@theme inline` tokens, shadcn/ui initialized without a Tailwind config file, Supabase JS v2 for the `service_requests` table, and Resend for owner notification emails. The most important implementation detail uncovered in this research is the Tailwind v4 / shadcn interaction: shadcn now uses `@theme inline` (not `@theme {}`) and places CSS custom properties in `:root` with `hsl()` wrappers rather than inside `@layer base`. The UI-SPEC has already defined a custom token block that adapts this pattern for the City Tech brand — the planner must reconcile the two (merge brand tokens into the shadcn-generated globals.css structure).

The other critical finding is the Supabase API key naming change: new projects (post-November 2025) no longer have `NEXT_PUBLIC_SUPABASE_ANON_KEY` — they use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with an `sb_publishable_...` key form. The `.env.example` and Supabase client files must use the new variable name. The `@supabase/ssr` server client pattern is unchanged.

**Primary recommendation:** Follow the build order — scaffold → postcss → shadcn init → globals.css brand tokens → services.ts → Supabase table → layout shell (header + footer) → env files. Do not deviate from the route group pattern (`app/(marketing)/layout.tsx`) established in ARCHITECTURE.md.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.x (latest via `create-next-app@latest`) | Full-stack React framework, App Router | Official docs at version 16.2.4; Turbopack enabled by default |
| React | 19.x (bundled with Next.js 16) | UI rendering | Ships with Next.js — no separate install decision |
| TypeScript | 5.x | Type safety | Required for Zod, Supabase generated types, mdx-components.tsx |
| Tailwind CSS | v4.x (current stable) | Utility CSS | v4 is production-stable since Jan 2025; no config file; CSS-native tokens |
| @tailwindcss/postcss | v4.x | PostCSS adapter for Next.js + Tailwind v4 | Replaces tailwind.config.js in v4 |
| shadcn/ui | latest (`npx shadcn@latest`) | Component library | CLI v4 (March 2026); full Tailwind v4 + React 19 support confirmed |
| @supabase/supabase-js | ^2.x | Database client | Standard Supabase JS client |
| @supabase/ssr | ^0.x | SSR/cookie helpers for App Router | Required for `createServerClient` in Server Actions |
| resend | latest (`npm show resend version`) | Transactional email | Simple API, 3k/month free tier, React Email optional |

### Phase 1 shadcn Components
| Component | Install Command | Purpose |
|-----------|----------------|---------|
| Button | `npx shadcn@latest add button` | Call Now CTA, footer CTA |
| NavigationMenu | `npx shadcn@latest add navigation-menu` | Desktop nav with Services dropdown |
| Sheet | `npx shadcn@latest add sheet` | Mobile slide-out drawer |

### What NOT to Install in Phase 1
| Library | Reason |
|---------|--------|
| react-hook-form, zod | Phase 3 (form) — not needed for layout shell |
| leaflet, react-leaflet | Phase 3 (map) — not needed in Phase 1 |
| @next/mdx | Phase 3 (blog) — not needed in Phase 1 |
| next-themes | Light mode only — D-02 locks out dark mode entirely |
| tw-animate-css | shadcn init installs what it needs; only add if animations break |

### Installation Commands
```bash
# Step 1: Scaffold (user runs interactively or with flags)
npx create-next-app@latest city-tech --typescript --tailwind --eslint --app --import-alias "@/*"
# When prompted: answer Yes to src-dir? → NO (project uses root-level app/)
# When prompted: Turbopack? → YES (default, keep it)

# Step 2: shadcn init (run after scaffold, inside project directory)
npx shadcn@latest init
# CLI auto-detects Tailwind v4 — no special flag needed
# When prompted: style → new-york (default style is deprecated)
# When prompted: base color → neutral
# When prompted: CSS file → app/globals.css
# components.json is created; tailwind.config field left BLANK (v4 behavior)

# Step 3: Add Phase 1 components
npx shadcn@latest add button navigation-menu sheet

# Step 4: Supabase
npm install @supabase/supabase-js @supabase/ssr

# Step 5: Resend
npm install resend
```

**Version verification at install time:**
```bash
npm show resend version
npm show @supabase/supabase-js version
npm show @supabase/ssr version
```

---

## Architecture Patterns

### Recommended Project Structure

```
app/
├── layout.tsx                     # Root layout — Inter font, global CSS, metadata defaults
├── globals.css                    # Tailwind v4 entry + @theme inline brand tokens
├── (marketing)/
│   ├── layout.tsx                 # Marketing layout — Header + Footer wrapper
│   ├── page.tsx                   # Homepage placeholder (Phase 2)
│   ├── services/[slug]/page.tsx   # Service detail (Phase 2)
│   ├── fleet/page.tsx             # Fleet page (Phase 2)
│   └── request-service/page.tsx   # Request form (Phase 3)
components/
├── layout/
│   ├── Header.tsx                 # Server Component wrapper — renders Nav + CTA
│   ├── MobileNav.tsx              # "use client" — Sheet-based drawer
│   ├── DesktopNav.tsx             # "use client" — NavigationMenu with dropdown
│   └── Footer.tsx                 # Server Component — reads services for links
data/
└── services.ts                    # Single source of truth for all services
lib/
├── supabase/
│   ├── client.ts                  # createBrowserClient (browser — not used in Phase 1)
│   └── server.ts                  # createServerClient (server actions)
└── env.ts                         # Startup env var validation (throws on missing)
public/
├── logo.svg                       # Placeholder SVG — swap on brand delivery
└── logos/                         # Client logos directory (Phase 2)
content/
└── blog/                          # MDX blog posts (Phase 3)
.env.example                       # Documented env vars
.env.local                         # Local secrets — gitignored
```

### Pattern 1: Tailwind v4 globals.css with shadcn + City Tech Brand Tokens

shadcn's `init` now generates a `@theme inline` block (not `@theme {}`). The `inline` keyword tells Tailwind v4 to expose these as utility classes without creating new CSS custom properties — the CSS variables are already declared in `:root`. The City Tech brand requires merging the shadcn-generated token structure with the custom brand blues from UI-SPEC.

**What shadcn@latest init generates (Tailwind v4):**
```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(0 0% 3.9%);
  --primary: hsl(221 83% 53%);
  /* ... all shadcn tokens in hsl() format ... */
  --radius: 0.5rem;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* ... all --color-* mappings ... */
  --radius-sm: calc(var(--radius) - 4px);
}
```

**City Tech override — replace the `:root` block with brand values (do NOT add a second @theme inline):**
```css
@import "tailwindcss";
@import "tw-animate-css";

/* No dark mode — D-02 */

:root {
  /* Brand blues — sampled from City Tech logo at project init */
  --background: #FFFFFF;
  --foreground: #111827;
  --muted: #F3F4F6;
  --muted-foreground: #6B7280;
  --primary: #1B3A8F;          /* Dark royal blue — van body, wordmark */
  --primary-foreground: #FFFFFF;
  --accent: #00AEEF;           /* Cyan/sky blue — key graphic, Est. 2016 */
  --accent-foreground: #FFFFFF;
  --card: #FFFFFF;
  --card-foreground: #111827;
  --popover: #FFFFFF;
  --popover-foreground: #111827;
  --secondary: #F3F4F6;
  --secondary-foreground: #111827;
  --destructive: #DC2626;
  --destructive-foreground: #FFFFFF;
  --border: #E5E7EB;
  --input: #E5E7EB;
  --ring: #1B3A8F;
  --radius: 0.375rem;          /* 6px — professional, not pill */
}

@theme inline {
  /* shadcn semantic mappings — Tailwind generates bg-background, text-primary, etc. */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Brand-specific direct tokens (for one-off usage not covered by shadcn) */
  --color-brand-primary: #1B3A8F;
  --color-brand-accent: #00AEEF;

  /* Radius scale */
  --radius-sm: calc(var(--radius) - 2px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 2px);

  /* Font */
  --font-sans: var(--font-inter);
}
```

**Key rule:** Do NOT add a `.dark {}` block anywhere. Light mode only (D-02). Delete any `.dark` block shadcn init generates.

### Pattern 2: Inter Font Loading

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
```

The `variable: '--font-inter'` makes the font available as `var(--font-inter)`, which is referenced by `--font-sans` in the `@theme inline` block above.

### Pattern 3: Route Group for Marketing Layout

```tsx
// app/(marketing)/layout.tsx
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  )
}
```

The route group `(marketing)` does NOT appear in the URL — `/services/[slug]` not `/(marketing)/services/[slug]`. This is the correct pattern for shared header/footer.

### Pattern 4: Header with Server/Client Split

NavigationMenu (Radix-based) and Sheet both require `"use client"` because they use state for open/close. The Header **wrapper** is a Server Component that imports the client islands.

```tsx
// components/layout/Header.tsx  — Server Component (NO "use client")
import Link from 'next/link'
import Image from 'next/image'
import DesktopNav from './DesktopNav'
import MobileNav from './MobileNav'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo zone */}
        <Link href="/" aria-label="City Tech — home">
          <Image src="/logo.svg" alt="City Tech — Mobile Automotive Locksmith and Electronics Service" height={40} width={120} priority />
        </Link>

        {/* Desktop nav — client island */}
        <DesktopNav />

        {/* CTA zone */}
        <div className="flex items-center gap-3">
          <a href="tel:+15555555555" aria-label="Call City Tech at (555) 555-5555" className="hidden text-sm font-semibold text-primary md:block">
            (555) 555-5555
          </a>
          {/* Call Now button — Phase 2 adds the full button component */}
          {/* MobileNav contains hamburger + Sheet drawer */}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
```

```tsx
// components/layout/DesktopNav.tsx  — "use client" required for NavigationMenu
'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { services } from '@/data/services'
import Link from 'next/link'

const electronics = services.filter(s => s.category === 'electronics')
const locksmith = services.filter(s => s.category === 'locksmith')

export default function DesktopNav() {
  return (
    <nav aria-label="Main navigation" className="hidden md:flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Services</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid grid-cols-2 gap-4 p-4 w-[500px] bg-muted">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Electronics</p>
                  {electronics.map(s => (
                    <NavigationMenuLink asChild key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="block py-1 text-sm text-foreground hover:text-primary">
                        {s.name}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Locksmith</p>
                  {locksmith.map(s => (
                    <NavigationMenuLink asChild key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="block py-1 text-sm text-foreground hover:text-primary">
                        {s.name}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/fleet" className="text-sm text-foreground hover:text-primary px-3 py-2">Fleet</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/request-service" className="text-sm text-foreground hover:text-primary px-3 py-2">Request Service</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}
```

```tsx
// components/layout/MobileNav.tsx  — "use client" required for Sheet
'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import Link from 'next/link'
import Image from 'next/image'
import { services } from '@/data/services'

const electronics = services.filter(s => s.category === 'electronics')
const locksmith = services.filter(s => s.category === 'locksmith')

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Phone number visible on mobile */}
      <a href="tel:+15555555555" aria-label="Call City Tech" className="text-sm font-semibold text-primary md:hidden">
        (555) 555-5555
      </a>
      <button
        onClick={() => setOpen(true)}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        className="ml-2 flex min-h-[44px] min-w-[44px] items-center justify-center md:hidden"
      >
        <Menu size={24} />
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="border-b border-border p-4">
            <Image src="/logo.svg" alt="City Tech" height={32} width={100} />
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          </SheetHeader>
          <nav aria-label="Mobile navigation" className="flex flex-col">
            <div className="border-b border-border p-4">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Electronics</p>
              {electronics.map(s => (
                <Link key={s.slug} href={`/services/${s.slug}`} onClick={() => setOpen(false)}
                  className="block min-h-[44px] items-center py-3 text-base text-foreground">
                  {s.name}
                </Link>
              ))}
            </div>
            <div className="border-b border-border p-4">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Locksmith</p>
              {locksmith.map(s => (
                <Link key={s.slug} href={`/services/${s.slug}`} onClick={() => setOpen(false)}
                  className="block min-h-[44px] items-center py-3 text-base text-foreground">
                  {s.name}
                </Link>
              ))}
            </div>
            <Link href="/fleet" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center border-b border-border px-4 text-base text-foreground">Fleet</Link>
            <Link href="/request-service" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center border-b border-border px-4 text-base text-foreground">Request Service</Link>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
```

### Pattern 5: `/data/services.ts` Type and Initial Data

```typescript
// data/services.ts
export interface ServiceDefinition {
  slug: string
  name: string
  shortDescription: string
  category: 'electronics' | 'locksmith'
  featured: boolean
  order: number
  pageContent: {
    problem: string
    solution: string
    process: string[]
  }
}

export const services: ServiceDefinition[] = [
  // Electronics
  {
    slug: 'car-audio-installation',
    name: 'Car Audio Installation',
    shortDescription: 'Professional car stereo, speaker, and amplifier installation for any vehicle.',
    category: 'electronics',
    featured: true,
    order: 1,
    pageContent: {
      problem: 'Your factory stereo sounds flat and lacks the features you need.',
      solution: 'City Tech installs premium aftermarket audio systems — head units, speakers, subwoofers, and amplifiers — tailored to your vehicle.',
      process: ['We assess your vehicle and discuss your audio goals', 'We source and install compatible components', 'We tune the system and verify full functionality before we leave'],
    },
  },
  // ... remaining 11 services with similar structure
]

// Utility helpers downstream components use
export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return services.find(s => s.slug === slug)
}

export function getServicesByCategory(category: ServiceDefinition['category']): ServiceDefinition[] {
  return services.filter(s => s.category === category).sort((a, b) => a.order - b.order)
}
```

All 12 services from D-12 must be entered. The planner should task the implementor to write all 12 entries — do not leave as `// ... remaining` in the actual file.

### Pattern 6: Supabase Client Files

**Important:** New Supabase projects (post-November 2025) use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (key format `sb_publishable_...`) instead of `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The variable name MUST match what the Supabase dashboard shows. The client code is otherwise identical.

```typescript
// lib/supabase/client.ts  — browser client (future use; not called in Phase 1)
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

```typescript
// lib/supabase/server.ts  — server-only; used in Server Actions
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from Server Component — reads are fine, writes are ignored
          }
        },
      },
    }
  )
}
```

Note: `cookies()` is now `async` in Next.js 15+. The `createClient()` function must be `async` and awaited at call sites.

### Pattern 7: Supabase `service_requests` Table DDL

```sql
-- Run in Supabase SQL Editor
CREATE TYPE service_request_status AS ENUM (
  'pending', 'contacted', 'quoted', 'scheduled', 'completed', 'cancelled'
);

CREATE TABLE service_requests (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name                TEXT NOT NULL,
  phone               TEXT NOT NULL,
  email               TEXT,
  vehicle_year        TEXT,
  vehicle_make        TEXT,
  vehicle_model       TEXT,
  services_requested  TEXT[] NOT NULL DEFAULT '{}',
  service_location    TEXT,
  preferred_datetime  TEXT,
  description         TEXT,
  referral_source     TEXT,
  status              service_request_status NOT NULL DEFAULT 'pending',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS (required — table is publicly writable)
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous INSERT (required — form submits without auth)
CREATE POLICY "Allow anonymous insert"
  ON service_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Deny anonymous SELECT, UPDATE, DELETE (default deny is fine — add no extra policies)
```

### Pattern 8: Resend Server Action (stub — Phase 1 creates the file; Phase 3 wires the form)

```typescript
// lib/actions/submitServiceRequest.ts
'use server'

import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface ServiceRequestPayload {
  name: string
  phone: string
  email?: string
  vehicle_year?: string
  vehicle_make?: string
  vehicle_model?: string
  services_requested: string[]
  service_location?: string
  preferred_datetime?: string
  description?: string
  referral_source?: string
}

export async function submitServiceRequest(payload: ServiceRequestPayload) {
  const supabase = await createClient()

  // Insert — use .select('id') to detect silent RLS failures
  const { data, error } = await supabase
    .from('service_requests')
    .insert(payload)
    .select('id')

  if (error) throw new Error(`Database error: ${error.message}`)
  if (!data || data.length === 0) {
    throw new Error('Insert returned no row — verify Supabase anon INSERT policy is active')
  }

  // Owner notification email
  await resend.emails.send({
    from: 'City Tech <noreply@your-verified-domain.com>',  // replace with verified domain
    to: 'owner@citytech.com',  // replace with owner email
    subject: `New Service Request from ${payload.name}`,
    html: `
      <h2>New Service Request</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Phone:</strong> ${payload.phone}</p>
      <p><strong>Email:</strong> ${payload.email ?? 'Not provided'}</p>
      <p><strong>Vehicle:</strong> ${payload.vehicle_year} ${payload.vehicle_make} ${payload.vehicle_model}</p>
      <p><strong>Services:</strong> ${payload.services_requested.join(', ')}</p>
      <p><strong>Location:</strong> ${payload.service_location ?? 'Not provided'}</p>
      <p><strong>Preferred time:</strong> ${payload.preferred_datetime ?? 'Flexible'}</p>
      <p><strong>Notes:</strong> ${payload.description ?? 'None'}</p>
      <p><strong>Referred by:</strong> ${payload.referral_source ?? 'Not specified'}</p>
    `,
  })

  return { success: true }
}
```

### Pattern 9: Environment Validation

```typescript
// lib/env.ts
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'RESEND_API_KEY',
] as const

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}
```

Call this in `instrumentation.ts` (project root) so it runs at startup — not per-request.

### Pattern 10: .env.example

```bash
# Supabase — get from Supabase dashboard > Project Settings > API
# New projects use PUBLISHABLE key (sb_publishable_...) not legacy ANON key
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here

# Resend — get from resend.com/api-keys
# NEVER prefix with NEXT_PUBLIC_ — server-only
RESEND_API_KEY=re_your_key_here
```

### Pattern 11: Skip-to-Content + Root Layout Accessibility Shell

```tsx
// app/layout.tsx (complete)
import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | City Tech',
    default: 'City Tech — Mobile Automotive Locksmith and Electronics Service',
  },
  description: 'Mobile automotive locksmith and electronics services for the DC, Maryland, and Virginia region.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-foreground antialiased min-h-screen">
        {/* Skip-to-content — accessibility requirement from UI-SPEC */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
```

### Pattern 12: Footer Structure

```tsx
// components/layout/Footer.tsx  — Server Component (reads services)
import Link from 'next/link'
import Image from 'next/image'
import { services } from '@/data/services'

export default function Footer() {
  const electronics = services.filter(s => s.category === 'electronics').sort((a, b) => a.order - b.order)
  const locksmith = services.filter(s => s.category === 'locksmith').sort((a, b) => a.order - b.order)

  return (
    <footer className="bg-muted">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Three-column grid — single column on mobile */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand column */}
          <div>
            <Image src="/logo.svg" alt="City Tech" height={40} width={120} />
            <p className="mt-3 text-sm text-muted-foreground">Mobile Automotive Locksmith and Electronics Service</p>
            <p className="mt-1 text-sm text-foreground">Serving DC, Maryland &amp; Virginia</p>
            <div className="mt-4 space-y-1">
              <p className="text-sm font-semibold text-accent">Est. 2016</p>
              <p className="text-sm text-foreground">NASTF Background-Checked Employees</p>
            </div>
          </div>

          {/* Services column */}
          <nav aria-label="Footer navigation">
            <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Our Services</p>
            <ul className="space-y-1">
              {[...electronics, ...locksmith].map(s => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-sm text-foreground hover:underline decoration-accent">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact column */}
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Contact</p>
            <a href="tel:+15555555555" className="text-base font-semibold text-primary">
              (555) 555-5555
            </a>
            <p className="mt-2 text-sm text-muted-foreground">Available when you need us</p>
            <p className="mt-1 text-sm text-muted-foreground">DC, Maryland &amp; Virginia</p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <div className="flex gap-4">
            <a href="#" aria-label="City Tech on Facebook" className="text-muted-foreground hover:text-primary transition-colors">
              {/* Lucide Facebook icon — 20px */}
            </a>
            <a href="#" aria-label="City Tech on Instagram" className="text-muted-foreground hover:text-primary transition-colors">
              {/* Lucide Instagram icon — 20px */}
            </a>
            <a href="#" aria-label="City Tech on Linktree" className="text-muted-foreground hover:text-primary transition-colors">
              {/* LT text fallback until Linktree SVG is sourced */}
              <span className="text-sm font-semibold">LT</span>
            </a>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 City Tech, LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
```

### Anti-Patterns to Avoid

- **"use client" on `app/(marketing)/layout.tsx`**: Header and Footer are Server Components. Only DesktopNav and MobileNav need "use client". Mark only the deepest interactive leaf.
- **No `tailwind.config.js` for Tailwind v4**: The shadcn init leaves this field blank in components.json. Do not create a tailwind.config.js file.
- **Dark mode variables in globals.css**: D-02 locks light mode only. Delete any `.dark {}` block that shadcn init generates.
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY` on new projects**: New Supabase projects use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Using the old variable name will result in `undefined` at runtime.
- **Synchronous `cookies()` in server.ts**: Next.js 15+ makes `cookies()` async. Must `await cookies()` and make the function `async`.
- **Hardcoding service names in Header or Footer**: Both components must read from `services` array imported from `/data/services.ts`. No hardcoded service name strings outside that file.
- **`@theme {}` instead of `@theme inline {}`**: The new shadcn v4 pattern uses `@theme inline`. Using `@theme {}` without `inline` creates new CSS custom properties instead of exposing existing ones to utilities — wrong behavior.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible dropdown nav | Custom `<div>` dropdown with JS | shadcn `NavigationMenu` (Radix) | Keyboard navigation, ARIA, focus management, screen reader support — all handled |
| Mobile slide-out drawer | Custom translate/position drawer | shadcn `Sheet` | Focus trap, Escape key close, ARIA dialog role, overlay dismiss — all handled |
| Button variants | Custom `<button>` with class logic | shadcn `Button` | Consistent variant/size system, focus ring, disabled state |
| SSR-safe font loading | Manual font link tags | `next/font/google` | Automatic preload, no FOUT, self-hosted at build time, no external requests |
| Env var validation boilerplate | Ad-hoc `if (!process.env.X)` checks | Centralized `lib/env.ts` + `instrumentation.ts` | Single source of truth; runs once at startup; loud failure before any request |
| Image optimization | Plain `<img>` tags | `next/image` | WebP conversion, lazy loading, prevents layout shift with known dimensions |

**Key insight:** The shadcn component library eliminates the accessibility complexity of dropdown and drawer components. Radix UI (underlying Leaflet) handles a11y primitives that take weeks to hand-roll correctly.

---

## Common Pitfalls

### Pitfall 1: shadcn init generates `.dark {}` — delete it
**What goes wrong:** `npx shadcn@latest init` generates `.dark { ... }` CSS variable overrides. If left in place, the dark mode variant `.dark` will be applied when `next-themes` or a class is set — even though D-02 prohibits dark mode.
**Why it happens:** shadcn defaults to supporting dark mode.
**How to avoid:** After running `shadcn init`, open `app/globals.css` and delete the entire `.dark { ... }` block. Also delete the `@custom-variant dark (...)` line if present.
**Warning signs:** Component backgrounds invert unexpectedly when `prefers-color-scheme: dark` is active.

### Pitfall 2: Supabase RLS silently drops anonymous inserts
**What goes wrong:** `service_requests` has RLS enabled but no INSERT policy for `anon`. Insert returns `{ data: null, error: null }` — no error, no row, no email.
**Why it happens:** Missing policy = silent permission deny.
**How to avoid:** Run the CREATE POLICY SQL from Pattern 7 immediately after creating the table. In the Server Action, use `.select('id')` and throw if `data.length === 0`.
**Warning signs:** Form appears to submit successfully but Supabase table stays empty.

### Pitfall 3: `NEXT_PUBLIC_SUPABASE_ANON_KEY` — wrong variable name for new projects
**What goes wrong:** New Supabase projects (post-November 2025) use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Using the old name results in `undefined` being passed to `createBrowserClient` / `createServerClient`, which silently fails.
**Why it happens:** Supabase changed key naming in their new key system launched June 2025.
**How to avoid:** Check the Supabase dashboard > Project Settings > API for the actual key name and value. Use whatever the dashboard shows.
**Warning signs:** All Supabase queries fail with authentication errors despite correct code.

### Pitfall 4: `@theme {}` vs `@theme inline {}` — wrong block keyword
**What goes wrong:** Using `@theme {}` without `inline` tells Tailwind v4 to create new CSS custom properties (doubling up). `@theme inline {}` tells Tailwind to reference existing CSS properties declared in `:root` and expose them as utility classes (`bg-primary`, `text-accent`, etc.).
**Why it happens:** The v4 docs and older blog posts show `@theme {}` without `inline` — that was the early v4 syntax. The shadcn v4 integration uses `@theme inline`.
**How to avoid:** Always write `@theme inline {` — never `@theme {` for the shadcn token block.
**Warning signs:** Tailwind utility classes like `bg-primary` don't map to the correct color.

### Pitfall 5: `cookies()` synchronous call in Next.js 15+ Supabase server client
**What goes wrong:** `const cookieStore = cookies()` (synchronous) throws a warning or error in Next.js 15+. The `cookies()` function is now async and must be awaited.
**Why it happens:** Next.js 15 made Dynamic APIs like `cookies()`, `headers()`, and `params` async.
**How to avoid:** Use `const cookieStore = await cookies()` and make the enclosing function `async`.
**Warning signs:** Build warning: "cookies() should be awaited before using its value."

### Pitfall 6: "use client" placed on layout or page instead of leaf component
**What goes wrong:** Placing `"use client"` on `app/(marketing)/layout.tsx` or `Header.tsx` converts the entire page subtree to client rendering, defeating Server Components.
**Why it happens:** NavigationMenu triggers "X needs use client" error, developer adds directive to the nearest ancestor.
**How to avoid:** Only `DesktopNav.tsx` and `MobileNav.tsx` get `"use client"`. `Header.tsx` and `Footer.tsx` remain Server Components that import the client islands.
**Warning signs:** Page bundle size is unexpectedly large. Layout files have "use client" at top.

### Pitfall 7: Resend from-address domain not verified
**What goes wrong:** Resend API returns 200 but emails land in spam or are rejected entirely without SPF/DKIM records on the sending domain.
**Why it happens:** DNS verification takes time — not an instant operation.
**How to avoid:** Phase 1 creates the stub action. DNS verification is an operational step the owner must complete before Phase 3 go-live. Use `@resend.dev` sender during development.
**Warning signs:** Resend dashboard shows "Delivered" but email is not in inbox.

---

## Environment Availability

> Phase 1 is greenfield code — dependencies are npm packages, not external services that need to be running locally. The Supabase instance is cloud-hosted. No local services need to be running.

| Dependency | Required By | Available | Notes |
|------------|------------|-----------|-------|
| Node.js / npm | All npm installs | User-managed | CLAUDE.md: Node is NOT available in bash on this machine — user runs all npm commands |
| Supabase cloud project | FOUND-03, FOUND-04 | Owner must create | Free tier sufficient; create at supabase.com before running migrations |
| Resend account | FOUND-04 | Owner must create | Free tier (3k/month) at resend.com; domain verification deferred to Phase 3 launch |
| Vercel account | Deployment | Owner must create | Free hobby tier at vercel.com; env vars added manually in dashboard |

**Critical constraint from CLAUDE.md:** Node.js is NOT available in bash on this Windows machine. All `npm install`, `npx create-next-app`, and `npx shadcn` commands must be presented as commands for the **user to run manually**, not as automated bash steps.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` + `@apply` | CSS-native `@theme inline {}` in globals.css | Jan 2025 (Tailwind v4 stable) | No config file; theme tokens are plain CSS variables |
| shadcn `@layer base { :root { --color: 0 0% 100% } }` + Tailwind resolve | `:root { --color: hsl(0 0% 100%) }` + `@theme inline { --color-*: var(--*) }` | Feb 2025 (shadcn Tailwind v4 update) | hsl() wrapper moves to CSS; @theme inline maps to utility classes |
| `tailwindcss-animate` | `tw-animate-css` | Feb 2025 (shadcn deprecation) | shadcn init now installs `tw-animate-css`; do NOT add `tailwindcss-animate` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Jun 2025 (Supabase new key system) | New projects use `sb_publishable_...` keys; old `anon` key deprecated |
| `cookies()` synchronous | `await cookies()` | Next.js 15 (Oct 2024) | Dynamic APIs are now async; synchronous usage throws warnings |
| `forwardRef` in shadcn components | Direct `ComponentProps` + `data-slot` attributes | Feb 2025 (shadcn v4 update) | Generated component code differs; not a usage concern for consumers |
| shadcn `default` style | `new-york` style | 2025 (default style deprecated) | Run `npx shadcn@latest init` and select `new-york`; `default` is deprecated |

---

## Open Questions

1. **Exact Supabase key name on the owner's project**
   - What we know: Post-November-2025 Supabase projects use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; pre-November-2025 projects may still show `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - What's unclear: The owner has not yet created a Supabase project — we don't know which key format they will see
   - Recommendation: Document both in `.env.example` with a comment; implementor checks the Supabase dashboard and uses whichever key name matches

2. **Logo file delivery**
   - What we know: Build proceeds with SVG placeholder at `/public/logo.svg`; real logo is a PNG on file with the owner
   - What's unclear: Actual hex values for `--primary` and `--accent` (D-01 says approximate targets are `#1B3A8F` / `#00AEEF`)
   - Recommendation: Phase 1 uses the approximate hex values from UI-SPEC; owner samples exact values from logo PNG with a color picker and updates globals.css before Phase 2 review

3. **Owner email address for Resend `to:` field**
   - What we know: Placeholder used during build
   - What's unclear: Owner's preferred notification email
   - Recommendation: Use a `OWNER_EMAIL` constant in the Server Action file with a clearly marked placeholder comment

---

## Sources

### Primary (HIGH confidence)
- Next.js 16.2.4 official docs — create-next-app CLI flags (verified 2026-04-19): https://nextjs.org/docs/app/api-reference/cli/create-next-app
- shadcn/ui Tailwind v4 docs — @theme inline pattern, migration from v3: https://ui.shadcn.com/docs/tailwind-v4
- shadcn/ui NavigationMenu docs — component structure, asChild pattern: https://ui.shadcn.com/docs/components/navigation-menu
- shadcn/ui Sheet docs — side prop, focus management, use client requirement: https://ui.shadcn.com/docs/components/sheet
- shadcn/ui components.json docs — tailwind.config blank for v4: https://ui.shadcn.com/docs/components-json
- Resend + Next.js docs — SDK init, emails.send() API: https://resend.com/docs/send-with-nextjs
- Supabase SSR + Next.js App Router docs — createServerClient, cookie pattern: https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase API key migration docs — publishable key vs anon key: https://github.com/orgs/supabase/discussions/29260

### Secondary (MEDIUM confidence)
- shadcn changelog — Tailwind v4 added Feb 2025, CLI v4 released March 2026: https://ui.shadcn.com/docs/changelog
- Supabase new API key system — June 2025 launch: https://supabase.com/docs/guides/api/api-keys
- shadcn + Tailwind v4 theming walkthrough (cross-verified with official docs): https://medium.com/@joseph.goins/theming-shadcn-with-tailwind-v4-and-css-variables-d602f6b3c258
- Prior domain research (STACK.md, ARCHITECTURE.md, PITFALLS.md) — all HIGH confidence from 2026-04-19

### Tertiary (LOW confidence — flag at install time)
- Exact resend package version: verify with `npm show resend version` at install
- Exact @supabase/supabase-js version: verify with `npm show @supabase/supabase-js version` at install

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — official docs verified for all core packages
- Architecture: HIGH — route group, Server/Client split, data flow all from official Next.js docs
- shadcn + Tailwind v4 integration: HIGH — official shadcn docs and changelog confirm current behavior
- Supabase key naming: MEDIUM — documentation clear, but owner's project creation date determines which key format they see
- Pitfalls: HIGH — all pitfalls verified from official docs or well-established community patterns

**Research date:** 2026-04-19
**Valid until:** 2026-07-19 (stable stack; shadcn CLI and Supabase key docs subject to change)
