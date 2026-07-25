import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FONTS } from '../theme'
import ALL_GALLERY_ASSETS from '../data/allGalleryAssets.json'

// Every image actually deployed under public/gallery (generated from `git ls-files`,
// so it matches production exactly — gitignored junk/reference dumps are never included).
// Files under /public aren't importable as JS modules (import.meta.glob only works under
// src), so this manifest is a plain JSON list rather than a build-time glob.
const FRAMER_CDN_ASSETS = [
  'https://framerusercontent.com/images/WLJH6DrE7vYZOrzelcXGw85E.png',
  'https://framerusercontent.com/images/FSOZ2cAUmk8MbEu5rVhQBl1zY.png',
  'https://framerusercontent.com/images/3M4OVTTiXVf9OBoBtpbRSROmsFM.png',
  'https://framerusercontent.com/images/CnPFsTzuRqn4MaIWpQt9bvN1aLU.png',
]

// Everything loads up front now — nothing left to warm in idle time.
const PRELOAD_ASSETS: string[] = [...ALL_GALLERY_ASSETS, ...FRAMER_CDN_ASSETS]
const IDLE_PRELOAD_ASSETS: string[] = []

function idlePreload(urls: string[]) {
  const run = () => preloadImages(urls)
  if ('requestIdleCallback' in window) {
    ;(window as any).requestIdleCallback(run, { timeout: 4000 })
  } else {
    setTimeout(run, 1500)
  }
}

// Tracks real network completion (not a fake timer) so the displayed percentage
// always matches how much has actually finished downloading.
function preloadImages(urls: string[], onProgress?: (percent: number) => void): Promise<void[]> {
  let loadedCount = 0
  const total = urls.length
  if (total === 0) {
    onProgress?.(100)
    return Promise.resolve([])
  }
  return Promise.all(
    urls.map(
      url =>
        new Promise<void>(resolve => {
          const isVideo = /\.(mp4|mov|webm)$/i.test(url)
          const el: HTMLImageElement | HTMLVideoElement = isVideo ? document.createElement('video') : new Image()
          const finish = () => {
            loadedCount++
            onProgress?.(Math.round((loadedCount / total) * 100))
            resolve()
          }
          el.onerror = finish
          if (isVideo) {
            const video = el as HTMLVideoElement
            video.preload = 'auto'
            video.oncanplaythrough = finish
            video.src = url
          } else {
            const img = el as HTMLImageElement
            img.onload = finish
            img.src = url
          }
        })
    )
  )
}

interface AppLoaderProps {
  children: React.ReactNode
}

const MOBILE_BP = 768 // matches EditorContext's mobile-band upper bound

export default function AppLoader({ children }: AppLoaderProps) {
  // Skip the full-gallery preload screen on mobile — it's built for the desktop
  // hero/gallery experience; phones should render immediately and let images
  // load lazily as the visitor scrolls, not sit through a heavy upfront preload.
  const isMobile = typeof window !== 'undefined' && window.innerWidth < MOBILE_BP

  // Only show on homepage, only once per session
  const shouldShow = !isMobile && window.location.pathname === '/' && !sessionStorage.getItem('loader_shown')

  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(!shouldShow)

  // Direct-landing on a non-home route (or a repeat visit where the loader
  // already ran) still deserves the cross-route hero warm-up, just without
  // gating it behind the homepage's own asset promise.
  useEffect(() => {
    if (isMobile || shouldShow || sessionStorage.getItem('idle_preload_done')) return
    sessionStorage.setItem('idle_preload_done', '1')
    idlePreload(IDLE_PRELOAD_ASSETS)
  }, [shouldShow])

  useEffect(() => {
    if (!shouldShow) return
    let assetsReady = false
    let minTimeElapsed = false

    function tryFinish() {
      if (assetsReady && minTimeElapsed) {
        sessionStorage.setItem('loader_shown', '1')
        setProgress(100)
        setTimeout(() => setDone(true), 400)
      }
    }

    // Real network progress — the percentage shown always matches how much has
    // actually finished downloading, so it can never sit at 100% while still waiting.
    preloadImages(PRELOAD_ASSETS, (pct) => {
      setProgress(pct)
    }).then(() => {
      assetsReady = true
      tryFinish()
      // Once the homepage's own assets are safely cached, warm every other
      // route's hero image in idle time so navigation elsewhere is instant.
      sessionStorage.setItem('idle_preload_done', '1')
      idlePreload(IDLE_PRELOAD_ASSETS)
    })

    // Small minimum floor so the loader doesn't just flash on an instant cache hit —
    // does not block or fake progress toward 100 while real assets are still loading.
    const minTimer = setTimeout(() => {
      minTimeElapsed = true
      tryFinish()
    }, 600)

    return () => clearTimeout(minTimer)
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
