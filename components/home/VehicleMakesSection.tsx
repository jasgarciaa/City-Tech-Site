import Image from 'next/image'

const MAKES = [
  { name: 'Acura',       logo: 'acura-logo.webp'                                    },
  { name: 'Chevrolet',   logo: 'chevrolet-logo.webp'                                },
  { name: 'Chrysler',    logo: 'chrysler-logo.webp'                                 },
  { name: 'Dodge',       logo: 'dodge-logo.webp'                                    },
  { name: 'Ford',        logo: 'ford-logo-vector.webp',  imgClass: 'h-full w-full'  },
  { name: 'GMC',         logo: 'gmc-logo.webp'                                      },
  { name: 'Honda',       logo: 'honda-logo.webp'                                    },
  { name: 'Hyundai',     logo: 'hyundai-logo.webp'                                  },
  { name: 'Infiniti',    logo: 'infiniti-logo.webp'                                 },
  { name: 'Jeep',        logo: 'jeep-logo.webp'                                     },
  { name: 'Kia',         logo: 'kia-logo.webp'                                      },
  { name: 'Lexus',       logo: 'lexus-logo.webp'                                    },
  { name: 'Mazda',       logo: 'mazda-logo.webp'                                    },
  { name: 'Mitsubishi',  logo: 'mitsubishi-logo.webp'                               },
  { name: 'Nissan',      logo: 'nissan-logo.webp'                                   },
  { name: 'Subaru',      logo: 'subaru-logo.webp'                                   },
  { name: 'Toyota',      logo: 'toyota-logo-transparent-2.webp'                     },
  { name: 'Volkswagen',  logo: 'vw-logo.webp'                                       },
  { name: 'Volvo',       logo: 'volvo-logo.webp'                                    },
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
              key={make.name}
              className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-4 transition-all duration-200 hover:border-primary hover:shadow-sm"
            >
              <div className="flex h-12 w-full items-center justify-center rounded bg-white px-2">
                <Image
                  src={`/logos/makes/${make.logo}`}
                  alt={make.name}
                  width={80}
                  height={40}
                  unoptimized
                  className={`${make.imgClass ?? 'h-10 w-auto'} object-contain`}
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
