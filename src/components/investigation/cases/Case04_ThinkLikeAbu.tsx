/**
 * Case04_ThinkLikeAbu.tsx
 *
 * Case File 04 — Rendered inside the fourth zone.
 * Presents a sequence of A/B choices. User must guess how Abu thinks.
 */
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { case04Choices, caseFiles } from '../../../data/caseFileData'
import { useGameState } from '../useGameState'
import CaseFileModal from '../CaseFileModal'

export default function Case04_ThinkLikeAbu() {
  const { markClueFound, caseProgress, completeCase, activeCaseModal, openCaseModal, closeCaseModal } = useGameState()
  
  const caseId = 4
  const caseDef = useMemo(() => caseFiles.find(c => c.id === caseId), [])
  const progress = caseProgress.get(caseId)
  const isSolved = progress?.solved ?? false

  // Local state for the current question being answered
  const currentChoiceIndex = progress?.cluesFound.size ?? 0
  const currentChoice = case04Choices[Math.min(currentChoiceIndex, case04Choices.length - 1)]

  // Track the most recently answered question for the explanation reveal
  const [revealedChoice, setRevealedChoice] = useState<{ id: string; userPicked: 'a'|'b' } | null>(null)

  const handleChoice = (option: 'a' | 'b') => {
    if (isSolved || revealedChoice) return // Prevent clicking while explanation is showing

    setRevealedChoice({ id: currentChoice.id, userPicked: option })
    
    // Wait for user to read explanation before moving to next
    setTimeout(() => {
      setRevealedChoice(null)
      markClueFound(caseId, currentChoice.id)
      
      const newFoundCount = currentChoiceIndex + 1
      if (!isSolved && caseDef && newFoundCount >= caseDef.requiredClues) {
        completeCase(caseId)
        setTimeout(() => openCaseModal(caseId), 500)
      }
    }, 4000)
  }

  return (
    <>
      {/* Central Interactive Console */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        background: '#111',
        borderRadius: 16,
        padding: 48,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        
        <div style={{ fontSize: 12, color: '#666', fontFamily: 'monospace', letterSpacing: '0.2em', marginBottom: 40, textTransform: 'uppercase' }}>
          PSYCHOLOGICAL PROFILING: TEST {Math.min(currentChoiceIndex + 1, caseDef?.requiredClues ?? 5)} OF {caseDef?.requiredClues}
        </div>

        <AnimatePresence mode="wait">
          {!revealedChoice && !isSolved && (
            <motion.div
              key={`q-${currentChoice.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: 'flex', gap: 32, width: '100%' }}
            >
              <ChoiceButton 
                label={currentChoice.optionA} 
                letter="A" 
                onClick={() => handleChoice('a')} 
              />
              <div style={{ display: 'flex', alignItems: 'center', color: '#444', fontFamily: 'monospace', fontSize: 18 }}>OR</div>
              <ChoiceButton 
                label={currentChoice.optionB} 
                letter="B" 
                onClick={() => handleChoice('b')} 
              />
            </motion.div>
          )}

          {revealedChoice && !isSolved && (
            <motion.div
              key={`a-${revealedChoice.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%', textAlign: 'center' }}
            >
              <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: revealedChoice.userPicked === currentChoice.abuChoice ? '#22c55e' : '#dc2626' }}>
                {revealedChoice.userPicked === currentChoice.abuChoice ? 'MATCH.' : 'MISMATCH.'}
              </div>
              <div style={{ fontSize: 18, color: '#aaa', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
                {currentChoice.explanation}
              </div>
              <div style={{ marginTop: 40, height: 4, background: '#333', borderRadius: 2, overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3.5, ease: 'linear' }}
                  style={{ height: '100%', background: '#666' }}
                />
              </div>
            </motion.div>
          )}

          {isSolved && (
            <motion.div
              key="solved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: 48, color: '#22c55e', marginBottom: 16 }}>✓</div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '0.1em' }}>PROFILE COMPLETE</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion Modal */}
      <CaseFileModal
        isOpen={activeCaseModal === caseId}
        onClose={closeCaseModal}
        title="THINK LIKE ABU"
        subtitle="PROFILE RESULT"
      >
        <div style={{ padding: '24px 0' }}>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#333', marginBottom: 32 }}>
            You've successfully mapped the decision-making framework. Design isn't about pushing pixels; it's about the choices made before Figma is even open.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {case04Choices.slice(0, caseDef?.requiredClues).map((choice, i) => (
              <div key={i} style={{ padding: 16, background: 'rgba(0,0,0,0.03)', borderRadius: 8, borderLeft: '4px solid #dc2626' }}>
                <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#666', marginBottom: 8, textTransform: 'uppercase' }}>
                  {choice.optionA} vs {choice.optionB}
                </div>
                <div style={{ fontSize: 16, color: '#1a1a1a', fontWeight: 500 }}>
                  {choice.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CaseFileModal>
    </>
  )
}

function ChoiceButton({ label, letter, onClick }: { label: string, letter: string, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: '#222' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        flex: 1,
        height: 200,
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      <span style={{ fontSize: 48, color: '#444', fontFamily: 'monospace', fontWeight: 900 }}>{letter}</span>
      <span style={{ fontSize: 24, fontWeight: 600, color: '#fff' }}>{label}</span>
    </motion.button>
  )
}
