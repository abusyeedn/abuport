import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

interface WelcomeModalProps {
  onGuided: () => void
  onExplore: () => void
}

export default function WelcomeModal({ onGuided, onExplore }: WelcomeModalProps) {
  const [visible, setVisible] = useState(false)
  const fired = useRef(false)

  useEffect(() => {
    // AppLoader takes ~3.1s + 0.8s exit = ~3.9s total — fire after it clears
    // No cleanup cancel: StrictMode double-invoke would cancel the timer before it fires
    const t = setTimeout(() => {
      if (!fired.current) {
        fired.current = true
        setVisible(true)
      }
    }, 4000)
    return () => clearTimeout(t)
  }, [])

  const handleGuided = () => {
    setVisible(false)
    setTimeout(onGuided, 350) // after exit animation
  }

  const handleExplore = () => {
    setVisible(false)
    setTimeout(onExplore, 350)
  }

  return createPortal(
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="welcome-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100001,
              background: "rgba(10,10,14,0.60)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          {/* Card */}
          <motion.div
            key="welcome-card"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 100002,
              width: "clamp(320px, 90vw, 480px)",
              background: "rgba(26,26,26,0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.50), 0 30px 80px rgba(0,0,0,0.30)",
              borderRadius: "32px",
              padding: "40px 40px 36px",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              style={{
                margin: 0,
                fontSize: "0.70rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#60a5fa",
                fontFamily: "var(--font-body, sans-serif)",
              }}
            >
              Welcome
            </motion.p>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.4 }}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <h2 style={{
                margin: 0,
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.92)",
                fontFamily: "var(--font-body, sans-serif)",
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
              }}>
                Hi — things are everywhere,{" "}
                <span style={{ color: "rgba(255,255,255,0.42)", fontWeight: 400 }}>
                  intentionally.
                </span>
              </h2>
              <p style={{
                margin: 0,
                fontSize: "0.95rem",
                fontWeight: 400,
                color: "rgba(255,255,255,0.50)",
                fontFamily: "var(--font-body, sans-serif)",
                lineHeight: 1.65,
              }}>
                This portfolio is a playground — folders, cards, music, galleries.
                You can wander freely or get a quick guided tour of what's where.
              </p>
            </motion.div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.35 }}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {/* Primary — guided */}
              <button
                onClick={handleGuided}
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#3b82f6",
                  color: "#ffffff",
                  fontSize: "0.90rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body, sans-serif)",
                  letterSpacing: "0.01em",
                  cursor: "pointer",
                  minHeight: "44px",
                  transition: "background 0.18s, transform 0.18s",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#2563eb"
                  e.currentTarget.style.transform = "scale(1.02)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#3b82f6"
                  e.currentTarget.style.transform = "scale(1)"
                }}
              >
                <span>Show me around</span>
                <span style={{ opacity: 0.7, fontSize: "1rem" }}>→</span>
              </button>

              {/* Ghost — explore */}
              <button
                onClick={handleExplore}
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.60)",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body, sans-serif)",
                  letterSpacing: "0.01em",
                  cursor: "pointer",
                  minHeight: "44px",
                  backdropFilter: "blur(10px)",
                  transition: "background 0.18s, border-color 0.18s, color 0.18s",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)"
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"
                  e.currentTarget.style.color = "rgba(255,255,255,0.80)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)"
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"
                  e.currentTarget.style.color = "rgba(255,255,255,0.60)"
                }}
              >
                <span>I'll explore on my own</span>
                <span style={{ opacity: 0.4, fontSize: "0.85rem" }}>✕</span>
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
