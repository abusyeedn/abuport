/**
 * CaseFileModal.tsx
 *
 * Reusable modal for displaying evidence details or interactive puzzles.
 * Opens when a clue is clicked or a case specific action is triggered.
 */
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'

interface CaseFileModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  subtitle?: string
  isSolved?: boolean
  stampText?: string
}

const CaseFileModal = React.memo(function CaseFileModal({
  isOpen,
  onClose,
  children,
  title = 'EVIDENCE',
  subtitle = 'EXHIBIT',
  isSolved = false,
  stampText = 'SOLVED',
}: CaseFileModalProps) {
  
  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (typeof window === 'undefined' || !document.body) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          cursor: 'default', // Restore cursor inside modal
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 5, 5, 0.85)',
              backdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Content - Manila Folder Style */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: 800,
              maxHeight: '90vh',
              background: '#fef7e0', // Manila folder base color
              borderRadius: '8px 8px 4px 4px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Folder Tab (visual only) */}
            <div style={{
              position: 'absolute',
              top: -24,
              left: 20,
              height: 24,
              width: 180,
              background: '#f5eecb',
              borderRadius: '8px 8px 0 0',
              border: '1px solid rgba(0,0,0,0.05)',
              borderBottom: 'none',
              zIndex: -1,
            }} />

            {/* Header */}
            <div style={{
              padding: '24px 32px 16px',
              borderBottom: '2px solid rgba(0,0,0,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
            }}>
              <div>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'rgba(0,0,0,0.5)',
                  letterSpacing: '0.15em',
                  fontFamily: '"SF Mono", "Fira Code", monospace',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                }}>
                  {subtitle}
                </div>
                <h2 style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#1a1a1a',
                  margin: 0,
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                }}>
                  {title}
                </h2>
              </div>
              
              <button 
                onClick={onClose}
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'rgba(0,0,0,0.6)',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
              >
                <Icon icon="solar:close-circle-bold" width={24} />
              </button>
            </div>

            {/* Solved Stamp */}
            <AnimatePresence>
              {isSolved && (
                <motion.div
                  initial={{ scale: 2, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 0.8, rotate: -5 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 80,
                    color: '#22c55e',
                    border: '4px solid #22c55e',
                    padding: '4px 12px',
                    borderRadius: 4,
                    fontSize: 24,
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                    fontFamily: '"SF Mono", "Fira Code", monospace',
                    pointerEvents: 'none',
                  }}
                >
                  {stampText}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '32px',
              color: '#333',
              fontFamily: '"Inter", sans-serif',
              background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
            }}>
              {children}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
})

export default CaseFileModal
