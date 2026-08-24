import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS, MOTION } from '../theme'

export type WorkCardProps = {
  image: string
  tag?: string
  period?: string
  title: string
  description: string
  onClick: () => void
  dark?: boolean
  index?: number
  hoverLabel?: string
  // 'cover' (default) fills the 4:3 box, cropping overflow - 'contain' shows
  // the whole image letterboxed, for source art that's already wide/composite
  // and shouldn't be cut into.
  imageFit?: 'cover' | 'contain'
}

// "Selected work" card - gradient-framed thumbnail treatment inspired by
// michaeltsirakis.com's portfolio grid, rebuilt with this project's own tokens.
// Motion: scroll-triggered staggered entrance (harshgond) + hover lift with
// an image zoom on the thumbnail (michaeltsirakis).
export default function WorkCard({ image, tag, period, title, description, onClick, dark = false, index = 0, hoverLabel = 'Read case study', imageFit = 'cover' }: WorkCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      whileHover="hover"
      transition={{ duration: 0.5, delay: index * 0.08, ease: MOTION.easeArray }}
      style={{
        textAlign: 'left',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '36px',
        width: '100%',
      }}
    >
      <motion.div
        variants={{ hover: { y: -6 } }}
        transition={{ duration: 0.3, ease: MOTION.easeArray }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
          borderRadius: '14px',
          overflow: 'hidden',
          background: imageFit === 'contain' ? '#e9e9ea' : 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
          boxShadow: '0 2px 6px rgba(20,32,52,.06), 0 24px 56px -28px rgba(20,32,52,.26)',
        }}
      >
        {image.endsWith('.mp4') || image.endsWith('.mov') || image.endsWith('.webm') ? (
          <motion.video
            src={image}
            autoPlay
            loop
            muted
            playsInline
            variants={{ hover: { scale: 1.06, filter: 'blur(3px) brightness(0.7)' } }}
            initial={{ filter: 'blur(0px) brightness(1)' }}
            transition={{ duration: 0.9, ease: MOTION.easeArray }}
            style={{ width: '100%', height: '100%', objectFit: imageFit, display: 'block' }}
          />
        ) : (
          <motion.img
            src={image}
            alt={title}
            variants={{ hover: { scale: 1.06, filter: 'blur(3px) brightness(0.7)' } }}
            initial={{ filter: 'blur(0px) brightness(1)' }}
            transition={{ duration: 0.9, ease: MOTION.easeArray }}
            style={{ width: '100%', height: '100%', objectFit: imageFit, display: 'block' }}
          />
        )}
        {/* "View case study" - fades in over the blurred/dimmed image on hover,
            michaeltsirakis.com's card-hover pattern */}
        <motion.div
          variants={{ hover: { opacity: 1, y: 0 } }}
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: MOTION.easeArray }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-cta)',
              background: 'rgba(255,255,255,0.95)',
              color: '#0f172a',
              fontFamily: FONTS.body,
              fontSize: '0.8rem',
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}
          >
            {hoverLabel} <Icon icon="solar:arrow-right-up-outline" width={14} />
          </span>
        </motion.div>
      </motion.div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {(tag || period) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: FONTS.body }}>
            {tag && <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: dark ? '#00cbb4' : '#077a4b' }}>{tag}</span>}
            {period && <span style={{ fontSize: '0.78rem', color: dark ? '#8a8a8a' : '#64748b' }}>{period}</span>}
          </div>
        )}
        <motion.h3
          variants={{ hover: { x: 4 } }}
          transition={{ duration: 0.25, ease: MOTION.easeArray }}
          style={{ margin: 0, fontFamily: FONTS.display, fontSize: '1.6rem', fontWeight: 700, color: dark ? '#f5f5f5' : '#0f172a' }}
        >
          {title}
        </motion.h3>
        <p style={{ margin: 0, fontFamily: FONTS.body, fontSize: '0.95rem', lineHeight: 1.5, color: dark ? '#a1a1a1' : '#475569' }}>{description}</p>
      </div>
    </motion.button>
  )
}
