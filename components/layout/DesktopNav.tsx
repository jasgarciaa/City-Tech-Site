'use client'

import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { services } from '@/data/services'

const electronics = services.filter(s => s.category === 'electronics').sort((a, b) => a.order - b.order)
const locksmith = services.filter(s => s.category === 'locksmith').sort((a, b) => a.order - b.order)

export default function DesktopNav() {
  return (
    <nav aria-label="Main navigation" className="hidden md:flex">
      <NavigationMenu>
        <NavigationMenuList>

          {/* Services dropdown (D-08) */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-normal text-foreground hover:text-primary data-[state=open]:text-primary">
              Services
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[500px] grid-cols-2 gap-6 bg-muted p-5 rounded-md border border-border">
                {/* Locksmith group */}
                <div>
                  <p className="mb-3 text-xs font-normal uppercase tracking-[0.08em] text-muted-foreground">
                    Locksmith
                  </p>
                  <ul className="space-y-0.5">
                    {locksmith.map(s => (
                      <li key={s.slug}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/services/${s.slug}`}
                            className="block rounded px-2 py-1.5 text-sm text-foreground transition-colors duration-150 hover:bg-primary/[0.06] hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
                          >
                            {s.name}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Electronics group */}
                <div>
                  <p className="mb-3 text-xs font-normal uppercase tracking-[0.08em] text-muted-foreground">
                    Electronics
                  </p>
                  <ul className="space-y-0.5">
                    {electronics.map(s => (
                      <li key={s.slug}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/services/${s.slug}`}
                            className="block rounded px-2 py-1.5 text-sm text-foreground transition-colors duration-150 hover:bg-primary/[0.06] hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
                          >
                            {s.name}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Fleet */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/fleet"
                className="px-3 py-2 text-sm text-foreground transition-colors duration-150 hover:text-primary"
              >
                Fleet
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Request Service */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/request-service"
                className="px-3 py-2 text-sm text-foreground transition-colors duration-150 hover:text-primary"
              >
                Request Service
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}
