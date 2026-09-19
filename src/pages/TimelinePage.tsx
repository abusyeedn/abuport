import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FONTS, MOTION } from '../theme'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { EVENTS, NEW_EVENT_SEEN_KEY } from '../data/events'

// Simple, static timeline - no admin/editing UI. To update, just edit this
// array directly: { date, title, subtitle?, description? }. Sorted newest
// to oldest (add new entries at the top), pulled from the same facts as
// ResumePage.tsx / api/chat.ts.
const TIMELINE: { date: string; title: string; subtitle?: string; description?: string }[] = [
  {
    date: 'Now',
    title: 'Looking for a job',
    subtitle: 'Actively looking for opportunities, can join immediately',
  },
  {
    date: 'Jun 2026',
    title: 'Kynhood role ended',
    subtitle: 'Actively looking for new opportunities, can join immediately',
  },
  {
    date: 'Aug 2025',
    title: 'Designathon 2025 - Lollypop Design Studio',
    subtitle: 'Top 6 of 15 teams',
  },
  {
    date: 'Jun 2024',
    title: 'Product Designer, Kynhood',
    subtitle: 'Chennai',
    description: "Took the Events feature from a blank page to a live product across web, mobile, and the operator portal. Crossed Rs. 10 Cr+ GMV in 14 months and pushed retention from 10% to 31%. Built and maintained the design system across all three platforms.",
  },
  {
    date: '2024',
    title: 'Graduated - B.Tech AI & Data Science',
    subtitle: '87%',
  },
  {
    date: 'Feb 2024',
    title: 'UX Design Intern, Spaarks',
    subtitle: 'Remote',
    description: 'Set up a computational design system from zero, component structure, visual language, and a style guide, so the team finally had one place to pull from instead of guessing. Worked across the full product cycle too, PRDs, research, usability testing, competitor analysis.',
  },
  {
    date: 'Sep 2022',
    title: 'Hackfest 2022 - PSG iTech',
    subtitle: 'Top 25 of 600 teams',
  },
  {
    date: 'Feb 2022',
    title: 'UX Design Intern, Cloud Counselage',
    subtitle: 'Remote',
    description: 'Took early ownership of an early-stage product and shipped an MVP independently using Framer and Wix, wireframes all the way to a live, clickable product. This is where the fundamentals stuck, information architecture, interaction design, typography, colour theory, grid systems, spacing.',
  },
  {
    date: 'Nov 2021',
    title: 'Hackathon 2022 - Cloud Counselage',
    subtitle: 'First prize, National level',
  },
  {
    date: '2020',
    title: 'B.Tech - Artificial Intelligence & Data Science',
    subtitle: 'Sri Manakula Vinayagar Engineering College',
    description: 'Started a B.Tech in AI & Data Science, the technical foundation that later shaped a design practice built around data-driven decisions and AI-assisted prototyping.',
  },
]

export default function TimelinePage() {
  const { isTablet } = useBreakpoint()
  // Captured once at mount, before the effect below marks it seen - so the
  // "New" badge still shows for this visit (the one it's meant for) and
  // only disappears starting next time.
  const [showNewBadge] = useState(() => localStorage.getItem(NEW_EVENT_SEEN_KEY) !== '1')
  useEffect(() => {
    localStorage.setItem(NEW_EVENT_SEEN_KEY, '1')
  }, [])
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#F8F6F3' }}>
      <div style={{ width: '100%', maxWidth: 1240, margin: '0 auto', padding: '11.5rem 2rem 8rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr', gap: isTablet ? '5rem' : '4rem', alignItems: 'start' }}>

          {/* Left column - Timeline */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: MOTION.easeArray }}
              style={{ marginBottom: '3rem' }}
            >
              <h1 style={{ margin: 0, fontFamily: FONTS.display, fontStyle: 'italic', letterSpacing: '0.015em', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#1a2420' }}>
                Timeline
              </h1>
              <p style={{ margin: '1rem 0 0', fontFamily: FONTS.body, fontSize: '1rem', lineHeight: 1.6, color: '#5c6b64', maxWidth: 480 }}>
                Education, roles, and a few things worth marking along the way.
              </p>
            </motion.div>

            <div style={{ position: 'relative' }}>
              {/* Rail */}
              <div style={{ position: 'absolute', left: 5, top: 8, bottom: 8, width: 1, background: 'rgba(20,32,52,.12)' }} />

              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.date + item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: MOTION.easeArray }}
                  style={{ position: 'relative', paddingLeft: '2rem', marginBottom: i === TIMELINE.length - 1 ? 0 : '2.5rem' }}
                >
                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: 0, top: 6,
                    width: 11, height: 11, borderRadius: '50%',
                    background: '#077a4b', border: '2px solid #F8F6F3',
                    boxShadow: '0 0 0 1px rgba(7,122,75,0.3)',
                  }} />

                  <span style={{ display: 'block', fontFamily: FONTS.body, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#077a4b', marginBottom: 4 }}>
                    {item.date}
                  </span>
                  <h3 style={{ margin: 0, fontFamily: FONTS.display, fontSize: '1.25rem', fontWeight: 700, color: '#1a2420', lineHeight: 1.3 }}>
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <span style={{ display: 'block', marginTop: 4, fontFamily: FONTS.body, fontSize: '0.85rem', color: '#5c6b64' }}>
                      {item.subtitle}
                    </span>
                  )}
                  {item.description && (
                    <p style={{ margin: '0.75rem 0 0', fontFamily: FONTS.body, fontSize: '0.95rem', lineHeight: 1.65, color: '#3a463f', maxWidth: 560 }}>
                      {item.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column - Events photos */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: MOTION.easeArray }}
              style={{ marginBottom: '3rem' }}
            >
              <h2 style={{ margin: 0, fontFamily: FONTS.display, fontStyle: 'italic', letterSpacing: '0.015em', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#1a2420' }}>
                Events
              </h2>
              <p style={{ margin: '1rem 0 0', fontFamily: FONTS.body, fontSize: '1rem', lineHeight: 1.6, color: '#5c6b64', maxWidth: 480 }}>
                Meetups, panels, and sessions I've shown up to, spoken at, or just sat in the crowd for.
              </p>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {EVENTS.map((event, i) => (
                <motion.div
                  key={event.src}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: MOTION.easeArray }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%', aspectRatio: '4 / 3', borderRadius: 14, overflow: 'hidden',
                      border: '1px solid rgba(20,32,52,.1)', boxShadow: '0 2px 6px rgba(20,32,52,.06), 0 16px 40px -20px rgba(20,32,52,.22)',
                    }}
                  >
                    <img src={event.src} alt={event.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    {i === 0 && showNewBadge && (
                      <span
                        style={{
                          position: 'absolute', top: 10, right: 10,
                          background: '#dc2626', color: '#ffffff',
                          fontFamily: FONTS.body, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em',
                          padding: '4px 10px', borderRadius: 'var(--radius-cta)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '0.75rem 0 0', fontFamily: FONTS.body, fontSize: '0.9rem', color: '#5c6b64', textAlign: 'center' }}>
                    {event.caption}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
