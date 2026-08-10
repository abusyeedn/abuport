import { motion } from 'framer-motion'
import { FONTS, MOTION } from '../theme'
import BackButton from '../components/BackButton'

// Placeholder route for the "Visual UI" nav item - empty page reserved for
// future content (UI shots, visual design work, etc.), not yet populated.
export default function VisualUiPage() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#F8F6F3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: MOTION.easeArray }}
        style={{ textAlign: 'center', maxWidth: 480 }}
      >
        <span style={{ fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
          Visual UI
        </span>
        <h1 style={{ margin: '0.75rem 0 0 0', fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#1a2420' }}>
          Coming soon
        </h1>
        <p style={{ marginTop: '1rem', fontFamily: FONTS.body, fontSize: '1rem', lineHeight: 1.6, color: '#5c6b64' }}>
          This page is reserved for visual UI work - screens, interface explorations, and
          design shots. Nothing here yet.
        </p>
      </motion.div>
      <BackButton to="/" />
    </div>
  )
}
