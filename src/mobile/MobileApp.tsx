/**
 * MobileApp.tsx
 *
 * Standalone mobile experience for the 300–700px band.
 *
 * This is deliberately NOT a responsive reflow of the desktop site - the desktop
 * build is a fixed-1440px canvas driven by ViewportScaler's CSS `zoom`, GSAP pins,
 * and a drag-positioned FigmaElement layout, none of which survive a phone viewport.
 * It's a real, independently-breakpointed layout instead - but it's built to *look*
 * like the desktop site: same design tokens (theme.ts), same imagery, same section
 * structure (hero → Kynhood → sub-projects → design systems → other work → contact),
 * same card language as WorkCard/FeaturedWorkCard. Only the mechanics differ.
 *
 * Nothing here imports desktop *components* (KynhoodBentoCards, App.tsx, etc.) -
 * those pull in GSAP/Lenis/the FigmaElement editor, which would bloat and couple
 * the mobile bundle to machinery it can't use. Content that lives only in those
 * files (card copy, image paths) is duplicated here in plain data instead.
 *
 * main.tsx renders this *instead of* the desktop route tree, for every path, since
 * there's no router here - a phone can't open a second window, so tapping through
 * to a full case study copies its desktop URL to the clipboard instead of navigating.
 */
import { useState } from 'react'
import { Icon } from '@iconify/react'
import { FONTS, TYPE, MOBILE_TYPE, COLORS } from '../theme'
import MobileChat from './MobileChat'

// ── Content ──────────────────────────────────────────────────────────────────
// Mirrors the homepage's real section order: Kynhood's sub-project case
// studies, the design systems, then general selected work. (The Kynhood
// flagship card itself was folded into the hero on desktop and dropped here
// to match - no separate "My journey" section anymore.)

// Descriptions here are the exact homeBlurb/description strings the desktop
// homepage shows for the same cards (App.tsx / KynhoodBentoCards.tsx) - not
// separately-paraphrased mobile copy, so the two builds never drift apart.
const KYNHOOD_SUB_PROJECTS = [
  {
    image: '/gallery/aa1.jpg',
    title: 'Registration → Pre-booking → Booking',
    description: 'Rebuilt after a 12K-buyer launch-day crash, ~20% of organizers signed on after',
    path: '/kynhood2/case/registration-pre-booking-booking',
  },
  {
    image: '/gallery/kyncaseimg/flow19.jpg',
    title: 'Partial Payments',
    description: 'Split payments that turned a ₹5,000 group trip into real, completed bookings',
    path: '/kynhood2/case/partial-payments',
  },
  {
    image: '/gallery/kyncaseimg/cover22.jpg',
    title: 'QR Validation & Live Attendance',
    description: '35,000+ gate scans, zero downtime, even at full DB load',
    path: '/kynhood2/case/qr-validation-live-attendance',
  },
]

const DESIGN_SYSTEMS = [
  {
    image: '/gallery/kyn-ds-docs/images/kyn_ds_cover.jpg',
    title: 'Kynhood Design System',
    description: '224 semantic tokens, 12 components, zero hardcoded hex values',
    path: '/kynhood2/case/neighbourhood-design-system',
  },
  {
    image: '/gallery/kyn-ds-docs/images/style_guide_cover.jpg',
    title: 'Kynhood Style Guide',
    description: '12 tested components shipped without a full engineering migration',
    path: '/kynhood2/case/style-guide-design-system',
  },
  {
    image: '/gallery/spaarks/spark_ds_cover.jpg',
    title: 'Spaarks Design System',
    description: '24 reusable components built for the Spaarks Android app, navigation, dialogs, form fields, and more, with full variants and states.',
    path: '/spaarks',
  },
]

const SELECTED_WORK = [
  {
    image: '/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Kynhood - UX & AI/Untitled.jpg',
    tag: 'Case Study',
    title: 'Kynhood - UX & AI',
    description: 'Users were confused selecting zone-areas during onboarding - the flow had no mapping to real Chennai geography.',
    path: '/casestudies/kynhood---ux-&-ai',
  },
]

// Mirrors ExpertiseSection.tsx's categories (desktop, `src/components/ExpertiseSection.tsx`).
const EXPERTISE = [
  { label: 'Product Design', items: ['High-fidelity UI', 'Wireframes & Interactive Prototyping', 'Design Systems & Component Libraries', 'Interaction Design'] },
  { label: 'UX & Research', items: ['User Research & Usability Testing', 'User Personas & Journey Mapping', 'Information Architecture', 'Competitor Analysis'] },
  { label: 'AI & Data', items: ['AI-native Product Design', 'Data-driven Design Decisions', 'Token-based Design', 'Agentic AI Workflows'] },
  { label: 'Tools', items: ['Figma, FigJam, Sketch, Adobe XD', 'Cursor, Claude, Lovable, Bolt, Windsurf', 'Framer, Wix (No-code)', 'Mixpanel, Clarity, Google Analytics'] },
]

const LINKS = [
  { label: 'Email', value: 'abusyeed10202@gmail.com', href: 'mailto:abusyeed10202@gmail.com', icon: 'solar:letter-outline' },
  // Brand mark comes from `mdi` - the Solar set used elsewhere here has no
  // linkedin glyph (`solar:linkedin-outline` silently renders nothing).
  { label: 'LinkedIn', value: 'linkedin.com/in/abusyeed1', href: 'https://linkedin.com/in/abusyeed1/', icon: 'mdi:linkedin' },
]

// ── Primitives ───────────────────────────────────────────────────────────────

/** Small uppercase eyebrow + serif heading, echoing the desktop section headers
 *  ("Portfolio" / "Selected work") instead of the old terminal `> LABEL` style. */
function SectionHeading({ eyebrow, children }: { eyebrow: string; children: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <span
        style={{
          display: 'block',
          fontFamily: FONTS.body,
          fontSize: MOBILE_TYPE['3xs'],
          fontWeight: TYPE.bold,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: COLORS.textMuted,
          marginBottom: 6,
        }}
      >
        {eyebrow}
      </span>
      <h2
        style={{
          margin: 0,
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.05rem, 5.5vw, 1.35rem)',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: COLORS.textPrimary,
        }}
      >
        {children}
      </h2>
    </div>
  )
}

function Divider() {
  return <div style={{ height: '1px', flexShrink: 0, background: COLORS.hairline, margin: '28px 0' }} />
}

/**
 * Desktop's WorkCard, mobile-native: same image/tag/title/description language,
 * but tapping copies the desktop URL instead of navigating (a phone can't open
 * a second window, and this build has no router to push a real route into).
 */
function WorkCardMobile({
  image, tag, period, title, description, path,
}: { image: string; tag?: string; period?: string; title: string; description: string; path: string }) {
  const copy = async () => {
    const url = `${window.location.origin}${path}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard API needs a secure context / permission - fall back to a
      // temporary selection, which works on older mobile browsers.
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  }

  return (
    <button
      onClick={copy}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
        background: 'none',
        border: 'none',
        padding: 0,
        margin: 0,
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
          borderRadius: 14,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
          boxShadow: '0 2px 6px rgba(20,32,52,.06), 0 24px 56px -28px rgba(20,32,52,.26)',
        }}
      >
        <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      {(tag || period) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          {/* Matches WorkCard's light-mode tag color exactly (App.tsx renders light-only now). */}
          {tag && <span style={{ fontSize: MOBILE_TYPE['3xs'], fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#077a4b' }}>{tag}</span>}
          {period && <span style={{ fontSize: MOBILE_TYPE['3xs'], color: COLORS.textMuted }}>{period}</span>}
        </div>
      )}
      <h3 style={{ margin: 0, fontFamily: FONTS.display, fontSize: MOBILE_TYPE.xl, fontWeight: 700, letterSpacing: '-0.01em', color: COLORS.textPrimary }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontFamily: FONTS.body, fontSize: MOBILE_TYPE.sm, lineHeight: TYPE.relaxed, color: COLORS.textMuted }}>
        {description}
      </p>
    </button>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MobileApp() {
  return (
    <div
      style={{
        fontFamily: FONTS.primary,
        // Same warm off-white the desktop homepage uses (App.tsx `bg`), not a
        // plain white terminal background.
        background: '#F8F6F3',
        color: COLORS.textPrimary,
        minHeight: '100vh',
        overflowX: 'hidden',
        WebkitTextSizeAdjust: '100%',
      }}
    >
      {/* Desktop nudge - case study detail pages aren't reachable on mobile
          (no router here; cards just copy their link), so this is called
          out up front as a top banner rather than buried at the bottom. */}
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: '#111111', padding: '10px 16px',
        }}
      >
        <Icon icon="solar:monitor-outline" width={16} color="#ffffff" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: MOBILE_TYPE['3xs'], fontWeight: 600, color: '#ffffff', textAlign: 'center' }}>
          Open this on desktop to read the full case studies.
        </span>
      </div>

      <div style={{ padding: '48px 20px 64px', maxWidth: 560, margin: '0 auto' }}>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <header>
          <h1
            style={{
              fontFamily: FONTS.display,
              fontSize: 'clamp(1.85rem, 11vw, 2.3rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: TYPE.tight,
              margin: '0 0 12px',
            }}
          >
            Abu Syeed
          </h1>
          <p style={{ margin: '0 0 4px', fontSize: MOBILE_TYPE.md, fontWeight: TYPE.medium, lineHeight: TYPE.snug, color: COLORS.textPrimary }}>
            Product Designer · AI &amp; Data Science · Design Systems
          </p>
          <p style={{ margin: '0 0 16px', fontSize: MOBILE_TYPE.sm, color: COLORS.textMuted }}>
            Chennai, India
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {['Actively looking for opportunities', 'Can join immediately'].map(chip => (
              <span
                key={chip}
                style={{
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 999,
                  padding: '6px 13px',
                  fontSize: MOBILE_TYPE['3xs'],
                  fontWeight: 600,
                  color: '#077a4b',
                  background: 'rgba(7,122,75,0.06)',
                }}
              >
                {chip}
              </span>
            ))}
          </div>
          <p style={{ margin: '0 0 22px', fontSize: MOBILE_TYPE.base, lineHeight: TYPE.loose, color: COLORS.textSecondary }}>
            I come from a background in AI &amp; Data Science. At Kynhood, I spent my time
            designing, solving real problems, and learning product strategy along the way,
            using AI to accelerate research and building out design systems.
          </p>

          <MobileChat />
        </header>

        <Divider />

        {/* ── My works at KYN ──────────────────────────────────────────────── */}
        <section>
          <SectionHeading eyebrow="Sub-projects">My works at KYN</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {KYNHOOD_SUB_PROJECTS.map(cs => <WorkCardMobile key={cs.title} {...cs} />)}
          </div>
        </section>

        <Divider />

        {/* ── Design systems ───────────────────────────────────────────────── */}
        <section>
          <SectionHeading eyebrow="Reference systems">Design Systems I built</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {DESIGN_SYSTEMS.map(ds => <WorkCardMobile key={ds.title} {...ds} />)}
          </div>
        </section>

        <Divider />

        {/* ── Selected work ─────────────────────────────────────────────────── */}
        <section>
          <SectionHeading eyebrow="More works from me">Writings and more case studies</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {SELECTED_WORK.map(cs => <WorkCardMobile key={cs.title} {...cs} />)}
          </div>
        </section>

        <Divider />

        {/* ── Recognition ──────────────────────────────────────────────────── */}
        <section>
          <SectionHeading eyebrow="Recognition">Featured on Wall of Portfolios</SectionHeading>
          <a
            href="https://www.wallofportfolios.in/portfolios/abu-syeed/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textDecoration: 'none' }}
          >
            <img
              src="/gallery/WOP_Silver_Badge_2026.svg"
              alt="Featured on Wall of Portfolios, 2026"
              style={{ height: 220, width: 220, display: 'block' }}
            />
            <img
              src="/gallery/WOP_Featured_Badge_Black.png"
              alt="Featured on Wall of Portfolios"
              style={{ height: 34, width: 'auto', display: 'block' }}
            />
          </a>
        </section>

        <Divider />

        {/* ── Expertise ────────────────────────────────────────────────────── */}
        <section>
          <SectionHeading eyebrow="Expertise">What I bring</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {EXPERTISE.map((cat, i) => (
              <div key={cat.label} style={{ padding: '18px 0', borderTop: i > 0 ? `1px solid ${COLORS.border}` : 'none' }}>
                <span style={{ display: 'block', fontFamily: FONTS.display, fontSize: MOBILE_TYPE.lg, fontWeight: TYPE.bold, color: COLORS.textPrimary, marginBottom: 8 }}>
                  {cat.label}
                </span>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {cat.items.map((item) => (
                    <li key={item} style={{ fontFamily: FONTS.body, fontSize: MOBILE_TYPE.sm, lineHeight: TYPE.relaxed, color: COLORS.textMuted }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Resume ───────────────────────────────────────────────────────── */}
        <section>
          <SectionHeading eyebrow="Resume">Download resume</SectionHeading>
          <a
            href="/gallery/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: '16px 18px',
              textDecoration: 'none',
              color: COLORS.textPrimary,
              background: '#ffffff',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon icon="solar:file-outline" width={20} color={COLORS.navy} />
              <span>
                <span style={{ display: 'block', fontSize: MOBILE_TYPE.base, fontWeight: TYPE.semibold }}>View resume</span>
                <span style={{ display: 'block', fontSize: MOBILE_TYPE['3xs'], color: COLORS.textMuted }}>PDF · opens in a new tab</span>
              </span>
            </span>
            <Icon icon="solar:arrow-right-outline" width={17} color={COLORS.textMuted} />
          </a>
        </section>

        <Divider />

        {/* ── Links ────────────────────────────────────────────────────────── */}
        <section>
          <SectionHeading eyebrow="Get in touch">Links</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {LINKS.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 2px',
                  textDecoration: 'none',
                  color: COLORS.textPrimary,
                  borderTop: i === 0 ? 'none' : `1px solid ${COLORS.hairline}`,
                }}
              >
                <Icon icon={l.icon} width={18} color={COLORS.navy} style={{ flexShrink: 0 }} />
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: FONTS.body,
                      fontSize: MOBILE_TYPE['4xs'],
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: COLORS.textMuted,
                    }}
                  >
                    {l.label}
                  </span>
                  {/* Long addresses must truncate rather than force the page wider at 300px */}
                  <span
                    style={{
                      display: 'block',
                      fontSize: MOBILE_TYPE.sm,
                      fontWeight: TYPE.medium,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {l.value}
                  </span>
                </span>
                <Icon icon="solar:arrow-right-outline" width={15} color={COLORS.textMuted} style={{ flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </section>

        <Divider />

        <footer
          style={{
            fontFamily: FONTS.body,
            fontSize: MOBILE_TYPE['4xs'],
            letterSpacing: '0.04em',
            color: COLORS.textMuted,
            lineHeight: TYPE.relaxed,
          }}
        >
          Abu Syeed - Portfolio
          <br />
          Full interactive build lives on desktop
        </footer>
      </div>
    </div>
  )
}
