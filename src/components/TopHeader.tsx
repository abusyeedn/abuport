import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS } from '../theme'
import { useBreakpoint } from '../hooks/useBreakpoint'

export type TopHeaderItemData = {
  label: React.ReactNode
  onClick: () => void
  active?: boolean
}

export type TopHeaderProps = {
  /** Center nav items - Work / Lab / About */
  items: TopHeaderItemData[]
  /** Right-side CTA - Download resume */
  cta: TopHeaderItemData
  brand?: React.ReactNode
  /** Same maxWidth as the hero content wrapper below it. */
  maxWidth?: number
  /** Same horizontal padding as the hero content wrapper - this is what
   *  actually lines the brand/CTA up with "Abu Syeed" and the description,
   *  not the outer width alone. */
  sidePadding?: string
  /** Slides the pill up and out of view (e.g. while scrolling down a long
   *  page) instead of leaving it pinned at the top the whole time. Opt-in -
   *  omitted/false keeps the header always visible, the default everywhere
   *  except pages that explicitly drive this off scroll direction. */
  hidden?: boolean
}

// Header uses the *exact* box model as the hero content wrapper below it
// (`width:100%; max-width; margin:0 auto` + matching side padding) rather
// than a separate width calculation - that mismatch was why the pill's edges
// drifted from the hero text's margins at different viewport widths.
//
// Below ~900px the center nav items (now 5 of them) no longer fit in one
// row alongside the brand/CTA, so they collapse into a hamburger that opens
// a stacked dropdown instead of silently overflowing/wrapping.
export default function TopHeader({ items, cta, brand = 'Abu.', maxWidth = 1320, sidePadding = '2.5rem', hidden = false }: TopHeaderProps) {
  const { isTablet, isMobile } = useBreakpoint()
  const [menuOpen, setMenuOpen] = useState(false)
  const bg = 'rgba(255,255,255,0.55)'
  const border = '1px solid rgba(255,255,255,0.6)'
  const text = '#111111'
  const panelBg = '#ffffff'

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: hidden ? 'none' : 'auto' }}>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: hidden ? 0 : 1, y: hidden ? -100 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          top: 20,
          width: '100%',
          maxWidth,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? `10px ${sidePadding.includes('rem') ? '1.25rem' : sidePadding}` : `10px ${sidePadding}`,
          borderRadius: 999,
          background: bg,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border,
          fontFamily: FONTS.body,
        } as React.CSSProperties}
      >
        <span style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: '1rem', color: text }}>
          {brand}
        </span>

        {!isTablet && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {items.map((item, i) => (
              <motion.button
                key={i}
                onClick={item.onClick}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.94 }}
                style={{
                  background: item.active ? 'rgba(0,0,0,0.07)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 14px',
                  borderRadius: 999,
                  color: text,
                  fontSize: '0.85rem',
                  fontWeight: item.active ? 700 : 400,
                  whiteSpace: 'nowrap',
                  transition: 'background 0.15s ease, color 0.3s ease',
                }}
                onMouseEnter={(e) => { if (!item.active) e.currentTarget.style.background = 'rgba(0,0,0,0.06)' }}
                onMouseLeave={(e) => { if (!item.active) e.currentTarget.style.background = 'none' }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10 }}>
          {!isMobile && (
            <motion.button
              onClick={cta.onClick}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.94 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#000000',
                border: 'none',
                cursor: 'pointer',
                padding: '9px 16px',
                borderRadius: 999,
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon icon="solar:download-outline" width={15} />
              {cta.label}
            </motion.button>
          )}

          {isTablet && (
            <motion.button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              whileTap={{ scale: 0.9 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34, flexShrink: 0,
                borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: 'rgba(0,0,0,0.05)',
                color: text,
              }}
            >
              <Icon icon={menuOpen ? 'solar:close-circle-outline' : 'solar:hamburger-menu-outline'} width={18} />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Mobile/tablet dropdown - nav items + CTA stacked below the pill */}
      <AnimatePresence>
        {isTablet && menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{
              marginTop: 8,
              width: 'calc(100% - 2.5rem)',
              maxWidth: 360,
              background: panelBg,
              border,
              borderRadius: 20,
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            }}
          >
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => { item.onClick(); setMenuOpen(false) }}
                style={{
                  background: item.active ? 'rgba(0,0,0,0.06)' : 'none',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  padding: '12px 14px', borderRadius: 12, color: text,
                  fontFamily: FONTS.body, fontSize: '0.95rem', fontWeight: item.active ? 700 : 500,
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { cta.onClick(); setMenuOpen(false) }}
              style={{
                marginTop: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                background: '#000000',
                border: 'none', cursor: 'pointer', textAlign: 'center',
                padding: '12px 14px', borderRadius: 12, color: '#ffffff',
                fontFamily: FONTS.body, fontSize: '0.95rem', fontWeight: 600,
              }}
            >
              <Icon icon="solar:download-outline" width={16} />
              {cta.label}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
