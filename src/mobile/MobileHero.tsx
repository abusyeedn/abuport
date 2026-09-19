/**
 * MobileHero.tsx
 *
 * Mobile-native take on the desktop hero (App.tsx) - same real content and
 * same visual language, restacked vertically for a phone. Desktop never
 * puts body text directly on the green "cutting mat" - the mat is just a
 * decorative backdrop, real copy sits on a yellow sticky note, and short
 * labels ("Kynhood - Product Designer", "I use these tools") get a tight
 * green-filled badge around just that text. This mirrors that exactly
 * instead of dropping paragraph text straight onto the green fill, which
 * is why the earlier version read as low-contrast.
 */
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS, MOBILE_TYPE, TYPE, MOTION } from '../theme'
import ShinyName from '../components/ShinyName'

const TOOLS = [
  'Group 481987.png',
  'Group 481988.png',
  'Group 481989.png',
  'Group 481991.png',
  'image 289.png',
  'image 290.png',
]

function GreenBadge({ children, fontSize = MOBILE_TYPE.sm }: { children: React.ReactNode; fontSize?: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '5px 12px', borderRadius: 8,
      background: '#0b5c47',
      fontFamily: FONTS.display, fontStyle: 'italic', letterSpacing: '0.015em', fontSize, fontWeight: 700,
      color: '#eaf5ee',
    }}>
      {children}
    </span>
  )
}

export default function MobileHero({ onViewJourney }: { onViewJourney: () => void | Promise<void> }) {
  return (
    <header>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: MOTION.easeArray }}
        style={{
          position: 'relative',
          borderRadius: 22,
          padding: '1.5rem 1.25rem',
          backgroundColor: '#0b5c47',
          backgroundImage: `
            repeating-linear-gradient(to right, rgba(255,255,255,0.14) 0, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(to bottom, rgba(255,255,255,0.14) 0, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 20px)
          `,
          backgroundSize: '20px 20px, 20px 20px',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}
      >
        {/* Yellow sticky note - name/tagline/description, same as desktop */}
        <div
          style={{
            position: 'relative',
            background: '#fef3b0',
            padding: '1.35rem',
            boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
          }}
        >
          <div style={{
            position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%) rotate(-3deg)',
            width: 60, height: 18,
            background: 'rgba(255,255,255,0.55)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          }} />

          <ShinyName fontSize="clamp(1.3rem, 6.5vw, 1.5rem)">Abu Syeed</ShinyName>

          <p style={{ margin: '0.75rem 0 0', fontFamily: FONTS.display, fontSize: MOBILE_TYPE.md, fontWeight: 600, color: '#1a2420' }}>
            Product &amp; Designer | 2.6 XP | Chennai
          </p>

          <p style={{ margin: '0.4rem 0 0', fontFamily: FONTS.body, fontSize: MOBILE_TYPE.sm, lineHeight: TYPE.loose, color: '#3a463f' }}>
            I did my undergrad in AI, and at my last company, Kynhood, I spent
            my time designing, solving real problems, and learning product strategy along
            the way, using AI wherever it could help me move faster.
          </p>
        </div>

        {/* Kynhood card - image, tight green title badge, white CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <img
            src="/gallery/kynhood/kyn-cover.png"
            alt="Kynhood - Product Designer, June 2024 to July 2026"
            fetchPriority="high"
            decoding="async"
            style={{ width: '100%', display: 'block', borderRadius: 16 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <GreenBadge>Kynhood - Product Designer</GreenBadge>
            <button
              onClick={onViewJourney}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0,
                padding: '9px 14px', borderRadius: 'var(--radius-cta)',
                background: '#ffffff', color: '#0f172a',
                border: 'none', cursor: 'pointer',
                fontFamily: FONTS.body, fontSize: MOBILE_TYPE.xs, fontWeight: 400,
                whiteSpace: 'nowrap',
              }}
            >
              Journey <Icon icon="solar:arrow-right-up-outline" width={12} />
            </button>
          </div>
        </div>

        {/* Tool stack - same "I use these tools" green badge + icon set as desktop */}
        <div style={{ textAlign: 'center' }}>
          <GreenBadge>I use these tools</GreenBadge>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.85rem', marginTop: '1rem' }}>
            {TOOLS.map((file) => (
              <img
                key={file}
                src={`/gallery/${encodeURIComponent(file)}`}
                alt=""
                width={36}
                height={36}
                style={{ width: 36, height: 36, borderRadius: 9, display: 'block' }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </header>
  )
}
