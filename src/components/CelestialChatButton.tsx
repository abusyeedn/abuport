import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import { FONTS } from '../theme'
import { useEditor } from '../EditorContext'

interface CelestialChatButtonProps {
  figmaId?: string
}

export default function CelestialChatButton({ figmaId = "celestial-chat-button" }: CelestialChatButtonProps) {
  const [active, setActive] = useState(false)
  const { isEditMode, currentState } = useEditor()
  const buttonText = currentState[figmaId]?.text || "Ask Abu's AI"

  useEffect(() => {
    const onOpen = () => setActive(true)
    const onClose = () => setActive(false)
    window.addEventListener('open-chat', onOpen)
    window.addEventListener('close-chat', onClose)
    return () => {
      window.removeEventListener('open-chat', onOpen)
      window.removeEventListener('close-chat', onClose)
    }
  }, [])

  const open = () => {
    if (isEditMode) return
    window.dispatchEvent(new CustomEvent('open-chat'))
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 14 }}>
      {/* Orbit 1 — sky blue, fast */}
      {!active && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 130, height: 130,
          marginTop: -65, marginLeft: -65,
          borderRadius: '50%',
          animation: 'cel-orbit-spin 4s linear infinite',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%',
            width: 9, height: 9, borderRadius: '50%',
            background: '#38bdf8',
            boxShadow: '0 0 10px 3px rgba(56,189,248,0.95)',
            transform: 'translateX(-50%) translateY(-50%)',
          }} />
        </div>
      )}

      {/* Orbit 2 — light blue, slow, reverse */}
      {!active && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 115, height: 115,
          marginTop: -57.5, marginLeft: -57.5,
          borderRadius: '50%',
          animation: 'cel-orbit-spin 7s linear infinite reverse',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', bottom: 0, left: '50%',
            width: 6, height: 6, borderRadius: '50%',
            background: '#bae6fd',
            boxShadow: '0 0 8px 2px rgba(186,230,253,0.95)',
            transform: 'translateX(-50%) translateY(50%)',
          }} />
        </div>
      )}

      {/* Pulse ring */}
      {!active && (
        <div style={{
          position: 'absolute', inset: 6,
          borderRadius: 50,
          border: '1.5px solid rgba(56,189,248,0.35)',
          animation: 'cel-ring-pulse 2.6s ease-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* The button */}
      <motion.button
        onClick={open}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position: 'relative',
          padding: '13px 26px',
          borderRadius: 50,
          background: 'linear-gradient(135deg, #0c2340 0%, #0a3a5c 50%, #0e4a72 100%)',
          border: '1.5px solid rgba(56,189,248,0.5)',
          boxShadow: '0 0 32px rgba(14,165,233,0.45), 0 6px 24px rgba(0,0,0,0.5)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 9,
          fontFamily: FONTS.primary,
          overflow: 'hidden',
        }}
      >
        {/* Lens flare */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 25%, rgba(56,189,248,0.2) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <AnimatePresence mode="wait">
          <motion.span
            key="icon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Icon icon="solar:stars-bold" width={22} color="#38bdf8" />
          </motion.span>
        </AnimatePresence>

        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e0f2fe', letterSpacing: '0.02em' }}>
          {buttonText}
        </span>

        <Icon icon="solar:stars-minimalistic-outline" width={13} color="rgba(56,189,248,0.5)" />
      </motion.button>

      <style>{`
        @keyframes cel-orbit-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes cel-ring-pulse {
          0%   { transform: scale(1); opacity: 0.55; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
