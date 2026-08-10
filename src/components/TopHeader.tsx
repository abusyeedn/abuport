import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS } from '../theme'
import { useBreakpoint } from '../hooks/useBreakpoint'

export type TopHeaderItemData = {
  label: React.ReactNode
  onClick: () => void
}

export type TopHeaderProps = {
  /** Center nav items - Work / Lab / About */
  items: TopHeaderItemData[]
  /** Right-side CTA - Say Hi */
  cta: TopHeaderItemData
  isDarkMode: boolean
  onToggleDarkMode: () => void
  brand?: React.ReactNode
  /** Same maxWidth as the hero content wrapper below it. */
  maxWidth?: number
  /** Same horizontal padding as the hero content wrapper - this is what
   *  actually lines the brand/CTA up with "Abu Syeed" and the description,
   *  not the outer width alone. */
  sidePadding?: string
}

// Header uses the *exact* box model as the hero content wrapper below it
// (`width:100%; max-width; margin:0 auto` + matching side padding) rather
// than a separate width calculation - that mismatch was why the pill's edges
// drifted from the hero text's margins at different viewport widths.
//
// Below ~900px the center nav items (now 5 of them) no longer fit in one
// row alongside the brand/CTA/toggle, so they collapse into a hamburger
// that opens a stacked dropdown instead of silently overflowing/wrapping.
export default function TopHeader({ items, cta, isDarkMode, onToggleDarkMode, brand = 'Abu.', maxWidth = 1320, sidePadding = '2.5rem' }: TopHeaderProps) {
  const { isTablet, isMobile } = useBreakpoint()
  const [menuOpen, setMenuOpen] = useState(false)
  const bg = isDarkMode ? 'rgba(20,20,20,0.55)' : 'rgba(255,255,255,0.55)'
  const border = isDarkMode ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(255,255,255,0.6)'
  const text = isDarkMode ? '#ffffff' : '#111111'
  const panelBg = isDarkMode ? '#1a1a1a' : '#ffffff'

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
          transition: 'background 0.3s ease, border 0.3s ease',
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
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 14px',
                  borderRadius: 999,
                  color: text,
                  fontSize: '0.85rem',
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                  transition: 'background 0.15s ease, color 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
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
                background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                border: 'none',
                cursor: 'pointer',
                padding: '9px 16px',
                borderRadius: 999,
                color: text,
                fontSize: '0.85rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              {cta.label}
            </motion.button>
          )}

          <motion.button
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            whileTap={{ scale: 0.85 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              flexShrink: 0,
              borderRadius: '50%',
              border,
              background: isDarkMode ? '#ffffff' : '#0f172a',
              color: isDarkMode ? '#0f172a' : '#ffffff',
              cursor: 'pointer',
              fontSize: '0.95rem',
              overflow: 'hidden',
              transition: 'background 0.3s ease',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDarkMode ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex' }}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {isTablet && (
            <motion.button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              whileTap={{ scale: 0.9 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34, flexShrink: 0,
                borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: text,
              }}
            >
              <Icon icon={menuOpen ? 'solar:close-circle-outline' : 'solar:hamburger-menu-outline'} width={18} />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Mobile/tablet dropdown - nav items + Say Hi stacked below the pill */}
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
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  padding: '12px 14px', borderRadius: 12, color: text,
                  fontFamily: FONTS.body, fontSize: '0.95rem', fontWeight: 500,
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { cta.onClick(); setMenuOpen(false) }}
              style={{
                marginTop: 6,
                background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                border: 'none', cursor: 'pointer', textAlign: 'center',
                padding: '12px 14px', borderRadius: 12, color: text,
                fontFamily: FONTS.body, fontSize: '0.95rem', fontWeight: 600,
              }}
            >
              {cta.label}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
