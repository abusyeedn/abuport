import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS, MOTION } from '../theme'
import { useBreakpoint } from '../hooks/useBreakpoint'

// Riffs on michaeltsirakis.com's "About" intro block (highlighted-keyword
// paragraph + stat chips + two CTAs) but doesn't copy its layout: the
// keywords get an animated wavy underline that draws in on scroll instead of
// plain color, and the side column is a rotated yellow sticky-note quote -
// borrowed from this site's own AboutPage post-it motif, not Michael's plain
// text column - with the stat chips and CTAs stacked underneath it, styled
// distinctly from each other (soft tinted tags vs. solid/outline buttons).

function Keyword({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  const accent = dark ? '#00cbb4' : '#077a4b'
  return (
    <span style={{ position: 'relative', display: 'inline-block', color: accent, fontWeight: 700 }}>
      {children}
      <motion.svg
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: MOTION.easeArray, delay: 0.15 }}
        style={{ position: 'absolute', left: 0, bottom: -4, width: '100%', height: 8, overflow: 'visible' }}
      >
        <motion.path
          d="M0,5 Q25,0 50,5 T100,5"
          fill="none"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </motion.svg>
    </span>
  )
}

const STATS = ['Chennai, India 🇮🇳', 'B.Tech AI & Data Science 🎓', 'Open to opportunities 🚀', '3+ shipped case studies 📐']

export default function AboutIntro({ dark = false }: { dark?: boolean }) {
  const { isTablet } = useBreakpoint()
  const textPrimary = dark ? '#f5f5f5' : '#0f172a'
  const textMuted = dark ? '#a1a1a1' : '#64748b'
  const chipBg = dark ? 'rgba(0,203,180,0.14)' : 'rgba(7,122,75,0.08)'
  const chipColor = dark ? '#00cbb4' : '#077a4b'

  return (
    <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: isTablet ? '0 1.25rem 4rem' : '0 2rem 6rem', display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1.6fr 1fr', gap: isTablet ? '2rem' : '3rem', alignItems: 'start' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: MOTION.easeArray }}
      >
        <span style={{ fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: textMuted }}>
          About
        </span>
        <h3 style={{ margin: '0.75rem 0 0 0', fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', fontWeight: 700, color: textPrimary }}>
          Hi again
        </h3>
        <p style={{ margin: '1rem 0 0 0', fontFamily: FONTS.display, fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 700, lineHeight: 1.55, color: textPrimary }}>
          Outside of design, I'm usually deep into <Keyword dark={dark}>video games</Keyword> - Assassin's Creed, GTA V, or
          a FIFA match. I used to make small bits of music, and I've edited a couple of reels for a
          few creators along the way. Lately I spend a lot of my free time <Keyword dark={dark}>vibe coding</Keyword> - just
          building whatever idea's stuck in my head that day.
        </p>
      </motion.div>

      {/* Right column: sticky-note quote, then stat tags, then CTAs - stacked, each visually distinct */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.75rem' }}>
        <motion.div
          initial={{ opacity: 0, rotate: 0, y: 16 }}
          whileInView={{ opacity: 1, rotate: -2.5, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: MOTION.easeArray, delay: 0.2 }}
          whileHover={{ rotate: 0, scale: 1.02 }}
          style={{
            background: '#fef08a',
            border: '1px solid #fde047',
            borderRadius: '2px',
            padding: '22px',
            boxShadow: '2px 10px 25px rgba(0,0,0,0.18), 0 2px 5px rgba(0,0,0,0.08)',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%) rotate(1deg)', width: '80px', height: '22px', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(0,0,0,0.04)' }} />
          <p style={{ margin: 0, fontFamily: FONTS.display, fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.5, color: '#713f12' }}>
            "Good design is as little design as possible - less, but better, because it
            concentrates on the essential aspects."
          </p>
          <p style={{ margin: '10px 0 0 0', fontFamily: FONTS.body, fontSize: '0.8rem', fontWeight: 600, color: '#8a6d1f' }}>
            - Dieter Rams
          </p>
        </motion.div>

        {/* Stat tags - soft tinted fill, no border, small type: reads as metadata not as actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: MOTION.easeArray, delay: 0.3 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
        >
          {STATS.map((s) => (
            <span
              key={s}
              style={{
                fontFamily: FONTS.body,
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: 6,
                background: chipBg,
                color: chipColor,
              }}
            >
              {s}
            </span>
          ))}
        </motion.div>

        {/* CTA - just the resume download now; "More about me" removed */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <motion.a
            href="/gallery/resume.pdf"
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '14px 24px', borderRadius: 999,
              background: dark ? '#ffffff' : '#0f172a', color: dark ? '#0f172a' : '#ffffff',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              fontFamily: FONTS.body, fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none',
            }}
          >
            <Icon icon="solar:download-outline" width={16} /> Download resume
          </motion.a>
        </div>
      </div>
    </div>
  )
}
