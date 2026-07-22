import { useEffect, useState } from 'react'
import { FONTS } from '../theme'

const STORYBOOK_URL = 'https://storybook-static-five-cyan.vercel.app'

interface ColorToken { name: string; value: string }
const COLOR_FAMILIES: { label: string; shades: ColorToken[] }[] = [
  { label: 'Brand', shades: [
    { name: 'brand-50', value: '#fde9ea' }, { name: 'brand-100', value: '#f9bbbe' }, { name: 'brand-200', value: '#f69b9e' },
    { name: 'brand-300', value: '#f26d72' }, { name: 'brand-400', value: '#ef5157' }, { name: 'brand-500', value: '#eb252d' },
    { name: 'brand-600', value: '#d62229' }, { name: 'brand-700', value: '#a71a20' }, { name: 'brand-800', value: '#811419' }, { name: 'brand-900', value: '#631013' },
  ]},
  { label: 'Primary — Yellow', shades: [
    { name: 'yellow-50', value: '#fffbec' }, { name: 'yellow-100', value: '#fff2c3' }, { name: 'yellow-200', value: '#ffeba6' },
    { name: 'yellow-300', value: '#ffe27d' }, { name: 'yellow-400', value: '#ffdd64' }, { name: 'yellow-500', value: '#ffd43d' },
    { name: 'yellow-600', value: '#e8c138' }, { name: 'yellow-700', value: '#b5972b' }, { name: 'yellow-800', value: '#8c7522' }, { name: 'yellow-900', value: '#6b591a' },
  ]},
  { label: 'Accent — Red', shades: [
    { name: 'red-50', value: '#ffe7e8' }, { name: 'red-100', value: '#ffb5b6' }, { name: 'red-200', value: '#ff9293' },
    { name: 'red-300', value: '#ff6062' }, { name: 'red-400', value: '#ff4144' }, { name: 'red-500', value: '#ff1115' },
    { name: 'red-600', value: '#e80f13' }, { name: 'red-700', value: '#b50c0f' }, { name: 'red-800', value: '#8c090c' }, { name: 'red-900', value: '#6b0709' },
  ]},
  { label: 'Accent — Orange', shades: [
    { name: 'orange-50', value: '#fff7ed' }, { name: 'orange-100', value: '#ffe7c7' }, { name: 'orange-200', value: '#ffdbac' },
    { name: 'orange-300', value: '#ffcb86' }, { name: 'orange-400', value: '#ffc16e' }, { name: 'orange-500', value: '#ffb14a' },
    { name: 'orange-600', value: '#e8a143' }, { name: 'orange-700', value: '#b57e35' }, { name: 'orange-800', value: '#8c6129' }, { name: 'orange-900', value: '#6b4a1f' },
  ]},
  { label: 'Accent — Green', shades: [
    { name: 'green-50', value: '#f1f7f1' }, { name: 'green-100', value: '#d3e6d2' }, { name: 'green-200', value: '#bdd9bd' },
    { name: 'green-300', value: '#9fc89f' }, { name: 'green-400', value: '#8dbd8c' }, { name: 'green-500', value: '#70ad6f' },
    { name: 'green-600', value: '#669d65' }, { name: 'green-700', value: '#507b4f' }, { name: 'green-800', value: '#3e5f3d' }, { name: 'green-900', value: '#2f492f' },
  ]},
  { label: 'Accent — Blue', shades: [
    { name: 'blue-50', value: '#e7f7ff' }, { name: 'blue-100', value: '#b5e7ff' }, { name: 'blue-200', value: '#92dbff' },
    { name: 'blue-300', value: '#60cbff' }, { name: 'blue-400', value: '#41c1ff' }, { name: 'blue-500', value: '#11b1ff' },
    { name: 'blue-600', value: '#0fa1e8' }, { name: 'blue-700', value: '#0c7eb5' }, { name: 'blue-800', value: '#09618c' }, { name: 'blue-900', value: '#074a6b' },
  ]},
  { label: 'Accent — Purple', shades: [
    { name: 'purple-50', value: '#f3eeff' }, { name: 'purple-100', value: '#dacaff' }, { name: 'purple-200', value: '#c8b0ff' },
    { name: 'purple-300', value: '#af8cff' }, { name: 'purple-400', value: '#a076ff' }, { name: 'purple-500', value: '#8854ff' },
    { name: 'purple-600', value: '#7c4ce8' }, { name: 'purple-700', value: '#613cb5' }, { name: 'purple-800', value: '#4b2e8c' }, { name: 'purple-900', value: '#39236b' },
  ]},
  { label: 'Neutral — Dark', shades: [
    { name: 'dark-50', value: '#eaeaea' }, { name: 'dark-100', value: '#bebebe' }, { name: 'dark-200', value: '#9f9f9f' },
    { name: 'dark-300', value: '#737373' }, { name: 'dark-400', value: '#585858' }, { name: 'dark-500', value: '#2e2e2e' },
    { name: 'dark-600', value: '#2a2a2a' }, { name: 'dark-700', value: '#212121' }, { name: 'dark-800', value: '#191919' }, { name: 'dark-900', value: '#131313' },
  ]},
  { label: 'Neutral — Gray', shades: [
    { name: 'gray-50', value: '#fdfdfd' }, { name: 'gray-100', value: '#f8f8f8' }, { name: 'gray-200', value: '#f5f5f5' },
    { name: 'gray-300', value: '#f0f0f0' }, { name: 'gray-400', value: '#ededed' }, { name: 'gray-500', value: '#e9e9e9' },
    { name: 'gray-600', value: '#d4d4d4' }, { name: 'gray-700', value: '#a5a5a5' }, { name: 'gray-800', value: '#808080' }, { name: 'gray-900', value: '#626262' },
  ]},
]

const TYPE_SCALE = [
  { name: '48 / Bold / Display Medium', fontSize: 48, fontWeight: 700, lineHeight: 72 },
  { name: '40 / Bold / Display Small', fontSize: 40, fontWeight: 700, lineHeight: 60 },
  { name: '32 / Bold / Heading Large', fontSize: 32, fontWeight: 700, lineHeight: 38.4 },
  { name: '24 / Bold / Heading Medium', fontSize: 24, fontWeight: 700, lineHeight: 28.8 },
  { name: '20 / Bold / Heading Small', fontSize: 20, fontWeight: 700, lineHeight: 24 },
  { name: '20 / Bold / Label Large', fontSize: 20, fontWeight: 700, lineHeight: 30 },
  { name: '16 / Semibold / Label Medium', fontSize: 16, fontWeight: 600, lineHeight: 24 },
  { name: '14 / Semibold / Label Small', fontSize: 14, fontWeight: 600, lineHeight: 21 },
  { name: '16 / Regular / Paragraph Large', fontSize: 16, fontWeight: 400, lineHeight: 24 },
  { name: '14 / Regular / Paragraph Medium', fontSize: 14, fontWeight: 400, lineHeight: 21 },
  { name: '12 / Regular / Paragraph Small', fontSize: 12, fontWeight: 400, lineHeight: 14.4 },
]

const SPACING_SCALE = [0, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72]
const RADIUS_SCALE = [0, 4, 8, 12, 16, 28, 100]

const COMPONENTS = [
  // Atoms
  { name: 'Avatar', desc: 'User identity badge — image, initials, or anonymous icon, 4 sizes.', docId: 'components-avatar--docs' },
  { name: 'Badge', desc: 'Status dot or count overlay — info, success, warning, error.', docId: 'components-badge--docs' },
  { name: 'Button', desc: '3 sizes, 3 themes, 3 variants, optional leading/trailing icons.', docId: 'components-button--docs' },
  { name: 'Checkbox', desc: 'Multi-select toggle with disabled and validation states.', docId: 'components-checkbox--docs' },
  { name: 'Chips', desc: 'Compact removable tags for filters and metadata.', docId: 'components-chips--docs' },
  { name: 'RadioButton', desc: 'Single-select control with validation states.', docId: 'components-radio--docs' },
  // Molecules
  { name: 'InputTextField', desc: 'Single-line input with placeholder, error, and success states.', docId: 'components-inputtextfield--docs' },
  { name: 'Banner', desc: 'Inline alert block for page-level messaging.', docId: 'components-banner--docs' },
  { name: 'Menu', desc: 'Anchored dropdown option list.', docId: 'components-menu--docs' },
  // Organisms
  { name: 'BottomSheet', desc: 'Slide-up overlay drawer for contextual actions on mobile.', docId: 'components-bottomsheet--docs' },
  { name: 'Modal', desc: 'Focus-locked dialog for confirmations and forms.', docId: 'components-modal--docs' },
  { name: 'Wizard', desc: 'Multi-step progress control with click-to-jump navigation.', docId: 'components-wizard--docs' },
]

function useManropeFont() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])
}

function CopyableSwatch({ token }: { token: ColorToken }) {
  const [copied, setCopied] = useState(false)
  const shadeOnly = token.name.split('-').pop() || ''
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(token.value).catch(() => {})
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
      title={`${token.name} — click to copy`}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'none', background: 'none',
        cursor: 'pointer', padding: 0, textAlign: 'center', width: '48px',
      }}
    >
      <div style={{
        width: '48px', height: '32px', borderRadius: '6px', background: token.value,
        border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '4px', position: 'relative'
      }}>
        {copied && <span style={{ fontSize: '0.5rem', fontWeight: 700, color: '#0f172a', background: 'rgba(255,255,255,0.85)', padding: '1px 3px', borderRadius: '3px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Copied</span>}
      </div>
      <span style={{ fontSize: '0.58rem', color: '#64748b', fontFamily: FONTS.mono }}>{shadeOnly}</span>
      <span style={{ fontSize: '0.55rem', color: '#94a3b8', fontFamily: FONTS.mono }}>{token.value}</span>
    </button>
  )
}

/** Live component browser — chip selector + real embedded Storybook. */
export function KynDsComponentsBrowser() {
  const [activeDoc, setActiveDoc] = useState(COMPONENTS[4].docId) // Button by default

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
        {COMPONENTS.map((c) => (
          <button
            key={c.docId}
            onClick={() => setActiveDoc(c.docId)}
            title={c.desc}
            style={{
              padding: '6px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
              border: `1px solid ${activeDoc === c.docId ? '#8b5cf6' : '#e2e8f0'}`,
              background: activeDoc === c.docId ? '#8b5cf6' : '#ffffff',
              color: activeDoc === c.docId ? '#ffffff' : '#334155',
              transition: 'all 0.15s',
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div style={{
        borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0',
        boxShadow: '0 6px 24px rgba(0,0,0,0.06)', background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <span style={{ width: '9px', height: '9px', borderRadius: '999px', background: '#ef4444' }} />
          <span style={{ width: '9px', height: '9px', borderRadius: '999px', background: '#eab308' }} />
          <span style={{ width: '9px', height: '9px', borderRadius: '999px', background: '#22c55e' }} />
          <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: '#94a3b8', fontFamily: FONTS.mono }}>
            storybook-static-five-cyan.vercel.app
          </span>
        </div>
        <iframe
          key={activeDoc}
          src={`${STORYBOOK_URL}/iframe.html?id=${activeDoc}&viewMode=docs`}
          title="Kyn DS Storybook"
          loading="lazy"
          style={{ width: '100%', height: '680px', border: 'none', display: 'block' }}
        />
      </div>
    </div>
  )
}

/** Live color-token swatches, click to copy hex. */
export function KynDsColorTokens() {
  return (
    <div style={{ marginTop: '8px' }}>
      {COLOR_FAMILIES.map((fam) => (
        <div key={fam.label} style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', fontFamily: FONTS.primary }}>{fam.label}</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {fam.shades.map((s) => <CopyableSwatch key={s.name} token={s} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Live Manrope type scale, rendered at true size/weight/line-height. */
export function KynDsTypeScale() {
  useManropeFont()
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', background: '#fff', marginTop: '8px' }}>
      {TYPE_SCALE.map((t, i) => (
        <div
          key={t.name}
          style={{
            display: 'flex', alignItems: 'baseline', gap: '16px', padding: '14px 18px', flexWrap: 'wrap',
            borderBottom: i === TYPE_SCALE.length - 1 ? 'none' : '1px solid #f1f5f9',
          }}
        >
          <span style={{ width: '190px', flexShrink: 0, fontSize: '0.65rem', fontFamily: FONTS.mono, color: '#94a3b8' }}>
            {t.name}
          </span>
          <span style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: `${Math.min(t.fontSize, 32)}px`,
            fontWeight: t.fontWeight,
            lineHeight: `${Math.min(t.lineHeight, 40)}px`,
            color: '#0f172a',
          }}>
            Kynhood design, live.
          </span>
        </div>
      ))}
    </div>
  )
}

/** Live spacing + corner-radius scale. */
export function KynDsSpacingRadius() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '8px' }}>
      <div>
        <h5 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>Gaps</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {SPACING_SCALE.map((px) => (
            <div key={px} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '34px', flexShrink: 0, fontSize: '0.65rem', fontFamily: FONTS.mono, color: '#94a3b8' }}>{px}px</span>
              <div style={{ height: '8px', width: `${px}px`, maxWidth: '140px', background: '#8b5cf6', borderRadius: '3px' }} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h5 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>Corner Radius</h5>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {RADIUS_SCALE.map((r) => (
            <div key={r} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: `${Math.min(r, 21)}px`, background: '#f3eeff', border: '1px solid #8b5cf633' }} />
              <span style={{ fontSize: '0.6rem', fontFamily: FONTS.mono, color: '#94a3b8' }}>{r}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Full inline explorer — all four pieces combined, for standalone use. */
export default function KynDsExplorer() {
  useManropeFont()
  return (
    <div style={{ marginTop: '8px' }}>
      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>The Components — Live</h4>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '14px' }}>
        Click a component to load its real Storybook doc page — controls, props table, and all.
      </p>
      <div style={{ marginBottom: '32px' }}><KynDsComponentsBrowser /></div>

      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>Color Tokens</h4>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '18px' }}>
        9 palettes, exported from Figma variables. Click a swatch to copy its hex.
      </p>
      <div style={{ marginBottom: '32px' }}><KynDsColorTokens /></div>

      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>Typography</h4>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '14px' }}>
        Manrope, 11 styles from 12px paragraphs to 48px display.
      </p>
      <div style={{ marginBottom: '32px' }}><KynDsTypeScale /></div>

      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>Spacing &amp; Radius</h4>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
        16 spacing steps, 7 corner-radius steps — the rhythm every component is built on.
      </p>
      <KynDsSpacingRadius />
    </div>
  )
}
