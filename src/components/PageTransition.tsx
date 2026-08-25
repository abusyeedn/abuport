import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useZoomScale } from './ViewportScaler'

// Was a 1.5s clip-path "wave" wipe. Replaced with a quick plain fade - the
// wipe drew attention to itself as a transition instead of just getting out
// of the way, and (combined with TopHeader being rendered per-page at the
// time) made the nav bar itself visibly animate on every navigation instead
// of staying put. TopHeader now lives above this in main.tsx so it never
// re-mounts on route change; this only ever wraps the page content beneath it.
export default function PageTransition({ children }: { children: ReactNode }) {
  const zoomScale = useZoomScale()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
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
