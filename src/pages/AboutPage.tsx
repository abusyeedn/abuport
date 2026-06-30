import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { FONTS } from '../theme'
import Dock from '../components/Dock'
import Footer from '../components/Footer'
import DynamicRenderer from '../components/DynamicRenderer'

export default function AboutPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#ffffff'
    return () => { document.body.style.backgroundColor = prev }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', backgroundColor: '#fff', fontFamily: FONTS.primary }}>

      {/* Grid background */}
      <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="aboutSmallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d1d5db" strokeWidth="0.4" />
          </pattern>
          <pattern id="aboutGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#aboutSmallGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#d1d5db" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#aboutGrid)" />
      </svg>

      {/* Content */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 4rem 8rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', color: '#aaa' }}
        >
          <div style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-4)' }}>👤</div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)' }}>About Me</h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', margin: 0 }}>Coming soon.</p>
        </motion.div>
      </div>

      <DynamicRenderer />
      <Dock
        items={[
          { icon: <Icon icon="solar:arrow-left-outline" width={22} color="#1e293b" />, label: 'Back', onClick: () => navigate(-1) },
          { icon: <Icon icon="solar:home-2-outline" width={22} color="#1e293b" />, label: 'Home', onClick: () => navigate('/') },
          { icon: <Icon icon="solar:file-outline" width={22} color="#1e293b" />, label: 'Resume', onClick: () => navigate('/resume') },
          { icon: <Icon icon="solar:user-outline" width={22} color="#1e293b" />, label: 'About me', onClick: () => navigate('/about') },
        ]}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />
      <Footer />
    </div>
  )
}
