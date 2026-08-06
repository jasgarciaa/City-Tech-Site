import { ImageResponse } from 'next/og'
import { BUSINESS } from '@/lib/seo'

/**
 * Shared social preview card, generated at build time.
 *
 * Before this existed, every link to the site shared in a text message or a local
 * Facebook group rendered as a blank card. Generating it here avoids waiting on a
 * design asset; swap in a real photo of the van later if one is worth using.
 *
 * Next only emits an og:image for the exact route segment an `opengraph-image` file
 * sits in, and the URL it serves carries a build hash — so a hand-written
 * "/opengraph-image" path 404s. Each segment therefore re-exports this through its
 * own thin opengraph-image.tsx, which is what lets Next mint the right hashed URL.
 */

export const alt =
  'CityTech — Mobile Auto Locksmith and Electronics, Alexandria VA'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#1B3A8F',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#00AEEF',
              fontWeight: 600,
            }}
          >
            {`Est. ${BUSINESS.founded} · Licensed DC · MD · VA`}
          </div>
          {/* Satori requires an explicit display on any div with >1 child, so each
              line of the headline is its own single-child node. */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 28,
              fontSize: 82,
              lineHeight: 1.05,
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex' }}>Mobile Auto Locksmith</div>
            <div style={{ display: 'flex' }}>&amp; Electronics</div>
          </div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 38, color: '#C7D3EE' }}>
            Car keys, fobs, lockouts, and fleet installs. We come to you.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #3A5BB0',
            paddingTop: 32,
          }}
        >
          <div style={{ display: 'flex', fontSize: 44, fontWeight: 600, color: '#FFFFFF' }}>
            CityTech
          </div>
          <div style={{ display: 'flex', fontSize: 36, color: '#00AEEF' }}>
            {BUSINESS.phoneDisplay}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
