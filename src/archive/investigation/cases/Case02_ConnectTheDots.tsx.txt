/**
 * Case02_ConnectTheDots.tsx - "Memory Network"
 *
 * Four memory clusters float around the reconstructed silhouette. The player
 * opens a root memory, then clicks each following node strictly in order -
 * every correct link glows and reveals one sentence about how Abu thinks.
 */
import React, { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { case02Chains, caseFiles } from '../../../data/caseFileData'
import { useGameState } from '../useGameState'
import GestureCoachMark from '../GestureCoachMark'

export default function Case02_ConnectTheDots() {
  const { markClueFound, isClueFound, caseProgress, completeCase } = useGameState()

  const caseId = 2
  const caseDef = useMemo(() => caseFiles.find(c => c.id === caseId), [])
  const progress = caseProgress.get(caseId)
  const isSolved = progress?.solved ?? false

  const [openChainId, setOpenChainId] = useState<string | null>(null)
  const [linkedIndex, setLinkedIndex] = useState(0) // how many nodes of the open chain are linked so far

  const openChain = useMemo(() => case02Chains.find(c => c.id === openChainId) ?? null, [openChainId])

  const handleRootClick = useCallback((chainId: string) => {
    if (isClueFound(chainId)) return
    setOpenChainId(chainId)
    setLinkedIndex(0)
  }, [isClueFound])

  const handleNodeClick = useCallback((chainId: string, nodeIdx: number) => {
    if (nodeIdx !== linkedIndex) return // must connect strictly in order
    const chain = case02Chains.find(c => c.id === chainId)
    if (!chain) return

    const next = linkedIndex + 1
    setLinkedIndex(next)

    if (next >= chain.nodes.length) {
      markClueFound(caseId, chainId)
      const currentFoundCount = (progress?.cluesFound.size ?? 0) + 1
      setTimeout(() => setOpenChainId(null), 900)
      if (!isSolved && caseDef && currentFoundCount >= caseDef.requiredClues) {
        setTimeout(() => completeCase(caseId), 1000)
      }
    }
  }, [linkedIndex, caseDef, progress, isSolved, markClueFound, completeCase])

  return (
    <>
      {!isSolved && !openChainId && (
        <GestureCoachMark x={800 - 10} y={160 - 10} dismissed={isClueFound(case02Chains[0].id)} />
      )}

      {/* Root memory nodes arranged around the silhouette center */}
      {case02Chains.map((chain, i) => {
        const linked = isClueFound(chain.id)
        const angle = (i / case02Chains.length) * Math.PI * 2 - Math.PI / 2
        const cx = 800, cy = 500, r = 340
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r

        return (
          <motion.div
            key={chain.id}
            onClick={() => handleRootClick(chain.id)}
            whileHover={!linked ? { scale: 1.08 } : undefined}
            whileTap={!linked ? { scale: 0.95 } : undefined}
            style={{
              position: 'absolute',
              left: x - 60,
              top: y - 60,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: linked ? 'rgba(34,197,94,0.12)' : 'rgba(220,38,38,0.1)',
              border: `2px solid ${linked ? '#22c55e' : '#dc2626'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: linked ? 'default' : 'pointer',
              boxShadow: linked ? '0 0 30px rgba(34,197,94,0.35)' : '0 0 20px rgba(220,38,38,0.2)',
              zIndex: 10,
            }}
          >
            <div style={{ fontSize: 32 }}>{chain.rootEmoji}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'monospace', marginTop: 4 }}>
              {chain.rootLabel}
            </div>
          </motion.div>
        )
      })}

      {/* Active chain - nodes revealed in sequence, connected via glowing links */}
      <AnimatePresence>
        {openChain && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              left: 200, top: 850,
              width: 1200, height: 260,
              background: 'rgba(5,5,8,0.9)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: 12,
              backdropFilter: 'blur(10px)',
              padding: '24px 32px',
              zIndex: 40,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '0.15em', marginBottom: 16 }}>
              TRACE THE PATHWAY - CLICK EACH NODE IN ORDER
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {/* Root node */}
              <div style={{
                padding: '12px 18px', borderRadius: 8,
                background: '#dc2626', color: '#fff',
                fontFamily: 'monospace', fontWeight: 700, fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>{openChain.rootEmoji}</span>{openChain.rootLabel}
              </div>

              {openChain.nodes.map((node, idx) => {
                const connected = idx < linkedIndex
                const isNext = idx === linkedIndex
                return (
                  <React.Fragment key={node.label}>
                    <motion.div
                      animate={{ opacity: connected ? 1 : 0.4, background: connected ? '#dc2626' : 'rgba(255,255,255,0.06)' }}
                      style={{ height: 3, width: 32, borderRadius: 2 }}
                    />
                    <motion.button
                      onClick={() => handleNodeClick(openChain.id, idx)}
                      whileHover={isNext ? { scale: 1.05 } : undefined}
                      whileTap={isNext ? { scale: 0.95 } : undefined}
                      style={{
                        padding: '12px 18px',
                        borderRadius: 8,
                        background: connected ? 'rgba(34,197,94,0.15)' : isNext ? 'rgba(220,38,38,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${connected ? '#22c55e' : isNext ? '#dc2626' : 'rgba(255,255,255,0.1)'}`,
                        color: connected ? '#22c55e' : isNext ? '#fff' : 'rgba(255,255,255,0.3)',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: isNext ? 'pointer' : 'default',
                      }}
                    >
                      {node.label}
                    </motion.button>
                  </React.Fragment>
                )
              })}
            </div>

            {/* Insight sentence for the most recently connected node */}
            <AnimatePresence mode="wait">
              {linkedIndex > 0 && (
                <motion.p
                  key={linkedIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ marginTop: 20, fontSize: 15, color: '#fef7e0', fontStyle: 'italic', lineHeight: 1.5, maxWidth: 700 }}
                >
                  "{openChain.nodes[linkedIndex - 1].insight}"
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
