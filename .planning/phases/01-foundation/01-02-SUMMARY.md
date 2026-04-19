---
plan: 01-02
phase: 01-foundation
status: complete
completed: 2026-04-19
---

## What Was Built

**Services data model, Supabase client utilities, Resend server action.**

Files created:
- `data/services.ts` — 12 services (8 electronics + 4 locksmith), full pageContent, getServiceBySlug/getServicesByCategory helpers
- `lib/supabase/client.ts` — Browser Supabase client
- `lib/supabase/server.ts` — Server-only async client (await cookies() for Next.js 15+)
- `lib/actions/submitServiceRequest.ts` — Server Action with Resend notification + RLS silent-failure guard

## Services Confirmed

Electronics (8): Car Audio Installation, Car Alarms, Mobile Video Systems, Backup Cameras, Remote Start Systems, Navigation Systems, Security & Tracking Systems, Compustar Products

Locksmith (4): Vehicle Lockouts, Transponder Key Programming, Key Fob Replacement, Ignition Repair & Replacement

Featured (4): car-audio-installation, remote-start-systems, vehicle-lockouts, transponder-key-programming

No icon field in any service object — Lucide icons assigned at UI layer per category.

## Supabase Setup (Pending User Action)

The following SQL must be run in the Supabase Dashboard SQL Editor before the form (Phase 3) can be used:

```sql
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

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert"
  ON service_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

Also update `.env.local` with real Supabase URL and publishable key before Phase 3.

## Deviations

None — all files match the plan exactly.

## Verification

- TypeScript: 0 errors
- All 12 services present, 8 electronics + 4 locksmith
- No icon field in any service
- server.ts uses `async createClient()` with `await cookies()`
- submitServiceRequest uses `.select('id')` + length check for RLS guard
