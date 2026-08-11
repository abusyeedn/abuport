import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'

// Floating "scroll to top" button - replaces the fixed Dock nav on case-study
// pages. Only appears once the user has scrolled past the hero, same pattern
// as michaeltsirakis.com's bottom-right up-arrow. Ringed with a circular
// reading-progress stroke so it doubles as a "how far through this page am I"
// indicator on the long case-study pages it lives on.
const SIZE = 44
const STROKE = 3
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// scrollContainerRef: pass this when the page scrolls inside a container div
// (e.g. the Kynhood case-study panel's own Lenis-scrolled body) instead of
// the window - otherwise progress/visibility never update.
export default function BackToTopButton({ dark = true, scrollContainerRef }: { dark?: boolean; scrollContainerRef?: React.RefObject<HTMLElement | null> }) {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const target: HTMLElement | Window = scrollContainerRef?.current ?? window
    const getScrollTop = () => (target === window ? window.scrollY : (target as HTMLElement).scrollTop)
    const getScrollable = () =>
      target === window
        ? document.documentElement.scrollHeight - window.innerHeight
        : (target as HTMLElement).scrollHeight - (target as HTMLElement).clientHeight
    const onScroll = () => {
      const top = getScrollTop()
      setVisible(top > 600)
      const scrollable = getScrollable()
      setProgress(scrollable > 0 ? Math.min(1, top / scrollable) : 0)
    }
    target.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => target.removeEventListener('scroll', onScroll)
  }, [scrollContainerRef])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => {
            const target = scrollContainerRef?.current
            if (target) target.scrollTo({ top: 0, behavior: 'smooth' })
            else window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 99999,
            width: SIZE,
            height: SIZE,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: dark ? '#0f172a' : '#ffffff',
            color: dark ? '#ffffff' : '#0f172a',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          }}
        >
          <svg width={SIZE} height={SIZE} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={dark ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.12)'}
              strokeWidth={STROKE}
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={dark ? '#00cbb4' : '#077a4b'}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>
          <Icon icon="solar:arrow-up-outline" width={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
