export interface ServiceDefinition {
  slug: string
  name: string
  shortDescription: string
  category: 'electronics' | 'locksmith'
  featured: boolean
  order: number
  /**
   * Search-facing title. Pattern: primary keyword + geo modifier, kept under about
   * 60 characters so it isn't truncated. The root layout appends " | CityTech".
   * Falls back to `name` when absent.
   */
  seoTitle?: string
  /**
   * Search-facing description, around 150 characters. This is ad copy for a free
   * ad slot: it should give a reason to call, not restate the service name.
   * Falls back to `shortDescription` when absent.
   */
  seoDescription?: string
  /**
   * Feeds FAQPage schema and, later, an on-page FAQ block.
   * Only add answers CityTech has confirmed. Nothing invented — see the claims
   * gate in the delivery SOPs. Prices and response times need sign-off first.
   */
  faqs?: { question: string; answer: string }[]
  pageContent: {
    problem: string
    solution: string
    process: string[]
  }
}

export const services: ServiceDefinition[] = [
  // --- Locksmith (order 1–4) ---
  {
    slug: 'vehicle-lockouts',
    name: 'Vehicle Lockouts',
    shortDescription: 'Mobile lockout service. We come to you when you\'re locked out of your car.',
    category: 'locksmith',
    featured: true,
    order: 1,
    seoTitle: 'Car Lockout Service in Alexandria & Northern VA',
    seoDescription:
      'Locked out of your car in Alexandria, Arlington, or Fairfax? CityTech comes to you and gets you back in without damaging your vehicle. No tow, no dealership wait.',
    pageContent: {
      problem: 'Being locked out of your vehicle is stressful, especially in an unfamiliar area or bad weather.',
      solution: 'CityTech dispatches a technician directly to your location. No tow required, no dealership wait.',
      process: [
        'Call us and provide your location, vehicle make, and model',
        'We dispatch a technician to your location',
        'We gain entry safely without damaging your vehicle and get you back on the road',
      ],
    },
  },
  {
    slug: 'transponder-key-programming',
    name: 'Transponder Key Programming',
    shortDescription: 'Mobile programming of transponder keys and push-to-start fobs for most vehicles.',
    category: 'locksmith',
    featured: true,
    order: 2,
    seoTitle: 'Transponder Key Programming & Cutting | Alexandria VA',
    seoDescription:
      'Mobile transponder key cutting and programming across Northern Virginia and DC. Chipped keys and push-to-start fobs programmed at your location, for less than a dealership.',
    pageContent: {
      problem: 'Modern vehicle keys contain embedded transponder chips. A blank-cut key from a hardware store won\'t start your car.',
      solution: 'CityTech programs transponder keys on-site using the right programming equipment. Faster and less expensive than a dealership.',
      process: [
        'We verify your vehicle\'s key type and confirm we have compatible programming hardware',
        'We cut and program the new key to your vehicle\'s immobilizer system',
        'We test the key in the ignition and confirm all functions before completing the job',
      ],
    },
  },
  {
    slug: 'key-fob-replacement',
    name: 'Key Fob Replacement',
    shortDescription: 'Replace and program lost or damaged key fobs. We come to your location.',
    category: 'locksmith',
    featured: false,
    order: 3,
    seoTitle: 'Car Key Fob Replacement & Programming | Alexandria VA',
    seoDescription:
      'Lost or broken key fob? CityTech sources and programs replacement fobs on-site in Alexandria, Arlington, Springfield, and Fairfax. No tow to the dealership.',
    pageContent: {
      problem: 'Lost or damaged key fobs are expensive to replace at a dealership, and the process requires leaving your car there.',
      solution: 'CityTech programs replacement fobs on-site. Remote lock/unlock, panic, and trunk functions all restored without a tow.',
      process: [
        'We source a compatible replacement fob for your vehicle\'s year, make, and model',
        'We come to your location and program the fob to your vehicle\'s security system',
        'We test all remote functions and confirm everything works before we leave',
      ],
    },
  },
  {
    slug: 'ignition-repair-replacement',
    name: 'Ignition Repair & Replacement',
    shortDescription: 'Mobile ignition cylinder repair or replacement. No tow needed.',
    category: 'locksmith',
    featured: false,
    order: 4,
    seoTitle: 'Car Ignition Repair & Replacement | Alexandria VA',
    seoDescription:
      'Key stuck or ignition won\'t turn? CityTech repairs and replaces ignition cylinders at your location across Northern Virginia and DC. No tow, no dealership labor charge.',
    pageContent: {
      problem: 'A worn or damaged ignition cylinder can prevent your key from turning or leave it stuck. There is no easy self-fix.',
      solution: 'CityTech diagnoses and repairs or replaces ignition cylinders at your location, saving you a costly dealership tow and labor charge.',
      process: [
        'We assess the ignition cylinder to determine repair vs. replacement',
        'We remove the damaged cylinder and install a new or rebuilt replacement',
        'We rekey to your existing key (when possible) and confirm the ignition operates correctly',
      ],
    },
  },
  // --- Electronics (order 1–9) ---
  {
    slug: 'telematic-fleet-devices',
    name: 'Telematic Fleet Devices',
    shortDescription: 'Professional installation of GPS telematics devices for fleet visibility, driver monitoring, and vehicle diagnostics.',
    category: 'electronics',
    featured: false,
    order: 1,
    seoTitle: 'Fleet GPS & Telematics Installation | DC, MD, VA',
    seoDescription:
      'Mobile telematics installation for commercial fleets across DC, Maryland, and Virginia. We install at your yard, so your vehicles stay on route instead of sitting at a shop.',
    pageContent: {
      problem: 'Without real-time data, managing a fleet means guessing at vehicle location, driver behavior, and maintenance needs — problems that compound quickly at scale.',
      solution: 'CityTech installs professional telematics devices that connect your fleet to a management platform, delivering live GPS location, mileage tracking, driver behavior alerts, and vehicle diagnostic data all accessible from a single dashboard.',
      process: [
        'We assess your fleet size, existing management platform, and specific data requirements',
        'We install telematics devices across your vehicles at your location with minimal downtime per vehicle',
        'We configure each device to your platform, verify live data transmission, and walk your team through the dashboard before handoff',
      ],
    },
  },
  {
    slug: 'oem-radio-repair',
    name: 'OEM Radio Repair',
    shortDescription: 'Factory radio diagnosis and repair — restore OEM audio, display, and integrated features without a dealer replacement.',
    category: 'electronics',
    featured: false,
    order: 2,
    seoTitle: 'OEM Factory Radio Repair | Alexandria & Northern VA',
    seoDescription:
      'Factory radio dead, display blank, or backup camera gone with it? CityTech diagnoses and repairs OEM head units across Northern Virginia for a fraction of dealer replacement.',
    pageContent: {
      problem: 'A failed factory radio takes your audio, backup camera display, and integrated controls with it — and dealer replacement quotes are often steep.',
      solution: 'CityTech diagnoses OEM radio faults and performs targeted repairs, restoring factory functionality at a fraction of dealer cost. Where repair isn\'t viable, we source and install a matching OEM unit.',
      process: [
        'We diagnose the fault: power loss, display failure, module error, or software corruption',
        'We perform component-level repair or source a compatible OEM replacement unit',
        'We reinstall, code if required (Ford SYNC, GM, Chrysler, etc.), and verify all factory functions before handoff',
      ],
    },
  },
  {
    slug: 'car-audio-installation',
    name: 'Car Audio Installation',
    shortDescription: 'Professional stereo, speaker, and amplifier installation for any vehicle.',
    category: 'electronics',
    featured: true,
    order: 3,
    seoTitle: 'Car Audio Installation | Alexandria & Northern VA',
    seoDescription:
      'Head units, speakers, subs, and amps installed at your home or office across Alexandria, Arlington, and Fairfax. Clean wiring, tuned and tested before we leave.',
    pageContent: {
      problem: 'Your factory stereo sounds flat and lacks the features you need.',
      solution: 'CityTech installs aftermarket audio systems for any vehicle: head units, speakers, subwoofers, and amplifiers matched to your budget.',
      process: [
        'We assess your vehicle and discuss your audio goals on-site',
        'We source and install compatible components with clean, professional wiring',
        'We tune the system and verify full functionality before we leave',
      ],
    },
  },
  {
    slug: 'car-alarms',
    name: 'Car Alarms',
    shortDescription: 'Reliable vehicle alarm and deterrent systems installed at your location.',
    category: 'electronics',
    featured: false,
    order: 4,
    seoTitle: 'Car Alarm Installation | Alexandria & Northern VA',
    seoDescription:
      'Vehicle alarm systems installed at your location across Northern Virginia and DC. Shock sensors, sirens, and remote disarm, wired clean and tested with you before we go.',
    pageContent: {
      problem: 'You want to protect your vehicle from theft and break-ins without complicated wiring.',
      solution: 'CityTech installs alarm systems with shock sensors, sirens, and remote disarm. Clean installation, tested before we leave.',
      process: [
        'We evaluate your vehicle\'s existing security and discuss your protection goals',
        'We install and wire the alarm system to manufacturer specifications',
        'We test every sensor and walk you through the remote operation',
      ],
    },
  },
  {
    slug: 'mobile-video-systems',
    name: 'Mobile Video Systems',
    shortDescription: 'In-vehicle screens and entertainment systems for rear passengers and drivers.',
    category: 'electronics',
    featured: false,
    order: 5,
    seoTitle: 'Mobile Video & Dash Camera Systems | DC, MD, VA',
    seoDescription:
      'Headrest screens, overhead monitors, and commercial in-vehicle video installed across Northern Virginia, DC, and Maryland. Factory-clean installs for families and fleets.',
    pageContent: {
      problem: 'Long drives are hard on passengers without in-vehicle entertainment, especially for families.',
      solution: 'CityTech installs headrest monitors, overhead screens, and multimedia systems. Clean installations that look factory-fitted.',
      process: [
        'We discuss screen placement and compatibility with your vehicle\'s interior',
        'We route cables cleanly and mount screens securely',
        'We connect the system and verify playback from all sources before finishing',
      ],
    },
  },
  {
    slug: 'backup-cameras',
    name: 'Backup Cameras',
    shortDescription: 'Rearview camera systems for safer reversing, installed while you wait.',
    category: 'electronics',
    featured: false,
    order: 6,
    seoTitle: 'Backup Camera Installation | Alexandria & Northern VA',
    seoDescription:
      'Rearview camera systems installed at your location across Alexandria, Arlington, and Fairfax. Works with your existing screen or a new monitor, for cars and work vans.',
    pageContent: {
      problem: 'Reversing without a camera is stressful, and factory cameras can be expensive to repair or add.',
      solution: 'CityTech installs aftermarket backup cameras with clear night-vision capable displays, integrated into your existing screen or a new monitor.',
      process: [
        'We assess your current display setup and choose a compatible camera system',
        'We mount the camera at the rear and route the cable through the vehicle',
        'We connect to the display and confirm the image quality before completing the job',
      ],
    },
  },
  {
    slug: 'remote-start-systems',
    name: 'Remote Start Systems',
    shortDescription: 'Start and climate-condition your vehicle from your phone or key fob.',
    category: 'electronics',
    featured: true,
    order: 7,
    seoTitle: 'Remote Start Installation | Alexandria & Northern VA',
    seoDescription:
      'Warm your car before you get in. CityTech installs remote start systems at your home or office across Northern Virginia and DC, tested with you before we leave.',
    pageContent: {
      problem: 'Stepping into a freezing or overheating vehicle every morning is an avoidable problem.',
      solution: 'CityTech installs remote start systems that let you warm up or cool down your vehicle before you get in.',
      process: [
        'We confirm compatibility with your vehicle\'s make, model, and year',
        'We install the remote start module and connect all required harnesses',
        'We test every function (remote start, climate hold, and runtime settings) before handoff',
      ],
    },
  },
  {
    slug: 'navigation-systems',
    name: 'Navigation Systems',
    shortDescription: 'Aftermarket GPS and navigation head units for vehicles without built-in nav.',
    category: 'electronics',
    featured: false,
    order: 8,
    seoTitle: 'CarPlay & Navigation Head Units | Alexandria VA',
    seoDescription:
      'Apple CarPlay, Android Auto, and built-in GPS head units installed across Northern Virginia and DC. A permanent fix for a car that never came with navigation.',
    pageContent: {
      problem: 'Your vehicle lacks built-in navigation and phone mounts are an unreliable substitute.',
      solution: 'CityTech installs aftermarket head units with Android Auto, Apple CarPlay, and built-in GPS navigation. A clean, permanent solution.',
      process: [
        'We identify a compatible head unit for your vehicle\'s dash configuration',
        'We install the unit with all wiring adapters and antenna connections',
        'We verify navigation, CarPlay/Android Auto, and audio output before completing the job',
      ],
    },
  },
  {
    slug: 'security-tracking-systems',
    name: 'Security & Tracking Systems',
    shortDescription: 'GPS vehicle tracking and security systems for personal and fleet vehicles.',
    category: 'electronics',
    featured: false,
    order: 9,
    seoTitle: 'GPS Vehicle Tracking & Security Systems | DC, MD, VA',
    seoDescription:
      'Concealed GPS trackers and security systems for personal vehicles and commercial fleets across Northern Virginia, DC, and Maryland. Live location and tamper alerts.',
    pageContent: {
      problem: 'Knowing where your vehicle is and getting alerted to unauthorized movement matters for both personal owners and businesses.',
      solution: 'CityTech installs GPS tracking and security systems that give you real-time location data and tamper alerts through a mobile app.',
      process: [
        'We discuss your tracking and alert requirements: personal use, fleet monitoring, or theft recovery',
        'We install the tracker in a concealed, power-stable location',
        'We configure the app, test location accuracy, and confirm alert triggers with you',
      ],
    },
  },
]

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return services.find(s => s.slug === slug)
}

export function getServicesByCategory(
  category: ServiceDefinition['category']
): ServiceDefinition[] {
  return services.filter(s => s.category === category).sort((a, b) => a.order - b.order)
}
