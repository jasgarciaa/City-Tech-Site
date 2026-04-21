import { Calendar, ShieldCheck, BadgeCheck } from 'lucide-react'

export default function TrustSignalsSection() {
  return (
    <section className="bg-muted py-12 px-6">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-sm uppercase tracking-[0.08em] text-muted-foreground font-normal mb-8">
          Why Choose City Tech
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center flex flex-col items-center">
            <Calendar aria-hidden="true" size={32} className="text-accent" />
            <h3 className="mt-3 text-xl font-semibold text-foreground">Est. 2016</h3>
            <p className="mt-2 text-base leading-relaxed text-foreground max-w-xs">
              Over a decade serving the DMV region
            </p>
          </div>
          <div className="text-center flex flex-col items-center">
            <ShieldCheck aria-hidden="true" size={32} className="text-accent" />
            <h3 className="mt-3 text-xl font-semibold text-foreground">Licensed &amp; Insured</h3>
            <p className="mt-2 text-base leading-relaxed text-foreground max-w-xs">
              Fully licensed in DC, Maryland, and Virginia
            </p>
          </div>
          <div className="text-center flex flex-col items-center">
            <BadgeCheck aria-hidden="true" size={32} className="text-accent" />
            <h3 className="mt-3 text-xl font-semibold text-foreground">NASTF Verified</h3>
            <p className="mt-2 text-base leading-relaxed text-foreground max-w-xs">
              All technicians background-checked by NASTF
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
