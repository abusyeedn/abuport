import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'

// Module-level so route-change scroll resets (see main.tsx's ScrollToTop) can
// nudge Lenis too — otherwise its internal animated-scroll value desyncs from
// a raw window.scrollTo() jump and the page visibly snaps back on the next tick.
let activeLenis: Lenis | null = null
export function getLenis() {
  return activeLenis
}

interface SmoothScrollProps {
  children: ReactNode
}

// Site-wide eased/inertial scroll — quicker and more responsive than a fully
// "relaxed" glide, while still smoothing out raw wheel/touch input.
export default function SmoothScroll({ children }: SmoothScrollProps) {
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      lerp: 0.15,
      syncTouch: true,
      syncTouchLerp: 0.12,
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
