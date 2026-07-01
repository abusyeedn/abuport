/**
 * Case06_Journey.tsx
 *
 * Case File 06 — Rendered inside the sixth zone.
 * User drags/clicks milestone cards to place them in chronological order.
 */
import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { case06Milestones, caseFiles } from '../../../data/caseFileData'
import { useGameState } from '../useGameState'
import CaseFileModal from '../CaseFileModal'

export default function Case06_Journey() {
  const { markClueFound, caseProgress, completeCase, activeCaseModal, openCaseModal, closeCaseModal, isClueFound } = useGameState()
  
  const caseId = 6
  const caseDef = useMemo(() => caseFiles.find(c => c.id === caseId), [])
  const progress = caseProgress.get(caseId)
  const isSolved = progress?.solved ?? false

  const handleMilestoneClick = (milestoneId: string) => {
    if (isSolved || isClueFound(milestoneId)) return
    
    markClueFound(caseId, milestoneId)
    
    const currentFoundCount = (progress?.cluesFound.size ?? 0) + 1
    if (!isSolved && caseDef && currentFoundCount >= caseDef.requiredClues) {
      completeCase(caseId)
      setTimeout(() => openCaseModal(caseId), 1500)
    }
  }

  // Scattered positions for unplaced milestones
  const scatteredPositions = useMemo(() => {
    return case06Milestones.map((_, i) => ({
      x: 200 + (i % 3) * 350 + Math.random() * 50,
      y: 420 + Math.floor(i / 3) * 150 + Math.random() * 50,
      rot: (Math.random() - 0.5) * 20
    }))
  }, [])

  return (
    <>
      {/* Timeline Base */}
      <div style={{
        position: 'absolute',
        top: 300,
        left: 200,
        width: 1200,
        height: 4,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
      }}>
        {!isSolved && (
          <div style={{ position: 'absolute', top: -40, left: 0, fontSize: 16, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '0.2em' }}>
            RECONSTRUCT TIMELINE
          </div>
        )}
      </div>

      {/* Milestones */}
      {case06Milestones.map((milestone, i) => {
        const isPlaced = isClueFound(milestone.id) || isSolved
        
        // Final position on the timeline
        const finalX = 200 + (i * 200)
        const finalY = 220
        
        const x = isPlaced ? finalX : scatteredPositions[i].x
        const y = isPlaced ? finalY : scatteredPositions[i].y
        const rot = isPlaced ? 0 : scatteredPositions[i].rot

        return (
          <motion.div
            key={milestone.id}
            initial={false}
            animate={{ x, y, rotate: rot }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            onClick={() => handleMilestoneClick(milestone.id)}
            whileHover={!isPlaced ? { scale: 1.1, zIndex: 30 } : undefined}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 180,
              padding: 16,
              background: '#fefefe',
              borderRadius: 4,
              boxShadow: isPlaced ? '0 4px 12px rgba(0,0,0,0.2)' : '2px 8px 24px rgba(0,0,0,0.4)',
              cursor: isPlaced ? 'default' : 'pointer',
              zIndex: isPlaced ? 10 : 20,
              borderTop: isPlaced ? '4px solid #22c55e' : '4px solid #dc2626',
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 900, color: '#1a1a1a', fontFamily: '"SF Mono", "Fira Code", monospace', marginBottom: 8 }}>
              {milestone.year}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 4, lineHeight: 1.2 }}>
              {milestone.title}
            </div>
            
            <AnimatePresence>
              {isPlaced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ fontSize: 12, color: '#666', marginTop: 8, lineHeight: 1.4 }}>
                    {milestone.description}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

      {/* Success Modal */}
      <CaseFileModal
        isOpen={activeCaseModal === caseId}
        onClose={closeCaseModal}
        title="CHRONOLOGY VERIFIED"
        subtitle="TIMELINE RECONSTRUCTION"
      >
        <div style={{ padding: '24px 0' }}>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#333', marginBottom: 40 }}>
            A career isn't just a list of jobs. It's a sequence of lessons learned. Here's what the timeline reveals.
          </p>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 16, width: 2, background: 'rgba(220,38,38,0.2)' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {case06Milestones.map(m => (
                <div key={m.id} style={{ position: 'relative', paddingLeft: 48 }}>
                  <div style={{ position: 'absolute', left: 11, top: 4, width: 12, height: 12, borderRadius: '50%', background: '#dc2626', border: '2px solid #fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)' }} />
                  
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', fontFamily: 'monospace', marginBottom: 4 }}>
                    {m.year}
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: 18 }}>{m.title}</h4>
                  
                  <div style={{ background: 'rgba(0,0,0,0.03)', padding: 16, borderRadius: 8, borderLeft: '3px solid #22c55e' }}>
                    <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#22c55e', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.1em' }}>
                      Key Insight
                    </div>
                    <div style={{ color: '#1a1a1a', fontStyle: 'italic', fontFamily: '"Caveat", cursive', fontSize: 18 }}>
                      "{m.lesson}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CaseFileModal>
    </>
  )
}
