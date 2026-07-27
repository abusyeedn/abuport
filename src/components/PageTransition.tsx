import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useZoomScale } from './ViewportScaler'

export default function PageTransition({ children }: { children: ReactNode }) {
  const zoomScale = useZoomScale()

  return (
    <motion.div
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      exit={{ clipPath: 'inset(0 0% 0 100%)', transition: { duration: 0.05 } }}
      transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
      // `100vh` alone renders short here: ViewportScaler applies CSS `zoom` to
      // the <html> root, which shrinks every page's real rendered height
      // along with everything else instead of growing vh's reference frame to
      // compensate. Since every route is wrapped in this component, dividing
      // by the current zoom scale here fixes the same crop bug site-wide
      // instead of needing a per-page patch.
      style={{ width: '100%', minHeight: `${100 / (zoomScale || 1)}vh`, isolation: 'isolate' }}
    >
      {children}
    </motion.div>
  )
}
