import { motion } from 'framer-motion'
import { FONTS, MOTION } from '../theme'
import { useBreakpoint } from '../hooks/useBreakpoint'

// "What I bring to the table" - heading left, image placeholder right.
// The chip cluster was removed per feedback; the right column now holds a
// placeholder box until a real image is supplied to drop in here.
export default function SkillPills({ dark = false }: { dark?: boolean }) {
  const { isTablet } = useBreakpoint()
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        padding: isTablet ? '3rem 1.25rem' : '4rem 2rem',
        display: 'grid',
        gridTemplateColumns: isTablet ? '1fr' : '1fr 1.4fr',
        gap: isTablet ? '2rem' : '3rem',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: MOTION.easeArray }}
      >
        <h2 style={{ margin: 0, fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: dark ? '#f5f5f5' : '#1a2420', lineHeight: 1.2 }}>
          How I work
        </h2>
        <p style={{ marginTop: '1.25rem', fontFamily: FONTS.body, fontSize: '1rem', lineHeight: 1.6, color: dark ? '#a1a1a1' : '#5c6b64' }}>
          I start from research, not assumptions - then move fast from wireframe to shipped
          product. At Kynhood that means owning a feature end to end: mapping the real
          workflow, designing the interface, and using data to see whether it actually
          worked once it's live.
        </p>
      </motion.div>

      {/* Placeholder - swap for the real image */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: MOTION.easeArray }}
        style={{
          width: '100%',
          aspectRatio: '4 / 3',
          borderRadius: 20,
          border: `1.5px dashed ${dark ? 'rgba(255,255,255,0.2)' : '#cfcdc3'}`,
          background: dark ? 'rgba(255,255,255,0.03)' : '#f2f1ec',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 600, color: dark ? '#6a6a6a' : '#9a9890' }}>
          Image placeholder
        </span>
      </motion.div>
    </div>
  )
}
