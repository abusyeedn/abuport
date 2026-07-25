  /**
   * Application entry point.
   *
   * - Sets up React Router with three routes: /, /kynhood, /casestudies
   * - Lazy-loads page components and editor tools so the home page bundle stays small
   * - Registers global event listeners to block right-click and drag-save on images
   */
  import { StrictMode, lazy, Suspense, useEffect } from 'react'
  import { SpeedInsights } from '@vercel/speed-insights/react'
  import { Analytics } from '@vercel/analytics/react'
  import { PostHogProvider } from 'posthog-js/react'
  import posthog from './lib/posthog.ts'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import App from './App.tsx'

  import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
  import { AnimatePresence } from 'motion/react'
  import { EditorProvider } from './EditorContext.tsx'
  import { AudioProvider } from './AudioContext.tsx'
  import AppLoader from './components/AppLoader.tsx'
  import { FONTS } from './theme.ts'
  import PageTransition from './components/PageTransition.tsx'
  import WaveTransition from './components/WaveTransition.tsx'
  import ViewportScaler from './components/ViewportScaler.tsx'
  import SmoothScroll, { getLenis } from './components/SmoothScroll.tsx'

  /* eslint-disable react-refresh/only-export-components */
  const Kynhood2Page = lazy(() => import('./pages/Kynhood2Page.tsx'))
  const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage.tsx'))
  const ResumePage = lazy(() => import('./pages/ResumePage.tsx'))
  const AboutPage = lazy(() => import('./pages/AboutPage.tsx'))
  const SpaarksPage = lazy(() => import('./pages/SpaarksPage.tsx'))
  const GlobalEditor = lazy(() => import('./components/GlobalEditor.tsx'))
  const EditModeToggle = lazy(() => import('./components/EditModeToggle.tsx'))
  /* eslint-enable react-refresh/only-export-components */

  // Block right-click and drag on all images site-wide
  document.addEventListener('contextmenu', (e) => {
    if (e.target instanceof HTMLImageElement || e.target instanceof HTMLCanvasElement) {
      e.preventDefault()
    }
  }, true)

  document.addEventListener('dragstart', (e) => {
    if (e.target instanceof HTMLImageElement) {
      e.preventDefault()
    }
  }, true)

  function ScrollToTop() {
    const { pathname } = useLocation()
    useEffect(() => {
      window.scrollTo(0, 0)
      // Lenis tracks its own animated-scroll value separately from the native
      // scrollTop — without this it desyncs from the jump above and the page
      // visibly snaps back on the next scroll frame.
      getLenis()?.scrollTo(0, { immediate: true })
    }, [pathname])
    return null
  }

  function PostHogPageview() {
    const location = useLocation()
    useEffect(() => {
      posthog.capture('$pageview', { $current_url: window.location.href })
    }, [location.pathname])
    return null
  }

  function AnimatedRoutes() {
    const location = useLocation()
    return (
      <>
        <ScrollToTop />
        <PostHogPageview />
        <AnimatePresence mode="sync">
          <Suspense fallback={null}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><App /></PageTransition>} />
              <Route path="/kynhood2" element={<PageTransition><Kynhood2Page /></PageTransition>} />
              <Route path="/casestudies" element={<PageTransition><CaseStudiesPage /></PageTransition>} />
              <Route path="/resume" element={<PageTransition><ResumePage /></PageTransition>} />
              <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
              <Route path="/spaarks" element={<PageTransition><SpaarksPage /></PageTransition>} />
            </Routes>
          </Suspense>
        </AnimatePresence>
        <WaveTransition />
      </>
    )
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <PostHogProvider client={posthog}>
      <div style={{ fontFamily: FONTS.primary }}>
        <BrowserRouter>
          <EditorProvider>
            <AudioProvider>
            <AppLoader>
              <SmoothScroll>
              <ViewportScaler>
                <AnimatedRoutes />
              </ViewportScaler>
              </SmoothScroll>

              {import.meta.env.DEV && (
                <Suspense fallback={null}>
                  <GlobalEditor />
                  <EditModeToggle />
                </Suspense>
              )}
            </AppLoader>
            </AudioProvider>
          </EditorProvider>
        </BrowserRouter>
      </div>
      </PostHogProvider>
      <SpeedInsights />
      <Analytics />
    </StrictMode>,
  )
