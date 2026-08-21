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
  import ViewportScaler from './components/ViewportScaler.tsx'
  import SmoothScroll, { getLenis } from './components/SmoothScroll.tsx'
  import useIsMobileViewport from './mobile/useIsMobileViewport.ts'
  import Seo from './seo/Seo.tsx'

  /* eslint-disable react-refresh/only-export-components */
  const MobileApp = lazy(() => import('./mobile/MobileApp.tsx'))
  const Kynhood2Page = lazy(() => import('./pages/Kynhood2Page.tsx'))
  const KynhoodCasePage = lazy(() => import('./pages/KynhoodCasePage.tsx'))
  const CaseStudyDetailPage = lazy(() => import('./pages/CaseStudyDetailPage.tsx'))
  const SpaarksPage = lazy(() => import('./pages/SpaarksPage.tsx'))
  const VisualUiPage = lazy(() => import('./pages/VisualUiPage.tsx'))
  const PhotographyPage = lazy(() => import('./pages/PhotographyPage.tsx'))
  const TimelinePage = lazy(() => import('./pages/TimelinePage.tsx'))
  // GlobalEditor / EditModeToggle removed from the render tree - Edit Mode is
  // retired site-wide. The underlying files are kept, just unmounted, so
  // FigmaElement wrappers throughout the codebase remain harmless static
  // positioning divs instead of needing a mass rewrite.
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
      // scrollTop - without this it desyncs from the jump above and the page
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
        <Seo pathname={location.pathname} />
        <AnimatePresence mode="sync">
          <Suspense fallback={null}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><App /></PageTransition>} />
              <Route path="/kynhood2" element={<PageTransition><Kynhood2Page /></PageTransition>} />
              {/* /casestudies (index), /resume, and /about are archived - the
                  page components still live under src/pages, just unrouted.
                  /casestudies/:caseId (detail) stays routed since individual
                  case studies are still linked from the homepage grid. */}
              <Route path="/casestudies/:caseId" element={<PageTransition><CaseStudyDetailPage /></PageTransition>} />
              <Route path="/kynhood2/case/:slug" element={<PageTransition><KynhoodCasePage /></PageTransition>} />
              <Route path="/spaarks" element={<PageTransition><SpaarksPage /></PageTransition>} />
              <Route path="/visual-ui" element={<PageTransition><VisualUiPage /></PageTransition>} />
              <Route path="/photography" element={<PageTransition><PhotographyPage /></PageTransition>} />
              <Route path="/timeline" element={<PageTransition><TimelinePage /></PageTransition>} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </>
    )
  }

  /** The existing desktop experience - unchanged, just extracted so Root can pick. */
  function DesktopRoot() {
    return (
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
            </AppLoader>
            </AudioProvider>
          </EditorProvider>
        </BrowserRouter>
      </div>
    )
  }

  /**
   * Phones get a separate build rather than a responsive desktop reflow - see
   * mobile/MobileApp.tsx. The two trees are mutually exclusive, so none of the
   * desktop-only machinery (ViewportScaler's canvas zoom, Lenis, GSAP pins, the
   * FigmaElement editor) ever mounts on mobile, and vice versa.
   */
  function Root() {
    const isMobile = useIsMobileViewport()

    // ViewportScaler (and the pre-hydration script in index.html) zoom the <html>
    // root to fit the 1440px canvas - at phone widths that would scale the page
    // down to ~20%, so the mobile tree has to clear it.
    useEffect(() => {
      if (isMobile) document.documentElement.style.zoom = '1'
    }, [isMobile])

    if (isMobile) {
      return (
        <Suspense fallback={null}>
          {/* Read straight from location - the mobile tree has no Router, and
              it never client-side navigates, so the entry path is the path. */}
          <Seo pathname={window.location.pathname} />
          <MobileApp />
        </Suspense>
      )
    }
    return <DesktopRoot />
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <PostHogProvider client={posthog}>
        <Root />
      </PostHogProvider>
      <SpeedInsights />
      <Analytics />
    </StrictMode>,
  )
