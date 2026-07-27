import { useEffect, useState } from 'react'

/**
 * The desktop build is a fixed-1440px canvas (ViewportScaler zoom + GSAP pins +
 * absolutely-positioned FigmaElements) and has no meaningful layout below this
 * width, so anything at or under it gets the separate mobile build instead.
 * 1023 = everything up to and including tablets; desktop starts at 1024.
 */
export const MOBILE_MAX_WIDTH = 1023

/** True while the viewport is in the mobile band (≤700px), tracked across resize/rotate. */
export default function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= MOBILE_MAX_WIDTH : false
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
