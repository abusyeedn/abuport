/**
 * Case01_FirstImpression.tsx
 *
 * Case File 01 — Rendered inside the first zone.
 * Displays 15 Pinterest-style clue cards. User must find 5 to complete the case.
 */
import React, { useCallback, useMemo } from 'react'
import { case01Clues, caseFiles } from '../../../data/caseFileData'
import EvidenceCard from '../EvidenceCard'
import CaseFileModal from '../CaseFileModal'
import { useGameState } from '../useGameState'

export default function Case01_FirstImpression() {
  const { markClueFound, isClueFound, activeClueId, openClue, closeClue, caseProgress, completeCase } = useGameState()

  const caseId = 1
  const caseDef = useMemo(() => caseFiles.find(c => c.id === caseId), [])
  const progress = caseProgress.get(caseId)
  const isSolved = progress?.solved ?? false

  const handleClueClick = useCallback((clueId: string) => {
    openClue(clueId)
    markClueFound(caseId, clueId)
    
    // Check if this was the last clue needed
    const currentFoundCount = (progress?.cluesFound.size ?? 0) + (isClueFound(clueId) ? 0 : 1)
    if (!isSolved && caseDef && currentFoundCount >= caseDef.requiredClues) {
      completeCase(caseId)
    }
  }, [caseId, caseDef, progress, isSolved, markClueFound, isClueFound, openClue, completeCase])

  const activeClue = useMemo(() => case01Clues.find(c => c.id === activeClueId), [activeClueId])

  return (
    <>
      {case01Clues.map(clue => {
        const found = isClueFound(clue.id)
        return (
          <EvidenceCard
            key={clue.id}
            item={clue}
            isSolved={found}
            onClick={() => handleClueClick(clue.id)}
          />
        )
      })}

      {/* Detail Modal */}
      <CaseFileModal
        isOpen={!!activeClue && activeClue.caseId === caseId}
        onClose={closeClue}
        title={activeClue?.title}
        subtitle="EVIDENCE RECORD"
        isSolved={true} // Automatically solved when opened
        stampText="ARTIFACT COLLECTED"
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
                Personal Note
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
