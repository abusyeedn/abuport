import { useEffect, useRef, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

interface SpotlightRect {
  top: number
  left: number
  width: number
  height: number
}

interface FolderHint {
  key: string
  description: string
  cx: number
  bottom: number
}

const FOLDER_DESCRIPTIONS: Record<string, string> = {
  "kynhood.proj":      "Product design case study",
  "Spaarks.intern":    "Social app internship",
  "Case_Studies.fun":  "Deep-dive design breakdowns",
  "College.proj":      "Academic design work",
  "behance.link":      "Full portfolio on Behance",
  "videos.link":       "Motion & video work",
  "illustration.link": "Illustration projects",
}

function measureFolders(): { rect: SpotlightRect | null; hints: FolderHint[] } {
  const el = document.querySelector<HTMLElement>('[data-figma-id="macos-folders"]')
  if (!el) return { rect: null, hints: [] }

  const r = el.getBoundingClientRect()
  const rect: SpotlightRect = { top: r.top, left: r.left, width: r.width, height: r.height }

  const hints: FolderHint[] = []
  const grid = el.firstElementChild as HTMLElement | null
  if (grid) {
    Array.from(grid.children).forEach((child) => {
      const text = (child as HTMLElement).textContent ?? ""
      const matchedKey = Object.keys(FOLDER_DESCRIPTIONS).find(k => text.includes(k))
      if (!matchedKey) return
      const cr = (child as HTMLElement).getBoundingClientRect()
      hints.push({
        key: matchedKey,
        description: FOLDER_DESCRIPTIONS[matchedKey],
        cx: cr.left + cr.width / 2,
        bottom: cr.bottom,
      })
    })
  }

  return { rect, hints }
}

interface CoachmarkProps {
  trigger?: boolean  // flip to true to start
}

export default function Coachmark({ trigger = false }: CoachmarkProps) {
  const [visible, setVisible] = useState(false)
  const [rect, setRect] = useState<SpotlightRect | null>(null)
  const [hints, setHints] = useState<FolderHint[]>([])

  const remeasure = useCallback(() => {
    const { rect: r, hints: h } = measureFolders()
    setRect(r)
    setHints(h)
  }, [])

  // Fire when parent sets trigger=true
  useEffect(() => {
    if (!trigger) return
    const t = setTimeout(() => {
      remeasure()
      setVisible(true)
    }, 300)
    return () => clearTimeout(t)
  }, [trigger, remeasure])

  // Re-measure on scroll so spotlight tracks the folders
  useEffect(() => {
    if (!visible) return
    const onScroll = () => remeasure()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [visible, remeasure])

  const dismiss = () => setVisible(false)

  const PAD = 28

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          key="coachmark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={dismiss}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99990,
            pointerEvents: "auto",
          }}
        >
          {/* Dark overlay with cutout hole */}
          {rect ? (
            <svg
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <mask id="cm-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x={rect.left - PAD}
                    y={rect.top - PAD}
                    width={rect.width + PAD * 2}
                    height={rect.height + PAD * 2}
                    rx="20" ry="20"
                    fill="black"
                  />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="rgba(10,10,14,0.85)" mask="url(#cm-mask)" />
            </svg>
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,14,0.85)", pointerEvents: "none" }} />
          )}

          {/* Spotlight ring */}
          {rect && (
            <div
              style={{
                position: "absolute",
                top: rect.top - PAD,
                left: rect.left - PAD,
                width: rect.width + PAD * 2,
                height: rect.height + PAD * 2,
                borderRadius: "20px",
                border: "1.5px solid rgba(255,255,255,0.22)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.05), inset 0 0 40px rgba(255,255,255,0.02)",
                pointerEvents: "none",
              }}
            />
          )}

          {/* ── Content ABOVE the spotlight ── */}
          {rect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                bottom: window.innerHeight - (rect.top - PAD) + 20,
                left: rect.left + rect.width / 2,
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "14px",
                pointerEvents: "auto",
              }}
            >
              {/* Headline */}
              <div style={{ textAlign: "center" }}>
                <p style={{
                  margin: "0 0 4px",
                  fontSize: "0.70rem",
                  fontWeight: 700,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.40)",
                  fontFamily: "var(--font-body, sans-serif)",
                }}>
                  Your portfolio
                </p>
                <h3 style={{
                  margin: 0,
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.92)",
                  fontFamily: "var(--font-body, sans-serif)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}>
                  Hover a folder to preview
                </h3>
                <p style={{
                  margin: "6px 0 0",
                  fontSize: "0.88rem",
                  color: "rgba(255,255,255,0.50)",
                  fontFamily: "var(--font-body, sans-serif)",
                  lineHeight: 1.5,
                }}>
                  Click to open the project
                </p>
              </div>

              {/* Okay button — design.md primary style */}
              <button
                onClick={dismiss}
                style={{
                  padding: "10px 28px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#3b82f6",
                  color: "#ffffff",
                  fontSize: "0.90rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body, sans-serif)",
                  cursor: "pointer",
                  transition: "background 0.2s, transform 0.2s",
                  minHeight: "44px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#2563eb"
                  e.currentTarget.style.transform = "scale(1.05)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#3b82f6"
                  e.currentTarget.style.transform = "scale(1)"
                }}
              >
                Okay, got it
              </button>
            </motion.div>
          )}

          {/* Fallback layout when rect is null */}
          {!rect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: "38%",
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <h3 style={{
                margin: 0,
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.92)",
                fontFamily: "var(--font-body, sans-serif)",
                letterSpacing: "-0.02em",
              }}>
                Hover a folder to preview · Click to open
              </h3>
              <button
                onClick={dismiss}
                style={{
                  padding: "10px 28px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#3b82f6",
                  color: "#ffffff",
                  fontSize: "0.90rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body, sans-serif)",
                  cursor: "pointer",
                  minHeight: "44px",
                }}
              >
                Okay, got it
              </button>
            </motion.div>
          )}

          {/* Per-folder labels below spotlight */}
          {hints.map((hint, i) => (
            <motion.div
              key={hint.key}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                top: hint.bottom + 10,
                left: hint.cx,
                transform: "translateX(-50%)",
                textAlign: "center",
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <span style={{
                fontSize: "0.67rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.05em",
                fontFamily: "var(--font-body, sans-serif)",
                whiteSpace: "nowrap",
              }}>
                {hint.key.replace(/\.(proj|intern|fun|link)$/, "")}
              </span>
              <span style={{
                fontSize: "0.58rem",
                color: "rgba(255,255,255,0.42)",
                fontFamily: "var(--font-body, sans-serif)",
                whiteSpace: "nowrap",
              }}>
                {hint.description}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
