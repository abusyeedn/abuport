import { useLayoutEffect, useState, type ReactNode } from 'react'
import { FONTS } from '../theme'

const BASE_WIDTH = 1440   // designed for MacBook Pro 16"
const MOBILE_BP  = 768    // below this → warning page

// ─── Mobile warning ───────────────────────────────────────────────────────────

function CautionTape() {
  return (
    <div style={{ position: 'relative', height: 52, overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        height: 52,
        width: '200%',
        animation: 'tape-scroll 7s linear infinite',
      }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} style={{
            width: 52, height: 52, flexShrink: 0,
            background: i % 2 === 0 ? '#fbbf24' : '#1c1917',
            transform: 'skewX(-18deg)',
          }} />
        ))}
      </div>
      <style>{`
        @keyframes tape-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

function MobileWarning() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#111',
      display: 'flex', flexDirection: 'column',
      fontFamily: FONTS.primary,
      overflow: 'hidden',
    }}>
      <CautionTape />

      {/* Main content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 28px', textAlign: 'center',
      }}>
        {/* Sign */}
        <div style={{
          background: '#fbbf24',
          borderRadius: 20,
          padding: '28px 36px 22px',
          boxShadow: '0 8px 0 #92400e, 0 16px 40px rgba(0,0,0,0.55)',
          marginBottom: 8,
          maxWidth: 260,
          width: '100%',
        }}>
          {/* Falling person SVG */}
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ display: 'block', margin: '0 auto 10px' }}>
            <circle cx="30" cy="9" r="6" fill="#1c1917" />
            <line x1="30" y1="15" x2="18" y2="34" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="24" y1="23" x2="12" y2="19" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="24" y1="23" x2="36" y2="16" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="18" y1="34" x2="9"  y2="50" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="18" y1="34" x2="32" y2="48" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="5"  y1="53" x2="55" y2="53" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />
            <line x1="38" y1="43" x2="43" y2="39" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
            <line x1="42" y1="47" x2="48" y2="45" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1c1917', lineHeight: 1.4 }}>
            CAUTION<br />
            <span style={{ fontWeight: 700 }}>Mobile Zone</span>
          </div>
        </div>

        {/* Post */}
        <div style={{ width: 5, height: 20, background: '#4b5563', borderRadius: '0 0 3px 3px', marginBottom: 28 }} />

        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '0 0 10px', lineHeight: 1.3 }}>
          This is a desktop experience
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0, maxWidth: 280 }}>
          Open this portfolio on a laptop or desktop for the full experience.
        </p>
      </div>

      <CautionTape />
    </div>
  )
}

// ─── Scaler ───────────────────────────────────────────────────────────────────

interface Props { children: ReactNode }

export default function ViewportScaler({ children }: Props) {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : BASE_WIDTH
  )

  // useLayoutEffect → runs synchronously before paint, no flash
  useLayoutEffect(() => {
    function apply(w: number) {
      if (w < MOBILE_BP) {
        document.documentElement.style.zoom = '1'
      } else {
        const scale = Math.min(1, w / BASE_WIDTH)
        document.documentElement.style.zoom = scale.toFixed(4)
      }
    }

    apply(width)

    function onResize() {
      const w = window.innerWidth
      setWidth(w)
      apply(w)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      document.documentElement.style.zoom = '1'
    }
  }, [width])

  if (width < MOBILE_BP) return <MobileWarning />

  return <>{children}</>
}
