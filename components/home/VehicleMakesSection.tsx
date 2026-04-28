const MAKES = [
  { name: 'Acura',       slug: 'acura'                  },
  { name: 'Chevrolet',   slug: 'chevrolet', scale: 3.4  },
  { name: 'Chrysler',    slug: 'chrysler',  scale: 1.6  },
  { name: 'Dodge',       slug: 'dodge'                  },
  { name: 'Ford',        slug: 'ford'                   },
  { name: 'GMC',         slug: 'gmc'                    },
  { name: 'Honda',       slug: 'honda'                  },
  { name: 'Hyundai',     slug: 'hyundai'                },
  { name: 'Infiniti',    slug: 'infiniti'               },
  { name: 'Jeep',        slug: 'jeep'                   },
  { name: 'Kia',         slug: 'kia'                    },
  { name: 'Lexus',       slug: 'lexus',     scale: 2.2  },
  { name: 'Mazda',       slug: 'mazda'                  },
  { name: 'Mitsubishi',  slug: 'mitsubishi'             },
  { name: 'Nissan',      slug: 'nissan'                 },
  { name: 'Subaru',      slug: 'subaru'                 },
  { name: 'Toyota',      slug: 'toyota'                 },
  { name: 'Volkswagen',  slug: 'volkswagen'             },
  { name: 'Volvo',       slug: 'volvo'                  },
]

export default function VehicleMakesSection() {
  return (
    <section className="bg-muted py-12 px-6">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-sm uppercase tracking-[0.08em] text-muted-foreground font-normal">
          Compatible With
        </p>
        <h2 className="mt-2 text-center text-xl font-semibold text-foreground">
          We Service All Major Makes
        </h2>

        <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
          {MAKES.map((make) => (
            <div
              key={make.slug}
              className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-4 transition-all duration-200 hover:border-primary hover:shadow-sm"
            >
              <div className="flex h-12 w-full items-center justify-center overflow-hidden">
                <img
                  src={`/logos/makes/${make.slug}.svg`}
                  alt={make.name}
                  style={make.scale ? { transform: `scale(${make.scale})` } : undefined}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xs font-normal text-muted-foreground">{make.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
