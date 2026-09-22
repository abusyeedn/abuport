/**
 * MobileHero.tsx
 *
 * Mobile-native take on the desktop hero (App.tsx) - just the plain,
 * centered name/tagline/description. Used to sit inside a rotated yellow
 * sticky-note card (background, tape, tilt) on a green cutting-mat
 * background; both the card styling and the mat are gone now, matching
 * desktop's hero.
 */
import { motion } from 'framer-motion'
import { FONTS, MOBILE_TYPE, TYPE, MOTION, COLORS } from '../theme'
import ShinyName from '../components/ShinyName'

export default function MobileHero() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: MOTION.easeArray }}
      style={{ textAlign: 'center' }}
    >
      <ShinyName fontSize="clamp(2rem, 10vw, 2.5rem)">Abu Syeed</ShinyName>

      <p style={{ margin: '1rem 0 0', fontFamily: FONTS.display, fontSize: MOBILE_TYPE.lg, fontWeight: 700, color: COLORS.textPrimary }}>
        Product &amp; Designer | 2.6 XP | Chennai
      </p>

      <p style={{ margin: '0.4rem 0 0', fontFamily: FONTS.body, fontSize: MOBILE_TYPE.sm, lineHeight: TYPE.loose, color: COLORS.textMuted }}>
        I did my education in AI and data science, and spent the last 2.5 years
        at Kynhood, designing, solving real problems, and learning product management
        and strategy along the way, using AI wherever it could help me move faster.
        I've also worked on a feature end to end, designing it completely from start
        to finish. I've dropped a few more case studies below for you to check out.
      </p>
    </motion.header>
  )
}
