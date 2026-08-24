import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS, MOTION } from '../theme'
import { useBreakpoint } from '../hooks/useBreakpoint'

export type FeaturedWorkCardProps = {
  image: string
  tag: string
  period: string
  title: string
  description?: string
  onClick: () => void
  dark?: boolean
}

// Large flagship project banner - sits above the regular Selected Work grid
// for a project big enough to lead with (Kynhood). Same visual language as
// WorkCard (gradient frame, hover zoom) just full-width and horizontal
// instead of stacked.
export default function FeaturedWorkCard({ image, tag, period, title, description, onClick, dark = false }: FeaturedWorkCardProps) {
  const { isTablet } = useBreakpoint()
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      whileHover="hover"
      transition={{ duration: 0.6, ease: MOTION.easeArray }}
      style={{
        textAlign: 'left',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: isTablet ? '1fr' : '1.3fr 1fr',
        gap: isTablet ? '1.5rem' : '2.5rem',
        alignItems: isTablet ? 'stretch' : 'center',
      }}
    >
      <motion.div
        variants={{ hover: { y: -6 } }}
        transition={{ duration: 0.3, ease: MOTION.easeArray }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 10',
          borderRadius: '18px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #043d33 0%, #077a4b 45%, #00cbb4 100%)',
          boxShadow: '0 4px 10px rgba(20,32,52,.08), 0 32px 64px -28px rgba(20,32,52,.32)',
        }}
      >
        <motion.img
          src={image}
          alt={title}
          variants={{ hover: { scale: 1.05, filter: 'blur(3px) brightness(0.7)' } }}
          initial={{ filter: 'blur(0px) brightness(1)' }}
          transition={{ duration: 0.9, ease: MOTION.easeArray }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <motion.div
          variants={{ hover: { opacity: 1, y: 0 } }}
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: MOTION.easeArray }}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: 'var(--radius-cta)', background: 'rgba(255,255,255,0.95)', color: '#0f172a', fontFamily: FONTS.body, fontSize: '0.8rem', fontWeight: 400, letterSpacing: '0.02em' }}>
            View journey <Icon icon="solar:arrow-right-up-outline" width={14} />
          </span>
        </motion.div>
      </motion.div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: FONTS.body, marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: dark ? '#8a8a8a' : '#64748b' }}>{tag}</span>
          <span style={{ fontSize: '0.8rem', color: dark ? '#6a6a6a' : '#94a3b8' }}>{period}</span>
        </div>
        <h3 style={{ margin: 0, fontFamily: FONTS.display, fontSize: 'clamp(2.1rem, 4vw, 2.9rem)', fontWeight: 700, color: dark ? '#f5f5f5' : '#0f172a', lineHeight: 1.1 }}>
          {title}
        </h3>
        {description && (
          <p style={{ margin: '1rem 0 0 0', fontFamily: FONTS.body, fontSize: '1.05rem', lineHeight: 1.55, color: dark ? '#a1a1a1' : '#475569' }}>
            {description}
          </p>
        )}
      </div>
    </motion.button>
  )
}
