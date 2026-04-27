'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { services } from '@/data/services'

const electronics = services.filter(s => s.category === 'electronics').sort((a, b) => a.order - b.order)
const locksmith = services.filter(s => s.category === 'locksmith').sort((a, b) => a.order - b.order)

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-2 md:hidden">
      {/* Phone number — always visible in mobile header (D-06) */}
      <a
        href="tel:+17033436234"
        aria-label="Call City Tech"
        className="text-sm font-semibold text-primary transition-colors hover:text-accent"
      >
        (703) 343-6234
      </a>

      {/* Hamburger button — min 44px touch target (LAYOUT-03) */}
      <button
        onClick={() => setOpen(true)}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
      >
        <Menu size={24} aria-hidden="true" />
      </button>

      {/* Sheet drawer — slides in from left (D-06) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="border-b border-border p-4">
            <Image
              src="/logos/New-citytech-logo.jpeg"
              alt="City Tech — Mobile Automotive Locksmith and Electronics Service"
              height={52}
              width={200}
              className="h-10 w-auto max-w-[180px] object-contain"
            />
            {/* Visually hidden title for screen reader context */}
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          </SheetHeader>

          <nav aria-label="Mobile navigation" className="flex flex-col overflow-y-auto">

            {/* Locksmith services */}
            <div className="border-b border-border p-4">
              <p className="mb-2 text-xs font-normal uppercase tracking-[0.08em] text-muted-foreground">
                Locksmith
              </p>
              {locksmith.map(s => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center py-2 text-base text-foreground transition-colors hover:text-primary"
                >
                  {s.name}
                </Link>
              ))}
            </div>

            {/* Electronics services */}
            <div className="border-b border-border p-4">
              <p className="mb-2 text-xs font-normal uppercase tracking-[0.08em] text-muted-foreground">
                Electronics
              </p>
              {electronics.map(s => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center py-2 text-base text-foreground transition-colors hover:text-primary"
                >
                  {s.name}
                </Link>
              ))}
            </div>

            {/* Top-level nav links */}
            <Link
              href="/fleet"
              onClick={() => setOpen(false)}
              className="flex min-h-[44px] items-center border-b border-border px-4 text-base text-foreground transition-colors hover:text-primary"
            >
              Fleet
            </Link>
            <Link
              href="/request-service"
              onClick={() => setOpen(false)}
              className="flex min-h-[44px] items-center border-b border-border px-4 text-base text-foreground transition-colors hover:text-primary"
            >
              Request Service
            </Link>

            {/* Call Now in drawer */}
            <a
              href="tel:+17033436234"
              aria-label="Call City Tech at (703) 343-6234"
              className="flex min-h-[44px] items-center bg-primary px-4 text-base font-semibold text-primary-foreground transition-colors hover:brightness-110"
            >
              Call Now: (703) 343-6234
            </a>

          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
