import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FONTS } from '../theme'
import DidYouKnow from '../components/DidYouKnow'
import { Icon } from '@iconify/react'
import Dock from '../components/Dock'
import Footer from '../components/Footer'
import FigmaElement from '../components/FigmaElement'
import DynamicRenderer from '../components/DynamicRenderer'
import { useNavigate } from 'react-router-dom'


function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
      color: '#4ade80', margin: '0 0 12px', paddingBottom: '6px',
      borderBottom: '1px solid rgba(74,222,128,0.2)', fontFamily: 'monospace',
    }}>
      {children}
    </h2>
  )
}

function JobEntry({ company, role, location, period, bullets }: {
  company: string; role: string; location: string; period: string; bullets: string[]
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px', marginBottom: '1px' }}>
        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#d1fae5' }}>{company}</span>
        <span style={{ fontSize: '0.7rem', color: '#6ee7b7', fontStyle: 'italic' }}>{period}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
        <span style={{ fontSize: '0.75rem', color: '#6ee7b7', fontStyle: 'italic' }}>{role}</span>
        <span style={{ fontSize: '0.7rem', color: '#6ee7b7' }}>{location}</span>
      </div>
      <ul style={{ margin: 0, paddingLeft: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ fontSize: '0.75rem', color: '#a7f3d0', lineHeight: 1.65 }}>{b}</li>
        ))}
      </ul>
    </div>
  )
}

export default function ResumePage() {
  const navigate = useNavigate()

  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#ffffff'
    return () => { document.body.style.backgroundColor = prev }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', backgroundColor: '#fff', fontFamily: FONTS.primary }}>

      {/* Grid background */}
      <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="resumeSmallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d1d5db" strokeWidth="0.4" />
          </pattern>
          <pattern id="resumeGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#resumeSmallGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#d1d5db" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#resumeGrid)" />
      </svg>

      {/* Stage */}
      <div style={{
        flex: 1, position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center',
        paddingLeft: '48px', paddingRight: '48px',
        paddingTop: '4rem', paddingBottom: '8rem',
        gap: '28px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>

        {/* Pip-Boy — left */}
        <FigmaElement figmaId="resume-pipboy" style={{ display: 'block', position: 'relative', flex: 1, minWidth: 0, overflow: 'visible' }}>
        <motion.div
          initial={{ x: '-100vw', opacity: 0, filter: 'blur(24px)' }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #0a1a0f 0%, #071210 50%, #0a1a0f 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(74,222,128,0.3)',
            boxShadow: '0 0 0 1px rgba(74,222,128,0.1), 0 0 60px rgba(74,222,128,0.08), 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(74,222,128,0.15)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* scanlines */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 4px)',
          }} />
          {/* glow */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9,
            background: 'radial-gradient(ellipse at 50% 30%, rgba(74,222,128,0.04) 0%, transparent 70%)',
          }} />

          {/* resume body */}
          <div style={{ padding: '24px 28px 32px' }}>

            {/* header */}
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(74,222,128,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '2px' }}>
                <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#d1fae5', margin: 0, lineHeight: 1.1, fontFamily: 'monospace', textShadow: '0 0 20px rgba(74,222,128,0.35)' }}>
                  Abusyeed
                </h1>
                <a
                  href="/gallery/resume.pdf"
                  download
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0,
                    padding: '5px 12px', borderRadius: '4px',
                    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.28)',
                    color: '#4ade80', fontSize: '0.65rem', fontFamily: 'monospace',
                    textDecoration: 'none', letterSpacing: '0.08em',
                    boxShadow: '0 0 8px rgba(74,222,128,0.1)',
                    marginTop: '6px',
                  }}
                >
                  <Icon icon="solar:download-outline" width={12} /> Download
                </a>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#6ee7b7', margin: '0 0 12px', fontFamily: 'monospace' }}>
                Product Designer · AI/Data Science · Chennai
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', fontSize: '0.68rem', fontFamily: 'monospace' }}>
                {[
                  { icon: <Icon icon="solar:phone-outline" width={11} />, label: '+91-938400 5600', href: 'tel:+919384005600' },
                  { icon: <Icon icon="solar:letter-outline" width={11} />, label: 'abusyeed10202@gmail.com', href: 'mailto:abusyeed10202@gmail.com' },
                  { icon: <Icon icon="solar:linkedin-outline" width={11} />, label: 'linkedin.com/in/abusyeed1/', href: 'https://linkedin.com/in/abusyeed1/' },
                  { icon: <Icon icon="solar:globe-outline" width={11} />, label: 'portfolio', href: '/' },
                ].map(c => (
                  <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6ee7b7', textDecoration: 'none' }}>
                    {c.icon}{c.label}
                  </a>
                ))}
              </div>
            </div>

            {/* experience */}
            <section style={{ marginBottom: '18px' }}>
              <SectionTitle>Experience</SectionTitle>
              <JobEntry
                company="Kynhood" role="Product Designer" location="Chennai" period="Jun 2024 – Present"
                bullets={[
                  'Events feature (0→1): Designed across 3 platforms and operator portals. Feature crossed 3 Cr GMV within 8 months.',
                  'Grew organic retention from 10% to 31% (3×) using Mixpanel and Clarity for data-informed iteration.',
                  'Pixel-perfect developer handoff; automated OPS and Legal workflows through design.',
                  'Applied Lean UX — prototyped independently using AI-assisted tools (Cursor, Claude).',
                ]}
              />
              <JobEntry
                company="Spaarks" role="UX Design Intern" location="Remote" period="Feb 2024 – Jun 2024"
                bullets={[
                  'Built a computational design system from scratch — components, style guide, UI patterns.',
                  'Contributed to PRDs; ran user research, competitor analysis, and usability evaluation.',
                ]}
              />
              <JobEntry
                company="Cloud Counselage" role="UX Design Intern" location="Remote" period="Feb 2022 – Aug 2023"
                bullets={[
                  'Led product design for web and mobile; shipped MVP independently via Framer and Wix.',
                  'Applied IA, grid systems, typography, color theory, and interaction design principles.',
                ]}
              />
            </section>

            {/* education */}
            <section style={{ marginBottom: '18px' }}>
              <SectionTitle>Education</SectionTitle>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', marginBottom: '1px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#d1fae5' }}>B.Tech – AI and Data Science</span>
                <span style={{ fontSize: '0.7rem', color: '#6ee7b7', fontStyle: 'italic' }}>2020 – 2024</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: '#6ee7b7', fontStyle: 'italic' }}>Sri Manakula Vinayagar Engineering College</span>
                <span style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>87%</span>
              </div>
            </section>

            {/* skills */}
            <section style={{ marginBottom: '18px' }}>
              <SectionTitle>Skills</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.72rem', color: '#a7f3d0', lineHeight: 1.6 }}>
                {[
                  ['Tools', 'Figma, FigJam, Illustrator, Canva, Adobe XD, Sketch, Photoshop'],
                  ['AI Prototyping', 'Cursor, Windsurf, Claude'],
                  ['Low Code', 'Framer, Wix, Lovable'],
                  ['Analytics', 'Mixpanel, Clarity'],
                  ['Certs', 'UX – Accenture, GUVI, Meta · Microsoft AZ900, PL900'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ color: '#4ade80', fontWeight: 700, flexShrink: 0 }}>{k}:</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* achievements */}
            <section>
              <SectionTitle>Achievements</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { title: 'Designathon25 – Lollypop Design Studio', desc: 'Top 6 / 15 Teams', date: 'Aug 2025' },
                  { title: 'Hackfest2022 – PSG iTech', desc: 'Top 25 / 600 Teams', date: 'Sep 2022' },
                  { title: 'Hackathon2022 – Cloud Counselage', desc: '1st prize – National level', date: 'Apr 2022' },
                ].map(a => (
                  <div key={a.title} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.75rem', color: '#d1fae5' }}>{a.title}</span>
                      <span style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>{' – '}{a.desc}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#6ee7b7', fontStyle: 'italic' }}>{a.date}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
        </FigmaElement>

        {/* Did You Know — right, vertically centered */}
        <FigmaElement figmaId="resume-did-you-know" style={{ display: 'flex', position: 'relative', alignItems: 'center', alignSelf: 'stretch' }}>
          <DidYouKnow />
        </FigmaElement>
      </div>

      <DynamicRenderer />
      <Dock
        items={[
          { icon: <Icon icon="solar:arrow-left-outline" width={22} color="#1e293b" />, label: 'Back', onClick: () => navigate(-1) },
          { icon: <Icon icon="solar:home-2-outline" width={22} color="#1e293b" />, label: 'Home', onClick: () => navigate('/') },
          { icon: <Icon icon="solar:file-outline" width={22} color="#1e293b" />, label: 'Resume', onClick: () => navigate('/resume') },
          { icon: <Icon icon="solar:user-outline" width={22} color="#1e293b" />, label: 'About me', onClick: () => navigate('/about') },
        ]}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />
      <Footer />
    </div>
  )
}
