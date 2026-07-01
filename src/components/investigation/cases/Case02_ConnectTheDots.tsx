/**
 * Case02_ConnectTheDots.tsx
 *
 * Case File 02 — Rendered inside the second zone.
 * User drags strings between concept cards. Correct connections reveal Abu's thought process.
 */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { case02Concepts, case02Connections, caseFiles } from '../../../data/caseFileData'
import { useGameState } from '../useGameState'
import CaseFileModal from '../CaseFileModal'

interface Point { x: number; y: number }

export default function Case02_ConnectTheDots() {
  const { markClueFound, caseProgress, completeCase, activeCaseModal, openCaseModal, closeCaseModal } = useGameState()
  
  const caseId = 2
  const caseDef = useMemo(() => caseFiles.find(c => c.id === caseId), [])
  const progress = caseProgress.get(caseId)
  const isSolved = progress?.solved ?? false

  // Interaction state
  const [activeDrag, setActiveDrag] = useState<{ startId: string; currentPos: Point } | null>(null)
  const [connections, setConnections] = useState<Set<string>>(new Set()) // 'id1-id2' format
  const [revealedPath, setRevealedPath] = useState<string[] | null>(null)

  const svgRef = useRef<SVGSVGElement>(null)

  // Pre-calculate center points of cards for easy string drawing
  const cardCenters = useMemo(() => {
    const centers: Record<string, Point> = {}
    case02Concepts.forEach(c => {
      centers[c.id] = { x: c.x + 80, y: c.y + 60 } // Assuming card is 160x120
    })
    return centers
  }, [])

  const handlePointerDown = (e: React.PointerEvent, conceptId: string) => {
    if (isSolved) return
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    
    // Get cursor pos relative to the SVG container (which is 100% of the zone)
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      // We need to account for scale/zoom, which makes raw clientX/Y tricky.
      // But since we are rendering absolute inside the zone, we can just use the center of the card as the start.
      setActiveDrag({
        startId: conceptId,
        currentPos: cardCenters[conceptId]
      })
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeDrag || !svgRef.current) return
    
    const rect = svgRef.current.getBoundingClientRect()
    // The Case 2 zone has a size of 1600x1200. Convert screen pixels to local coordinates.
    const scaleX = rect.width / 1600
    const scaleY = rect.height / 1200
    
    setActiveDrag(prev => {
      if (!prev) return null
      return {
        ...prev,
        currentPos: {
          x: (e.clientX - rect.left) / scaleX,
          y: (e.clientY - rect.top) / scaleY
        }
      }
    })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!activeDrag || !svgRef.current) return
    
    // Calculate release coordinates in local 1600x1200 coordinate space
    const rect = svgRef.current.getBoundingClientRect()
    const scaleX = rect.width / 1600
    const scaleY = rect.height / 1200
    const localX = (e.clientX - rect.left) / scaleX
    const localY = (e.clientY - rect.top) / scaleY

    // Find the closest card within range
    let endId: string | null = null
    let minDistance = 120 // Target snap radius

    case02Concepts.forEach(c => {
      if (c.id === activeDrag.startId) return
      const center = cardCenters[c.id]
      const dx = localX - center.x
      const dy = localY - center.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < minDistance) {
        minDistance = dist
        endId = c.id
      }
    })
    
    if (endId) {
      const isCorrectPair = 
        (activeDrag.startId === 'c02-running' && endId === 'c02-minimalism') ||
        (activeDrag.startId === 'c02-minimalism' && endId === 'c02-running') ||
        (activeDrag.startId === 'c02-ai' && endId === 'c02-technology') ||
        (activeDrag.startId === 'c02-technology' && endId === 'c02-ai') ||
        (activeDrag.startId === 'c02-coffee' && endId === 'c02-music') ||
        (activeDrag.startId === 'c02-music' && endId === 'c02-coffee')

      if (isCorrectPair) {
        // Create connection
        const pair = [activeDrag.startId, endId].sort().join('--')
        const newConnections = new Set(connections)
        newConnections.add(pair)
        setConnections(newConnections)

        // Check if this connection forms part of a correct path
        const startConcept = case02Concepts.find(c => c.id === activeDrag.startId)?.label
        
        const foundPath = case02Connections.find(path => 
          path.nodes[0] === startConcept // Match by starting concept
        )

        if (foundPath) {
          setRevealedPath(foundPath.nodes)
          openCaseModal(caseId)
          
          // Mark clue found based on the start concept
          markClueFound(caseId, activeDrag.startId)
          
          // Check case completion
          const currentFoundCount = (progress?.cluesFound.size ?? 0) + 1
          if (!isSolved && caseDef && currentFoundCount >= caseDef.requiredClues) {
            completeCase(caseId)
          }
        }
      }
    }
    
    setActiveDrag(null)
  }

  // Draw active and established lines
  const renderLines = () => {
    const lines = []
    
    // Established connections
    let i = 0
    connections.forEach(conn => {
      const [id1, id2] = conn.split('--')
      const p1 = cardCenters[id1]
      const p2 = cardCenters[id2]
      if (p1 && p2) {
        lines.push(
          <line key={`conn-${i++}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#dc2626" strokeWidth="4" strokeDasharray="8 4" opacity="0.8" />
        )
      }
    })

    // Active drag line
    if (activeDrag) {
      const p1 = cardCenters[activeDrag.startId]
      const p2 = activeDrag.currentPos
      lines.push(
        <line key="active" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#dc2626" strokeWidth="4" opacity="0.5" />
      )
    }

    return lines
  }

  return (
    <>
      <div 
        style={{ position: 'absolute', inset: 0 }}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => handlePointerUp(e)}
        onPointerLeave={(e) => handlePointerUp(e)}
      >
        <svg 
          ref={svgRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
        >
          {renderLines()}
        </svg>

        {case02Concepts.map(concept => {
          const isFound = progress?.cluesFound.has(concept.id) ?? false
          
          return (
            <div
              key={concept.id}
              data-concept-id={concept.id}
              onPointerDown={(e) => handlePointerDown(e, concept.id)}
              onPointerUp={handlePointerUp}
              style={{
                position: 'absolute',
                left: concept.x,
                top: concept.y,
                width: 160,
                height: 120,
                background: '#fefce8',
                borderRadius: 4,
                boxShadow: '2px 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isSolved ? 'default' : 'grab',
                zIndex: 10,
                border: isFound ? '2px solid #22c55e' : '1px solid rgba(0,0,0,0.1)',
                userSelect: 'none',
              }}
            >
              {/* Pin */}
              <div style={{ position: 'absolute', top: -6, width: 12, height: 12, borderRadius: '50%', background: isFound ? '#22c55e' : '#dc2626', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.5)' }} />
              
              <div style={{ fontSize: 32, marginBottom: 8 }}>{concept.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: '"Caveat", cursive', color: '#1a1a1a' }}>
                {concept.label}
              </div>
            </div>
          )
        })}
      </div>

      <CaseFileModal
        isOpen={activeCaseModal === caseId}
        onClose={closeCaseModal}
        title="THOUGHT PATTERN DISCOVERED"
        subtitle="ANALYSIS RESULT"
      >
        {revealedPath && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h3 style={{ fontSize: 16, color: '#666', marginBottom: 32, letterSpacing: '0.1em' }}>CONNECTION ESTABLISHED</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              {revealedPath.map((node, i) => (
                <React.Fragment key={i}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.4 }}
                    style={{
                      background: '#fff',
                      border: '2px solid #dc2626',
                      padding: '16px 24px',
                      borderRadius: 8,
                      fontSize: 18,
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(220,38,38,0.15)'
                    }}
                  >
                    {node}
                  </motion.div>
                  
                  {i < revealedPath.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 40 }}
                      transition={{ delay: i * 0.4 + 0.2 }}
                      style={{ height: 4, background: '#dc2626', borderRadius: 2 }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </CaseFileModal>
    </>
  )
}
