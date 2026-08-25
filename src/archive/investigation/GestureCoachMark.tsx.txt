/**
 * GestureCoachMark.tsx
 *
 * Small animated hand cursor that taps near a target element to teach the
 * interaction for a case, without any text instruction. Auto-hides after
 * a few seconds or as soon as `dismissed` becomes true (first real click).
 */
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GestureCoachMarkProps {
  x: number
  y: number
  dismissed: boolean
  /** ms before it auto-hides even if the player hasn't acted yet */
  autoHideMs?: number
}

const GestureCoachMark = React.memo(function GestureCoachMark({ x, y, dismissed, autoHideMs = 5000 }: GestureCoachMarkProps) {
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setExpired(true), autoHideMs)
    return () => clearTimeout(t)
  }, [autoHideMs])

  const visible = !dismissed && !expired

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            zIndex: 35,
            pointerEvents: 'none',
          }}
        >
          <motion.div
            animate={{ scale: [1, 0.82, 1], x: [0, 0, 0], y: [0, 6, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: 34, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))' }}
          >
            👆
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 4, left: 8,
              width: 20, height: 20,
              borderRadius: '50%',
              border: '2px solid #fef08a',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
})

export default GestureCoachMark
