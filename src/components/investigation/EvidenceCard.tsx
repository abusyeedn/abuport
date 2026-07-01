/**
 * EvidenceCard.tsx
 *
 * Renders a single evidence item on the investigation wall.
 * Supports interactive states: hover, locked, clicked, and solved.
 */
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Clue, DecoItem } from '../../data/caseFileData'

interface EvidenceCardProps {
  item: Clue | DecoItem
  isLocked?: boolean
  isSolved?: boolean
  onClick?: () => void
}

const EvidenceCard = React.memo(function EvidenceCard({ 
  item, 
  isLocked = false, 
  isSolved = false, 
  onClick 
}: EvidenceCardProps) {
  const { type, x, y, width, height, rotation, title, content, pinColor, bgColor } = item
  
  const isInteractive = !!onClick && !isLocked

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    width,
    height,
    transform: `rotate(${rotation}deg)`,
    zIndex: isInteractive ? 10 : 5,
    userSelect: 'none',
    pointerEvents: isInteractive ? 'auto' : 'none',
    cursor: isInteractive ? 'pointer' : 'default',
    filter: isLocked ? 'brightness(0.5) contrast(0.8) grayscale(0.5)' : 'none',
    transition: 'filter 0.5s ease',
  }

  // Pin element (changes to green when solved)
  const effectivePinColor = isSolved ? '#22c55e' : pinColor
  const pin = (
    <div style={{
      position: 'absolute',
      top: -6,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: `radial-gradient(circle at 35% 35%, ${effectivePinColor}dd, ${effectivePinColor})`,
      boxShadow: `0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.3)`,
      zIndex: 20,
      transition: 'background 0.5s ease',
    }}>
      <div style={{
        position: 'absolute',
        top: 10,
        left: 2,
        width: 8,
        height: 4,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.25)',
        filter: 'blur(2px)',
      }} />
    </div>
  )

  // Solved stamp overlay
  const solvedStamp = (
    <AnimatePresence>
      {isSolved && (
        <motion.div
          initial={{ scale: 2, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 0.8, rotate: -10 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
            pointerEvents: 'none',
          }}
        >
          <div style={{
            color: '#22c55e',
            border: '3px solid #22c55e',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: Math.max(12, width / 6),
            fontWeight: 900,
            letterSpacing: '0.1em',
            fontFamily: '"SF Mono", "Fira Code", monospace',
            background: 'rgba(255,255,255,0.9)',
          }}>
            SOLVED
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // ── Type-specific rendering ────────────────────────────────────────────────

  let cardContent = null

  if (type === 'photo') {
    cardContent = (
      <div className="ev-card ev-photo" style={{ background: bgColor, width: '100%', height: '100%', position: 'relative' }}>
        <div style={{
          width: '100%',
          height: '75%',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: width / 3,
          color: 'rgba(255,255,255,0.15)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          {('emoji' in item) ? item.emoji : '📷'}
        </div>
        <div style={{ padding: '6px 8px', color: '#999', fontSize: Math.max(8, width/15), fontFamily: 'monospace' }}>
          {title}
        </div>
        {solvedStamp}
      </div>
    )
  }

  else if (type === 'sticky') {
    const stickyColors: Record<string, string> = {
      '#fef08a': '#854d0e',
      '#bbf7d0': '#166534',
      '#fce7f3': '#9d174d',
    }
    const textColor = stickyColors[bgColor] || '#1a1a1a'
    cardContent = (
      <div className="ev-card ev-sticky" style={{
        background: bgColor,
        width: '100%',
        height: '100%',
        padding: '16px 12px 12px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 3px 8px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        <div style={{ fontSize: Math.max(10, width/12), fontWeight: 800, color: textColor, fontFamily: '"Caveat", cursive', marginBottom: 6, lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          {title}
        </div>
        <div style={{ fontSize: Math.max(12, width/10), color: textColor, fontFamily: '"Caveat", cursive', lineHeight: 1.4, opacity: 0.85 }}>
          {content}
        </div>
        {solvedStamp}
      </div>
    )
  }

  else if (type === 'newspaper') {
    cardContent = (
      <div className="ev-card ev-newspaper" style={{
        background: bgColor,
        width: '100%',
        height: '100%',
        padding: '14px 12px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          fontSize: Math.max(9, width/18),
          fontWeight: 900,
          color: '#1a1a1a',
          fontFamily: '"Times New Roman", Georgia, serif',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          lineHeight: 1.2,
          borderBottom: '2px solid #1a1a1a',
          paddingBottom: 6,
          marginBottom: 8,
        }}>
          {title}
        </div>
        <div style={{
          fontSize: Math.max(7, width/25),
          color: '#444',
          fontFamily: '"Times New Roman", Georgia, serif',
          lineHeight: 1.5,
          columnCount: 2,
          columnGap: 8,
        }}>
          {content} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
        {solvedStamp}
      </div>
    )
  }

  else if (type === 'polaroid') {
    cardContent = (
      <div className="ev-card ev-polaroid" style={{
        background: bgColor,
        width: '100%',
        height: '100%',
        padding: '10px 10px 30px',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          height: 'calc(100% - 20px)',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0d1117 50%, #161b22 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: width / 3,
          color: 'rgba(255,255,255,0.8)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
        }}>
          {('emoji' in item) ? item.emoji : '🔍'}
        </div>
        <div style={{
          fontSize: Math.max(10, width/14),
          color: '#444',
          fontFamily: '"Caveat", cursive',
          textAlign: 'center',
          marginTop: 8,
          lineHeight: 1,
        }}>
          {title}
        </div>
        {solvedStamp}
      </div>
    )
  }

  else if (type === 'document') {
    cardContent = (
      <div className="ev-card ev-document" style={{
        background: bgColor,
        width: '100%',
        height: '100%',
        padding: '16px 14px',
        overflow: 'hidden',
        borderLeft: '3px solid #1e40af',
        position: 'relative'
      }}>
        <div style={{ fontSize: Math.max(8, width/15), fontWeight: 800, color: '#1e40af', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ fontSize: Math.max(7, width/20), color: '#555', fontFamily: 'monospace', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
          {content}
        </div>
        <div style={{ position: 'absolute', bottom: 10, right: 12, fontSize: Math.max(20, width/5), color: 'rgba(220,38,38,0.15)', fontWeight: 900, fontFamily: 'Impact, sans-serif', transform: 'rotate(-15deg)' }}>
          CLASSIFIED
        </div>
        {solvedStamp}
      </div>
    )
  }

  else if (type === 'handwritten') {
    cardContent = (
      <div className="ev-card ev-handwritten" style={{
        background: bgColor,
        width: '100%',
        height: '100%',
        padding: '14px 12px',
        backgroundImage: 'repeating-linear-gradient(transparent 0px, transparent 23px, #bfdbfe40 24px)',
        position: 'relative'
      }}>
        <div style={{ fontSize: Math.max(12, width/12), color: '#1e3a5f', fontFamily: '"Caveat", cursive', lineHeight: '24px' }}>
          {content}
        </div>
        {solvedStamp}
      </div>
    )
  }

  // Fallback for types that might not have custom logic yet (receipt, fingerprint, map, letter, label)
  else {
    cardContent = (
      <div className="ev-card ev-label" style={{
        background: bgColor,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        position: 'relative',
        border: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: Math.max(9, width/14), fontWeight: 900, color: '#1a1a1a', fontFamily: 'monospace', textTransform: 'uppercase', textAlign: 'center' }}>
          {title}
        </div>
        <div style={{ fontSize: Math.max(7, width/18), color: '#555', fontFamily: 'monospace', textAlign: 'center', marginTop: 4 }}>
          {content}
        </div>
        {solvedStamp}
      </div>
    )
  }

  return (
    <motion.div 
      style={baseStyle}
      whileHover={isInteractive ? { scale: 1.05, filter: 'brightness(1.1)' } : undefined}
      whileTap={isInteractive ? { scale: 0.95 } : undefined}
      onClick={isInteractive ? onClick : undefined}
    >
      {pin}
      {cardContent}
    </motion.div>
  )
})

export default EvidenceCard
