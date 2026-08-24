import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useZoomScale } from './ViewportScaler'

// Replaces the fixed Dock nav on content pages - a single floating "back"
// button, bottom-left, instead of a full navigation dock.
export default function BackButton({ dark = true, to, onClick }: { dark?: boolean; to?: string; onClick?: () => void }) {
  const navigate = useNavigate()
  const zoomScale = useZoomScale()
  // Fixed-position elements get shrunk (and mispositioned) by the page's
  // ambient zoom the same as anything else - cancel it out, same technique
  // as Dock.tsx and the case-study panels, so this renders at true size in
  // its actual on-screen spot instead of appearing shrunk/offset.
  const counterZoom = zoomScale > 0 ? 1 / zoomScale : 1
  return (
    <motion.button
      onClick={onClick ?? (() => (to ? navigate(to) : navigate(-1)))}
      aria-label="Back"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: -3 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        bottom: 28,
        left: 28,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        borderRadius: 'var(--radius-cta)',
        border: 'none',
        cursor: 'pointer',
        background: dark ? '#1a1a1a' : '#ffffff',
        color: dark ? '#ffffff' : '#0f172a',
        fontSize: '0.8rem',
        fontWeight: 400,
        zoom: counterZoom,
      } as React.CSSProperties}
    >
      <Icon icon="solar:arrow-left-outline" width={16} /> Back
    </motion.button>
  )
}
