import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useZoomScale } from './ViewportScaler'
import { useBreakpoint } from '../hooks/useBreakpoint'

const IDLE_HIDE_MS = 5000
// Ignore sub-pixel/rubber-band scroll noise so it doesn't fire on every tiny
// wobble, but small enough that a real scroll-up always registers.
const SCROLL_THRESHOLD = 4

// Simple rule, applies on every page: scrolling down never shows the back
// button (and hides it if it's up); scrolling up always shows it; a tap
// anywhere also shows it; either way it auto-hides again after 5s idle.
// Desktop keeps it always visible (hover already makes intent obvious there).
function useMobileAutoHide(isMobile: boolean) {
  const [visible, setVisible] = useState(true)
  // Some pages scroll the window; others (e.g. CaseStudyPanel, which every
  // /kynhood2/case/:slug page renders) are a fixed-position full-screen panel
  // with its own internal `overflow-y: auto` container instead. Tracking the
  // last known position per scroll source (rather than one shared value)
  // means whichever one is actually scrolling is always compared against
  // its own history, not another source's leftover position.
  const lastYByTarget = useRef(new Map<EventTarget, number>())
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isMobile) return

    const scheduleHide = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => setVisible(false), IDLE_HIDE_MS)
    }
    const show = () => {
      setVisible(true)
      scheduleHide()
    }
    const getY = (target: EventTarget) => (target instanceof Document ? window.scrollY : (target as HTMLElement).scrollTop)

    // Capture phase on `document` catches scroll from any descendant
    // scrollable element too, not just window (scroll events don't bubble).
    const onScroll = (e: Event) => {
      const target = e.target as EventTarget
      const y = getY(target)
      const last = lastYByTarget.current.get(target) ?? y
      const delta = y - last
      lastYByTarget.current.set(target, y)
      if (delta > SCROLL_THRESHOLD) {
        // Scrolling down - never show, and cancel any pending idle-hide
        // since there's nothing to hide.
        setVisible(false)
        if (idleTimer.current) clearTimeout(idleTimer.current)
      } else if (delta < -SCROLL_THRESHOLD) {
        // Scrolling up - always show.
        show()
      }
    }
    // A real tap fires `click`; a scroll-down drag doesn't (the browser
    // cancels the synthetic click once the touch moves), so this can't
    // conflict with "scrolling down never shows it".
    const onClick = () => show()

    document.addEventListener('scroll', onScroll, { passive: true, capture: true })
    document.addEventListener('click', onClick, { passive: true })
    scheduleHide()
    return () => {
      document.removeEventListener('scroll', onScroll, true)
      document.removeEventListener('click', onClick)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [isMobile])

  return isMobile ? visible : true
}

// Replaces the fixed Dock nav on content pages - a single floating "back"
// button, bottom-left, instead of a full navigation dock.
export default function BackButton({ dark = true, to, onClick }: { dark?: boolean; to?: string; onClick?: () => void }) {
  const navigate = useNavigate()
  const zoomScale = useZoomScale()
  const { isMobile } = useBreakpoint()
  const visible = useMobileAutoHide(isMobile)
  // Fixed-position elements get shrunk (and mispositioned) by the page's
  // ambient zoom the same as anything else - cancel it out, same technique
  // as Dock.tsx and the case-study panels, so this renders at true size in
  // its actual on-screen spot instead of appearing shrunk/offset.
  const counterZoom = zoomScale > 0 ? 1 / zoomScale : 1
  return (
    <motion.button
      onClick={onClick ?? (() => (to ? navigate(to) : navigate(-1)))}
      aria-label="Back"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      whileHover={{ x: -3 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        bottom: 28,
        left: 28,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        borderRadius: 'var(--radius-cta)',
        border: 'none',
        cursor: 'pointer',
        background: dark ? '#1a1a1a' : '#ffffff',
        color: dark ? '#ffffff' : '#0f172a',
        fontSize: '0.8rem',
        fontWeight: 400,
        zoom: counterZoom,
        pointerEvents: visible ? 'auto' : 'none',
      } as React.CSSProperties}
    >
      <Icon icon="solar:arrow-left-outline" width={16} /> Back
    </motion.button>
  )
}
