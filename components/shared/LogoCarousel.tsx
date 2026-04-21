'use client'

import { useRef } from 'react'

type Client = { name: string; logoSrc?: string }

const BASE_CLIENTS: Client[] = [
  { name: 'AVIS' },
  { name: 'Zipcar' },
  { name: 'Michael and Sons' },
]

// Repeat 4× so one set is always wider than the widest viewport
const SET: Client[] = [
  ...BASE_CLIENTS,
  ...BASE_CLIENTS,
  ...BASE_CLIENTS,
  ...BASE_CLIENTS,
]

function ClientTile({ name, logoSrc }: Client) {
  return (
    <div className="flex min-w-[220px] h-24 shrink-0 items-center justify-center rounded-md border border-border bg-white px-6 shadow-sm grayscale transition-[filter,box-shadow] duration-200 hover:grayscale-0 hover:shadow-md">
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={name}
          className="max-h-10 max-w-[160px] object-contain"
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
      <p className="mb-6 text-center text-xs font-normal uppercase tracking-[0.08em] text-muted-foreground">
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
    </section>
  )
}
