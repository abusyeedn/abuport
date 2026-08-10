/**
 * Case03_Workspace.tsx - "The Lost Memory"
 *
 * One project memory survived only as scattered, broken fragments. The
 * player clicks each floating fragment to magnetically snap it back into
 * place. Once all six are restored, the complete memory - and the project
 * that defined Abu - is revealed.
 */
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { case03Fragments, lostMemoryProjectName, caseFiles } from '../../../data/caseFileData'
import { useGameState } from '../useGameState'
import CaseFileModal from '../CaseFileModal'
import GestureCoachMark from '../GestureCoachMark'

// The lost memory is visualized as a single Figma file icon, shattered into
// a 3×2 jigsaw. Each fragment shows one tile of the same logo - reassembling
// them rebuilds the whole mark, echoing that this memory is a design file.
const MOSAIC_COLS = 3
const MOSAIC_TILE = 180
const MOSAIC_W = MOSAIC_COLS * MOSAIC_TILE
const MOSAIC_H = 2 * MOSAIC_TILE

function FigmaTile({ index }: { index: number }) {
  const col = index % MOSAIC_COLS
  const row = Math.floor(index / MOSAIC_COLS)
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 6 }}>
      <div style={{
        position: 'absolute',
        left: -col * MOSAIC_TILE,
        top: -row * MOSAIC_TILE,
        width: MOSAIC_W,
        height: MOSAIC_H,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon icon="logos:figma" width={MOSAIC_H * 0.72} height={MOSAIC_H * 0.72} />
      </div>
    </div>
  )
}

// Scattered starting positions (broken/floating) relative to the zone
const scatteredPositions: Record<string, { x: number; y: number; rotation: number }> = {
  'mem-problem': { x: 80, y: 60, rotation: -18 },
  'mem-research': { x: 900, y: 40, rotation: 14 },
  'mem-iterations': { x: 1250, y: 300, rotation: -12 },
  'mem-failures': { x: 60, y: 620, rotation: 16 },
  'mem-breakthrough': { x: 700, y: 750, rotation: -14 },
  'mem-impact': { x: 1200, y: 700, rotation: 10 },
}

// Final reconstructed positions - tightly packed into the 3×2 jigsaw grid
// so restored tiles sit flush against each other and form one Figma mark.
const finalPositions: Record<string, { x: number; y: number }> = {
  'mem-problem': { x: 280, y: 140 },
  'mem-research': { x: 460, y: 140 },
  'mem-iterations': { x: 640, y: 140 },
  'mem-failures': { x: 280, y: 320 },
  'mem-breakthrough': { x: 460, y: 320 },
  'mem-impact': { x: 640, y: 320 },
}

export default function Case03_Workspace() {
  const { markClueFound, caseProgress, completeCase, activeCaseModal, openCaseModal, closeCaseModal, isClueFound } = useGameState()

  const caseId = 3
  const caseDef = useMemo(() => caseFiles.find(c => c.id === caseId), [])
  const progress = caseProgress.get(caseId)
  const isSolved = progress?.solved ?? false

  const handleFragmentClick = (fragId: string) => {
    if (isSolved || isClueFound(fragId)) return

    markClueFound(caseId, fragId)

    const currentFoundCount = (progress?.cluesFound.size ?? 0) + 1
    if (!isSolved && caseDef && currentFoundCount >= caseDef.requiredClues) {
      completeCase(caseId)
      setTimeout(() => openCaseModal(caseId), 1600)
    }
  }

  return (
    <>
      {/* Reconstruction frame (target area) - matches the assembled jigsaw exactly */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: 240,
        width: 620,
        height: 440,
        border: '4px dashed rgba(255,255,255,0.06)',
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        {!isSolved && (
          <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.06)', fontFamily: 'monospace', letterSpacing: '0.2em' }}>
            FIGMA FILE - SHATTERED
          </span>
        )}
      </div>

      {/* Gesture coach mark on the first un-restored fragment */}
      {!isSolved && (
        <GestureCoachMark
          x={scatteredPositions['mem-problem'].x + 70}
          y={scatteredPositions['mem-problem'].y + 70}
          dismissed={isClueFound('mem-problem')}
        />
      )}

      {/* Interactive fragments - each shows one tile of the same Figma mark */}
      {case03Fragments.map((frag, i) => {
        const isPlaced = isClueFound(frag.id) || isSolved
        const scattered = scatteredPositions[frag.id]
        const final = finalPositions[frag.id]
        const x = isPlaced ? 240 + final.x - 280 : scattered.x
        const y = isPlaced ? 100 + final.y - 140 : scattered.y
        const rotation = isPlaced ? 0 : scattered.rotation

        return (
          <motion.div
            key={frag.id}
            initial={false}
            animate={{ x, y, rotate: rotation, scale: isPlaced ? 1 : 1.05 }}
            transition={{ type: 'spring', damping: 18, stiffness: 90 }}
            onClick={() => handleFragmentClick(frag.id)}
            whileHover={!isPlaced ? { scale: 1.12, filter: 'brightness(1.2)' } : undefined}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 180,
              height: 180,
              background: '#fcf8ec',
              borderRadius: isPlaced ? 0 : 6,
              cursor: isPlaced ? 'default' : 'pointer',
              boxShadow: isPlaced ? 'none' : '0 12px 24px rgba(0,0,0,0.6)',
              outline: isPlaced ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.1)',
              zIndex: isPlaced ? 10 : 20,
              boxSizing: 'border-box',
            }}
          >
            <FigmaTile index={i} />

            {/* Piece label - always shown so the player knows what's being pieced together */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              padding: '6px 8px',
              background: 'rgba(255,255,255,0.92)',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              textAlign: 'center',
            }}>
              <span style={{ fontSize: 11, fontWeight: 800, fontFamily: 'monospace', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {frag.label}
              </span>
            </div>
          </motion.div>
        )
      })}

      {/* Success Modal - the memory, fully reconstructed */}
      <CaseFileModal
        isOpen={activeCaseModal === caseId}
        onClose={closeCaseModal}
        title={lostMemoryProjectName}
        subtitle="MEMORY RESTORED"
      >
        <div style={{ padding: '8px 0' }}>
          <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>
            This was the project that defined him.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#334155', marginBottom: 28, fontFamily: '"Inter", sans-serif' }}>
            Every fragment has been recovered. Together, they tell the full story of {lostMemoryProjectName}.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {case03Fragments.map(frag => (
              <div key={frag.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'rgba(0,0,0,0.03)', padding: 16, borderRadius: 8 }}>
                <span style={{ fontSize: 26 }}>{frag.emoji}</span>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: 13, fontFamily: 'monospace', textTransform: 'uppercase', color: '#dc2626' }}>{frag.label}</h4>
                  <p style={{ margin: 0, fontSize: 13, color: '#555', lineHeight: 1.5 }}>{frag.content}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </CaseFileModal>
    </>
  )
}
