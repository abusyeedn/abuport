import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FONTS } from '../theme'
import ALL_GALLERY_ASSETS from '../data/allGalleryAssets.json'

// Every image actually deployed under public/gallery (generated from `git ls-files`,
// so it matches production exactly - gitignored junk/reference dumps are never included).
// Files under /public aren't importable as JS modules (import.meta.glob only works under
// src), so this manifest is a plain JSON list rather than a build-time glob.
const FRAMER_CDN_ASSETS = [
  'https://framerusercontent.com/images/WLJH6DrE7vYZOrzelcXGw85E.png',
  'https://framerusercontent.com/images/FSOZ2cAUmk8MbEu5rVhQBl1zY.png',
  'https://framerusercontent.com/images/3M4OVTTiXVf9OBoBtpbRSROmsFM.png',
  'https://framerusercontent.com/images/CnPFsTzuRqn4MaIWpQt9bvN1aLU.png',
]

// Everything loads up front now - nothing left to warm in idle time.
const PRELOAD_ASSETS: string[] = [...ALL_GALLERY_ASSETS, ...FRAMER_CDN_ASSETS]
const IDLE_PRELOAD_ASSETS: string[] = []

// Visual Piece's whole point is a scannable wall of screens - loading them
// one at a time as you scroll defeats that, so they get the same loader
// screen has (real progress, not a fake timer) instead of a lazy pop-in.
const VISUAL_UI_ASSETS: string[] = [
  ...[
    'Frame 1.png', 'Frame 2.png', 'Frame 3.png', 'Frame 4.png', 'Frame 5.png', 'Frame 6.png', 'Frame 7.png', 'Frame 8.png', 'Frame 9.png', 'Frame 10.png',
    'Frame 11.png', 'Frame 12.png', 'Frame 13.png', 'Frame 15.png', 'Frame 16.png', 'Frame 17.png', 'Frame 18.png', 'Frame 19.png', 'Frame 20.png',
    'Frame 21.png', 'Frame 23.png', 'Frame 24.png', 'Frame 25.png', 'Frame 26.png', 'Frame 27.png', 'Frame 28.png', 'Frame 29.png', 'Frame 30.png',
  ].map((f) => `/gallery/ui-playground/${f}`),
  ...['Frame 31.png', 'Frame 32.png', 'Frame 33.png', 'Frame 34.png', 'Frame 35.png'].map((f) => `/gallery/kynhood/${f}`),
]

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
  // Skip the full-gallery preload screen on mobile - it's built for the desktop
  // hero/gallery experience; phones should render immediately and let images
  // load lazily as the visitor scrolls, not sit through a heavy upfront preload.
  const isMobile = typeof window !== 'undefined' && window.innerWidth < MOBILE_BP
  const isVisualUi = typeof window !== 'undefined' && window.location.pathname === '/visual-ui'
  const loaderKey = isVisualUi ? 'loader_shown_visual_ui' : 'loader_shown'
  const assetsToLoad = isVisualUi ? VISUAL_UI_ASSETS : PRELOAD_ASSETS

  // Shows on the homepage every session, and on Visual Piece the first time
  // it's opened directly (not when arriving from the homepage, which already
  // warmed these in idle time below).
  const shouldShow = !isMobile && (window.location.pathname === '/' || isVisualUi) && !sessionStorage.getItem(loaderKey)

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
        sessionStorage.setItem(loaderKey, '1')
        setProgress(100)
        setTimeout(() => setDone(true), 400)
      }
    }

    // Real network progress - the percentage shown always matches how much has
    // actually finished downloading, so it can never sit at 100% while still waiting.
    preloadImages(assetsToLoad, (pct) => {
      setProgress(pct)
    }).then(() => {
      assetsReady = true
      tryFinish()
      // Once this page's own assets are safely cached, warm every other
      // route's hero image (and, from the homepage, Visual Piece's gallery)
      // in idle time so navigating elsewhere is instant.
      sessionStorage.setItem('idle_preload_done', '1')
      idlePreload(isVisualUi ? IDLE_PRELOAD_ASSETS : [...IDLE_PRELOAD_ASSETS, ...VISUAL_UI_ASSETS])
      if (!isVisualUi) sessionStorage.setItem('loader_shown_visual_ui', '1')
    })

    // Small minimum floor so the loader doesn't just flash on an instant cache hit -
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

            {/* Progress bar - dashed animated stripe */}
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

            {/* Big percentage - bottom-right */}
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
