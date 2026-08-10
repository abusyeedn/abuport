/**
 * Case04_ThinkLikeAbu.tsx - "Profile Reconstruction"
 *
 * Every characteristic here was already learned in Cases 1–3 - nothing is
 * guessed. The player places each trait into the silhouette; every placement
 * restores another part of the portrait until the full picture emerges,
 * the flashlight switches off, and the case closes.
 */
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { case04Traits, caseFiles } from '../../../data/caseFileData'
import { useGameState } from '../useGameState'
import HumanSilhouette, { generateSilhouetteSlots } from '../HumanSilhouette'
import GestureCoachMark from '../GestureCoachMark'

export default function Case04_ThinkLikeAbu() {
  const { markClueFound, caseProgress, completeCase, isClueFound } = useGameState()

  const caseId = 4
  const caseDef = useMemo(() => caseFiles.find(c => c.id === caseId), [])
  const progress = caseProgress.get(caseId)
  const isSolved = progress?.solved ?? false
  const placedCount = progress?.cluesFound.size ?? 0

  const slots = useMemo(() => generateSilhouetteSlots(case04Traits.length), [])

  const handleTraitClick = (traitId: string) => {
    if (isSolved || isClueFound(traitId)) return
    markClueFound(caseId, traitId)

    const currentFoundCount = (progress?.cluesFound.size ?? 0) + 1
    // No extra "case closed" popup here - completeCase hands off directly to
    // CaseTransitionOverlay → FinaleSequence, so the closing message is only ever shown once.
    if (!isSolved && caseDef && currentFoundCount >= caseDef.requiredClues) {
      setTimeout(() => completeCase(caseId), 900)
    }
  }

  return (
    <>
      {/* Silhouette - brightens as traits are placed */}
      <div style={{ position: 'absolute', left: 550, top: -20 }}>
        <HumanSilhouette progress={placedCount / (caseDef?.requiredClues ?? 1)} width={480} height={600}>
          {case04Traits.map((trait, i) => {
            const placed = isClueFound(trait.id)
            if (!placed) return null
            return (
              <motion.div
                key={trait.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 14 }}
                style={{
                  position: 'absolute',
                  left: slots[i].x - 22,
                  top: slots[i].y - 22,
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'rgba(34,197,94,0.15)',
                  border: '1px solid rgba(34,197,94,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                {trait.emoji}
              </motion.div>
            )
          })}
        </HumanSilhouette>
      </div>

      {/* Trait cards to place */}
      <div style={{
        position: 'absolute', left: 40, top: 40,
        width: 460,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
      }}>
        {case04Traits.map(trait => {
          const placed = isClueFound(trait.id)
          return (
            <motion.button
              key={trait.id}
              onClick={() => handleTraitClick(trait.id)}
              whileHover={!placed ? { scale: 1.04 } : undefined}
              whileTap={!placed ? { scale: 0.96 } : undefined}
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                background: placed ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${placed ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.12)'}`,
                textAlign: 'left',
                cursor: placed ? 'default' : 'pointer',
                opacity: placed ? 0.55 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 22 }}>{trait.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
                  {trait.label}{placed && ' ✓'}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, lineHeight: 1.4 }}>
                  {trait.description}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {!isSolved && (
        <GestureCoachMark x={60} y={60} dismissed={placedCount > 0} />
      )}

      {/* Progress */}
      {!isSolved && (
        <div style={{
          position: 'absolute', top: -50, left: 40,
          fontSize: 13, fontFamily: '"SF Mono", "Fira Code", monospace',
          color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em',
        }}>
          PORTRAIT: {placedCount} / {caseDef?.requiredClues}
        </div>
      )}

    </>
  )
}
