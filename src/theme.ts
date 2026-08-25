/** Centralized design tokens */

export const FONTS = {
  display:   "'Libre Baskerville', serif",
  body:      "'DM Sans', sans-serif",
  primary:   "'DM Sans', sans-serif",
  secondary: "'Libre Baskerville', serif",
  mono:      "'SF Mono', 'Fira Code', monospace",
} as const

/** Type scale - matches index.css's --text-* custom properties exactly (both are
 *  consumed, e.g. CaseStudiesPage.tsx uses var(--text-sm/md/lg/...) extensively,
 *  so the two must never drift). '4xs'/'3xs' are new additions covering the
 *  smallest real-world clusters (tiny badges/meta) that had no step before. */
export const TYPE = {
  // size
  '4xs':'0.58rem',   // 9.3px  - smallest meta/badge text
  '3xs':'0.65rem',   // 10.4px - tiny badges/meta
  xs:   '0.70rem',   // 11.2px - labels, caps
  sm:   '0.82rem',   // 13.1px - secondary text
  base: '0.95rem',   // 15.2px - body
  md:   '1.05rem',   // 16.8px - large body
  lg:   '1.15rem',   // 18.4px - subheadings
  xl:   '1.35rem',   // 21.6px - section titles
  '2xl':'1.75rem',   // 28px   - page subheadings
  '3xl':'2.25rem',   // 36px   - page headings
  '4xl':'3.00rem',   // 48px   - hero
  // weight
  regular: 400,
  medium:  500,
  semibold:600,
  bold:    700,
  extrabold:800,
  black:   900,
  // line height - calibrated to real clusters found across the codebase
  // (e.g. 1.5 is the single most common value, not 1.6 as the old scale assumed)
  none:    1,      // single-line labels, no-wrap contexts
  tight:   1.2,
  snug:    1.4,    // covers 1.3–1.4 cluster
  normal:  1.5,    // most common body-text value - the real default
  relaxed: 1.6,    // covers 1.55–1.6 cluster
  loose:   1.75,   // covers 1.65–1.8 cluster - generous paragraph text
} as const

/** Mobile-only counterpart to TYPE's size scale (weights/line-heights are
 *  shared - only physical size differs). Desktop renders everything through
 *  ViewportScaler's ~0.8 CSS `zoom`, so a 1.35rem heading there actually
 *  paints at ~21.6px * 0.8 ≈ 17px. Mobile has no such zoom (explicitly reset
 *  to 1 in Root()), so the exact same rem value would paint at its full,
 *  unscaled size - noticeably bigger than the desktop proportions it's
 *  supposed to match. Each step here is ~18% smaller than TYPE's, matching
 *  that zoom factor instead of reading oversized on phones. */
export const MOBILE_TYPE = {
  '4xs':'0.48rem',
  '3xs':'0.53rem',
  xs:   '0.58rem',
  sm:   '0.67rem',
  base: '0.78rem',
  md:   '0.86rem',
  lg:   '0.94rem',
  xl:   '1.11rem',
  '2xl':'1.44rem',
  '3xl':'1.85rem',
  '4xl':'2.46rem',
} as const

export const SPACE = {
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
  100:'400px',
} as const

/** Radius scale - matches the values already dominant across the codebase (a de-facto
 *  Tailwind-style progression), just centralized so future changes are one line.
 *  Mirrors the --radius-* custom properties in index.css exactly. */
export const RADII = {
  xs:     '2px',
  sm:     '4px',
  base:   '6px',
  md:     '8px',
  lg:     '10px',
  xl:     '12px',
  '2xl':  '16px',
  '3xl':  '20px',
  '4xl':  '24px',
  full:   '9999px', // pill buttons/badges
  circle: '50%',    // avatars, dots
} as const

/** New canonical shadow tiers (design.md §8) - exactly two, no per-component recipes. */
export const SHADOWS = {
  subtle: '0 1px 2px rgba(20,32,52,.04), 0 6px 16px -8px rgba(20,32,52,.14)',
  deep:   '0 2px 6px rgba(20,32,52,.06), 0 24px 56px -28px rgba(20,32,52,.26)',
} as const

/** New canonical motion tokens (design.md §6) - one signature ease, three durations. */
export const MOTION = {
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)', // for plain CSS transitions
  easeArray: [0.22, 1, 0.36, 1] as [number, number, number, number], // for Framer Motion's `ease` prop
  dur1: '0.18s',
  dur2: '0.32s',
  dur3: '0.5s',
} as const

export const COLORS = {
  // Backgrounds
  bgPrimary:   '#ffffff',
  bgSecondary: '#f8fafc',
  bgDark:      '#0f172a',
  // Text - matches design.md §2 Light Panel Palette (the dominant real-world values)
  textPrimary:    '#0f172a',
  textSecondary:  '#1e293b', // paragraphs/body - darker "Updated" value per design.md
  textTertiary:   '#334155', // list items, tech chip labels - between secondary and muted
  textMuted:      '#64748b', // captions/labels/timestamps - darker "Updated" value per design.md
  textMutedLight: '#94a3b8', // lighter muted tone, used alongside textMuted in denser panels
  textInverse:    '#ffffff',
  black:          '#000000',
  // Border
  border:      '#e2e8f0',
  borderStrong:'#cbd5e1',
  // Brand accent
  accent:      '#0ea5e9',
  accentDark:  '#0369a1',
  // Status
  error: '#dc2626',

  // New canonical palette (design.md §2) - navy/ink system. Use for new/migrated components;
  // does not replace the dark-canvas home page colors above.
  ink:            '#22271e',
  soft:           '#4a4a40',
  faint:          '#8b95a3',
  navy:           '#16202b',
  navyDeep:       '#0f1822',
  navySoft:       '#e7ecf3',
  onAccent:       '#ffffff',
  emphasisGreen:  '#0083E7',
  surface2:       '#f5f5f5',
  line:           'rgba(20,32,52,.12)',
  hairline:       'rgba(20,32,52,.06)',
} as const

/** Icon names - all outline style (Solar icon set) */
export const ICONS = {
  home:      'solar:home-2-outline',
  back:      'solar:arrow-left-outline',
  resume:    'solar:file-outline',
  about:     'solar:user-outline',
  download:  'solar:download-outline',
  phone:     'solar:phone-outline',
  email:     'solar:letter-outline',
  linkedin:  'solar:linkedin-outline',
  globe:     'solar:globe-outline',
  lock:      'solar:lock-keyhole-outline',
  chart:     'solar:chart-2-outline',
  gallery:   'solar:gallery-outline',
  widget:    'solar:widget-outline',
  camera:    'solar:videocamera-outline',
  clock:     'solar:clock-circle-outline',
  calendar:  'solar:calendar-outline',
  close:     'solar:close-circle-outline',
  check:     'solar:check-circle-outline',
  arrow:     'solar:arrow-right-outline',
} as const

/** Dock icon size */
export const DOCK_ICON_SIZE = 22
