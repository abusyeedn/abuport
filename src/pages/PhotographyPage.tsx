import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS, MOTION } from '../theme'
import BackButton from '../components/BackButton'
import TopHeader from '../components/TopHeader'

// Hides the header on scroll-down, brings it back on scroll-up - same
// pattern as Visual Piece, since this is also a long scannable image wall.
function useHideHeaderOnScroll() {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
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
  }, [])

  return hidden
}

// Real camera/cloud photos only - the old /gallery/home/gallery_*.jpg set
// was poster/graphic-design artwork, not photography, so it's excluded here.
// Add more objects here as new shots come in; `caption` is optional if a
// photo doesn't need one.
//
// Note: /gallery/photod/20260423_171559.heic was left out - browsers other
// than Safari can't render HEIC. Export it as a .jpg/.png and add it here.
const PHOTOS: { image: string; caption?: string }[] = [
  { image: '/gallery/photod/IMG_20211010_142526252.jpg' },
  { image: '/gallery/photod/IMG_20211021_200126931.jpg' },
  { image: '/gallery/photod/IMG_20211130_092755545.jpg' },
  { image: '/gallery/photod/IMG_20211231_140701693.jpg' },
  { image: '/gallery/photod/IMG_20220413_055206910.jpg' },
  { image: '/gallery/photod/IMG_20220629_152052844.jpg' },
  { image: '/gallery/photod/IMG_20220912_183639449.jpg' },
  { image: '/gallery/photod/IMG_20230222_184907592.jpg' },
  { image: '/gallery/photod/Snapchat-546225346.jpg' },
]

export default function PhotographyPage() {
  const navigate = useNavigate()
  const [lightbox, setLightbox] = useState<{ image: string; caption?: string } | null>(null)
  const headerHidden = useHideHeaderOnScroll()

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#F8F6F3' }}>
      <TopHeader
        hidden={headerHidden}
        items={[
          { label: 'Case Studies', onClick: () => navigate('/#work') },
          { label: 'Expertise', onClick: () => navigate('/#expertise') },
          { label: 'Posters', onClick: () => navigate('/#posters') },
          { label: 'About', onClick: () => navigate('/#about') },
          { label: 'Visual Piece', onClick: () => navigate('/visual-ui') },
          { label: 'Photography', onClick: () => {}, active: true },
          { label: 'Timeline', onClick: () => navigate('/timeline') },
        ]}
        cta={{ label: 'Download resume', onClick: () => { window.open('/gallery/resume.pdf', '_blank') } }}
      />
      <div style={{ width: '100%', margin: '0 auto', padding: '7rem 2rem 6rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MOTION.easeArray }}
          style={{ marginBottom: '4rem', textAlign: 'center' }}
        >
          <h1 style={{ margin: 0, fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#1a2420' }}>
            Photography
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

      <BackButton to="/" />

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
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 'clamp(1rem, 5vw, 4rem)', cursor: 'zoom-out',
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
              }}
            >
              <Icon icon="solar:close-circle-bold" width={24} />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.18 }}
              src={lightbox.image}
              alt={lightbox.caption || 'Photograph'}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 12, cursor: 'default', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            />
            {lightbox.caption && (
              <p
                onClick={(e) => e.stopPropagation()}
                style={{ margin: '1.25rem 0 0', fontFamily: FONTS.body, fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', cursor: 'default' }}
              >
                {lightbox.caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
