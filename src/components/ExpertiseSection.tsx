import { motion } from 'framer-motion'
import { FONTS, MOTION } from '../theme'
import { useBreakpoint } from '../hooks/useBreakpoint'

// "Expertise" section - category label + sub-skill list rows, style pulled
// from michaeltsirakis.com/work's case-study expertise block, but with Abu's
// real categories/tools (from ResumePage.tsx) instead of Michael's CGI/3D/
// illustration ones. Transparent background (sits on the page's own bg) with
// a blur-reveal scroll-in, matching the blur-reveal pattern already used
// elsewhere on this site (ScrollReveal / the success-toast).
// Kicker + column proportion match AboutIntro's "About" label exactly, so
// the two sections read as one system.
const CATEGORIES = [
  { label: 'Product Design', items: ['User Interface (UI)', 'Wireframes & Prototypes', 'Design Systems', 'Interaction Design'] },
  { label: 'UX & Research', items: ['User Research', 'Usability Testing', 'Competitor Research', 'Information Architecture'] },
  { label: 'AI & Data', items: ['AI-accelerated Prototyping', 'Data-driven Design Decisions', 'IoT & Connected Product UX'] },
  { label: 'Tools', items: ['Figma, FigJam, Sketch', 'Framer, Wix (No-code)', 'Mixpanel, Clarity (Analytics)', 'Cursor, Claude, Lovable, Bolt'] },
]

export default function ExpertiseSection({ dark = false }: { dark?: boolean }) {
  const { isTablet, isMobile } = useBreakpoint()
  const heading = dark ? '#f5f5f5' : '#0f172a'
  const sub = dark ? '#8a8a8a' : '#64748b'
  const muted = dark ? '#a1a1a1' : '#64748b'
  const divider = dark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)'

  return (
    <div style={{ width: '100%', background: 'transparent', padding: isMobile ? '4rem 1.25rem' : '7rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.span
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: MOTION.easeArray }}
          style={{ display: 'block', fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted }}
        >
          Expertise
        </motion.span>

        <div style={{ marginTop: '2rem' }}>
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: MOTION.easeArray }}
              style={{
                display: 'grid',
                gridTemplateColumns: isTablet ? '1fr' : '1fr 2fr',
                gap: isTablet ? '0.75rem' : '2rem',
                padding: '1.75rem 0',
                borderTop: i > 0 ? `1px solid ${divider}` : 'none',
              }}
            >
              <span style={{ fontFamily: FONTS.body, fontSize: '1.05rem', fontWeight: 600, color: heading }}>
                {cat.label}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cat.items.map((item) => (
                  <span key={item} style={{ fontFamily: FONTS.body, fontSize: '0.95rem', color: sub }}>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
