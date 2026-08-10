import { useEffect, useState } from 'react'

// Most of this site's layout is built with inline-style CSS grid (not
// Tailwind/media-query classes), so a shared JS breakpoint hook is the most
// direct way to collapse fixed-ratio columns (1.6fr/1fr, repeat(2,1fr), etc.)
// down to a single column on tablet/mobile instead of squeezing/overflowing.
export type Breakpoint = {
  isMobile: boolean // <= 640px
  isTablet: boolean // <= 900px (includes mobile)
  width: number
}

function getBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return { isMobile: false, isTablet: false, width: 1280 }
  const width = window.innerWidth
  return { isMobile: width <= 640, isTablet: width <= 900, width }
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(getBreakpoint)

  useEffect(() => {
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setBp(getBreakpoint()))
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return bp
}
