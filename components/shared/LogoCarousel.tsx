'use client'

import { useRef } from 'react'

export type LogoCarouselProps = {
  ariaLabel?: string
}

const CLIENTS: { name: string }[] = [
  { name: 'Michael and Sons' },
  { name: 'Zipcar' },
  { name: 'AVIS' },
]

function CarouselTile({ name }: { name: string }) {
  return (
    <div className="flex min-w-[160px] h-20 items-center justify-center rounded-md border border-border bg-muted text-sm font-semibold text-muted-foreground grayscale hover:grayscale-0 transition-[filter] duration-200">
      {name}
    </div>
  )
}

export default function LogoCarousel({ ariaLabel = 'Our clients' }: LogoCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <section aria-label={ariaLabel} className="overflow-hidden bg-background py-10">
      <div
        ref={trackRef}
        className="carousel-track flex w-max items-center gap-6 px-6"
        onMouseEnter={() => trackRef.current?.setAttribute('data-paused', 'true')}
        onMouseLeave={() => trackRef.current?.removeAttribute('data-paused')}
        onFocus={() => trackRef.current?.setAttribute('data-paused', 'true')}
        onBlur={() => trackRef.current?.removeAttribute('data-paused')}
      >
        {/* First tile set — read by assistive tech */}
        {CLIENTS.map((c) => <CarouselTile key={c.name} name={c.name} />)}
        {/* Duplicate set — decorative, hidden from assistive tech */}
        <div aria-hidden="true" className="flex items-center gap-6">
          {CLIENTS.map((c) => <CarouselTile key={`dup-${c.name}`} name={c.name} />)}
        </div>
      </div>
    </section>
  )
}
