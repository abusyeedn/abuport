/**
 * MobileTopHeader.tsx
 *
 * Same floating rounded pill as desktop's TopHeader.tsx (blurred glass
 * background, centered, pinned near the top with a gap above it) - just
 * with a hamburger instead of the full inline nav row, since a phone has no
 * room for one. Reuses useSiteNavItems (siteNav.ts), the same single source
 * of truth desktop's TopHeader reads from, so a nav destination added there
 * shows up here automatically, and the Timeline "new events" badge and the
 * Case Studies section highlight behave identically to desktop.
 */
import { useState } from 'react'
import { Icon } from '@iconify/react'
import { AnimatePresence, motion } from 'framer-motion'
import { FONTS, MOBILE_TYPE, COLORS } from '../theme'
import { useSiteNavItems } from '../components/siteNav'

export default function MobileTopHeader({ activePath }: { activePath?: string }) {
  const [open, setOpen] = useState(false)
  const items = useSiteNavItems(activePath)

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            position: 'relative', top: 18,
            width: 'calc(100% - 2.5rem)', maxWidth: 480,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.6)',
          }}
        >
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, lineHeight: 0, textDecoration: 'none' }}>
            <img src="/gallery/portfolioicon-nav.png" alt="Abu Syeed" width={30} height={30} style={{ borderRadius: 8, display: 'block' }} />
            <span style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: MOBILE_TYPE.md, color: COLORS.textPrimary }}>Abu.</span>
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34, flexShrink: 0,
              borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'rgba(0,0,0,0.06)', color: COLORS.textPrimary,
            }}
          >
            <Icon icon={open ? 'solar:close-circle-outline' : 'solar:hamburger-menu-outline'} width={18} />
            {!open && items.some((it) => !!it.badge) && (
              <span
                style={{
                  position: 'absolute', top: -2, right: -2,
                  width: 11, height: 11, borderRadius: '50%',
                  background: '#dc2626', border: '2px solid #F8F6F3',
                }}
              />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 250, background: 'rgba(20,32,52,0.35)' }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 260,
                width: 'min(82vw, 340px)', background: '#ffffff',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.2)',
                display: 'flex', flexDirection: 'column',
                padding: '18px 14px', overflowY: 'auto',
              }}
            >
              {items.map((item, i) => (
                <div key={i}>
                  <button
                    onClick={() => { item.onClick(); setOpen(false) }}
                    style={{
                      position: 'relative',
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', textAlign: 'left',
                      background: item.active ? 'rgba(0,0,0,0.06)' : 'none',
                      border: 'none', cursor: 'pointer',
                      padding: '14px 14px', borderRadius: 12,
                      color: COLORS.textPrimary,
                      fontFamily: FONTS.body, fontSize: MOBILE_TYPE.lg,
                      fontWeight: item.active ? 700 : 500,
                    }}
                  >
                    {item.label}
                    {!!item.badge && (
                      <span
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          minWidth: 18, height: 18, padding: '0 5px',
                          borderRadius: 999, background: '#dc2626', color: '#ffffff',
                          fontFamily: FONTS.body, fontSize: MOBILE_TYPE['4xs'], fontWeight: 700,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                  {item.dividerAfter && (
                    <div style={{ height: 1, background: COLORS.hairline, margin: '6px 14px 10px' }} />
                  )}
                </div>
              ))}

              <div style={{ flex: 1 }} />

              <a
                href="/gallery/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: '#000000', color: '#ffffff', textDecoration: 'none',
                  padding: '13px 16px', borderRadius: 'var(--radius-cta)',
                  fontFamily: FONTS.body, fontSize: MOBILE_TYPE.base, fontWeight: 500,
                  marginTop: 12,
                }}
              >
                <Icon icon="solar:download-outline" width={15} />
                Download resume
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
