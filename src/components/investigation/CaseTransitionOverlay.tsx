/**
 * CaseTransitionOverlay.tsx
 *
 * Full-screen overlay that displays a clean typewriter animation
 * and status update when a case is successfully cracked.
 * Blocks interaction and alerts the player before the camera pans.
 */
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameState } from './useGameState'
import { caseFiles, case01Clues } from '../../data/caseFileData'

export default function CaseTransitionOverlay() {
  const { transitioningTo, advanceCase, caseProgress } = useGameState()

  const case1Progress = caseProgress.get(1)
  const collectedClues = React.useMemo(() => {
    if (!case1Progress) return []
    return case01Clues.filter(c => case1Progress.cluesFound.has(c.id))
  }, [case1Progress])

  const nextCaseFile = transitioningTo === 8
    ? { id: 8, title: 'FINALE: CASE CLOSED', subtitle: 'Case File 08', objective: 'All evidence connected. Swerving into full decrypt.' }
    : caseFiles.find(c => c.id === transitioningTo)

  const currentCaseFile = caseFiles.find(c => c.id === (transitioningTo ? transitioningTo - 1 : 0))

  // Custom Dossier Texts based on user design requirements
  const getTransitionDossierContent = (completedCaseId: number) => {
    switch (completedCaseId) {
      case 1:
        return (
          <div style={{ textAlign: 'left', background: 'rgba(254, 247, 224, 0.04)', padding: 24, borderRadius: 6, border: '1px solid rgba(254, 247, 224, 0.1)', marginBottom: 24 }}>
            <div style={{ color: '#ef4444', fontSize: 10, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 12 }}>CLASSIFIED RECORD</div>
            <p style={{ margin: '0 0 16px 0', fontSize: 15, fontStyle: 'italic', color: '#fef7e0' }}>
              "Every obsession serves a purpose. Don't remember what he likes. Discover why those things belong together."
            </p>
            <div style={{ fontSize: 13, color: '#aaa', fontFamily: 'monospace', lineHeight: 1.6 }}>
              <div>Running → ?</div>
              <div>Coffee → ?</div>
              <div>Technology → ?</div>
              <div>Music → ?</div>
              <div>Minimalism → ?</div>
              <div>Travel → ?</div>
            </div>
          </div>
        )
      case 2:
        return (
          <div style={{ textAlign: 'left', background: 'rgba(254, 247, 224, 0.04)', padding: 24, borderRadius: 6, border: '1px solid rgba(254, 247, 224, 0.1)', marginBottom: 24 }}>
            <div style={{ color: '#ef4444', fontSize: 10, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 12 }}>PROFILE REPORT</div>
            <p style={{ margin: '0 0 16px 0', fontSize: 15, fontStyle: 'italic', color: '#fef7e0', lineHeight: 1.5 }}>
              "Interesting... The connections explain how he thinks. But four critical pieces of evidence are missing."
            </p>
            <div style={{ fontSize: 12, color: '#dc2626', fontFamily: 'monospace', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              ⚠️ Faded photograph showing four empty pin marks.
            </div>
          </div>
        )
      case 3:
        return (
          <div style={{ textAlign: 'left', background: 'rgba(254, 247, 224, 0.04)', padding: 24, borderRadius: 6, border: '1px solid rgba(254, 247, 224, 0.1)', marginBottom: 24 }}>
            <div style={{ color: '#ef4444', fontSize: 10, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 12 }}>PERSONAL OBSERVATION</div>
            <p style={{ margin: 0, fontSize: 15, fontStyle: 'italic', color: '#fef7e0', lineHeight: 1.5 }}>
              "These weren't hobbies. These were routines. Don't study the tools. Study the decisions."
            </p>
          </div>
        )
      case 4:
        return (
          <div style={{ textAlign: 'left', background: 'rgba(254, 247, 224, 0.04)', padding: 24, borderRadius: 6, border: '1px solid rgba(254, 247, 224, 0.1)', marginBottom: 24 }}>
            <div style={{ color: '#ef4444', fontSize: 10, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 12 }}>PROJECT OMEGA</div>
            <p style={{ margin: 0, fontSize: 15, fontStyle: 'italic', color: '#fef7e0', lineHeight: 1.5 }}>
              "Every decision led to one project. Find it."
            </p>
          </div>
        )
      case 5:
        return (
          <div style={{ textAlign: 'left', background: 'rgba(254, 247, 224, 0.04)', padding: 24, borderRadius: 6, border: '1px solid rgba(254, 247, 224, 0.1)', marginBottom: 24 }}>
            <div style={{ color: '#ef4444', fontSize: 10, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 12 }}>TIMELINE REQUEST</div>
            <p style={{ margin: 0, fontSize: 15, fontStyle: 'italic', color: '#fef7e0', lineHeight: 1.5 }}>
              "Projects explain achievements. Time explains growth. Reconstruct the journey."
            </p>
          </div>
        )
      case 6:
        return (
          <div style={{ textAlign: 'left', background: 'rgba(254, 247, 224, 0.04)', padding: 24, borderRadius: 6, border: '1px solid rgba(254, 247, 224, 0.1)', marginBottom: 24 }}>
            <div style={{ color: '#ef4444', fontSize: 10, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 12 }}>FINAL PROFILE</div>
            <p style={{ margin: 0, fontSize: 15, fontStyle: 'italic', color: '#fef7e0', lineHeight: 1.5 }}>
              "You've learned the facts. You've rebuilt the journey. One question remains. Can you think like him without seeing the answers?"
            </p>
          </div>
        )
      case 7:
        return (
          <div style={{ textAlign: 'left', background: 'rgba(254, 247, 224, 0.04)', padding: 24, borderRadius: 6, border: '1px solid rgba(254, 247, 224, 0.1)', marginBottom: 24 }}>
            <div style={{ color: '#ef4444', fontSize: 10, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 12 }}>FINAL SUMMARY</div>
            <p style={{ margin: 0, fontSize: 15, fontStyle: 'italic', color: '#fef7e0', lineHeight: 1.5 }}>
              "At the beginning, you searched for clues. Then you discovered habits. Then decisions. Then purpose. You didn't just investigate Abu's work. You investigated the person behind it."
            </p>
          </div>
        )
      default:
        return null
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
              borderRadius: 8,
              background: 'rgba(15,15,15,0.6)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px rgba(220,38,38,0.05)',
            }}
          >
            <div style={{ 
              fontSize: 12, 
              color: '#22c55e', 
              fontWeight: 800, 
              letterSpacing: '0.3em', 
              marginBottom: 16,
              textTransform: 'uppercase'
            }}>
              ✓ CASE {currentCaseFile.id.toString().padStart(2, '0')} CRACKED
            </div>
            
            <h1 style={{ 
              fontSize: 28, 
              fontWeight: 900, 
              marginBottom: 24, 
              letterSpacing: '-0.02em', 
              color: '#fef7e0',
              fontFamily: '"Inter", sans-serif',
              textTransform: 'uppercase'
            }}>
              {currentCaseFile.title}
            </h1>
            
            {/* Themed Classified Dossier Content */}
            {getTransitionDossierContent(currentCaseFile.id)}

            {/* Case 1 Dynamic Artifacts collected overlay */}
            {transitioningTo === 2 && collectedClues.length > 0 && (
              <div style={{
                margin: '0 0 24px 0',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 4,
                padding: 16,
                textAlign: 'left',
              }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 10, fontFamily: 'monospace' }}>
                  COLLECTED EVIDENCE:
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {collectedClues.map(clue => (
                    <span key={clue.id} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 4, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>{clue.emoji}</span>
                      <span style={{ color: '#fff', fontWeight: 500 }}>{clue.title}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ 
              fontSize: 16, 
              fontWeight: 700, 
              color: '#888',
              fontStyle: 'italic',
              margin: '24px 0 32px 0',
              fontFamily: '"Inter", sans-serif'
            }}>
              "Wait... what does this mean?"
            </div>

            {/* Next Objective Hint Block */}
            <div style={{ 
              padding: '16px 20px',
              background: 'rgba(220,38,38,0.02)',
              border: '1px dashed rgba(220,38,38,0.18)',
              borderRadius: 6,
              textAlign: 'left',
              marginBottom: 32
            }}>
              <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 6 }}>
                UNREVEALED HINT:
              </div>
              <div style={{ fontSize: 14, color: '#fca5a5', fontWeight: 500, lineHeight: 1.4, fontFamily: '"Inter", sans-serif' }}>
                {currentCaseFile.id === 1 && '"The next investigation isn\'t about finding evidence... it\'s about connecting it."'}
                {currentCaseFile.id === 2 && '"Find what someone didn\'t want you to discover."'}
                {currentCaseFile.id === 3 && '"The next investigation isn\'t about what Abu owns. It\'s about how Abu thinks."'}
                {currentCaseFile.id === 4 && '"Not every project changed him. One project changed everything."'}
                {currentCaseFile.id === 5 && '"People aren\'t built in a day. Rebuild the years."'}
                {currentCaseFile.id === 6 && '"The final test isn\'t about memory. It\'s about understanding."'}
                {currentCaseFile.id === 7 && '"All evidence connected. Swerving into full decrypt..."'}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: '#b91c1c' }}
              whileTap={{ scale: 0.97 }}
              onClick={advanceCase}
              style={{
                padding: '14px 28px',
                background: '#dc2626',
                border: 'none',
                borderRadius: 4,
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'monospace',
                letterSpacing: '0.12em',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(220, 38, 38, 0.3)',
              }}
            >
              CONTINUE TO CASE {nextCaseFile.id.toString().padStart(2, '0')} →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
