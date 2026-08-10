import { useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { FONTS } from '../theme'

interface TimelineEntry {
  id: string
  date: string
  title: string
  subtext: string
  accent: string
}

// Latest first - reverse chronological, read top to bottom.
const ENTRIES: TimelineEntry[] = [
  {
    id: 'now',
    date: 'Now',
    title: 'Founding something',
    subtext: 'Convinced a founder, co-founding (stealth). Side jobs, quests, notice period.',
    accent: '#f472b6',
  },
  {
    id: '2026',
    date: '2026',
    title: 'Kynhood',
    subtext: 'AI and 9 to 9.',
    accent: '#f59e0b',
  },
  {
    id: '2025',
    date: '2025',
    title: 'Kynhood',
    subtext: 'Full time 9 to 9, hehe.',
    accent: '#f59e0b',
  },
  {
    id: '2024',
    date: '2024',
    title: 'Spaarks → Kynhood',
    subtext: 'Spaarks, second paid internship. Later, the Kynhood internship.',
    accent: '#a78bfa',
  },
  {
    id: '2023',
    date: '2023',
    title: 'College',
    subtext: 'Little college studies. Focus.',
    accent: '#60a5fa',
  },
  {
    id: '2022',
    date: '2022',
    title: 'Cloud Counselage',
    subtext: 'First paid internship.',
    accent: '#34d399',
  },
  {
    id: '2020',
    date: '2020',
    title: 'College',
    subtext: '1 year of covid. College.',
    accent: '#60a5fa',
  },
  {
    id: '2006-2020',
    date: '2006 - 2020',
    title: 'Studies',
    subtext: '2019 - small freelance graphic designer.',
    accent: '#94a3b8',
  },
]

// Subtle plastic-grain texture, generated once as a data URI (no network asset).
const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")"

export default function CrtTimelineTV() {
  const screenRef = useRef<HTMLDivElement>(null)
  const [isOn, setIsOn] = useState(true)

  return (
    <>
    <style>{`
      .crt-tv-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
      .crt-tv-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      @keyframes crt-tv-scan { 0% { transform: translateY(-120%); } 100% { transform: translateY(120%); } }
      @keyframes crt-tv-flicker { 0%, 100% { opacity: 0.12; } 45% { opacity: 0.22; } 50% { opacity: 0.08; } 55% { opacity: 0.2; } }
      @keyframes crt-tv-roll { 0%, 96%, 100% { opacity: 0; } 97%, 99% { opacity: 0.5; } }
      .crt-tv-scanband { animation: crt-tv-scan 5s linear infinite; }
      .crt-tv-grain { animation: crt-tv-flicker 2.4s ease-in-out infinite; }
      .crt-tv-rollbar { animation: crt-tv-roll 9s ease-in-out infinite; }
    `}</style>
    <section
      style={{
        width: '100%',
        position: 'relative',
        padding: '80px 4rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* TV frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '920px',
          background: 'linear-gradient(160deg, #f1f1ee 0%, #d4d4d1 55%, #b8b8b4 100%)',
          borderRadius: '40px',
          padding: '34px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.6)',
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        {/* Plastic grain texture over the whole bezel */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '40px',
            backgroundImage: NOISE_BG,
            opacity: 0.5,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />

        {/* Brand strip */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px',
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: '#78716c',
            }}
          >
            ABU-SUNG
          </span>
        </div>

        {/* Screen - scrolls internally if content overflows, scrollbar hidden */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-4xl)',
            background: '#050607',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9), inset 0 0 4px rgba(0,0,0,1)',
            height: '580px',
          }}
        >
          {isOn ? (
            <>
              <div
                ref={screenRef}
                className="crt-tv-scroll"
                style={{ position: 'relative', zIndex: 1, overflowY: 'auto', height: '100%', padding: '40px 52px', boxSizing: 'border-box', textAlign: 'left' }}
              >
                {ENTRIES.map((e, i) => (
                  <div
                    key={e.id}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--space-5)',
                      paddingBottom: i === ENTRIES.length - 1 ? 0 : 'var(--space-10)',
                    }}
                  >
                    {/* Rail: date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100px', flexShrink: 0, justifyContent: 'flex-start', paddingTop: '3px' }}>
                      <span
                        style={{
                          fontFamily: FONTS.mono,
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          color: 'var(--color-text-muted-light)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {e.date}
                      </span>
                    </div>

                    {/* Content - title above, subtext below */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h3
                        style={{
                          fontFamily: FONTS.display,
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: '#f1f5f9',
                          margin: 0,
                          textShadow: `0 0 10px ${e.accent}44`,
                        }}
                      >
                        {e.title}
                      </h3>
                      <span
                        style={{
                          fontFamily: FONTS.primary,
                          fontSize: '0.82rem',
                          color: 'var(--color-text-muted-light)',
                          lineHeight: 1.5,
                        }}
                      >
                        {e.subtext}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CRT texture: scanlines */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  backgroundImage:
                    'repeating-linear-gradient(rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.32) 3px)',
                  mixBlendMode: 'multiply',
                }}
              />
              {/* Pip-Boy texture: green phosphor glass + fine scanlines + vignette */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'radial-gradient(circle at 50% 45%, rgba(74,222,128,0.14) 0%, rgba(0,0,0,0.5) 85%)',
                  mixBlendMode: 'screen',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  backgroundImage: 'linear-gradient(rgba(74,222,128,0) 50%, rgba(0,20,0,0.55) 50%)',
                  backgroundSize: '100% 4px',
                  mixBlendMode: 'multiply',
                }}
              />
              {/* CRT texture: animated moving scan band (electron beam) */}
              <div
                className="crt-tv-scanband"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: '35%',
                  pointerEvents: 'none',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(180,255,200,0.14) 50%, rgba(255,255,255,0) 100%)',
                  mixBlendMode: 'screen',
                }}
              />
              {/* CRT texture: animated fine grain static */}
              <div
                className="crt-tv-grain"
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  backgroundImage: NOISE_BG,
                  mixBlendMode: 'screen',
                }}
              />
              {/* CRT texture: occasional horizontal roll bar glitch */}
              <div
                className="crt-tv-rollbar"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '60%',
                  height: '6px',
                  pointerEvents: 'none',
                  background: 'rgba(255,255,255,0.4)',
                  mixBlendMode: 'overlay',
                }}
              />
              {/* CRT texture: RGB fringing at the edges */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  boxShadow: 'inset 4px 0 8px rgba(255,0,60,0.2), inset -4px 0 8px rgba(0,140,255,0.2)',
                }}
              />
              {/* CRT texture: curvature vignette */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  boxShadow: 'inset 0 0 90px rgba(0,0,0,0.75)',
                }}
              />
            </>
          ) : null}
        </div>

        {/* Control deck: speaker grill + power button */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'var(--space-5)',
            padding: '0 4px',
          }}
        >
          {/* Speaker grill */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 4px)',
              gridAutoRows: '4px',
              gap: '4px',
            }}
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '999px',
                  background: 'radial-gradient(circle at 35% 35%, #dedad4, #9c9a95 70%)',
                  boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.4)',
                }}
              />
            ))}
          </div>

          {/* Power button - bevel & emboss */}
          <button
            onClick={() => setIsOn((v) => !v)}
            aria-label={isOn ? 'Turn screen off' : 'Turn screen on'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(160deg, #ffffff 0%, #d9d9d6 45%, #b3b3af 100%)',
              boxShadow: isOn
                ? '0 2px 3px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -2px 3px rgba(0,0,0,0.25)'
                : 'inset 0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 1px rgba(255,255,255,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              icon="solar:power-outline"
              width={18}
              color={isOn ? '#22c55e' : '#71717a'}
              style={{ filter: isOn ? 'drop-shadow(0 0 3px rgba(34,197,94,0.8))' : 'none' }}
            />
          </button>
        </div>
      </div>
    </section>
    </>
  )
}
