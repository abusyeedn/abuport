/**
 * CaseObjective.tsx
 *
 * Fixed center-top banner that slides in when entering a new case zone.
 * Shows the current case number, title, and the objective.
 */
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameState } from './useGameState'
import { caseFiles } from '../../data/caseFileData'

const CaseObjective = React.memo(function CaseObjective() {
  const { currentCase, introSeen } = useGameState()
  const activeCaseFile = caseFiles.find(c => c.id === currentCase)
  const [isVisible, setIsVisible] = useState(false)
  const [showHint, setShowHint] = useState(false)

  // Reset hint on case change
  useEffect(() => {
    setShowHint(false)
  }, [currentCase])

  useEffect(() => {
    if (!introSeen || currentCase === 0 || currentCase === 8 || !activeCaseFile) {
      setIsVisible(false)
      return
    }

    setIsVisible(true)
  }, [currentCase, introSeen, activeCaseFile])

  return (
    <AnimatePresence>
      {isVisible && activeCaseFile && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ 
            x: 0, 
            opacity: 1,
          }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{
            position: 'fixed',
            bottom: 40,
            right: 40,
            zIndex: 61,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          {/* Pulsing red badge */}
          <motion.div 
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{
              background: 'rgba(220, 38, 38, 0.95)',
              backdropFilter: 'blur(8px)',
              padding: '6px 16px',
              borderRadius: '4px',
              boxShadow: '0 4px 20px rgba(220, 38, 38, 0.4)',
              marginBottom: '8px',
            }}
          >
            <span style={{
              color: '#fff',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.2em',
              fontFamily: '"SF Mono", "Fira Code", monospace',
              textTransform: 'uppercase',
            }}>
              {activeCaseFile.subtitle} — {activeCaseFile.title}
            </span>
          </motion.div>

          {/* Description container */}
          <motion.div 
            animate={{ 
              boxShadow: [
                '0 10px 30px rgba(0,0,0,0.5)',
                '0 10px 30px rgba(220,38,38,0.15)',
                '0 10px 30px rgba(0,0,0,0.5)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{
              background: 'rgba(15, 15, 18, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '16px 24px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              minWidth: 280,
              maxWidth: 360,
              pointerEvents: 'auto', // Allow clicking hint inside pointer-events-none parent
            }}
          >
            <span style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: '"Inter", sans-serif',
              lineHeight: 1.4,
            }}>
              {activeCaseFile.objective}
            </span>

            {/* Hint toggler */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: 'monospace',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  🔍 REVEAL HINT
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '0.08em' }}>HINT:</div>
                  <div style={{ fontSize: 12, color: '#fca5a5', lineHeight: 1.4, fontFamily: '"Inter", sans-serif' }}>
                    {activeCaseFile.hint}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

export default CaseObjective
