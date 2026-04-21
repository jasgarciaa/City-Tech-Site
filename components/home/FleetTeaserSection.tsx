import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function FleetTeaserSection() {
  return (
    <section className="bg-background py-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="border-l-4 border-primary pl-6 md:pl-8 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.08em] text-accent font-normal">
            Fleet &amp; Commercial
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">
            City Tech Serves Fleets Too
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            From dealerships to rental companies — we handle multi-vehicle electronics and locksmith
            needs on-site.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-5 min-h-[44px] border-primary text-primary hover:bg-primary/5"
          >
            <Link href="/fleet">
              Learn About Fleet Services <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
