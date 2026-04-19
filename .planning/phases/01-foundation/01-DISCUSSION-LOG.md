# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-19
**Phase:** 01-foundation
**Areas discussed:** Brand color system, Header layout, Services data shape, Footer structure

---

## Brand Color System

| Option | Description | Selected |
|--------|-------------|----------|
| Deep navy / dark blue | Trust, authority — e.g., #1e3a5f | |
| Royal / medium blue | Confident, clear — e.g., #2563eb | |
| Match the logo exactly | Use hex values from the actual logo file | ✓ |

**User's choice:** Match the logo exactly — two-tone blue system (dark royal blue + cyan) from the provided logo PNG.

**Notes:** User shared the actual logo files (PNG). Logo contains two blues: dark royal blue for the van/wordmark and cyan/sky blue for the key graphic and "Est. 2016" text. The accent color question resolved by the logo — cyan is already the defined accent.

| Accent option | Selected |
|---------------|----------|
| No accent — blue + white only | |
| Yes, add an accent | ✓ |

**Accent:** Cyan/sky blue from the logo key graphic. Not a separate design choice — extracted from existing brand asset.

| Dark mode | Selected |
|-----------|----------|
| Light mode only | ✓ |
| Dark mode toggle | |
| Dark-primary design | |

---

## Header Layout

| Structure | Selected |
|-----------|----------|
| Logo left / nav center / phone right | ✓ |
| Logo left / phone + CTA right, nav below | |
| Logo left / everything right | |

| Mobile nav | Selected |
|------------|----------|
| Hamburger menu | ✓ |
| Phone button only | |
| Bottom navigation bar | |

| Phone CTA label | Selected |
|----------------|----------|
| Phone number only | |
| "Call Now" + number | ✓ |
| "Get Help Now" | |

| Nav pages | Selected |
|-----------|----------|
| Services (dropdown) | ✓ |
| Fleet | ✓ |
| Blog | |
| Request Service | ✓ |

| Services nav behavior | Selected |
|----------------------|----------|
| Dropdown from data source | ✓ |
| Links to /services page | |
| Both dropdown + overview page | |

---

## Services Data Shape

| Additional fields | Selected |
|------------------|----------|
| longDescription / page content | |
| Icon or image reference | |
| category (Electronics / Locksmith) | ✓ |
| featured flag + display order | ✓ |

**Notes:** longDescription not selected — handled via `pageContent` object (Claude's discretion on structure). Icon not selected — Lucide icons used at UI layer, not stored in data model.

| Category grouping | Selected |
|------------------|----------|
| Electronics & Locksmith | ✓ |
| Flat list | |
| Three groups | |

---

## Footer Structure

| Column layout | Selected |
|--------------|----------|
| 3 columns + social row | ✓ |
| 4 columns + social row | |

**User question during discussion:** "Should this also include a way to get to the Facebook, Instagram, or a Linktree?" → Yes, added to social row.

| Footer extras | Selected |
|--------------|----------|
| "Est. 2016" + NASTF mention | ✓ |
| "Serving DC, Maryland & Virginia" | ✓ |
| Copyright line | ✓ |
| Social media links | ✓ |

| Social platforms | Selected |
|-----------------|----------|
| Facebook | ✓ |
| Instagram | ✓ |
| Linktree | ✓ |
| Google Business Profile | |

---

## Claude's Discretion

- Exact hex values sampled from logo at project init
- Lucide icon selection per service category
- shadcn component variants and sizing
- Mobile hamburger animation style
- Typography scale, spacing, border-radius

## Deferred Ideas

- Google Business Profile footer link — add when owner provides URL
- Social platform URLs (Facebook, Instagram, Linktree) — placeholders during build
- Compustar badge — v2 after usage rights confirmed
