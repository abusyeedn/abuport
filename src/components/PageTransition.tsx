import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      exit={{ clipPath: 'inset(0 0% 0 100%)', transition: { duration: 0.05 } }}
      transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
      style={{ width: '100%', minHeight: '100vh', isolation: 'isolate' }}
    >
      {children}
    </motion.div>
  )
}
