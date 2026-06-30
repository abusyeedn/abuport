  /**
   * Application entry point.
   *
   * - Wraps the app in Radix UI Theme (iris accent, light appearance)
   * - Sets up React Router with three routes: /, /kynhood, /casestudies
   * - Lazy-loads page components and editor tools so the home page bundle stays small
   * - Registers global event listeners to block right-click and drag-save on images
   */
  import { StrictMode, lazy, Suspense } from 'react'
  import { SpeedInsights } from '@vercel/speed-insights/react'
  import { createRoot } from 'react-dom/client'
  import '@radix-ui/themes/styles.css'
  import './index.css'
  import App from './App.tsx'
  import { Theme } from '@radix-ui/themes'

  import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
  import { AnimatePresence } from 'motion/react'
  import { EditorProvider } from './EditorContext.tsx'
  import { AudioProvider } from './AudioContext.tsx'
  import AppLoader from './components/AppLoader.tsx'
  import { FONTS } from './theme.ts'
  import PageTransition from './components/PageTransition.tsx'
  import WaveTransition from './components/WaveTransition.tsx'
  import ViewportScaler from './components/ViewportScaler.tsx'

  // main.tsx is a side-effect entry point, not a hot-reloadable module — fast-refresh rules don't apply.
  import Kynhood2Page from './pages/Kynhood2Page.tsx'
  import CaseStudiesPage from './pages/CaseStudiesPage.tsx'
  import ResumePage from './pages/ResumePage.tsx'
  import AboutPage from './pages/AboutPage.tsx'

  /* eslint-disable react-refresh/only-export-components */
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

  function AnimatedRoutes() {
    const location = useLocation()
    return (
      <>
        <AnimatePresence mode="sync">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><App /></PageTransition>} />
            <Route path="/kynhood2" element={<PageTransition><Kynhood2Page /></PageTransition>} />
            <Route path="/casestudies" element={<PageTransition><CaseStudiesPage /></PageTransition>} />
            <Route path="/resume" element={<PageTransition><ResumePage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
        <WaveTransition />
      </>
    )
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Theme accentColor="iris" panelBackground="solid" radius="large" appearance="light" style={{ fontFamily: FONTS.primary }}>
        <BrowserRouter>
          <EditorProvider>
            <AudioProvider>
            <AppLoader>
              <ViewportScaler>
                <AnimatedRoutes />
              </ViewportScaler>

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
      </Theme>
      <SpeedInsights />
    </StrictMode>,
  )
