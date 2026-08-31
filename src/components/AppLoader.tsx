import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
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

// Only what's actually visible on first paint of the homepage - card covers,
// the "My journey" gallery strip, envelope/social icons - gates the loader.
// The full gallery is 695 tracked files (~250MB); downloading all of it
// before the homepage even renders meant a first-time visitor sat behind a
// blank screen for a very long time to warm case-study body images they
// might never scroll to. Everything else now warms in idle time after the
// homepage is already interactive (see IDLE_PRELOAD_ASSETS below), instead
// of blocking first paint.
const HOMEPAGE_CRITICAL_ASSETS: string[] = [
  '/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/Frame_44.png',
  '/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Competitive Audit - Real Estate sites/logo.png',
  '/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/FoundIt - UX Case Study/Group_32.png',
  '/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Kynhood - UX & AI/Untitled.jpg',
  '/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/A4_-_1.jpg',
  '/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 2 - Abusyeed/Untitled.jpg',
  '/gallery/home/behance.png',
  '/gallery/home/drive.png',
  '/gallery/home/envelope-opened.png',
  '/gallery/home/envelope.png',
  '/gallery/home/gallery_1.jpg',
  '/gallery/home/gallery_2.jpg',
  '/gallery/home/gallery_3.jpg',
  '/gallery/home/gallery_4.jpg',
  '/gallery/home/gallery_5.jpg',
  '/gallery/home/gallery_6.jpg',
  '/gallery/home/gallery_7.jpg',
  '/gallery/home/gallery_8.jpg',
  '/gallery/aa1.jpg',
  '/gallery/home/icon.png',
  '/gallery/home/post.png',
  '/gallery/kyn-ds-docs/images/kyn_ds_cover.jpg',
  '/gallery/kyn-ds-docs/images/style_guide_cover.jpg',
  '/gallery/kyncaseimg/chase_and_cheer_cover.png',
  '/gallery/kyncaseimg/cover22.jpg',
  '/gallery/kyncaseimg/flow19.jpg',
  '/gallery/kyncaseimg/plugin.jpg',
  '/gallery/kynhood/Frame 36.png',
  '/gallery/kynhood/kyn-cover.png',
  '/gallery/kynhood/kyn-screens.png',
  '/gallery/kynhood/kyn1.jpg',
  '/gallery/pdfs/hifi-screen-01-home.png',
  '/gallery/pdfs/image.png',
  '/gallery/spaarks/spaarks_onboarding.jpg',
  '/gallery/spaarks/spark_ds_cover.jpg',
  '/gallery/ui-playground/Frame 29.png',
]
const PRELOAD_ASSETS: string[] = [...HOMEPAGE_CRITICAL_ASSETS, ...FRAMER_CDN_ASSETS]
// Every other tracked gallery asset (case-study body images, component
// catalogs, PDFs exports) - fetched in the background once the homepage is
// already up, so navigating into a case study later hits a warm cache
// instead of triggering a fresh network wait.
const IDLE_PRELOAD_ASSETS: string[] = ALL_GALLERY_ASSETS.filter(
  (p) => !HOMEPAGE_CRITICAL_ASSETS.includes(p)
)

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

  // AppLoader sits above <Routes> (see main.tsx) and isn't re-rendered by
  // route changes on its own, so it must read the path via useLocation -
  // reading window.location.pathname directly here only reflected whatever
  // page the tab was first loaded on. That meant clicking "UI and Visuals"
  // from the homepage nav (a client-side navigation, no full reload) never
  // re-armed the full-preload loader for that route - it only fired on a
  // hard/direct visit to /visual-ui, so the nav-click path was silently
  // falling back to the images streaming in as each <img> tag rendered.
  const { pathname } = useLocation()
  const isVisualUi = pathname === '/visual-ui'
  const loaderKey = isVisualUi ? 'loader_shown_visual_ui' : 'loader_shown'
  const assetsToLoad = isVisualUi ? VISUAL_UI_ASSETS : PRELOAD_ASSETS

  // Shows on the homepage every session, and on Visual Piece the first time
  // it's opened each session - whether that's a direct visit or a client-side
  // nav click - unless it's already been shown (or warmed via idle preload).
  const computeShouldShow = () => !isMobile && (pathname === '/' || isVisualUi) && !sessionStorage.getItem(loaderKey)

  const [shouldShow, setShouldShow] = useState(computeShouldShow)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(!computeShouldShow())

  // Re-arm on every route change (not just first mount) - this is what lets
  // navigating from "/" into "/visual-ui" re-show the loader for that page's
  // own asset set instead of staying stuck with whatever `shouldShow` was
  // computed on the very first render.
  useEffect(() => {
    const show = computeShouldShow()
    setShouldShow(show)
    setDone(!show)
    setProgress(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShow, pathname])

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
