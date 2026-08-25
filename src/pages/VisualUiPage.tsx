import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS, MOTION } from '../theme'

// Raw UI screenshots across all of Abu's design work, not just Kynhood - a
// quick scannable wall for a recruiter to skim real interface work without
// clicking into a single full case study.
const IMAGES = [
  ...[
    'Frame 1.png', 'Frame 2.png', 'Frame 3.png', 'Frame 4.png', 'Frame 5.png', 'Frame 6.png', 'Frame 7.png', 'Frame 8.png', 'Frame 9.png', 'Frame 10.png',
    'Frame 11.png', 'Frame 12.png', 'Frame 13.png', 'Frame 15.png', 'Frame 16.png', 'Frame 17.png', 'Frame 18.png', 'Frame 19.png', 'Frame 20.png',
    'Frame 21.png', 'Frame 23.png', 'Frame 24.png', 'Frame 25.png', 'Frame 26.png', 'Frame 27.png', 'Frame 28.png', 'Frame 29.png', 'Frame 30.png',
  ].map((f) => `/gallery/ui-playground/${f}`),
  ...['Frame 31.png', 'Frame 32.png', 'Frame 33.png', 'Frame 34.png', 'Frame 35.png'].map((f) => `/gallery/kynhood/${f}`),
]

export default function VisualUiPage() {
  const [lightbox, setLightbox] = useState<string | null>(null)

  // Without this, the page's own scrollbar stays visible (and scrollable)
  // behind the fixed fullscreen overlay - locking body scroll while zoomed
  // in removes it until the lightbox closes.
  useEffect(() => {
    if (!lightbox) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [lightbox])

  // Click cycle on the zoomed image itself: normal -> 200% -> back to
  // normal -> close. `zoomedOnce` is what lets step 3 tell "still fresh,
  // zoom in" apart from "already cycled through, this click means close" -
  // both of those are the same 100% `zoomed` state otherwise.
  const [zoomed, setZoomed] = useState(false)
  const [zoomedOnce, setZoomedOnce] = useState(false)
  // The browser still fires a native click on drag-release even though the
  // pointer moved, which was toggling the zoom cycle every time someone
  // panned the zoomed image instead of just panning it. Set on drag start,
  // read (and swallowed) by the click that immediately follows on release,
  // then cleared a frame later so the next real tap isn't affected.
  const wasDragging = useRef(false)

  function openLightbox(src: string) {
    setLightbox(src)
    setZoomed(false)
    setZoomedOnce(false)
  }

  function handleImageClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (wasDragging.current) return
    if (zoomed) {
      setZoomed(false)
      setZoomedOnce(true)
    } else if (zoomedOnce) {
      setLightbox(null)
    } else {
      setZoomed(true)
    }
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#F8F6F3' }}>
      <div style={{ width: '100%', margin: '0 auto', padding: '11.5rem 2rem 6rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MOTION.easeArray }}
          style={{ marginBottom: '4rem', textAlign: 'center' }}
        >
          <h1 style={{ margin: 0, fontFamily: FONTS.display, fontStyle: 'italic', letterSpacing: '0.015em', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#1a2420' }}>
            UI Screens
          </h1>
          <p style={{ margin: '1rem auto 0', fontFamily: FONTS.body, fontSize: '1rem', lineHeight: 1.6, color: '#5c6b64', maxWidth: 560 }}>
            A wall of interface work across every project I've designed, Kynhood and beyond. A lot
            of it is under NDA, so I can't walk through all of it as a full case study, but I can
            still show the screens.
          </p>
          <p style={{ margin: '0.75rem auto 0', fontFamily: FONTS.body, fontSize: '1rem', lineHeight: 1.6, color: '#5c6b64' }}>
            Click any shot to zoom in.
          </p>
        </motion.div>

        {/* AppLoader already preloads every image in this wall before this
            page is shown, so there's no lazy/staggered pop-in here - the
            whole grid is ready to render at once. */}
        <div style={{ columnCount: 2, columnGap: '1.5rem' }} className="ui-playground-columns">
          {IMAGES.map((src) => (
            <motion.button
              key={src}
              onClick={() => openLightbox(src)}
              whileHover={{ scale: 1.015 }}
              style={{
                display: 'block',
                width: '100%',
                marginBottom: '1.5rem',
                breakInside: 'avoid',
                padding: 0,
                border: 'none',
                borderRadius: 10,
                overflow: 'hidden',
                cursor: 'zoom-in',
                background: '#eceae4',
                boxShadow: '0 2px 6px rgba(20,32,52,.06), 0 16px 40px -20px rgba(20,32,52,.22)',
              }}
            >
              <img
                src={src}
                alt="UI screen from Abu's design work"
                draggable={false}
                style={{ width: '100%', display: 'block' }}
              />
            </motion.button>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .ui-playground-columns { column-count: 2 !important; } }
        @media (max-width: 480px) { .ui-playground-columns { column-count: 1 !important; } }
      `}</style>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 999999,
              background: 'rgba(0,0,0,0.88)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 'clamp(1rem, 5vw, 4rem)', paddingTop: 'clamp(6rem, 12vw, 8rem)', cursor: 'zoom-out',
            }}
          >
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close image"
              style={{
                position: 'absolute', top: 96, right: 24,
                width: 40, height: 40, borderRadius: '50%',
                border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <Icon icon="solar:close-circle-outline" width={24} />
            </button>
            <motion.img
              key={zoomed ? 'zoomed' : 'normal'}
              initial={{ scale: zoomed ? 1 : 0.95 }}
              animate={{ scale: zoomed ? 2 : 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.22 }}
              src={lightbox}
              alt="UI screen from Abu's design work"
              onClick={handleImageClick}
              drag={zoomed}
              dragMomentum={false}
              dragElastic={0.15}
              onDragStart={() => { wasDragging.current = true }}
              onDragEnd={() => { requestAnimationFrame(() => { wasDragging.current = false }) }}
              style={{
                maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 12,
                cursor: zoomed ? 'grab' : 'zoom-in',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
