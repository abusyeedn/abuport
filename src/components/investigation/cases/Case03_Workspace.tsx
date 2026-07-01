/**
 * Case03_Workspace.tsx
 *
 * Case File 03 — Rendered inside the third zone.
 * User drags/clicks objects to place them on the desk outline.
 */
import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { case03Objects, caseFiles } from '../../../data/caseFileData'
import { useGameState } from '../useGameState'
import CaseFileModal from '../CaseFileModal'

export default function Case03_Workspace() {
  const { markClueFound, caseProgress, completeCase, activeCaseModal, openCaseModal, closeCaseModal, isClueFound, currentCase } = useGameState()
  
  const caseId = 3
  const caseDef = useMemo(() => caseFiles.find(c => c.id === caseId), [])
  const progress = caseProgress.get(caseId)
  const isSolved = progress?.solved ?? false

  const handleObjectClick = (objId: string) => {
    if (isSolved || isClueFound(objId)) return
    
    markClueFound(caseId, objId)
    
    const currentFoundCount = (progress?.cluesFound.size ?? 0) + 1
    if (!isSolved && caseDef && currentFoundCount >= caseDef.requiredClues) {
      completeCase(caseId)
      setTimeout(() => openCaseModal(caseId), 1500) // Delay to let animation finish
    }
  }

  // Scattered coordinates relative to Case 3 Zone (x: 4000, y: 2400)
  const scatteredPositions = useMemo<Record<string, { x: number, y: number }>>(() => ({
    'ws-notebook': { x: -1600, y: -800 },   // Near Case 1 (2400, 1600)
    'ws-wireframe': { x: -3200, y: -1600 }, // Near Case 6 (800, 800)
    'ws-medal': { x: 400, y: -1600 },       // Near Case 2 (4400, 800)
    'ws-journal': { x: -3000, y: 200 }      // Near Case 5 (1000, 2600)
  }), [])

  // Do not render anything until Case 3 is unlocked
  if (currentCase < 3) return null

  return (
    <>
      {/* Desk Outline (Target area) */}
      <div style={{
        position: 'absolute',
        top: 250,
        left: 200,
        width: 1200,
        height: 500,
        border: '4px dashed rgba(255,255,255,0.06)',
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        {!isSolved && (
          <span style={{ fontSize: 32, color: 'rgba(255,255,255,0.06)', fontFamily: 'monospace', letterSpacing: '0.25em' }}>
            EMPTY PIN OUTLINES
          </span>
        )}
      </div>

      {/* Interactive Objects */}
      {case03Objects.map((obj) => {
        const isPlaced = isClueFound(obj.id) || isSolved
        const x = isPlaced ? 200 + obj.finalX : (scatteredPositions[obj.id]?.x ?? 0)
        const y = isPlaced ? 250 + obj.finalY : (scatteredPositions[obj.id]?.y ?? 0)

        return (
          <motion.div
            key={obj.id}
            initial={false}
            animate={{ x, y, scale: isPlaced ? 1 : 1.25 }}
            transition={{ type: 'spring', damping: 18, stiffness: 90 }}
            onClick={() => handleObjectClick(obj.id)}
            whileHover={!isPlaced ? { scale: 1.3, filter: 'brightness(1.2)' } : undefined}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 110,
              height: 110,
              background: '#fcf8ec', // Manila dossier folder color
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isPlaced ? 'default' : 'pointer',
              boxShadow: isPlaced ? '0 4px 12px rgba(0,0,0,0.3)' : '0 12px 24px rgba(0,0,0,0.6)',
              border: isPlaced ? '2px solid #22c55e' : '1px solid rgba(0,0,0,0.1)',
              zIndex: isPlaced ? 10 : 20,
              padding: 8,
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: 36 }}>{obj.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: 700, marginTop: 6, fontFamily: 'monospace', color: '#1e293b', textAlign: 'center' }}>
              {obj.name}
            </span>
          </motion.div>
        )
      })}

      {/* Success Modal */}
      <CaseFileModal
        isOpen={activeCaseModal === caseId}
        onClose={closeCaseModal}
        title="MISSING EVIDENCE RECOVERED"
        subtitle="PROFILE RECONSTRUCTION"
      >
        <div style={{ padding: '24px 0' }}>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#334155', marginBottom: 32, fontFamily: '"Inter", sans-serif' }}>
            stolen evidence elements have been restored to the profile wall. The connections are automatically re-establishing. It's clear that Abu's routines shape his outcomes:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {case03Objects.map(obj => (
              <div key={obj.id} style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'rgba(0,0,0,0.03)', padding: 16, borderRadius: 8 }}>
                <span style={{ fontSize: 32 }}>{obj.emoji}</span>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: 14, fontFamily: 'monospace' }}>{obj.name}</h4>
                  <p style={{ margin: 0, fontSize: 14, color: '#666' }}>{obj.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CaseFileModal>
    </>
  )
}
