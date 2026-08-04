/**
 * MobileApp.tsx
 *
 * Standalone mobile experience for the 300–700px band.
 *
 * This is deliberately NOT a responsive reflow of the desktop site — the desktop
 * build is a fixed-1440px canvas driven by ViewportScaler's CSS `zoom`, GSAP pins,
 * and a drag-positioned FigmaElement layout, none of which survive a phone viewport.
 * Instead this is a separate, text-first surface that carries the same content and
 * type system, and points visitors to the desktop build for the full experience.
 *
 * Nothing here imports from the desktop page tree, and main.tsx renders this
 * *instead of* the desktop tree, so the two can never affect one another.
 */
import { useState } from 'react'
import { Icon } from '@iconify/react'
import { FONTS, TYPE, COLORS, RADII, MOTION } from '../theme'
import MobileChat from './MobileChat'

// ── Content ──────────────────────────────────────────────────────────────────

const CASE_STUDIES = [
  {
    title: 'Kynhood — UX & AI',
    meta: 'Product · AI',
    // Matches the AI_SUMMARY "Problem" line used on the desktop case studies page
    teaser:
      'Users were confused selecting zone-areas during onboarding — the flow had no mapping to real Chennai geography.',
    path: '/casestudies',
  },
  {
    title: 'PhonePe 2.0 — BTS',
    meta: 'Teardown',
    teaser:
      "PhonePe 2.0's bento-grid redesign caused heavy user backlash — muscle memory from the old list layout broke.",
    path: '/casestudies',
  },
]

const LINKS = [
  { label: 'Email', value: 'abusyeed10202@gmail.com', href: 'mailto:abusyeed10202@gmail.com', icon: 'solar:letter-outline' },
  // Brand mark comes from `mdi` — the Solar set used elsewhere here has no
  // linkedin glyph (`solar:linkedin-outline` silently renders nothing).
  { label: 'LinkedIn', value: 'linkedin.com/in/abusyeed1', href: 'https://linkedin.com/in/abusyeed1/', icon: 'mdi:linkedin' },
]

// ── Primitives ───────────────────────────────────────────────────────────────

/** Monospace `> LABEL` section header, echoing the reference site's terminal feel. */
function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontFamily: FONTS.mono,
        fontSize: TYPE.xs,
        fontWeight: TYPE.semibold,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: COLORS.faint,
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 7,
      }}
    >
      <span style={{ color: COLORS.emphasisGreen }}>&gt;</span>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: COLORS.hairline, margin: '38px 0' }} />
}

/**
 * "Read this on desktop" affordance. A phone can't just open a desktop window, so
 * rather than a dead-end message this copies the deep link to the clipboard.
 */
function DesktopLink({ path, label = 'Open on desktop to read more' }: { path: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const url = `${window.location.origin}${path}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard API needs a secure context / permission — fall back to a
      // temporary selection, which works on older mobile browsers.
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        fontFamily: FONTS.mono,
        fontSize: TYPE['3xs'],
        fontWeight: TYPE.semibold,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: copied ? COLORS.emphasisGreen : COLORS.navy,
        transition: `color ${MOTION.dur1} ${MOTION.ease}`,
      }}
    >
      <Icon icon={copied ? 'solar:check-circle-outline' : 'solar:monitor-outline'} width={14} />
      {copied ? 'Link copied' : label}
    </button>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MobileApp() {
  return (
    <div
      style={{
        fontFamily: FONTS.primary,
        background: COLORS.bgPrimary,
        color: COLORS.ink,
        minHeight: '100vh',
        // The celestial chat CTA's pulse-ring animation scales up via CSS
        // transform, which briefly extends past the edge on narrow screens —
        // transforms count toward scrollWidth, so without this a phone gets a
        // real (if flickering) horizontal scrollbar during the pulse.
        overflowX: 'hidden',
        // Graph-paper wash — the one visual motif carried over from the desktop pages
        backgroundImage:
          'linear-gradient(rgba(20,32,52,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(20,32,52,.04) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        WebkitTextSizeAdjust: '100%',
      }}
    >
      {/* ── Desktop banner ─────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: COLORS.navyDeep,
          color: COLORS.textInverse,
          padding: '11px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Icon icon="solar:monitor-outline" width={17} color={COLORS.emphasisGreen} style={{ flexShrink: 0 }} />
        <div style={{ lineHeight: TYPE.snug }}>
          <div style={{ fontSize: TYPE.sm, fontWeight: TYPE.semibold }}>Best viewed on desktop</div>
          <div style={{ fontSize: TYPE['3xs'], color: 'rgba(255,255,255,0.55)' }}>
            This is a condensed version — the full interactive portfolio lives on a bigger screen.
          </div>
        </div>
      </div>

      <div style={{ padding: '40px 20px 64px', maxWidth: 700, margin: '0 auto' }}>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <header>
          <h1
            style={{
              fontFamily: FONTS.display,
              fontSize: 'clamp(2rem, 11vw, 2.75rem)',
              fontWeight: TYPE.bold,
              letterSpacing: '-0.03em',
              lineHeight: TYPE.tight,
              margin: '0 0 12px',
            }}
          >
            Abu Syeed
          </h1>
          <p style={{ margin: '0 0 12px', fontSize: TYPE.md, fontWeight: TYPE.medium, lineHeight: TYPE.snug, color: COLORS.soft }}>
            Product Designer · AI &amp; Data Science · Design Systems
          </p>
          <p
            style={{
              margin: '0 0 14px',
              fontFamily: FONTS.mono,
              fontSize: TYPE['3xs'],
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: COLORS.faint,
            }}
          >
            Chennai, India
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
            {['Actively looking for opportunities', 'Can join immediately'].map(chip => (
              <span
                key={chip}
                style={{
                  border: `1px solid ${COLORS.line}`,
                  borderRadius: RADII.full,
                  padding: '6px 13px',
                  fontSize: TYPE['3xs'],
                  fontWeight: TYPE.semibold,
                  color: COLORS.navy,
                }}
              >
                {chip}
              </span>
            ))}
          </div>
          <p style={{ margin: '0 0 22px', fontSize: TYPE.base, lineHeight: TYPE.loose, color: COLORS.soft }}>
            2+ years building and shipping features from scratch in a fast-paced startup. I drift
            into product discussions too — asking questions, defining flows, and making sure what we
            build actually works for users.
          </p>

          <MobileChat />
        </header>

        <Divider />

        {/* ── Kynhood ──────────────────────────────────────────────────────── */}
        <section>
          <SectionLabel>Experience</SectionLabel>
          <h2
            style={{
              fontFamily: FONTS.display,
              fontSize: TYPE.xl,
              fontWeight: TYPE.bold,
              letterSpacing: '-0.02em',
              margin: '0 0 4px',
            }}
          >
            Kynhood
          </h2>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: TYPE['3xs'],
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: COLORS.faint,
              marginBottom: 12,
            }}
          >
            Product Designer · Jun 2024 – Jul 2026
          </div>
          <p style={{ margin: '0 0 16px', fontSize: TYPE.base, lineHeight: TYPE.loose, color: COLORS.soft }}>
            Owned end-to-end design across 3 platforms — from user research and wireframes to
            responsive, accessible UI — driving the feature to ₹3Cr GMV in 8 months and growing
            organic retention 3× (10%→31%) with zero paid acquisition.
          </p>
          <DesktopLink path="/kynhood2" />
        </section>

        <Divider />

        {/* ── Locked case studies ──────────────────────────────────────────── */}
        <section>
          <SectionLabel>Case studies</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CASE_STUDIES.map(cs => (
              <article
                key={cs.title}
                style={{
                  border: `1px solid ${COLORS.line}`,
                  borderRadius: RADII['2xl'],
                  padding: 18,
                  background: 'rgba(255,255,255,0.72)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                  <h3
                    style={{
                      fontFamily: FONTS.display,
                      fontSize: TYPE.lg,
                      fontWeight: TYPE.bold,
                      letterSpacing: '-0.02em',
                      lineHeight: TYPE.snug,
                      margin: 0,
                    }}
                  >
                    {cs.title}
                  </h3>
                  <span
                    style={{
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: COLORS.surface2,
                      border: `1px solid ${COLORS.line}`,
                      borderRadius: RADII.full,
                      padding: '4px 9px',
                      fontFamily: FONTS.mono,
                      fontSize: TYPE['4xs'],
                      fontWeight: TYPE.semibold,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: COLORS.faint,
                    }}
                  >
                    <Icon icon="solar:lock-keyhole-outline" width={10} />
                    Locked
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: TYPE['4xs'],
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: COLORS.faint,
                    marginBottom: 10,
                  }}
                >
                  {cs.meta}
                </div>

                <p style={{ margin: '0 0 16px', fontSize: TYPE.sm, lineHeight: TYPE.relaxed, color: COLORS.soft }}>
                  {cs.teaser}
                </p>

                <DesktopLink path={cs.path} />
              </article>
            ))}
          </div>
          <p
            style={{
              margin: '14px 0 0',
              fontSize: TYPE['3xs'],
              lineHeight: TYPE.relaxed,
              color: COLORS.faint,
            }}
          >
            Open these on desktop to read more.
          </p>
        </section>

        <Divider />

        {/* ── Resume ───────────────────────────────────────────────────────── */}
        <section>
          <SectionLabel>Resume</SectionLabel>
          <a
            href="/gallery/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              border: `1px solid ${COLORS.line}`,
              borderRadius: RADII['2xl'],
              padding: '16px 18px',
              textDecoration: 'none',
              color: COLORS.ink,
              background: 'rgba(255,255,255,0.72)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon icon="solar:file-outline" width={20} color={COLORS.navy} />
              <span>
                <span style={{ display: 'block', fontSize: TYPE.base, fontWeight: TYPE.semibold }}>View resume</span>
                <span style={{ display: 'block', fontSize: TYPE['3xs'], color: COLORS.faint }}>PDF · opens in a new tab</span>
              </span>
            </span>
            <Icon icon="solar:arrow-right-outline" width={17} color={COLORS.faint} />
          </a>
        </section>

        <Divider />

        {/* ── Links ────────────────────────────────────────────────────────── */}
        <section>
          <SectionLabel>Links</SectionLabel>
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
                  color: COLORS.ink,
                  borderTop: i === 0 ? 'none' : `1px solid ${COLORS.hairline}`,
                }}
              >
                <Icon icon={l.icon} width={18} color={COLORS.navy} style={{ flexShrink: 0 }} />
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: FONTS.mono,
                      fontSize: TYPE['4xs'],
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: COLORS.faint,
                    }}
                  >
                    {l.label}
                  </span>
                  {/* Long addresses must truncate rather than force the page wider at 300px */}
                  <span
                    style={{
                      display: 'block',
                      fontSize: TYPE.sm,
                      fontWeight: TYPE.medium,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {l.value}
                  </span>
                </span>
                <Icon icon="solar:arrow-right-outline" width={15} color={COLORS.faint} style={{ flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </section>

        <Divider />

        <footer
          style={{
            fontFamily: FONTS.mono,
            fontSize: TYPE['4xs'],
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: COLORS.faint,
            lineHeight: TYPE.relaxed,
          }}
        >
          Abu Syeed — Portfolio
          <br />
          Mobile edition · full build on desktop
        </footer>
      </div>
    </div>
  )
}
