import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react'

const BASE_WIDTH = 1440   // designed for MacBook Pro 16"

// Current page-wide zoom scale, exposed so persistently-visible UI like the
// Dock nav can cancel it out and stay pinned at native size in every corner
// instead of shrinking along with the rest of the page.
const ZoomScaleContext = createContext(1)
export function useZoomScale() {
  return useContext(ZoomScaleContext)
}

// ─── Scaler ───────────────────────────────────────────────────────────────────

interface Props { children: ReactNode }

const TARGET_SCALE = 0.8      // native "100%" should render at the same size as the old 80% browser-zoom view
const WIDE_BP = 1920          // above this, a *high-DPI* screen runs higher OS scaling and needs to zoom IN instead

// A plain 1920px+ desktop monitor (24"/27", 100% OS scaling, devicePixelRatio 1)
// reports the same window.innerWidth as a high-DPI laptop panel that Windows
// has already scaled down to fit more content - but the desktop monitor has no
// such scaling behind it. Without this check, both hit the same "wide screen"
// branch and jump straight to native (unshrunk) size, so a 24" monitor renders
// every spacing/type decision tuned for the 0.8 scale looking oversized and
// off, even though it never had OS scaling to compensate for in the first place.
function isHighDpi(): boolean {
  return typeof window !== 'undefined' && window.devicePixelRatio > 1
}

function computeScale(w: number, highDpi: boolean): number {
  if (w >= WIDE_BP && highDpi) return 1
  return Math.min(TARGET_SCALE, (w / BASE_WIDTH) * TARGET_SCALE)
}

export default function ViewportScaler({ children }: Props) {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : BASE_WIDTH
  )
  const [highDpi, setHighDpi] = useState(isHighDpi)

  // useLayoutEffect → runs synchronously before paint, no flash
  useLayoutEffect(() => {
    function apply(w: number, hd: boolean) {
      document.documentElement.style.zoom = computeScale(w, hd).toFixed(4)
    }

    apply(width, highDpi)

    function onResize() {
      const w = window.innerWidth
      const hd = isHighDpi()
      setWidth(w)
      setHighDpi(hd)
      apply(w, hd)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      document.documentElement.style.zoom = '1'
    }
  }, [width, highDpi])

  return (
    <ZoomScaleContext.Provider value={computeScale(width, highDpi)}>
      {children}
    </ZoomScaleContext.Provider>
  )
}
