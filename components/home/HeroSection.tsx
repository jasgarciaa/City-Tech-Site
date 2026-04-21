import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section
      className="w-full"
      style={{ background: 'linear-gradient(135deg, #1B3A8F 0%, #152E72 100%)' }}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 text-center">
        <p className="text-sm uppercase tracking-[0.08em] text-accent font-normal">
          Mobile Automotive Services
        </p>
        <h1 className="mt-4 text-3xl md:text-4xl font-semibold leading-[1.2] text-primary-foreground">
          Expert Auto Electronics &amp; Locksmith &mdash;{' '}
          <span className="text-accent">we come to you</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/85 max-w-3xl mx-auto">
          City Tech provides mobile car audio, electronics installation, and locksmith services
          throughout the DC, Maryland, and Virginia region.
        </p>
        <p className="mt-4 text-sm text-white/70">Available when you need us</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="min-h-[44px] bg-primary text-primary-foreground hover:brightness-110"
          >
            <Link href="/request-service">Request Service</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="min-h-[44px] border-white bg-transparent text-white hover:bg-white/10"
          >
            <a href="tel:+15555555555" aria-label="Call City Tech at (555) 555-5555">
              Call Now
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
