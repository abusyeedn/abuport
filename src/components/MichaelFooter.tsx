import { FONTS } from '../theme'

// Footer modeled on michaeltsirakis.com's structure - a "Say hello" CTA line,
// then Email / Elsewhere / Based-in columns, then a copyright line - rebuilt
// with Abu's real contact details, not copied content.
export default function MichaelFooter({ dark = false }: { dark?: boolean }) {
  const bg = dark ? '#0a0a0a' : '#1a1a1a'
  const textPrimary = '#ffffff'
  const textMuted = dark ? '#8a8a8a' : '#94a3b8'
  const labelGreen = '#00cbb4'

  return (
    <footer style={{ width: '100%', background: bg, color: textPrimary, fontFamily: FONTS.body }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 2rem 2.5rem' }}>
        <a
          href="mailto:abusyeed10202@gmail.com"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            fontFamily: FONTS.display,
            fontSize: 'clamp(2.75rem, 9vw, 6.5rem)',
            fontWeight: 200,
            color: textPrimary,
            textDecoration: 'underline',
            textUnderlineOffset: '10px',
            lineHeight: 1,
          }}
        >
          Say hello
        </a>

        <div style={{ marginTop: '6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: labelGreen, marginBottom: '0.6rem' }}>Email</div>
            <a href="mailto:abusyeed10202@gmail.com" style={{ color: textPrimary, textDecoration: 'none', fontSize: '0.95rem' }}>abusyeed10202@gmail.com</a>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: labelGreen, marginBottom: '0.6rem' }}>Elsewhere</div>
            <a href="https://linkedin.com/in/abusyeed1/" target="_blank" rel="noreferrer" style={{ color: textPrimary, textDecoration: 'none', fontSize: '0.95rem' }}>LinkedIn</a>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: labelGreen, marginBottom: '0.6rem' }}>Based in</div>
            <span style={{ fontSize: '0.95rem' }}>Chennai, India</span>
          </div>
        </div>

        <div style={{ marginTop: '5rem', paddingTop: '1.5rem', borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)'}`, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.78rem', color: textMuted }}>
          <span>© {new Date().getFullYear()} Abu Syeed</span>
          <span>Designed and built in Chennai</span>
        </div>
      </div>
    </footer>
  )
}
