import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function FooterCTASection() {
  return (
    <section className="bg-primary py-12 px-6 text-center">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold text-primary-foreground">Ready to Get Started?</h2>
        <p className="mt-3 text-base leading-relaxed text-white/85">
          Contact City Tech today. We come to you.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="min-h-[44px] bg-white text-primary hover:bg-white/90"
          >
            <Link href="/request-service">Request Service</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="min-h-[44px] border-white bg-transparent text-white hover:bg-white/10"
          >
            <a href="tel:+17033436234" aria-label="Call City Tech at (703) 343-6234">
              Call Now
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
