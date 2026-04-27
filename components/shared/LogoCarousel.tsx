'use client'

import { useRef } from 'react'

type Client = { name: string; logoSrc?: string; logoClassName?: string }

const BASE_CLIENTS: Client[] = [
  { name: 'AVIS', logoSrc: '/logos/avis-budget-group-logo-png_seeklogo-317428.webp', logoClassName: 'max-h-28 max-w-[260px]' },
  { name: 'Zipcar', logoSrc: '/logos/zipcar-logo-png_seeklogo-333354.webp', logoClassName: 'max-h-28 max-w-[260px]' },
  { name: 'Michael and Sons', logoSrc: '/logos/New-michael-and-sons.webp' },
]

// Repeat 4× so one set is always wider than the widest viewport
const SET: Client[] = [
  ...BASE_CLIENTS,
  ...BASE_CLIENTS,
  ...BASE_CLIENTS,
  ...BASE_CLIENTS,
]

function ClientTile({ name, logoSrc, logoClassName }: Client) {
  return (
    <div className="flex min-w-[280px] h-32 shrink-0 items-center justify-center rounded-md border border-border bg-white px-8 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={name}
          className={`object-contain ${logoClassName ?? 'max-h-20 max-w-[220px]'}`}
        />
      ) : (
        <span className="text-base font-semibold tracking-tight text-foreground">
          {name}
        </span>
      )}
    </div>
  )
}

export default function LogoCarousel({ ariaLabel = 'Our clients' }: { ariaLabel?: string }) {
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <section className="overflow-hidden bg-background py-10">
      <p className="mb-6 text-center text-base font-semibold text-foreground">
        Trusted by
      </p>
      <div
        ref={trackRef}
        aria-label={ariaLabel}
        className="carousel-track flex w-max items-center gap-8"
        onMouseEnter={() => trackRef.current?.setAttribute('data-paused', 'true')}
        onMouseLeave={() => trackRef.current?.removeAttribute('data-paused')}
        onFocus={() => trackRef.current?.setAttribute('data-paused', 'true')}
        onBlur={() => trackRef.current?.removeAttribute('data-paused')}
      >
        {SET.map((c, i) => (
          <ClientTile key={i} {...c} />
        ))}
        <div aria-hidden="true" className="flex items-center gap-8">
          {SET.map((c, i) => (
            <ClientTile key={`d-${i}`} {...c} />
          ))}
        </div>
      </div>
      <p className="mt-6 text-center text-base font-semibold text-foreground">And more</p>
    </section>
  )
}
