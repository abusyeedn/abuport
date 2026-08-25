import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS, MOTION } from '../theme'
import { WRITINGS, estimateReadTime } from '../data/writings'

const PAGE_BG = '#F8F6F3'

// Long-form writing list - title, read time, arrow to open. Deliberately
// just a plain list (no cards/images) since this is text-first, unlike the
// Visual Piece / Photography walls. New entries just get added to
// src/data/writings.ts, nothing here needs to change.
export default function WritingsPage() {
  const navigate = useNavigate()

  // The page's own div background stops covering the viewport once the
  // site's CSS-zoom scaling (ViewportScaler) shrinks it below 100vh - `vh`
  // doesn't reliably compensate for the zoom, so a short page (one writing
  // so far) left a strip of the body's default white showing below it.
  // Coloring body itself removes the seam regardless of that zoom math.
  useEffect(() => {
    const original = document.body.style.backgroundColor
    document.body.style.backgroundColor = PAGE_BG
    return () => { document.body.style.backgroundColor = original }
  }, [])

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: PAGE_BG }}>
      <div style={{ width: '100%', maxWidth: 720, margin: '0 auto', padding: '11.5rem 2rem 4rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MOTION.easeArray }}
          style={{ marginBottom: '3rem', textAlign: 'center' }}
        >
          <h1 style={{ margin: 0, fontFamily: FONTS.display, fontStyle: 'italic', letterSpacing: '0.015em', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#1a2420' }}>
            Writings
          </h1>
          <p style={{ margin: '1rem auto 0', fontFamily: FONTS.body, fontSize: '1rem', lineHeight: 1.6, color: '#5c6b64', maxWidth: 480 }}>
            Ideas and product thinking that don't belong to a single shipped project.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {WRITINGS.map((w, i) => (
            <motion.button
              key={w.slug}
              onClick={() => navigate(`/writings/${w.slug}`)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: MOTION.easeArray }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem',
                width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                padding: '1.5rem 0', borderTop: i === 0 ? '1px solid rgba(20,32,52,.12)' : 'none',
                borderBottom: '1px solid rgba(20,32,52,.12)',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontFamily: FONTS.display, fontSize: '1.3rem', fontWeight: 700, color: '#1a2420', lineHeight: 1.3 }}>
                  {w.title}
                </h3>
                <span style={{ display: 'block', marginTop: 6, fontFamily: FONTS.body, fontSize: '0.85rem', color: '#5c6b64' }}>
                  {estimateReadTime(w.body)}
                </span>
              </div>
              <Icon icon="solar:arrow-right-up-outline" width={20} color="#077a4b" style={{ flexShrink: 0 }} />
            </motion.button>
          ))}
        </div>
      </div>

    </div>
  )
}
