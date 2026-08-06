// Thin per-segment wrapper. Next needs an opengraph-image file in each segment to
// emit that page's og:image tag. Card itself lives in lib/og-image.tsx.
import { renderOgImage } from '@/lib/og-image'

export { alt, size, contentType } from '@/lib/og-image'

export default function Image() {
  return renderOgImage()
}
