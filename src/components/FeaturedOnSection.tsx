import { motion } from 'framer-motion'
import { FONTS, MOTION } from '../theme'
import { useBreakpoint } from '../hooks/useBreakpoint'

// Third-party recognition strip - Wall of Portfolios featured the site in
// 2026. Kept as its own small section (not folded into a card grid) since
// it's an external badge with a real backlink, not portfolio content, and
// sits above Expertise the same way AboutIntro's kicker pattern is reused
// across the page for a consistent "label + content" rhythm.
const PROFILE_URL = 'https://www.wallofportfolios.in/portfolios/abu-syeed/'

export default function FeaturedOnSection({ dark = false }: { dark?: boolean }) {
  const { isMobile } = useBreakpoint()
  const muted = dark ? '#8a8a8a' : '#64748b'

  return (
    <div style={{ width: '100%', padding: isMobile ? '2.5rem 1.25rem' : '3rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.span
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: MOTION.easeArray }}
          style={{ display: 'block', fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted }}
        >
          Recognition
        </motion.span>

        <motion.a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: MOTION.easeArray }}
          whileHover={{ y: -2 }}
          style={{
            marginTop: '2rem',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            gap: isMobile ? '1.5rem' : '2.5rem',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <img
            src="/gallery/WOP_Silver_Badge_2026.svg"
            alt="Featured on Wall of Portfolios, 2026"
            draggable={false}
            style={{ height: isMobile ? 260 : 500, width: isMobile ? 260 : 500, flexShrink: 0, display: 'block' }}
          />
          <img
            src="/gallery/WOP_Featured_Badge_Black.png"
            alt="Featured on Wall of Portfolios"
            draggable={false}
            style={{ height: isMobile ? 34 : 40, width: 'auto', display: 'block' }}
          />
        </motion.a>
      </div>
    </div>
  )
}
