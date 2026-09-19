  /**
   * Application entry point.
   *
   * - Sets up React Router with three routes: /, /kynhood, /casestudies
   * - Lazy-loads page components and editor tools so the home page bundle stays small
   * - Registers global event listeners to block right-click and drag-save on images
   */
  import { StrictMode, lazy, Suspense, useEffect, useRef, useState } from 'react'
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
  import AppLoader from './components/AppLoader.tsx'
  import { FONTS } from './theme.ts'
  import PageTransition from './components/PageTransition.tsx'
  import ViewportScaler from './components/ViewportScaler.tsx'
  import SmoothScroll, { getLenis } from './components/SmoothScroll.tsx'
  import useIsMobileViewport from './mobile/useIsMobileViewport.ts'
  import Seo from './seo/Seo.tsx'
  import TopHeader from './components/TopHeader.tsx'
  import { useSiteNavItems } from './components/siteNav.ts'
  import MobileTopHeader from './mobile/MobileTopHeader.tsx'
  import MobileLoader from './mobile/MobileLoader.tsx'
  import MobileHomePage from './mobile/MobileHomePage.tsx'
  import MobileKynhoodPage from './mobile/MobileKynhoodPage.tsx'

  /* eslint-disable react-refresh/only-export-components */
  const Kynhood2Page = lazy(() => import('./pages/Kynhood2Page.tsx'))
  const KynhoodCasePage = lazy(() => import('./pages/KynhoodCasePage.tsx'))
  const CaseStudyDetailPage = lazy(() => import('./pages/CaseStudyDetailPage.tsx'))
  const SpaarksPage = lazy(() => import('./pages/SpaarksPage.tsx'))
  const VisualUiPage = lazy(() => import('./pages/VisualUiPage.tsx'))
  const PhotographyPage = lazy(() => import('./pages/PhotographyPage.tsx'))
  const TimelinePage = lazy(() => import('./pages/TimelinePage.tsx'))
  const WritingsPage = lazy(() => import('./pages/WritingsPage.tsx'))
  const WritingDetailPage = lazy(() => import('./pages/WritingDetailPage.tsx'))
  const MentorsPage = lazy(() => import('./pages/MentorsPage.tsx'))
  const BrandGuidePage = lazy(() => import('./pages/BrandGuidePage.tsx'))
  const BrandGuideDetailPage = lazy(() => import('./pages/BrandGuideDetailPage.tsx'))
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

  // Only Visual Piece hides its nav on scroll-down (it's a long scannable
  // image wall where the pinned header just eats space) - everywhere else
  // it stays put, so this only actually listens while that route is active.
  function useHideHeaderOnScroll(active: boolean) {
    const [hidden, setHidden] = useState(false)
    const lastY = useRef(0)

    useEffect(() => {
      if (!active) {
        setHidden(false)
        return
      }
      lastY.current = window.scrollY
      function onScroll() {
        const y = window.scrollY
        const delta = y - lastY.current
        if (Math.abs(delta) > 6) {
          setHidden(y > 120 && delta > 0)
          lastY.current = y
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }, [active])

    return hidden
  }

  // The nav pill used to be rendered separately inside each page (App.tsx,
  // PhotographyPage, TimelinePage, VisualUiPage, WritingsPage,
  // WritingDetailPage), which meant it unmounted and remounted - visibly
  // animating along with the page - on every navigation between them. Living
  // here, above <Routes>, it survives route changes entirely; only the page
  // content underneath it transitions.
  const NAV_PAGES = new Set(['/', '/visual-ui', '/photography', '/timeline', '/writings', '/mentors', '/brand-guide'])
  function GlobalTopHeader() {
    const { pathname } = useLocation()
    const onWritingDetail = pathname.startsWith('/writings/')
    const onBrandGuideDetail = pathname.startsWith('/brand-guide/')
    const showsNav = NAV_PAGES.has(pathname) || onWritingDetail || onBrandGuideDetail
    const activePath = pathname === '/' ? undefined : onWritingDetail ? '/writings' : onBrandGuideDetail ? '/brand-guide' : pathname
    const navItems = useSiteNavItems(activePath)
    const headerHidden = useHideHeaderOnScroll(pathname === '/visual-ui' || onBrandGuideDetail)

    if (!showsNav) return null
    return (
      <TopHeader
        hidden={headerHidden}
        items={navItems}
        cta={{ label: 'Download resume', onClick: () => { window.open('/gallery/resume.pdf', '_blank') } }}
      />
    )
  }

  function AnimatedRoutes() {
    const location = useLocation()
    return (
      <>
        <ScrollToTop />
        <PostHogPageview />
        <Seo pathname={location.pathname} />
        <GlobalTopHeader />
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
              <Route path="/writings" element={<PageTransition><WritingsPage /></PageTransition>} />
              <Route path="/writings/:slug" element={<PageTransition><WritingDetailPage /></PageTransition>} />
              <Route path="/mentors" element={<PageTransition><MentorsPage /></PageTransition>} />
              <Route path="/brand-guide" element={<PageTransition><BrandGuidePage /></PageTransition>} />
              <Route path="/brand-guide/:slug" element={<PageTransition><BrandGuideDetailPage /></PageTransition>} />
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
            <AppLoader>
              <SmoothScroll>
              <ViewportScaler>
                <AnimatedRoutes />
              </ViewportScaler>
              </SmoothScroll>
            </AppLoader>
          </EditorProvider>
        </BrowserRouter>
      </div>
    )
  }

  // Every route the mobile tree renders directly with real content -
  // Kynhood2 gets its own mobile-native layout (MobileKynhoodPage.tsx) and
  // Spaarks skips its GSAP bento pin on mobile internally (see isMobile
  // branch in SpaarksPage.tsx), everything else already renders responsively
  // as-is. ScrollToTop/PostHogPageview/Seo are shared with DesktopRoot's
  // AnimatedRoutes so route changes behave identically on both.
  function MobileRoutes() {
    const location = useLocation()
    return (
      <>
        <ScrollToTop />
        <PostHogPageview />
        <Seo pathname={location.pathname} />
        <MobileTopHeader activePath={location.pathname === '/' ? undefined : location.pathname} />
        {/* MobileTopHeader floats (position: fixed), same as desktop's pill -
            it doesn't reserve layout space, so every route needs this
            clearance above its own content instead of the header pushing it
            down on its own. */}
        <div style={{ paddingTop: 78 }}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<MobileHomePage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/mentors" element={<MentorsPage />} />
            <Route path="/writings" element={<WritingsPage />} />
            <Route path="/writings/:slug" element={<WritingDetailPage />} />
            <Route path="/brand-guide" element={<BrandGuidePage />} />
            <Route path="/brand-guide/:slug" element={<BrandGuideDetailPage />} />
            <Route path="/photography" element={<PhotographyPage />} />
            <Route path="/visual-ui" element={<VisualUiPage />} />
            <Route path="/casestudies/:caseId" element={<CaseStudyDetailPage />} />
            <Route path="/kynhood2/case/:slug" element={<KynhoodCasePage />} />
            <Route path="/kynhood2" element={<MobileKynhoodPage />} />
            <Route path="/spaarks" element={<SpaarksPage />} />
            <Route path="*" element={<MobileHomePage />} />
          </Routes>
        </Suspense>
        </div>
      </>
    )
  }

  function MobileRoot() {
    return (
      <div style={{ fontFamily: FONTS.primary }}>
        <BrowserRouter>
          <MobileLoader>
            <MobileRoutes />
          </MobileLoader>
        </BrowserRouter>
      </div>
    )
  }

  /**
   * Phones and tablets get their own route tree (MobileRoot) instead of a
   * responsive reflow of the desktop one - the desktop build is a fixed-1440px
   * canvas driven by ViewportScaler's CSS `zoom`, GSAP pins, and a
   * drag-positioned FigmaElement layout, none of which survive a phone
   * viewport. Most page components (Timeline, Mentors, Writings, Brand
   * Guide, Photography, UI Screens, individual case studies) are already
   * responsive in their own right and are mounted directly in both trees;
   * only the homepage hero/nav and the two GSAP-pinned pages
   * (Kynhood2Page, SpaarksPage) need a mobile-specific version.
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
      return <MobileRoot />
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
