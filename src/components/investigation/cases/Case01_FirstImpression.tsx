/**
 * Case01_FirstImpression.tsx - "Memory Reconstruction"
 *
 * The wall is destroyed: every photograph is crooked. The player is not
 * solving clues - they're restoring the board. Clicking a photo straightens
 * and re-pins it. Once all are restored, the full set of evidence silently
 * forms a human silhouette, and a classified report slides out.
 */
import React, { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { case01Clues, caseFiles } from '../../../data/caseFileData'
import EvidenceCard from '../EvidenceCard'
import CaseFileModal from '../CaseFileModal'
import HumanSilhouette, { generateSilhouetteSlots } from '../HumanSilhouette'
import GestureCoachMark from '../GestureCoachMark'
import { useGameState } from '../useGameState'

export default function Case01_FirstImpression() {
  const { markClueFound, isClueFound, activeClueId, openClue, closeClue, caseProgress, completeCase } = useGameState()

  const caseId = 1
  const caseDef = useMemo(() => caseFiles.find(c => c.id === caseId), [])
  const progress = caseProgress.get(caseId)
  const isSolved = progress?.solved ?? false
  const restoredCount = progress?.cluesFound.size ?? 0

  const [showSilhouette, setShowSilhouette] = useState(false)

  const handleClueClick = useCallback((clueId: string) => {
    if (isClueFound(clueId)) {
      openClue(clueId)
      return
    }
    markClueFound(caseId, clueId)

    const currentFoundCount = (progress?.cluesFound.size ?? 0) + 1
    if (!isSolved && caseDef && currentFoundCount >= caseDef.requiredClues) {
      // Let the last photo settle, then reveal the silhouette before the
      // transition screen takes over - completeCase triggers that overlay.
      setTimeout(() => setShowSilhouette(true), 900)
      setTimeout(() => completeCase(caseId), 3200)
    }
  }, [caseId, caseDef, progress, isSolved, markClueFound, isClueFound, openClue, completeCase])

  const activeClue = useMemo(() => case01Clues.find(c => c.id === activeClueId), [activeClueId])

  const slots = useMemo(() => generateSilhouetteSlots(case01Clues.length), [])

  return (
    <>
      {!isSolved && (
        <GestureCoachMark
          x={case01Clues[0].x + case01Clues[0].width / 2 - 17}
          y={case01Clues[0].y + case01Clues[0].height / 2 - 17}
          dismissed={isClueFound(case01Clues[0].id)}
        />
      )}

      {case01Clues.map(clue => {
        const restored = isClueFound(clue.id)
        // Straightened once restored; stays crooked until then.
        const displayItem = restored ? { ...clue, rotation: 0 } : clue
        return (
          <EvidenceCard
            key={clue.id}
            item={displayItem}
            isSolved={restored}
            onClick={() => handleClueClick(clue.id)}
          />
        )
      })}

      {/* Restoration progress */}
      {!isSolved && (
        <div style={{
          position: 'absolute', top: -50, left: 0,
          fontSize: 13, fontFamily: '"SF Mono", "Fira Code", monospace',
          color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em',
        }}>
          RESTORED: {restoredCount} / {caseDef?.requiredClues}
        </div>
      )}

      {/* Silhouette reveal - camera "zooms out" as the board forms a human shape */}
      <AnimatePresence>
        {showSilhouette && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 30,
            }}
          >
            <HumanSilhouette progress={1}>
              {case01Clues.map((clue, i) => (
                <motion.div
                  key={clue.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.06, type: 'spring', damping: 14 }}
                  style={{
                    position: 'absolute',
                    left: slots[i].x - 20,
                    top: slots[i].y - 20,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(220,38,38,0.12)',
                    border: '1px solid rgba(220,38,38,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}
                >
                  {clue.emoji}
                </motion.div>
              ))}
            </HumanSilhouette>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal - restored photo memory */}
      <CaseFileModal
        isOpen={!!activeClue && activeClue.caseId === caseId}
        onClose={closeClue}
        title={activeClue?.title}
        subtitle="RESTORED MEMORY"
        isSolved={true}
        stampText="RESTORED"
      >
        {activeClue && (
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            <div style={{
              width: 300,
              height: 400,
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 100,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}>
              {activeClue.emoji || '🔍'}
            </div>

            <div style={{ flex: 1, paddingRight: 24 }}>
              <h3 style={{ fontSize: 18, color: '#666', marginTop: 0, marginBottom: 8, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                Observation
              </h3>
              <p style={{ fontSize: 24, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.4, margin: '0 0 32px 0' }}>
                "{activeClue.content}"
              </p>

              <h3 style={{ fontSize: 18, color: '#666', marginBottom: 8, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                Recovered Memory
              </h3>
              <p style={{ fontSize: 20, color: '#444', lineHeight: 1.6, margin: 0, fontStyle: 'italic', fontFamily: '"Caveat", cursive' }}>
                {activeClue.story}
              </p>
            </div>
          </div>
        )}
      </CaseFileModal>
    </>
  )
}
