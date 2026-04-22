import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import DesktopNav from './DesktopNav'
import MobileNav from './MobileNav'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo zone — left */}
        <Link href="/" aria-label="City Tech — home">
          <Image
            src="/logo.svg"
            alt="City Tech — Mobile Automotive Locksmith and Electronics Service"
            height={52}
            width={200}
            priority
            className="h-11 w-auto"
          />
        </Link>

        {/* Navigation zone — center (desktop only) */}
        <DesktopNav />

        {/* CTA zone — right */}
        <div className="flex items-center gap-3">
          {/* Phone number — visible on desktop, hidden on mobile (MobileNav handles mobile) */}
          <a
            href="tel:+17033436234"
            aria-label="Call City Tech at (703) 343-6234"
            className="hidden text-sm font-semibold text-primary md:block transition-colors hover:text-accent"
          >
            (703) 343-6234
          </a>

          {/* Call Now button — desktop only */}
          <Button
            asChild
            size="sm"
            className="hidden min-h-[44px] bg-primary text-primary-foreground hover:brightness-110 active:brightness-95 focus-visible:outline-accent md:flex"
          >
            <a href="tel:+17033436234" aria-label="Call City Tech at (703) 343-6234">
              Call Now
            </a>
          </Button>

          {/* Mobile: hamburger + phone — handled inside MobileNav */}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
