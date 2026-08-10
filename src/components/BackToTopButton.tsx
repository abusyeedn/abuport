import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'

// Floating "scroll to top" button - replaces the fixed Dock nav on case-study
// pages. Only appears once the user has scrolled past the hero, same pattern
// as michaeltsirakis.com's bottom-right up-arrow.
export default function BackToTopButton({ dark = true }: { dark?: boolean }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 99999,
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: dark ? '#0f172a' : '#ffffff',
            color: dark ? '#ffffff' : '#0f172a',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          }}
        >
          <Icon icon="solar:arrow-up-outline" width={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
