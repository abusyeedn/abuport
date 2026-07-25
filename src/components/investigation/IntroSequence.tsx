/**
 * IntroSequence.tsx
 *
 * Plays on first visit. Typewriter text, fades to the investigation wall.
 */
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameState } from './useGameState'

const IntroSequence = React.memo(function IntroSequence() {
  const { introSeen, setIntroSeen } = useGameState()
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (introSeen) return

    // Stage 0: Black screen, wait 1s
    // Stage 1: "Several years ago, a brilliant designer disappeared..." (wait 2.5s)
    // Stage 2: "CASE FILE: THE MISSING DESIGNER" (wait 2.5s)
    // Stage 3: "Your objective: Reconstruct the person. Not by reading. By investigating." (wait 3s)
    // Stage 4: Fade out intro

    const s1 = setTimeout(() => setStage(1), 1000)
    const s2 = setTimeout(() => setStage(2), 3500)
    const s3 = setTimeout(() => setStage(3), 6000)
    const s4 = setTimeout(() => {
      setStage(4)
      setTimeout(setIntroSeen, 1000) // Unmount after fade out
    }, 9000)

    return () => {
      clearTimeout(s1)
      clearTimeout(s2)
      clearTimeout(s3)
      clearTimeout(s4)
    }
  }, [introSeen, setIntroSeen])

  if (introSeen) return null

  return (
    <AnimatePresence>
      {stage < 4 && (
        <motion.div
          key="intro-sequence"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#050505',
            zIndex: 100, // Topmost
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'none',
            userSelect: 'none',
          }}
        >
          <div style={{
            maxWidth: 600,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
          }}>
            {/* Stage 1 Text */}
            <AnimatePresence>
              {stage >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: '"SF Mono", "Fira Code", monospace',
                    fontSize: 14,
                    letterSpacing: '0.05em',
                  }}
                >
                  <Typewriter text="Several years ago, a brilliant designer disappeared. No photo. No resume. Only this room." />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stage 2 Text */}
            <AnimatePresence>
              {stage >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{
                    color: '#dc2626',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: 42,
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                  }}
                >
                  CASE FILE: THE MISSING DESIGNER
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stage 3 Text */}
            <AnimatePresence>
              {stage >= 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: 18,
                    fontWeight: 400,
                  }}
                >
                  <Typewriter text="Your objective: Reconstruct the person. Not by reading — by investigating." />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

export default IntroSequence

// Simple typewriter effect component
function Typewriter({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let i = 0
    setDisplayedText('')
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i))
        i++
      } else {
        clearInterval(timer)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <span>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ display: 'inline-block', width: '8px', background: 'currentColor', marginLeft: '2px', height: '1em', verticalAlign: 'middle' }}
      />
    </span>
  )
}
