import Link from 'next/link'
import Image from 'next/image'
import { services } from '@/data/services'

export default function Footer() {
  const electronics = services
    .filter(s => s.category === 'electronics')
    .sort((a, b) => a.order - b.order)
  const locksmith = services
    .filter(s => s.category === 'locksmith')
    .sort((a, b) => a.order - b.order)

  return (
    <footer className="bg-muted">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">

        {/* Three-column grid — single column on mobile (D-13, D-18) */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          {/* Brand column (D-13) */}
          <div>
            <Image
              src="/logos/New-citytech-logo.jpeg"
              alt="City Tech — Mobile Automotive Locksmith and Electronics Service"
              height={64}
              width={240}
              sizes="240px"
              className="h-16 w-auto object-contain"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Mobile Automotive Locksmith and Electronics Service
            </p>
            <p className="mt-1 text-sm text-foreground">
              Serving DC, Maryland &amp; Virginia
            </p>
            {/* Trust signals (D-15) */}
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-accent">Est. 2016</p>
              <div className="flex items-center gap-3">
                <Image
                  src="/logos/NASTF-Logo.webp"
                  alt="NASTF — National Automotive Service Task Force"
                  height={40}
                  width={100}
                  className="h-10 w-auto"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">NASTF Certified</p>
                  <p className="text-sm text-muted-foreground">Background-Checked Employees</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services column (D-13) */}
          <nav aria-label="Footer navigation">
            <p className="mb-3 text-xs font-normal uppercase tracking-[0.08em] text-muted-foreground">
              Our Services
            </p>
            <ul className="space-y-1.5">
              {[...locksmith, ...electronics].map(s => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-foreground transition-colors hover:underline decoration-accent decoration-2 underline-offset-2"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact column (D-13) */}
          <div>
            <p className="mb-3 text-xs font-normal uppercase tracking-[0.08em] text-muted-foreground">
              Contact
            </p>
            <a
              href="tel:+17033436234"
              className="text-base font-semibold text-primary transition-colors hover:text-accent"
            >
              (703) 343-6234
            </a>
            <p className="mt-1 text-sm text-muted-foreground">
              <a
                href="mailto:Citytech12v@gmail.com"
                className="transition-colors hover:text-primary"
              >
                Citytech12v@gmail.com
              </a>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Available when you need us</p>
            <p className="mt-1 text-sm text-muted-foreground">DC, Maryland &amp; Virginia</p>
          </div>

        </div>

        {/* Bottom strip (D-14) */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">

          {/* Social icons — left on desktop, centered on mobile (D-17) */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Citytech on Facebook"
              className="text-muted-foreground transition-colors duration-150 hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-ring"
            >
              {/* Facebook icon */}
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Citytech on Instagram"
              className="text-muted-foreground transition-colors duration-150 hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-ring"
            >
              {/* Instagram icon */}
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            {/* Linktree — text fallback (D-17, deferred) */}
            <a
              href="#"
              aria-label="Citytech on Linktree"
              className="flex h-5 w-5 items-center justify-center text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-ring"
            >
              LT
            </a>
          </div>

          {/* Copyright — right on desktop, below on mobile (D-16) */}
          <p className="text-sm text-muted-foreground">
            © 2026 City Tech, LLC. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  )
}
