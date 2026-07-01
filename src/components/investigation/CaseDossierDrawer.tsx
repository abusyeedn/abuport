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
        return 'EVIDENCE LOG: Mood board analyzed. Note recovered: "paired AI with Technology, Running with Minimalism, and Coffee with Music." Use this pairing logic to connect the dots in Case 2.'
      case 2:
        return 'METHODOLOGY KEY: Connections completed. Abu\'s workflow pairing note: "Place Laptop in the center, Keyboard in front of it, Notebook to the left, and Coffee on the far left." Use this to reconstruct the workspace in Case 3.'
      case 3:
        return 'WORKSPACE PROFILE: Desk organized. Abu\'s thinking profile note: "Abu always chooses SPEED over Polish, FUNCTION over Form, and DATA over Intuition." Use this to pass the psychological test in Case 4.'
      case 4:
        return 'PSYCH PROFILE: Mindset mapped. Case file note: "Abu\'s primary project is Spaarks. Focus on the Verdict tab to find the core user metrics." Use this to inspect his project files in Case 5.'
      case 5:
        return 'PROJECT INTELLIGENCE: Spaarks folder examined. Timeline milestones recovered: "Spaarks joined in 2021, Guvi in 2022, and began Freelancing in 2023." Use this to reconstruct the career journey in Case 6.'
      case 6:
        return 'CHRONOLOGY DOSSIER: Journey mapped. Final rapid assessment profile keys: "A, B, A, A, B, B, A, B." Use this to clear the rapid profile test in Case 7.'
      case 7:
        return 'PROFILE COMPLETE: All cases cracked. Abu\'s true identity is fully decrypted. Open the final Case Closed file to finish.'
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
            padding: 24,
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
                padding: 4,
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
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
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
                    borderRadius: 6,
                    padding: 16,
                    position: 'relative',
                    opacity: isUnlocked ? 1 : 0.5,
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
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
                      padding: 12,
                      borderRadius: 4,
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
