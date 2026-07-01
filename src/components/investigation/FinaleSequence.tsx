import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { finaleData, case01Clues } from '../../data/caseFileData'
import { useGameState } from './useGameState'
import { Icon } from '@iconify/react'

export default function FinaleSequence() {
  const { currentCase, resetProgress, caseProgress } = useGameState()
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (currentCase === 8) {
      // Climax cinematic timing
      // Stage 0: Show final message typewriter over the fully illuminated board
      const t1 = setTimeout(() => setStage(1), 5000) // Slam CASE CLOSED stamp
      const t2 = setTimeout(() => setStage(2), 7000) // Reveal the "OPEN DOSSIER" button
      // Stage 3 is triggered when user clicks "OPEN DOSSIER"

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    } else {
      setStage(0)
    }
  }, [currentCase])

  // Get collected Case 1 artifacts
  const case1Progress = caseProgress.get(1)
  const collectedClues = useMemo(() => {
    if (!case1Progress) return []
    return case01Clues.filter(c => case1Progress.cluesFound.has(c.id))
  }, [case1Progress])

  if (currentCase !== 8) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 90, // Sit on top of HUD
      pointerEvents: stage >= 2 ? 'auto' : 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      
      {/* Background Darken - starts transparent, only dims when dossier is open */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 3 ? 0.94 : 0 }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#0a0a0c',
          backdropFilter: stage >= 3 ? 'blur(20px)' : 'none',
        }}
      />

      <AnimatePresence>
        {/* Stage 0 & 1: Typewriter Final Message (Transparent background, fully lit board visible) */}
        {stage < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            style={{
              zIndex: 95,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '90%',
              maxWidth: 700,
              textAlign: 'center',
              background: 'rgba(5, 5, 5, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '40px 48px',
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              pointerEvents: 'auto',
            }}
          >
            {/* The Climax Narrative Typewriter Message */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              style={{
                fontFamily: '"SF Mono", "Fira Code", monospace',
                fontSize: 16,
                lineHeight: 1.8,
                color: '#fef7e0',
                margin: '0 0 24px 0',
              }}
            >
              "At the beginning, you searched for clues.<br />
              Then you discovered habits.<br />
              Then decisions.<br />
              Then purpose.<br /><br />
              You didn't just investigate Abu's work.<br />
              You investigated the person behind it."
            </motion.p>

            {/* Stage 1: Big Detective Case Closed Stamp */}
            {stage >= 1 && (
              <motion.div
                initial={{ scale: 3, opacity: 0, rotate: -25 }}
                animate={{ scale: 1, opacity: 1, rotate: -12 }}
                transition={{ type: 'spring', damping: 10, stiffness: 220 }}
                style={{
                  color: '#dc2626',
                  border: '6px solid #dc2626',
                  padding: '10px 32px',
                  borderRadius: 4,
                  fontSize: 48,
                  fontWeight: 900,
                  fontFamily: '"SF Mono", "Fira Code", monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  background: 'rgba(5, 5, 5, 0.95)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  marginBottom: 32,
                  display: 'inline-block',
                }}
              >
                CASE CLOSED
              </motion.div>
            )}

            {/* Stage 2: Reveal Dossier Button */}
            {stage >= 2 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setStage(3)}
                whileHover={{ scale: 1.05, backgroundColor: '#dc2626' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '14px 28px',
                  background: '#b91c1c',
                  border: 'none',
                  borderRadius: 4,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(185, 28, 28, 0.4)',
                }}
              >
                OPEN PROFILE DOSSIER →
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Stage 3: Final Profile Reveal Manila Folder */}
        {stage === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            style={{
              width: '90%',
              maxWidth: 960,
              display: 'flex',
              gap: 72,
              alignItems: 'center',
              zIndex: 95,
              background: '#fcf8ec', // Dossier light cream
              padding: '60px 48px',
              borderRadius: 6,
              boxShadow: '0 30px 70px rgba(0,0,0,0.8)',
              borderTop: '8px solid #dc2626',
              position: 'relative',
              pointerEvents: 'auto',
            }}
          >
            {/* Folder Tab decoration */}
            <div style={{
              position: 'absolute',
              top: -24,
              left: 32,
              height: 24,
              width: 160,
              background: '#f5eecb',
              borderRadius: '8px 8px 0 0',
              border: '1px solid rgba(0,0,0,0.05)',
              borderBottom: 'none',
              zIndex: -1,
            }} />

            {/* Portrait side — added more space */}
            <div style={{ flex: '0 0 340px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: 24 }}>
              <div style={{
                width: 320,
                height: 400,
                background: '#fff',
                padding: '20px 20px 80px', // Extra Polaroid borders
                borderRadius: 4,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
                transform: 'rotate(-2deg)',
                position: 'relative',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #222, #111)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 64 }}>👤</span>
                </div>
                <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', fontFamily: '"Caveat", cursive', fontSize: 24, color: '#1a1a1a', width: '100%', textAlign: 'center' }}>
                  {finaleData.name}
                </div>
              </div>
            </div>

            {/* Info side */}
            <div style={{ flex: 1, color: '#1e293b' }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div style={{ fontSize: 13, color: '#dc2626', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.15em', marginBottom: 12 }}>
                  IDENTITY CONFIRMED
                </div>
                <h1 style={{ fontSize: 56, fontWeight: 900, margin: '0 0 16px 0', letterSpacing: '-0.02em', color: '#0f172a' }}>
                  {finaleData.name}
                </h1>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {finaleData.titles.map((title, i) => (
                    <span key={i} style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', color: '#334155', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                      {title}
                    </span>
                  ))}
                </div>

                <p style={{ fontSize: 16, color: '#334155', lineHeight: 1.6, marginBottom: 24, maxWidth: 500, fontFamily: '"Inter", sans-serif' }}>
                  {finaleData.closingMessage}
                </p>

                {/* Profile Connections Summary (Dynamic based on selected Case 1 clues) */}
                {collectedClues.length > 0 && (
                  <div style={{
                    marginBottom: 32,
                    padding: '16px 20px',
                    background: 'rgba(0,0,0,0.02)',
                    border: '1px dashed rgba(0,0,0,0.12)',
                    borderRadius: 8,
                    boxSizing: 'border-box',
                    maxWidth: 500
                  }}>
                    <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#dc2626', fontWeight: 800, letterSpacing: '0.12em', marginBottom: 10, textTransform: 'uppercase' }}>
                      Profile Connections Discovered
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {collectedClues.map(c => (
                        <span key={c.id} style={{ fontSize: 11, padding: '4px 8px', background: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                          <span>{c.emoji}</span>
                          <span style={{ color: '#0f172a', fontWeight: 600 }}>{c.title}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dossier links */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 500 }}>
                  {finaleData.links.map((link, i) => (
                    <a 
                      key={i} 
                      href={link.url}
                      target={link.url.startsWith('http') ? '_blank' : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px 18px',
                        background: '#1e293b',
                        borderRadius: 4,
                        color: '#fff',
                        textDecoration: 'none',
                        fontSize: 14,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        letterSpacing: '0.08em',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = '#0f172a'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = '#1e293b'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{link.icon}</span>
                      {link.label}
                    </a>
                  ))}
                </div>

                <div style={{ marginTop: 40 }}>
                  <button
                    onClick={() => resetProgress()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(0,0,0,0.4)',
                      fontFamily: 'monospace',
                      fontSize: 12,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: 0,
                      fontWeight: 700,
                    }}
                    onMouseOver={e => e.currentTarget.style.color = '#dc2626'}
                    onMouseOut={e => e.currentTarget.style.color = 'rgba(0,0,0,0.4)'}
                  >
                    <Icon icon="solar:restart-bold" /> Restart Investigation
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
