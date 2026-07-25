/**
 * CaseTransitionOverlay.tsx
 *
 * Full-screen classified-report panel shown between cases. Presents the
 * in-world "encrypted clue" that motivates the next investigation — never
 * an explicit instruction, always a diegetic fragment of narrative.
 */
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameState } from './useGameState'
import { caseFiles, case01Clues } from '../../data/caseFileData'

export default function CaseTransitionOverlay() {
  const { transitioningTo, advanceCase, caseProgress } = useGameState()

  const collectedClues = React.useMemo(() => {
    const case1Progress = caseProgress.get(1)
    if (!case1Progress) return []
    return case01Clues.filter(c => case1Progress.cluesFound.has(c.id))
  }, [caseProgress])

  const nextCaseFile = transitioningTo === 5
    ? { id: 5, title: 'CASE CLOSED', subtitle: 'FINAL FILE' }
    : caseFiles.find(c => c.id === transitioningTo)

  const currentCaseFile = caseFiles.find(c => c.id === (transitioningTo ? transitioningTo - 1 : 0))

  const getTransitionDossierContent = (completedCaseId: number) => {
    switch (completedCaseId) {
      case 1:
        return (
          <div style={{ textAlign: 'left', background: 'rgba(254, 247, 224, 0.04)', padding: 'var(--space-6)', borderRadius: 'var(--radius-base)', border: '1px solid rgba(254, 247, 224, 0.1)', marginBottom: 24 }}>
            <div style={{ color: '#ef4444', fontSize: 10, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 12 }}>CLASSIFIED REPORT</div>
            <p style={{ margin: 0, fontSize: 15, fontStyle: 'italic', color: '#fef7e0', lineHeight: 1.6 }}>
              "We've reconstructed his memories.<br />Now discover how they're connected."
            </p>
          </div>
        )
      case 2:
        return (
          <div style={{ textAlign: 'left', background: 'rgba(254, 247, 224, 0.04)', padding: 'var(--space-6)', borderRadius: 'var(--radius-base)', border: '1px solid rgba(254, 247, 224, 0.1)', marginBottom: 24 }}>
            <div style={{ color: '#ef4444', fontSize: 10, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 12 }}>CLASSIFIED REPORT</div>
            <p style={{ margin: 0, fontSize: 15, fontStyle: 'italic', color: '#fef7e0', lineHeight: 1.6 }}>
              "The memories survived.<br />One important memory is still fragmented."
            </p>
          </div>
        )
      case 3:
        return (
          <div style={{ textAlign: 'left', background: 'rgba(254, 247, 224, 0.04)', padding: 'var(--space-6)', borderRadius: 'var(--radius-base)', border: '1px solid rgba(254, 247, 224, 0.1)', marginBottom: 24 }}>
            <div style={{ color: '#ef4444', fontSize: 10, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 12 }}>CLASSIFIED REPORT</div>
            <p style={{ margin: 0, fontSize: 15, fontStyle: 'italic', color: '#fef7e0', lineHeight: 1.6 }}>
              "You know what he built.<br />You know why he built.<br />One mystery remains.<br />Who became this person?"
            </p>
          </div>
        )
      // Case 4 has no dossier quote here — the closing narrative is told once,
      // in the finale cinematic that follows, not repeated on this screen.
      default:
        return null
    }
  }

  const hintFor = (caseId: number) => {
    switch (caseId) {
      case 1: return 'The objects matter less than the relationships between them.'
      case 2: return 'Find the missing memory. It changed everything.'
      case 3: return 'Build the person from everything you\'ve learned.'
      default: return ''
    }
  }

  return (
    <AnimatePresence>
      {transitioningTo !== null && nextCaseFile && currentCaseFile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 5, 5, 0.94)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: '"SF Mono", "Fira Code", monospace',
            cursor: 'default',
          }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: -15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              textAlign: 'center',
              width: '90%',
              maxWidth: 580,
              padding: '40px 32px',
              border: '1px solid rgba(220,38,38,0.2)',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15,15,15,0.6)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px rgba(220,38,38,0.05)',
            }}
          >
            <div style={{
              fontSize: 12,
              color: '#22c55e',
              fontWeight: 800,
              letterSpacing: '0.3em',
              marginBottom: 'var(--space-4)',
              textTransform: 'uppercase'
            }}>
              ✓ CASE {currentCaseFile.id.toString().padStart(2, '0')} CRACKED
            </div>

            <h1 style={{
              fontSize: 28,
              fontWeight: 900,
              marginBottom: 'var(--space-6)',
              letterSpacing: '-0.02em',
              color: '#fef7e0',
              fontFamily: '"Inter", sans-serif',
              textTransform: 'uppercase'
            }}>
              {currentCaseFile.title}
            </h1>

            {/* Themed Classified Dossier Content */}
            {getTransitionDossierContent(currentCaseFile.id)}

            {/* Case 1 collected memories overlay */}
            {transitioningTo === 2 && collectedClues.length > 0 && (
              <div style={{
                margin: '0 0 24px 0',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-4)',
                textAlign: 'left',
              }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 10, fontFamily: 'monospace' }}>
                  RESTORED MEMORIES:
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {collectedClues.map(clue => (
                    <span key={clue.id} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>{clue.emoji}</span>
                      <span style={{ color: '#fff', fontWeight: 500 }}>{clue.title}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Next Objective Hint Block */}
            {hintFor(currentCaseFile.id) && (
              <div style={{
                padding: '16px 20px',
                background: 'rgba(220,38,38,0.02)',
                border: '1px dashed rgba(220,38,38,0.18)',
                borderRadius: 'var(--radius-base)',
                textAlign: 'left',
                marginBottom: 32
              }}>
                <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 6 }}>
                  HINT:
                </div>
                <div style={{ fontSize: 14, color: '#fca5a5', fontWeight: 500, lineHeight: 1.4, fontFamily: '"Inter", sans-serif' }}>
                  "{hintFor(currentCaseFile.id)}"
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: '#b91c1c' }}
              whileTap={{ scale: 0.97 }}
              onClick={advanceCase}
              style={{
                padding: '14px 28px',
                background: '#dc2626',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'monospace',
                letterSpacing: '0.12em',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(220, 38, 38, 0.3)',
              }}
            >
              {transitioningTo === 5 ? 'OPEN CASE CLOSED FILE →' : `CONTINUE TO CASE ${nextCaseFile.id.toString().padStart(2, '0')} →`}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
