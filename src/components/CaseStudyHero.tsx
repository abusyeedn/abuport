import { motion } from 'framer-motion'
import { FONTS, MOTION } from '../theme'
import { useBreakpoint } from '../hooks/useBreakpoint'
import SplitFlapText from './SplitFlapText'

export type CaseStudyStat = { value: string; label: string }

export type CaseStudyHeroProps = {
  client: string
  period: string
  category: string
  title: string
  subtitle: string
  mockupImage: string
  stats: CaseStudyStat[]
  /** CSS gradient for the full-bleed background */
  gradient?: string
  /** 'row' (default) puts stats in a horizontal row below the subtitle;
   *  'column-right' puts text on the left and stats stacked in a right
   *  column instead, for pages where the stats read as a standalone
   *  "impact" column rather than a footnote row. */
  statsLayout?: 'row' | 'column-right'
}

// Full-bleed gradient case-study hero - pattern lifted from
// michaeltsirakis.com/work/netflix-script-hub: back link, small meta line,
// oversized title, subhead, a stat row, then a floating device-mockup image
// riding the bottom edge. Rebuilt as a reusable component (any case study
// can pass its own client/gradient/stats) with this project's own tokens.
export default function CaseStudyHero({ client, period, category, title, subtitle, mockupImage, stats, gradient, statsLayout = 'row' }: CaseStudyHeroProps) {
  const { isMobile } = useBreakpoint()
  const columnLayout = statsLayout === 'column-right' && !isMobile

  const statsBlock = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: MOTION.easeArray, delay: 0.2 }}
      style={
        columnLayout
          ? { display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingTop: '0.5rem' }
          : { marginTop: '3.5rem', display: 'flex', flexWrap: 'wrap', gap: '2.5rem 3.5rem' }
      }
    >
      {stats.map((s) => (
        <div key={s.label}>
          <SplitFlapText
            words={[' '.repeat(s.value.length), s.value]}
            loop={false}
            cycleDelay={300}
            padTo={s.value.length}
            flipDuration={0.09}
            stagger={0.04}
            flipsPerChar={6}
            fontSize={26}
            gap={1}
            tileRadius={4}
            tileColor="#020a02"
            textColor="#ffffff"
          />
          <div style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: '#ffffff', marginTop: '6px' }}>{s.label}</div>
        </div>
      ))}
    </motion.div>
  )

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
        <div style={columnLayout ? { marginTop: '5rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '4rem', alignItems: 'start' } : undefined}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: MOTION.easeArray, delay: 0.1 }}
            style={{ marginTop: columnLayout ? 0 : (isMobile ? '2.5rem' : '5rem'), maxWidth: 800 }}
          >
            <span style={{ fontFamily: FONTS.body, fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.02em', color: 'rgba(255,255,255,0.75)' }}>
              {client} · {period} · {category}
            </span>
            <h1 style={{ margin: '0.75rem 0 0 0', fontFamily: FONTS.body, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.02em', color: '#ffffff' }}>
              {title}
            </h1>
            <p style={{ marginTop: '1.5rem', fontFamily: FONTS.body, fontSize: '1.15rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.8)', maxWidth: 600 }}>
              {subtitle}
            </p>
          </motion.div>

          {columnLayout && statsBlock}
        </div>

        {!columnLayout && statsBlock}

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: MOTION.easeArray, delay: 0.15 }}
          style={{ marginTop: '4rem', borderRadius: '16px', overflow: 'hidden', background: '#ffffff' }}
        >
          <img src={mockupImage} alt={title} style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 560 }} />
        </motion.div>
      </div>
    </div>
  )
}
