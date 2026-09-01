import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS, MOTION } from '../theme'
import { getLenis } from '../components/SmoothScroll'

// Real camera/cloud photos only - the old /gallery/home/gallery_*.jpg set
// was poster/graphic-design artwork, not photography, so it's excluded here.
// Add more objects here as new shots come in; `caption` is optional if a
// photo doesn't need one.
//
// Note: /gallery/photod/20260423_171559.heic was left out - browsers other
// than Safari can't render HEIC. Export it as a .jpg/.png and add it here.
const PHOTOS: { image: string; caption?: string }[] = [
  { image: '/gallery/photod/IMG_20211010_142526252.jpg' },
  { image: '/gallery/photod/IMG_20211130_092755545.jpg' },
  { image: '/gallery/photod/IMG_20211231_140701693.jpg' },
  { image: '/gallery/photod/IMG_20220413_055206910.jpg' },
  { image: '/gallery/photod/IMG_20220629_152052844.jpg' },
  { image: '/gallery/photod/IMG_20220912_183639449.jpg' },
  { image: '/gallery/photod/IMG_20230222_184907592.jpg' },
  { image: '/gallery/photod/Snapchat-546225346.jpg' },
]

export default function PhotographyPage() {
  const [lightbox, setLightbox] = useState<{ image: string; caption?: string } | null>(null)

  // Without this, the page's own scrollbar stays visible (and scrollable)
  // behind the fixed fullscreen overlay - locking body scroll while zoomed
  // in removes it until the lightbox closes. That alone isn't enough
  // though: the site-wide Lenis instance has `syncTouch` on, which hijacks
  // touch-drag gestures directly rather than relying on native scrolling,
  // so it kept translating an up/down drag over the zoomed photo into a
  // background scroll even with body overflow locked - `stop()`/`start()`
  // pauses that hijacking for as long as the lightbox is open.
  useEffect(() => {
    if (!lightbox) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const lenis = getLenis()
    lenis?.stop()
    return () => {
      document.body.style.overflow = original
      lenis?.start()
    }
  }, [lightbox])

  const lightboxOverlay = (
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
            background: 'rgba(0,0,0,0.96)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close image"
            style={{
              position: 'absolute', top: 24, right: 24,
              width: 40, height: 40, borderRadius: '50%',
              border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              zIndex: 1,
            }}
          >
            <Icon icon="solar:close-circle-outline" width={24} />
          </button>
          <motion.img
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.18 }}
            src={lightbox?.image}
            alt={lightbox?.caption || 'Photograph'}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'default' }}
          />
          {lightbox?.caption && (
            <p
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', margin: 0, fontFamily: FONTS.body, fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', cursor: 'default' }}
            >
              {lightbox.caption}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )

  const content = (
    <div style={{ minHeight: '100vh', width: '100%', background: '#F8F6F3' }}>
      <div style={{ width: '100%', margin: '0 auto', padding: '11.5rem 2rem 6rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MOTION.easeArray }}
          style={{ marginBottom: '4rem', textAlign: 'center' }}
        >
          <h1 style={{ margin: 0, fontFamily: FONTS.display, fontStyle: 'italic', letterSpacing: '0.015em', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#1a2420' }}>
            Photos
          </h1>
          <p style={{ margin: '1rem auto 0', fontFamily: FONTS.body, fontSize: '1rem', lineHeight: 1.6, color: '#5c6b64', maxWidth: 560 }}>
            A few frames outside of design work. Click any shot to zoom in.
          </p>
        </motion.div>

        <div style={{ columnCount: 2, columnGap: '1.5rem' }} className="photography-columns">
          {PHOTOS.map((photo) => (
            <motion.button
              key={photo.image}
              onClick={() => setLightbox(photo)}
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
                src={photo.image}
                alt={photo.caption || 'Photograph'}
                draggable={false}
                style={{ width: '100%', display: 'block' }}
              />
            </motion.button>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .photography-columns { column-count: 2 !important; } }
        @media (max-width: 480px) { .photography-columns { column-count: 1 !important; } }
      `}</style>

    </div>
  )

  return (
    <>
      {content}
      {/* Portalled straight to <body> rather than rendered inline: every
          routed page is wrapped in PageTransition, which sets `isolation:
          isolate` to scope its own stacking context. That traps a
          z-index:999999 lightbox rendered inline below the global nav
          header's z-index:99999 no matter how high the number is - the
          header's full-width, pointer-events:auto hit area then visually
          and interactively sits on top of it, which is why the nav used to
          show through the zoomed photo and swallow clicks meant for the
          close button. Porting just the lightbox out of that subtree (same
          fix already used by the Kynhood case-study lightbox) puts it in
          the true root stacking context, where 999999 actually outranks
          the header. */}
      {createPortal(lightboxOverlay, document.body)}
    </>
  )
}
