import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS, MOTION } from '../theme'
import { useBreakpoint } from '../hooks/useBreakpoint'

export type CaseStudyStat = { value: string; label: string }

export type CaseStudyHeroProps = {
  client: string
  period: string
  category: string
  title: string
  subtitle: string
  mockupImage: string
  stats: CaseStudyStat[]
  onBack: () => void
  /** CSS gradient for the full-bleed background */
  gradient?: string
}

// Full-bleed gradient case-study hero - pattern lifted from
// michaeltsirakis.com/work/netflix-script-hub: back link, small meta line,
// oversized title, subhead, a stat row, then a floating device-mockup image
// riding the bottom edge. Rebuilt as a reusable component (any case study
// can pass its own client/gradient/stats) with this project's own tokens.
export default function CaseStudyHero({ client, period, category, title, subtitle, mockupImage, stats, onBack, gradient }: CaseStudyHeroProps) {
  const { isMobile } = useBreakpoint()
  return (
    <div
      style={{
        width: '100%',
        background: gradient || 'linear-gradient(160deg, #043d33 0%, #077a4b 45%, #00cbb4 100%)',
        padding: isMobile ? '2rem 1.25rem 0' : '3rem 2.5rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.button
          onClick={onBack}
          whileHover={{ x: -3 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.85)', fontFamily: FONTS.body, fontSize: '0.9rem', fontWeight: 600,
            padding: 0,
          }}
        >
          <Icon icon="solar:arrow-left-outline" width={16} /> All Work
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: MOTION.easeArray, delay: 0.1 }}
          style={{ marginTop: isMobile ? '2.5rem' : '5rem', maxWidth: 800 }}
        >
          <span style={{ fontFamily: FONTS.body, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>
            {client} · {period} · {category}
          </span>
          <h1 style={{ margin: '0.75rem 0 0 0', fontFamily: FONTS.body, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.02em', color: '#ffffff' }}>
            {title}
          </h1>
          <p style={{ marginTop: '1.5rem', fontFamily: FONTS.body, fontSize: '1.15rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.8)', maxWidth: 600 }}>
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: MOTION.easeArray, delay: 0.2 }}
          style={{ marginTop: '3.5rem', display: 'flex', flexWrap: 'wrap', gap: '2.5rem 3.5rem' }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: FONTS.display, fontSize: '1.6rem', fontWeight: 700, color: '#ffffff' }}>{s.value}</div>
              <div style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: MOTION.easeArray, delay: 0.15 }}
          style={{ marginTop: '4rem', borderRadius: '16px 16px 0 0', overflow: 'hidden', boxShadow: '0 -20px 60px rgba(0,0,0,0.25)' }}
        >
          <img src={mockupImage} alt={title} style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 560 }} />
        </motion.div>
      </div>
    </div>
  )
}
