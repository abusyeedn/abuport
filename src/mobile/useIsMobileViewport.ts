import { useEffect, useState } from 'react'

/**
 * The desktop build is a fixed-1440px canvas (ViewportScaler zoom + GSAP pins +
 * absolutely-positioned FigmaElements) and has no meaningful layout below this
 * width, so anything at or under it gets the separate mobile build instead.
 * 1023 = everything up to and including tablets; desktop starts at 1024.
 */
export const MOBILE_MAX_WIDTH = 1023

// A narrowed/half-snapped browser window on a large (e.g. 4K) monitor can
// report a small window.innerWidth even though it's clearly a desktop
// machine - screen.width (the actual monitor resolution) doesn't shrink
// when the window does, so checking both catches that case and keeps big
// screens on the desktop build.
function computeIsMobile(): boolean {
  if (typeof window === 'undefined') return false
  const widest = Math.max(window.innerWidth, window.screen?.width || 0)
  return widest <= MOBILE_MAX_WIDTH
}

/** True while the viewport is in the mobile band (≤700px), tracked across resize/rotate. */
export default function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState(computeIsMobile)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`)
    const onChange = () => setIsMobile(computeIsMobile())
    onChange()
    mq.addEventListener('change', onChange)
    window.addEventListener('resize', onChange)
    return () => {
      mq.removeEventListener('change', onChange)
      window.removeEventListener('resize', onChange)
    }
  }, [])

  return isMobile
}
