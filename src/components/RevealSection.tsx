import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS, MOTION } from '../theme'
import { useBreakpoint } from '../hooks/useBreakpoint'

// Renders items[0..collapsedCount) normally, then wraps the remaining block
// (the "second 2x2") in its own blurred container with a "See more" pill
// centered on top of just that block - not the whole grid, and nothing gets
// clipped/hidden, just blurred until expanded.
export default function RevealSection<T>({
  items,
  renderItem,
  collapsedCount = 4,
  columnGap = '3rem',
  rowGap = '5.5rem',
  expanded,
  onExpand,
  dark = false,
}: {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  collapsedCount?: number
  columnGap?: string
  rowGap?: string
  expanded: boolean
  onExpand: () => void
  dark?: boolean
}) {
  const { isTablet, isMobile } = useBreakpoint()
  const cols = isTablet ? '1fr' : 'repeat(2, 1fr)'
  const gap = isMobile ? '2.5rem' : rowGap
  const visible = items.slice(0, collapsedCount)
  const rest = items.slice(collapsedCount)
  const isExpanded = expanded || rest.length === 0

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: cols, columnGap, rowGap: gap }}>
        {visible.map((item, i) => renderItem(item, i))}
      </div>

      {rest.length > 0 && (
        <div
          style={{
            position: 'relative',
            marginTop: gap,
            maxHeight: isExpanded ? 8000 : 160,
            overflow: 'hidden',
            borderRadius: isExpanded ? 0 : 20,
            maskImage: isExpanded ? 'none' : 'linear-gradient(to bottom, black 55%, transparent 100%)',
            WebkitMaskImage: isExpanded ? 'none' : 'linear-gradient(to bottom, black 55%, transparent 100%)',
            transition: 'max-height 0.6s ease',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: cols,
              columnGap,
              rowGap: gap,
              filter: isExpanded ? 'none' : 'blur(10px)',
              pointerEvents: isExpanded ? 'auto' : 'none',
              userSelect: isExpanded ? 'auto' : 'none',
              transition: 'filter 0.5s ease',
            }}
          >
            {rest.map((item, i) => renderItem(item, i + collapsedCount))}
          </div>

          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: MOTION.easeArray }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.button
                onClick={onExpand}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  background: dark ? '#ffffff' : '#0f172a',
                  color: dark ? '#0f172a' : '#ffffff',
                  fontFamily: FONTS.body,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                }}
              >
                See more ({rest.length}) <Icon icon="solar:alt-arrow-down-outline" width={16} />
              </motion.button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
