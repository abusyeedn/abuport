/**
 * CaseProgressHUD.tsx
 *
 * Fixed top-right corner overlay showing case progress.
 * Styled like a classified document header.
 */
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameState } from './useGameState'
import { caseFiles } from '../../data/caseFileData'
import { Icon } from '@iconify/react'
import CaseDossierDrawer from './CaseDossierDrawer'

const CaseProgressHUD = React.memo(function CaseProgressHUD() {
  const { currentCase, totalProgress, caseProgress, isCaseUnlocked } = useGameState()
  const activeCaseFile = caseFiles.find(c => c.id === currentCase)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 62,
          pointerEvents: 'auto',
          userSelect: 'none',
          cursor: 'default',
        }}
      >
        {/* Classified header */}
        <div style={{
          background: 'rgba(15, 15, 18, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8,
          padding: '16px 20px',
          minWidth: 200,
        }}>
          {/* Title */}
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            color: 'rgba(220, 38, 38, 0.8)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontFamily: '"SF Mono", "Fira Code", monospace',
            marginBottom: 8,
          }}>
            CASE PROGRESS
          </div>

          {/* Current case name */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.75)',
                fontFamily: '"Inter", sans-serif',
                marginBottom: 10,
              }}
            >
              {currentCase === 0
                ? 'Awaiting Assignment...'
                : currentCase === 8
                  ? 'CASE CLOSED'
                  : activeCaseFile
                    ? `${activeCaseFile.subtitle}: ${activeCaseFile.title}`
                    : 'Understanding Abu'
              }
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div style={{
            width: '100%',
            height: 4,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 2,
            overflow: 'hidden',
            marginBottom: 8,
          }}>
            <motion.div
              animate={{ width: `${totalProgress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)',
                borderRadius: 2,
              }}
            />
          </div>

          {/* Percentage */}
          <div style={{
            fontSize: 22,
            fontWeight: 800,
            color: totalProgress === 100 ? '#22c55e' : 'rgba(255,255,255,0.9)',
            fontFamily: '"SF Mono", "Fira Code", monospace',
            letterSpacing: '-0.02em',
          }}>
            {totalProgress}%
          </div>

          {/* Case dots */}
          <div style={{
            display: 'flex',
            gap: 6,
            marginTop: 10,
            marginBottom: 12,
          }}>
            {caseFiles.map(cf => {
              const cp = caseProgress.get(cf.id)
              const solved = cp?.solved ?? false
              const unlocked = isCaseUnlocked(cf.id)
              const isActive = cf.id === currentCase

              return (
                <div
                  key={cf.id}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: solved
                      ? '#22c55e'
                      : isActive
                        ? '#dc2626'
                        : unlocked
                          ? 'rgba(255,255,255,0.25)'
                          : 'rgba(255,255,255,0.08)',
                    border: isActive ? '1px solid rgba(220,38,38,0.5)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
              )
            })}
          </div>

          {/* Evidence Dossier Button */}
          {currentCase > 0 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
              <button
                onClick={() => setIsDrawerOpen(true)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 800,
                  fontFamily: '"SF Mono", "Fira Code", monospace',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)'
                  e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.5)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)'
                }}
              >
                <Icon icon="solar:folder-with-files-bold" width={14} color="#dc2626" />
                OPEN EVIDENCE LOG
              </button>
            </div>
          )}
        </div>
      </div>

      <CaseDossierDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
})

export default CaseProgressHUD
