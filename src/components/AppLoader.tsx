import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FONTS } from '../theme'

const PRELOAD_ASSETS = [
  '/gallery/kyn-cover.png',
  '/gallery/kyn-screens.png',
  '/gallery/kyn1.jpg',
  '/gallery/kyn2.png',
  '/gallery/kyn4.png',
  '/gallery/kyn5.jpg',
  '/gallery/kyn6.jpg',
  '/gallery/kyn7.jpg',
  '/gallery/post.png',
  '/gallery/kyn-journey-1.png',
  '/gallery/kyn-journey-2.png',
  '/gallery/Image.png',
  '/gallery/gallery_1.png',
  '/gallery/gallery_2.png',
  '/gallery/gallery_3.png',
  '/gallery/gallery_4.jpg',
  // Framer CDN images used by CDPlayer
  'https://framerusercontent.com/images/WLJH6DrE7vYZOrzelcXGw85E.png',
  'https://framerusercontent.com/images/FSOZ2cAUmk8MbEu5rVhQBl1zY.png',
  'https://framerusercontent.com/images/3M4OVTTiXVf9OBoBtpbRSROmsFM.png',
  'https://framerusercontent.com/images/CnPFsTzuRqn4MaIWpQt9bvN1aLU.png',
]

function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      url =>
        new Promise<void>(resolve => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve() // don't block on 404s
          img.src = url
        })
    )
  )
}

interface AppLoaderProps {
  children: React.ReactNode
}

export default function AppLoader({ children }: AppLoaderProps) {
  // Only show on homepage, only once per session
  const shouldShow = window.location.pathname === '/' && !sessionStorage.getItem('loader_shown')

  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(!shouldShow)
  useEffect(() => {
    if (!shouldShow) return
    let assetsReady = false
    let animDone = false

    function tryFinish() {
      if (assetsReady && animDone) {
        sessionStorage.setItem('loader_shown', '1')
        setTimeout(() => setDone(true), 700)
      }
    }

    // Preload assets in background (caches them for the app)
    preloadImages(PRELOAD_ASSETS).then(() => {
      assetsReady = true
      tryFinish()
    })

    // Mandated smooth 0→100 animation over ~2.4s
    const DURATION = 2400
    const INTERVAL = 16
    const start = performance.now()

    const timer = setInterval(() => {
      const elapsed = performance.now() - start
      const t = Math.min(elapsed / DURATION, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      const val = Math.round(eased * 100)
      setProgress(val)

      if (val >= 100) {
        clearInterval(timer)
        animDone = true
        tryFinish()
      }
    }, INTERVAL)

    return () => clearInterval(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <AnimatePresence>
        {!done && (
          <motion.div
            key="loader"
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: '#ffffff',
              fontFamily: FONTS.primary,
              overflow: 'hidden',
            }}
          >
            {/* Top-left label */}
            <div style={{
              position: 'absolute',
              top: '2rem',
              left: '2.5rem',
              fontSize: '1rem',
              fontWeight: 300,
              color: '#aaa',
              letterSpacing: '0.04em',
            }}>
              Abu Syeed
            </div>

            {/* Progress bar — dashed animated stripe */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '2.5rem',
              right: '2.5rem',
              transform: 'translateY(-50%)',
            }}>
              {/* SVG stroke line */}
              <svg width="100%" height="12" style={{ display: 'block', overflow: 'visible' }}>
                {/* ghost track */}
                <line x1="0" y1="6" x2="100%" y2="6" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
                {/* animated fill line */}
                <motion.line
                  x1="0" y1="6"
                  x2="100%" y2="6"
                  stroke="#111"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeDasharray="4 6"
                  animate={{ pathLength: progress / 100 }}
                  style={{ pathLength: progress / 100 }}
                />
                {/* traveling dot at the head */}
                <motion.circle
                  cy="6"
                  r="3"
                  fill="#111"
                  animate={{ cx: `${progress}%` }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              </svg>
            </div>

            {/* Big percentage — bottom-right */}
            <div style={{
              position: 'absolute',
              bottom: '2rem',
              right: '2.5rem',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '0.2rem',
              lineHeight: 1,
            }}>
              <motion.span
                style={{
                  fontSize: 'clamp(5rem, 18vw, 12rem)',
                  fontWeight: 100,
                  color: '#111',
                  letterSpacing: '-0.04em',
                  lineHeight: 0.85,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {progress}
              </motion.span>
              <span style={{
                fontSize: 'clamp(1.2rem, 4vw, 3rem)',
                fontWeight: 100,
                color: '#111',
                marginBottom: '0.6rem',
              }}>
                %
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render children underneath so they're ready when loader exits */}
      <motion.div
        initial={{ opacity: shouldShow ? 0 : 1 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: 0 }}
      >
        {children}
      </motion.div>
    </>
  )
}
