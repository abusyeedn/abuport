import { FONTS } from '../theme';

export default function FreeTimeLabel() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{
        fontFamily: FONTS.primary,
        fontSize: '24px',
        color: '#555',
        transform: 'rotate(-5deg)',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}>
        i make these in my free time
      </span>
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#555"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: 'rotate(120deg) scaleY(-1)', flexShrink: 0 }}
      >
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
      </svg>
    </div>
  )
}
