import { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS, MOTION, MOBILE_TYPE } from '../theme'
import { MENTORS } from '../data/mentors'
import { useBreakpoint } from '../hooks/useBreakpoint'

const PAGE_BG = '#F8F6F3'

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('')
}

// Fisher-Yates on a copy - shuffles display order per visit without touching
// the shared MENTORS export, which seoConfig.ts also reads for structured
// data and shouldn't reorder underneath it.
function shuffled<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export default function MentorsPage() {
  const [mentors] = useState(() => shuffled(MENTORS))
  const { isMobile } = useBreakpoint()
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: PAGE_BG }}>
      <div style={{ width: '100%', maxWidth: 1160, margin: '0 auto', padding: isMobile ? '2rem 1.25rem 4rem' : '11.5rem 2rem 6rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MOTION.easeArray }}
          style={{ marginBottom: '4rem', textAlign: 'center' }}
        >
          <h1 style={{ margin: 0, fontFamily: FONTS.display, fontStyle: 'italic', letterSpacing: '0.015em', fontSize: isMobile ? '1.5rem' : 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#1a2420' }}>
            Mentors
          </h1>
          <p style={{ margin: '1rem auto 0', fontFamily: FONTS.body, fontSize: '1rem', lineHeight: 1.6, color: '#5c6b64', maxWidth: 560 }}>
            I follow them, watch their videos, and some I've met personally. That's how I've learned design from them.
          </p>
        </motion.div>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '3rem 1.5rem', justifyItems: 'center' }}
        >
          {mentors.map((mentor, i) => (
            <motion.a
              key={mentor.name + i}
              href={mentor.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: MOTION.easeArray }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                textDecoration: 'none', textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 176, height: 176, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                  border: '1px solid rgba(20,32,52,.1)', boxShadow: '0 2px 6px rgba(20,32,52,.06), 0 16px 40px -20px rgba(20,32,52,.22)',
                  background: '#0b5c47', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {mentor.image ? (
                  <img src={mentor.image} alt={mentor.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <span style={{ fontFamily: FONTS.display, fontSize: '2.75rem', fontWeight: 700, color: '#eaf5ee' }}>
                    {initials(mentor.name)}
                  </span>
                )}
              </div>

              <div>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: FONTS.display, fontSize: isMobile ? MOBILE_TYPE.lg : '1.05rem', fontWeight: 700, color: '#1a2420' }}>
                  {mentor.name}
                  <Icon icon={mentor.platform === 'linkedin' ? 'mdi:linkedin' : 'mdi:youtube'} width={16} color="#077a4b" />
                </span>
                <p style={{ margin: '0.35rem 0 0', fontFamily: FONTS.body, fontSize: isMobile ? MOBILE_TYPE.sm : '0.85rem', lineHeight: 1.5, color: '#5c6b64' }}>
                  {mentor.note}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  )
}
