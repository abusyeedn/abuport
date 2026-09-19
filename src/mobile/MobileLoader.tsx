/**
 * MobileLoader.tsx
 *
 * Phone-native counterpart to AppLoader.tsx. Desktop's loader gates on a big
 * upfront gallery preload (fine for the fixed 1440px canvas); mobile should
 * stay fast and let images lazy-load as the visitor scrolls instead, so this
 * is a short branded splash (real elapsed time, not a fake asset wait) - same
 * visual language (dashed progress line, big tabular-nums percentage) scaled
 * down to MOBILE_TYPE, shown once per session on first load only.
 */
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FONTS, MOBILE_TYPE } from '../theme'

const SHOWN_KEY = 'abu-portfolio:mobile-loader-shown'
const DURATION_MS = 900

export default function MobileLoader({ children }: { children: React.ReactNode }) {
  const [shouldShow] = useState(() => !sessionStorage.getItem(SHOWN_KEY))
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(!shouldShow)

  useEffect(() => {
    if (!shouldShow) return
    sessionStorage.setItem(SHOWN_KEY, '1')
    const start = Date.now()
    const raf = () => {
      const pct = Math.min(100, Math.round(((Date.now() - start) / DURATION_MS) * 100))
      setProgress(pct)
      if (pct < 100) requestAnimationFrame(raf)
      else setTimeout(() => setDone(true), 250)
    }
    requestAnimationFrame(raf)
  }, [shouldShow])

  return (
    <>
      <AnimatePresence>
        {!done && (
          <motion.div
            key="mobile-loader"
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 99999,
              background: '#ffffff', fontFamily: FONTS.primary, overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', fontSize: MOBILE_TYPE.base, fontWeight: 300, color: '#aaa', letterSpacing: '0.04em' }}>
              Abu Syeed
            </div>

            <div style={{ position: 'absolute', top: '50%', left: '1.5rem', right: '1.5rem', transform: 'translateY(-50%)' }}>
              <svg width="100%" height="10" style={{ display: 'block', overflow: 'visible' }}>
                <line x1="0" y1="5" x2="100%" y2="5" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
                <motion.line
                  x1="0" y1="5" x2="100%" y2="5"
                  stroke="#111" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 6"
                  style={{ pathLength: progress / 100 }}
                />
                <motion.circle cy="5" r="2.5" fill="#111" animate={{ cx: `${progress}%` }} transition={{ duration: 0.15, ease: 'easeOut' }} />
              </svg>
            </div>

            <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'flex-end', gap: '0.15rem', lineHeight: 1 }}>
              <span style={{ fontSize: 'clamp(3.5rem, 22vw, 5.5rem)', fontWeight: 100, color: '#111', letterSpacing: '-0.04em', lineHeight: 0.85, fontVariantNumeric: 'tabular-nums' }}>
                {progress}
              </span>
              <span style={{ fontSize: 'clamp(1rem, 5vw, 1.6rem)', fontWeight: 100, color: '#111', marginBottom: '0.35rem' }}>%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: shouldShow ? 0 : 1 }} animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 0 }}>
        {children}
      </motion.div>
    </>
  )
}
