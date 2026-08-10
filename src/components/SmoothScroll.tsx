import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'

// Module-level so route-change scroll resets (see main.tsx's ScrollToTop) can
// nudge Lenis too - otherwise its internal animated-scroll value desyncs from
// a raw window.scrollTo() jump and the page visibly snaps back on the next tick.
let activeLenis: Lenis | null = null
export function getLenis() {
  return activeLenis
}

interface SmoothScrollProps {
  children: ReactNode
}

// Site-wide eased/inertial scroll - a slower, more relaxed glide (rather than
// a quick/snappy one) so scrolling reads as pleasing rather than instant.
export default function SmoothScroll({ children }: SmoothScrollProps) {
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.3,
      lerp: 0.09,
      syncTouch: true,
      syncTouchLerp: 0.08,
    })
    activeLenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lenis.destroy()
      activeLenis = null
    }
  }, [])

  return children
}
