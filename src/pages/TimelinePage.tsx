import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FONTS, MOTION } from '../theme'
import BackButton from '../components/BackButton'
import TopHeader from '../components/TopHeader'

// Simple, static timeline - no admin/editing UI. To update, just edit this
// array directly: { date, title, subtitle?, description? }. Sorted newest
// to oldest (add new entries at the top), pulled from the same facts as
// ResumePage.tsx / api/chat.ts.
const TIMELINE: { date: string; title: string; subtitle?: string; description?: string }[] = [
  {
    date: 'Now',
    title: 'FDE, Stealth Startup',
    subtitle: 'A side build, not my main focus, still looking for opportunities',
    description: 'Building a product on the side at a startup still in stealth. This is not my primary role, I am still actively looking for a full-time product design position and can join immediately.',
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
    date: 'Apr 2022',
    title: 'Hackathon 2022 - Cloud Counselage',
    subtitle: 'First prize, National level',
  },
  {
    date: 'Feb 2022',
    title: 'UX Design Intern, Cloud Counselage',
    subtitle: 'Remote',
    description: 'Took early ownership of an early-stage product and shipped an MVP independently using Framer and Wix, wireframes all the way to a live, clickable product. This is where the fundamentals stuck, information architecture, interaction design, typography, colour theory, grid systems, spacing.',
  },
  {
    date: '2020',
    title: 'B.Tech - Artificial Intelligence & Data Science',
    subtitle: 'Sri Manakula Vinayagar Engineering College',
    description: 'Started a B.Tech in AI & Data Science, the technical foundation that later shaped a design practice built around data-driven decisions and AI-assisted prototyping.',
  },
]

export default function TimelinePage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#F8F6F3' }}>
      <TopHeader
        items={[
          { label: 'Case Studies', onClick: () => navigate('/#work') },
          { label: 'Expertise', onClick: () => navigate('/#expertise') },
          { label: 'Posters', onClick: () => navigate('/#posters') },
          { label: 'About', onClick: () => navigate('/#about') },
          { label: 'Visual Piece', onClick: () => navigate('/visual-ui') },
          { label: 'Photography', onClick: () => navigate('/photography') },
          { label: 'Timeline', onClick: () => {}, active: true },
        ]}
        cta={{ label: 'Download resume', onClick: () => { window.open('/gallery/resume.pdf', '_blank') } }}
      />
      <div style={{ width: '100%', maxWidth: 720, margin: '0 auto', padding: '7rem 2rem 8rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MOTION.easeArray }}
          style={{ marginBottom: '4rem', textAlign: 'center' }}
        >
          <h1 style={{ margin: 0, fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#1a2420' }}>
            Timeline
          </h1>
          <p style={{ margin: '1rem auto 0', fontFamily: FONTS.body, fontSize: '1rem', lineHeight: 1.6, color: '#5c6b64', maxWidth: 480 }}>
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

      <BackButton to="/" />
    </div>
  )
}
