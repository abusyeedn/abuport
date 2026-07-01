/**
 * Case07_RapidProfile.tsx
 *
 * Case File 07 — Rendered inside the seventh zone.
 * Rapid-fire Q&A. User answers questions and compares with Abu.
 */
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { case07Questions, caseFiles } from '../../../data/caseFileData'
import { useGameState } from '../useGameState'
import CaseFileModal from '../CaseFileModal'

export default function Case07_RapidProfile() {
  const { markClueFound, caseProgress, completeCase, activeCaseModal, openCaseModal, closeCaseModal } = useGameState()
  
  const caseId = 7
  const caseDef = useMemo(() => caseFiles.find(c => c.id === caseId), [])
  const progress = caseProgress.get(caseId)
  const isSolved = progress?.solved ?? false

  const currentIndex = progress?.cluesFound.size ?? 0
  const currentQuestion = case07Questions[Math.min(currentIndex, case07Questions.length - 1)]

  const [revealed, setRevealed] = useState<{ userChoice: 'a'|'b' } | null>(null)

  const handleAnswer = (choice: 'a' | 'b') => {
    if (isSolved || revealed) return

    setRevealed({ userChoice: choice })
    
    setTimeout(() => {
      setRevealed(null)
      markClueFound(caseId, currentQuestion.id)
      
      const newFoundCount = currentIndex + 1
      if (!isSolved && caseDef && newFoundCount >= caseDef.requiredClues) {
        completeCase(caseId)
        setTimeout(() => openCaseModal(caseId), 500)
      }
    }, 2500) // Faster pace than Case 04
  }

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        height: 600,
        background: '#f8fafc', // Light sterile clinical look
        borderRadius: 8,
        border: '1px solid #cbd5e1',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}>
        
        <div style={{ position: 'absolute', top: 24, left: 32, fontSize: 10, fontFamily: 'monospace', color: '#64748b', letterSpacing: '0.2em' }}>
          RAPID ASSESSMENT PROTOCOL
        </div>

        <div style={{ position: 'absolute', top: 24, right: 32, fontSize: 10, fontFamily: 'monospace', color: '#64748b' }}>
          SEQ: {Math.min(currentIndex + 1, caseDef?.requiredClues ?? 10)}/{caseDef?.requiredClues}
        </div>

        <AnimatePresence mode="wait">
          {!isSolved && !revealed && (
            <motion.div
              key={`q-${currentQuestion.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', gap: 24, width: '100%', maxWidth: 800 }}
            >
              <RapidButton label={currentQuestion.optionA} onClick={() => handleAnswer('a')} />
              <RapidButton label={currentQuestion.optionB} onClick={() => handleAnswer('b')} />
            </motion.div>
          )}

          {!isSolved && revealed && (
            <motion.div
              key={`r-${currentQuestion.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', width: '100%', maxWidth: 600 }}
            >
              <div style={{ 
                fontSize: 64, 
                fontWeight: 900, 
                marginBottom: 24,
                color: revealed.userChoice === currentQuestion.abuChoice ? '#22c55e' : '#334155'
              }}>
                {currentQuestion.abuChoice === 'a' ? currentQuestion.optionA : currentQuestion.optionB}
              </div>
              <div style={{ fontSize: 20, color: '#64748b', fontFamily: '"Caveat", cursive' }}>
                {currentQuestion.explanation}
              </div>
              
              {/* Progress bar for auto-advance */}
              <div style={{ width: '100%', height: 2, background: '#e2e8f0', marginTop: 40 }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.3, ease: 'linear' }}
                  style={{ height: '100%', background: '#94a3b8' }}
                />
              </div>
            </motion.div>
          )}

          {isSolved && (
            <motion.div
              key="solved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', color: '#0f172a' }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                Assessment Complete
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CaseFileModal
        isOpen={activeCaseModal === caseId}
        onClose={closeCaseModal}
        title="RAPID PROFILE"
        subtitle="FINAL ASSESSMENT"
      >
        <div style={{ padding: '24px 0' }}>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#333', marginBottom: 32 }}>
            The final pieces of the puzzle. Rapid instinct reveals true preference. The profile is now complete.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {case07Questions.slice(0, caseDef?.requiredClues).map(q => (
              <div key={q.id} style={{ padding: 12, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
                  {q.abuChoice === 'a' ? q.optionA : q.optionB}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CaseFileModal>
    </>
  )
}

function RapidButton({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: '#f1f5f9' }}
      whileTap={{ scale: 0.98, backgroundColor: '#e2e8f0' }}
      onClick={onClick}
      style={{
        flex: 1,
        height: 160,
        background: '#fff',
        border: '2px solid #e2e8f0',
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 32,
        fontWeight: 800,
        color: '#0f172a',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </motion.button>
  )
}
