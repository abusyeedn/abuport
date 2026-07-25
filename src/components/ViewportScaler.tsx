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
const WIDE_BP = 1920          // above this, screens run higher OS scaling and need to zoom IN instead
const WIDE_SCALE = 1          // native size on wide/high-res monitors

function computeScale(w: number): number {
  if (w >= WIDE_BP) return WIDE_SCALE
  return Math.min(TARGET_SCALE, (w / BASE_WIDTH) * TARGET_SCALE)
}

export default function ViewportScaler({ children }: Props) {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : BASE_WIDTH
  )

  // useLayoutEffect → runs synchronously before paint, no flash
  useLayoutEffect(() => {
    function apply(w: number) {
      document.documentElement.style.zoom = computeScale(w).toFixed(4)
    }

    apply(width)

    function onResize() {
      const w = window.innerWidth
      setWidth(w)
      apply(w)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      document.documentElement.style.zoom = '1'
    }
  }, [width])

  return (
    <ZoomScaleContext.Provider value={computeScale(width)}>
      {children}
    </ZoomScaleContext.Provider>
  )
}
