import { motion } from 'framer-motion'
import { FONTS, MOTION } from '../theme'
import { useBreakpoint } from '../hooks/useBreakpoint'

// "How I work" - short philosophy statement. Used to have an image
// placeholder column alongside it; removed per feedback, now just the text.
export default function SkillPills({ dark = false }: { dark?: boolean }) {
  const { isTablet } = useBreakpoint()
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 700,
        margin: '0 auto',
        padding: isTablet ? '3rem 1.25rem' : '4rem 2rem',
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
          I start with data when it already exists, or competitive research when the problem
          is new. From there I move fast, from wireframe to shipped product. At Kynhood that
          meant owning a feature end to end. I mapped the real workflow, designed the
          interface, and used data to see whether it actually worked once it was live.
        </p>
      </motion.div>
    </div>
  )
}
