/** Centralized design tokens */

export const FONTS = {
  display:   "'Stack Sans Headline', sans-serif",
  body:      "'Stack Sans', sans-serif",
  primary:   "'Stack Sans', sans-serif",
  secondary: "'Cormorant Garamond', Georgia, serif",
  mono:      "'SF Mono', 'Fira Code', monospace",
} as const

export const TYPE = {
  // size
  xs:   '0.70rem',   // 11.2px — labels, caps
  sm:   '0.80rem',   // 12.8px — secondary text
  base: '0.90rem',   // 14.4px — body
  md:   '1.00rem',   // 16px   — large body
  lg:   '1.15rem',   // 18.4px — subheadings
  xl:   '1.35rem',   // 21.6px — section titles
  '2xl':'1.75rem',   // 28px   — page subheadings
  '3xl':'2.25rem',   // 36px   — page headings
  '4xl':'3.00rem',   // 48px   — hero
  // weight
  regular: 400,
  medium:  500,
  semibold:600,
  bold:    700,
  extrabold:800,
  // line height
  tight:  1.2,
  snug:   1.4,
  normal: 1.6,
  relaxed:1.75,
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
} as const

export const RADII = {
  sm:   '6px',
  md:   '10px',
  lg:   '16px',
  xl:   '24px',
  pill: '999px',
} as const

export const COLORS = {
  // Backgrounds
  bgPrimary:   '#ffffff',
  bgSecondary: '#f8fafc',
  bgDark:      '#0f172a',
  // Text
  textPrimary:   '#0f172a',
  textSecondary: '#475569',
  textMuted:     '#94a3b8',
  textInverse:   '#ffffff',
  // Border
  border:      '#e2e8f0',
  borderStrong:'#cbd5e1',
  // Brand accent
  accent:      '#0ea5e9',
  accentDark:  '#0369a1',
} as const

/** Icon names — all outline style (Solar icon set) */
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
