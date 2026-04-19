# City Tech — Claude Code Guide

## Project

Mobile automotive locksmith and electronics marketing site for City Tech, LLC (DMV region). Primary goal: lead generation via service request form.

**Stack:** Next.js App Router · Tailwind v4 · shadcn/ui · Supabase · React Hook Form + Zod · Resend · MDX · Vercel

## GSD Workflow

This project uses the GSD planning system. Planning artifacts live in `.planning/`.

| File | Purpose |
|------|---------|
| `.planning/PROJECT.md` | Project context, goals, constraints |
| `.planning/REQUIREMENTS.md` | 41 v1 requirements with REQ-IDs |
| `.planning/ROADMAP.md` | 3-phase roadmap |
| `.planning/STATE.md` | Current progress |

**Current phase:** Phase 1 — Foundation (not started)

### Commands
- `/gsd:plan-phase 1` — plan Phase 1 before building
- `/gsd:progress` — check current state and route to next action
- `/gsd:discuss-phase 1` — discuss approach before planning

## Architecture Rules

**Services data model is the spine.** `/data/services.ts` drives: dynamic route generation, homepage grid, nav, and sitemap. Never hardcode service names elsewhere.

**Server Actions over API routes.** Form submissions go through `"use server"` actions — no `/api/` route files for the request form.

**Push `"use client"` to leaf nodes.** Never place it on layouts or page files. Interactive components (form, carousel) are islands inside static Server Component pages.

**Leaflet needs `dynamic(..., { ssr: false })`.** If a map is ever added, this is non-negotiable.

## Critical Pitfalls

- **Supabase RLS silent failure:** A missing anon INSERT policy returns `{ data: null, error: null }` — check both, not just `error`
- **Resend DNS:** SPF/DKIM must be configured before go-live or owner emails go to spam
- **Tailwind v4:** No `tailwind.config.js` — use `@theme {}` in CSS and `@import "tailwindcss"` as the entry point

## Services (Initial List)

Car audio installation, car alarms, mobile video, backup cameras, remote starters, navigation systems, security/tracking systems, vehicle lockouts, transponder key programming, key fob replacement, ignition repair/replacement.

Data source: `/data/services.ts` (to be created in Phase 1)

## Brand

- **Colors:** Blue and white (logo pending delivery)
- **Tone:** Clean, professional, trustworthy — skilled trade, not startup
- **Audience:** Broad age range — prioritize readability over trendy patterns
- **Availability:** "Available when you need us" (not "24/7")
- **Trust signals:** Years in business, licensed & insured, NASTF background-checked employees

## Environment Variables

See `.env.example` (created in Phase 1). Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
