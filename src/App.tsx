import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import FigmaElement from './components/FigmaElement'
import Dock from './components/Dock'
import { Icon } from '@iconify/react'
import Footer from './components/Footer'
import { FONTS } from './theme'
import DynamicRenderer from './components/DynamicRenderer'
import ChatWidget from './components/ChatWidget'
import CelestialChatButton from './components/CelestialChatButton'

const TiltCard = React.lazy(() => import('./components/TiltCard'))
const MacOSFolder = React.lazy(() => import('./components/MacOSFolder'))
const VinylDeck = React.lazy(() => import('./components/VinylDeck'))
const CDPlayer = React.lazy(() => import('./components/CDPlayer'))
const CircularGallery = React.lazy(() => import('./components/CircularGallery'))
const EnvelopesStack = React.lazy(() => import('./components/EnvelopesStack'))

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    minWidth: '150px',
    minHeight: '150px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(8px)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#999',
    fontFamily: 'monospace',
    fontSize: '11px',
    gap: '8px'
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
    <span>LOADING...</span>
  </div>
);

const GALLERY_ITEMS = [
  { image: '/gallery/gallery_1.png', text: 'الجعران\nAl-Ga\'ran - Scarab' },
  { image: '/gallery/gallery_2.png', text: 'القرار\nAl-Qarar - The Decision' },
  { image: '/gallery/gallery_3.png', text: 'رؤيا\nRu\'ya - Vision' },
  { image: '/gallery/gallery_4.jpg', text: 'خليك\nKhaleek - Stay' },
  { image: '/gallery/gallery_5.jpg', text: 'حرية\nHurriya - Freedom' },
  { image: '/gallery/gallery_6.jpg', text: 'جميلة\nJamila - Beautiful' },
  { image: '/gallery/gallery_7.jpg', text: 'بحبك\nBahebak - I love you' },
  { image: '/gallery/gallery_8.png', text: 'لو في\nLaw Fi - If only' }
];

const CIRCULAR_GALLERY_PROPS = {
  bend: 3,
  textColor: "#000000",
  borderRadius: 0.05,
  scrollSpeed: 2.1,
  scrollEase: 0.03,
  fontUrl: "https://fonts.googleapis.com/css2?family=Stack+Sans+Headline:wght@200..700&display=swap",
  font: "bold 30px 'Stack Sans Headline'",
  items: GALLERY_ITEMS
};

export default function App() {
  const navigate = useNavigate()
  const [showSuccessMsg, setShowSuccessMsg] = useState(false)

  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#ffffff'
    return () => { document.body.style.backgroundColor = prev }
  }, [])

  useEffect(() => {
    const handleSuccess = () => {
      setShowSuccessMsg(true)
      setTimeout(() => setShowSuccessMsg(false), 4000)
    }
    window.addEventListener('post-receive', handleSuccess)
    return () => window.removeEventListener('post-receive', handleSuccess)
  }, [])

  return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', backgroundColor: '#ffffff' }}>
        {/* Light grey graph background */}
        <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid-home" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d1d5db" strokeWidth="0.4" />
            </pattern>
            <pattern id="grid-home" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid-home)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#d1d5db" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-home)" />
        </svg>
        
        {/* Main Content Wrapper */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: '4rem', fontFamily: FONTS.primary }}>
            <FigmaElement figmaId="main-title" style={{ display: 'block', width: 'max-content', position: 'relative' }}>
              <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>Portfolio</h1>
            </FigmaElement>

            <FigmaElement figmaId="main-subtitle" style={{ display: 'block', width: 'max-content', marginBottom: '3rem', position: 'relative' }}>
              <p style={{ fontSize: '1.2rem', color: '#555' }}>
                Basic setup ready. Drag me around in Edit Mode!
              </p>
            </FigmaElement>

            {/* Freeform Absolute Canvas */}
            <div style={{ position: 'relative', width: '100%', height: '2000px' }}>
              
              <FigmaElement 
                figmaId="hero-tilt-card" 
                componentType="TiltCard"
                style={{ display: 'block', width: '300px', height: '400px', top: '0px', left: '0px' }}
              >
                <React.Suspense fallback={<LoadingFallback />}>
                  <TiltCard />
                </React.Suspense>
              </FigmaElement>


              <FigmaElement 
                figmaId="circular-gallery"
                componentType="CircularGallery"
                componentProps={CIRCULAR_GALLERY_PROPS}
                style={{ display: 'block', width: '600px', height: '600px', top: '450px', left: '0px' }}
              >
                <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                  <React.Suspense fallback={<LoadingFallback />}>
                    <CircularGallery {...CIRCULAR_GALLERY_PROPS} />
                  </React.Suspense>
                </div>
              </FigmaElement>

              <FigmaElement
                figmaId="macos-folders"
                componentType="MacOSFolder"
                style={{ display: 'block', width: '600px', height: '600px', top: '450px', left: '650px' }}
              >
                <React.Suspense fallback={<LoadingFallback />}>
                  <MacOSFolder />
                </React.Suspense>
              </FigmaElement>


              <FigmaElement 
                figmaId="vinyl-deck"
                componentType="VinylDeck"
                style={{ display: 'block', width: '400px', height: '400px', top: '0px', left: '350px' }}
              >
                <React.Suspense fallback={<LoadingFallback />}>
                  <VinylDeck />
                </React.Suspense>
              </FigmaElement>

              <FigmaElement
                figmaId="envelope-stack"
                componentType="EnvelopesStack"
                style={{ display: 'block', width: '200px', height: '150px', top: '200px', left: '500px', overflow: 'visible' }}
              >
                <React.Suspense fallback={<LoadingFallback />}>
                  <EnvelopesStack />
                </React.Suspense>
              </FigmaElement>

              {/* The post box does not have a componentType since it's highly custom inline JSX */}
              <FigmaElement
                figmaId="post-image"
                style={{ display: 'block', width: '400px', top: '200px', left: '0px', zIndex: 10000 }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <img 
                    src="/gallery/post.png" 
                    alt="Post Image" 
                    style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }} 
                  />
                </div>
              </FigmaElement>

              <FigmaElement
                figmaId="interactive-cd-player"
                componentType="CDPlayer"
                style={{ display: 'block', width: '400px', height: '470px', top: '1100px', left: '0px' }}
              >
                <React.Suspense fallback={<LoadingFallback />}>
                  <CDPlayer />
                </React.Suspense>
              </FigmaElement>

              <FigmaElement
                figmaId="celestial-chat-button"
                componentType="CelestialChatButton"
                style={{ display: 'block', top: '1100px', left: '450px' }}
              >
                <CelestialChatButton />
              </FigmaElement>

              {/* Dynamic Clones */}
              <DynamicRenderer />
            </div>
          </div>

          <AnimatePresence>
            {showSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(10px)', y: -10 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontFamily: FONTS.primary,
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#000',
                  backgroundColor: '#fff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 10001
                }}
              >
                email sent, I will get back to you!
              </motion.div>
            )}
          </AnimatePresence>

          <ChatWidget />
          <Dock
            items={[
              { icon: <Icon icon="solar:home-2-outline" width={22} color="#1e293b" />, label: 'Home', onClick: () => navigate('/') },
              { icon: <Icon icon="solar:file-outline" width={22} color="#1e293b" />, label: 'Resume', onClick: () => navigate('/resume') },
              { icon: <Icon icon="solar:user-outline" width={22} color="#1e293b" />, label: 'About me', onClick: () => navigate('/about') }
            ]}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
        <Footer />
      </div>
  )
}
