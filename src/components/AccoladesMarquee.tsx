import { FONTS } from '../theme'

// Scrolling ticker bar, inspired by vishnuroy.com's accolades strip -
// pure CSS animation (no JS scroll listeners) for a smooth infinite loop.
export default function AccoladesMarquee({ items }: { items: string[] }) {
  const loop = [...items, ...items] // duplicated for a seamless wrap
  return (
    <div style={{ width: '100%', overflow: 'hidden', background: '#111111', padding: '14px 0' }}>
      <style>{`
        @keyframes accolades-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
      <div style={{ display: 'flex', width: 'max-content', animation: 'accolades-scroll 28s linear infinite' }}>
        {loop.map((text, i) => (
          <span
            key={i}
            style={{
              fontFamily: FONTS.body,
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#f5f5f5',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
              padding: '0 28px',
              borderRight: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
