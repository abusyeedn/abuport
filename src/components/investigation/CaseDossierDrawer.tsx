/**
 * CaseDossierDrawer.tsx
 *
 * Side drawer that houses all collected artifacts and case clues.
 * Acts as the detective's logbook where they can review clues solved in previous
 * cases to find the hints needed to solve upcoming cases.
 */
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useGameState } from './useGameState'
import { caseFiles } from '../../data/caseFileData'

interface CaseDossierDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CaseDossierDrawer({ isOpen, onClose }: CaseDossierDrawerProps) {
  const { caseProgress, isCaseUnlocked, currentCase } = useGameState()

  // Get dossier clue texts for solved cases
  const getDossierClueText = (caseId: number): string => {
    switch (caseId) {
      case 1:
        return 'CLASSIFIED REPORT: "We\'ve reconstructed his memories. Now discover how they\'re connected." The objects matter less than the relationships between them — trace the pathways in Case 2.'
      case 2:
        return 'PROFILE REPORT: "The memories survived. One important memory is still fragmented." Find the missing memory in Case 3 — it changed everything.'
      case 3:
        return 'PERSONAL OBSERVATION: "You know what he built. You know why he built. One mystery remains — who became this person?" Build the person from everything learned so far in Case 4.'
      case 4:
        return 'CASE CLOSED: "You didn\'t solve a crime. You reconstructed a person." All memories restored, connected, and placed. The investigation is complete.'
      default:
        return ''
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          background: 'rgba(10, 10, 12, 0.95)',
          backdropFilter: 'blur(16px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
          zIndex: 70,
          display: 'flex',
          flexDirection: 'column',
          color: '#fff',
          cursor: 'default',
        }}>
          {/* Header */}
          <div style={{
            padding: 'var(--space-6)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon icon="solar:folder-with-files-bold" width={22} color="#dc2626" />
              <span style={{
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: '0.15em',
                fontFamily: '"SF Mono", "Fira Code", monospace',
                textTransform: 'uppercase',
              }}>
                EVIDENCE DOSSIER
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                padding: 'var(--space-1)',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.color = '#fff'}
              onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              <Icon icon="solar:close-circle-bold" width={24} />
            </button>
          </div>

          {/* Dossier Content */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
          }}>
            <p style={{
              margin: '0 0 16px 0',
              fontSize: 12,
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.5,
              fontFamily: '"Inter", sans-serif',
            }}>
              Review case intelligence and artifacts collected from completed zones below. Use these findings to solve upcoming case files.
            </p>

            {caseFiles.map(cf => {
              const cp = caseProgress.get(cf.id)
              const isSolved = cp?.solved ?? false
              const isUnlocked = isCaseUnlocked(cf.id)
              const isActive = cf.id === currentCase

              return (
                <div
                  key={cf.id}
                  style={{
                    background: isSolved 
                      ? 'rgba(34, 197, 94, 0.03)' 
                      : isActive 
                        ? 'rgba(220, 38, 38, 0.03)' 
                        : 'rgba(255, 255, 255, 0.01)',
                    border: `1px solid ${
                      isSolved 
                        ? 'rgba(34, 197, 94, 0.25)' 
                        : isActive 
                          ? 'rgba(220, 38, 38, 0.25)' 
                          : 'rgba(255, 255, 255, 0.05)'
                    }`,
                    borderRadius: 'var(--radius-base)',
                    padding: 'var(--space-4)',
                    position: 'relative',
                    opacity: isUnlocked ? 1 : 0.5,
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-2)',
                  }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: '"SF Mono", "Fira Code", monospace',
                      color: isSolved ? '#22c55e' : isActive ? '#dc2626' : '#64748b',
                    }}>
                      CASE {cf.id.toString().padStart(2, '0')}
                    </span>
                    <Icon
                      icon={
                        isSolved 
                          ? 'solar:check-circle-bold' 
                          : isUnlocked 
                            ? 'solar:folder-opened-bold' 
                            : 'solar:lock-keyhole-bold'
                      }
                      color={isSolved ? '#22c55e' : isActive ? '#dc2626' : '#64748b'}
                      width={16}
                    />
                  </div>

                  <h4 style={{
                    margin: '0 0 10px 0',
                    fontSize: 14,
                    fontWeight: 700,
                    color: isSolved ? '#fff' : 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"Inter", sans-serif',
                  }}>
                    {cf.title}
                  </h4>

                  {isSolved ? (
                    <div style={{
                      fontSize: 13,
                      color: '#fef7e0', // folder cream text
                      lineHeight: 1.4,
                      background: 'rgba(254, 247, 224, 0.05)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: '3px solid #22c55e',
                      fontFamily: '"SF Mono", "Fira Code", monospace',
                    }}>
                      {getDossierClueText(cf.id)}
                    </div>
                  ) : (
                    <span style={{
                      fontSize: 12,
                      color: 'rgba(255, 255, 255, 0.35)',
                      fontFamily: '"Inter", sans-serif',
                    }}>
                      {isUnlocked ? 'Investigation in progress. Clear the objective to extract dossier findings.' : 'Locked. Solve previous cases to decrypt dossier file.'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
