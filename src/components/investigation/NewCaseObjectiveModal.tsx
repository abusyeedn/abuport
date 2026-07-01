/**
 * NewCaseObjectiveModal.tsx
 *
 * Dossier-themed center modal that pops up when a new case sector is unlocked.
 * Clearly introduces the new case title, subtitle, and detailed objective.
 */
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useGameState } from './useGameState'
import { caseFiles } from '../../data/caseFileData'

export default function NewCaseObjectiveModal() {
  const { activeCaseObjectiveModal, closeObjectiveModal } = useGameState()

  const activeCase = caseFiles.find(c => c.id === activeCaseObjectiveModal)

  if (typeof window === 'undefined' || !document.body) return null

  return createPortal(
    <AnimatePresence>
      {activeCaseObjectiveModal !== null && activeCase && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 85, // Sits on top of HUD and other layouts, but below transition overlay
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          cursor: 'default',
        }}>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeObjectiveModal}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 5, 5, 0.82)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Dossier Card Container Wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: 550,
              zIndex: 90,
            }}
          >
            {/* Folder tab effect - sibling outside card */}
            <div style={{
              position: 'absolute',
              top: -23,
              left: 20,
              height: 24,
              width: 140,
              background: '#f3edd6',
              borderRadius: '6px 6px 0 0',
              border: '1px solid rgba(0,0,0,0.08)',
              borderBottom: 'none',
              zIndex: 1,
            }} />

            {/* Dossier Card Panel */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                background: '#fcf8ec', // Manila folder light cream color
                borderRadius: 4,
                boxShadow: '0 30px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,0,0,0.1)',
                padding: '48px 40px',
                color: '#1e293b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderTop: '6px solid #dc2626', // Crimson accent top border
                zIndex: 2, // Sit on top of tab to mask bottom borders
                boxSizing: 'border-box',
              }}
            >

            {/* Red Dossier Stamp */}
            <div style={{
              border: '2px dashed #dc2626',
              color: '#dc2626',
              padding: '4px 12px',
              fontFamily: '"SF Mono", "Fira Code", monospace',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginBottom: 32,
              borderRadius: 2,
            }}>
              CLASSIFIED DOSSIER
            </div>

            {activeCase.id > 1 && (
              <div style={{
                fontSize: 13,
                fontStyle: 'italic',
                color: '#dc2626',
                fontWeight: 700,
                marginBottom: 20,
                fontFamily: '"Inter", sans-serif',
                textAlign: 'center',
                letterSpacing: '-0.01em'
              }}>
                "Oh... that's what the previous clue was for!"
              </div>
            )}

            <div style={{
              fontSize: 12,
              fontFamily: '"SF Mono", "Fira Code", monospace',
              color: '#64748b',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              {activeCase.subtitle}
            </div>

            <h2 style={{
              fontSize: 32,
              fontWeight: 900,
              textAlign: 'center',
              margin: '0 0 24px 0',
              letterSpacing: '-0.02em',
              color: '#0f172a',
              fontFamily: '"Inter", sans-serif',
              textTransform: 'uppercase',
            }}>
              {activeCase.title}
            </h2>

            <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', width: '60%', marginBottom: 32 }} />

            {/* Objective box */}
            <div style={{
              background: 'rgba(0,0,0,0.02)',
              borderLeft: '4px solid #dc2626',
              padding: '20px 24px',
              borderRadius: '0 6px 6px 0',
              width: '100%',
              marginBottom: 40,
              boxSizing: 'border-box',
            }}>
              <div style={{
                fontSize: 10,
                fontFamily: '"SF Mono", "Fira Code", monospace',
                color: '#ef4444',
                fontWeight: 800,
                letterSpacing: '0.1em',
                marginBottom: 6,
                textTransform: 'uppercase',
              }}>
                SECTOR OBJECTIVE:
              </div>
              <p style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.5,
                fontWeight: 600,
                color: '#334155',
                fontFamily: '"Inter", sans-serif',
              }}>
                {activeCase.objective}
              </p>
            </div>

            {/* CTA to start case */}
            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: '#0f172a' }}
              whileTap={{ scale: 0.97 }}
              onClick={closeObjectiveModal}
              style={{
                width: '100%',
                padding: '16px',
                background: '#1e293b',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: 13,
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                boxShadow: '0 10px 20px rgba(15,23,42,0.15)',
                transition: 'background-color 0.2s',
              }}
            >
              BEGIN INVESTIGATION
            </motion.button>
          </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
