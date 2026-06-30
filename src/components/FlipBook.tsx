import { useState, useEffect, useCallback, type CSSProperties, type ReactNode } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

export interface FlipBookPage {
  front: { src: string; alt?: string }
  frontContent?: ReactNode
  back?: { src: string; alt?: string }
  backContent?: ReactNode
  title?: string
  description?: string
}

interface FlipBookProps {
  pages: FlipBookPage[]
  borderRadius?: number
  fontFamily?: string
  // shadow
  shadowColor?: string
  shadowOpacity?: number
  shadowBlur?: number
  shadowOffsetX?: number
  shadowOffsetY?: number
  shadowSpread?: number
  // legacy props accepted but unused (keeps CaseStudiesPage call-site clean)
  cornerRadius?: number
  showSpine?: boolean
  showGlare?: boolean
  showEdge?: boolean
  showOverlay?: boolean
  perspective?: number
  style?: CSSProperties
  autoOpen?: boolean
}

// ─────────────────────────────────────────────
// SINGLE LEAF
// Each leaf has its own animation controls so hooks are never called in a loop.
// ─────────────────────────────────────────────
function FlipLeaf({
  page,
  index,
  flippedCount,
  borderRadius,
  fontFamily,
  registerControls,
}: {
  page: FlipBookPage
  index: number
  flippedCount: number
  borderRadius: number
  fontFamily: string
  registerControls: (index: number, controls: ReturnType<typeof useAnimationControls>) => void
}) {
  const controls = useAnimationControls()

  useEffect(() => {
    registerControls(index, controls)
  }, [index, controls, registerControls])

  const isFlipped = index < flippedCount
  const isFlipping = index === flippedCount - 1
  const zIndex = isFlipping ? 1000 : isFlipped ? index + 1 : undefined

  const faceBase: CSSProperties = {
    position: 'absolute',
    inset: 0,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  }

  return (
    <motion.div
      animate={controls}
      initial={{ rotateY: 0 }}
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: '50%',
        height: '100%',
        transformOrigin: 'left center',
        transformStyle: 'preserve-3d',
        zIndex,
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    >
      {/* FRONT FACE */}
      <div style={{ ...faceBase, borderRadius: `0px ${borderRadius}px ${borderRadius}px 0px` }}>
        {page.frontContent ? (
          page.frontContent
        ) : page.front?.src ? (
          <img src={page.front.src} style={imgStyle} alt={page.front.alt || ''} draggable={false} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: `hsl(${index * 40}, 55%, 88%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#666', fontFamily }}>
            Page {index + 1}
          </div>
        )}
        <div style={spineGradientLeft} />
      </div>

      {/* BACK FACE */}
      <div style={{ ...faceBase, transform: 'rotateY(180deg) translateZ(0.01px)', borderRadius: `${borderRadius}px 0px 0px ${borderRadius}px` }}>
        {page.backContent ? (
          <div style={{
            width: '100%',
            height: '100%',
            background: '#faf9f6',
            overflowY: 'auto',
            padding: '28px 24px',
            boxSizing: 'border-box',
            fontFamily,
            color: '#1f2937',
            lineHeight: 1.65,
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.06) 27px, rgba(0,0,0,0.06) 28px)',
            backgroundPositionY: '28px',
          }}>
            {page.backContent}
          </div>
        ) : page.back?.src ? (
          <img src={page.back.src} style={imgStyle} alt={page.back.alt || ''} draggable={false} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: `hsl(${index * 40 + 20}, 50%, 92%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#777', fontFamily }}>
            Back {index + 1}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function FlipBook({
  pages = [],
  borderRadius,
  cornerRadius,
  fontFamily = 'inherit',
  perspective = 2500,
  style,
  autoOpen = false,
}: FlipBookProps) {
  const radius = borderRadius ?? cornerRadius ?? 8
  const [flippedCount, setFlippedCount] = useState(0)
  const [isBookOpen, setIsBookOpen] = useState(false)

  // Map from leaf index → animation controls (populated by each FlipLeaf on mount)
  const controlsMap = useState<Map<number, ReturnType<typeof useAnimationControls>>>(() => new Map())[0]

  const totalLeaves = pages.length

  // Reset state when pages change (new case study selected)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setFlippedCount(0) // eslint-disable-line react-hooks/set-state-in-effect
    setIsBookOpen(false) // eslint-disable-line react-hooks/set-state-in-effect
    controlsMap.forEach((ctrl) => ctrl.set({ rotateY: 0 }))
  }, [pages]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-flip the cover when autoOpen becomes true (fired after the landing animation completes)
  useEffect(() => {
    if (!autoOpen) return
    // eslint-disable-next-line react-hooks/immutability
    const t = setTimeout(() => flipForward(), 300)
    return () => clearTimeout(t)
  }, [autoOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const registerControls = useCallback(
    (index: number, controls: ReturnType<typeof useAnimationControls>) => {
      controlsMap.set(index, controls)
    },
    [controlsMap]
  )


  const flipForward = useCallback(async () => {
    if (!isBookOpen) {
      setIsBookOpen(true)
    }
    if (flippedCount < totalLeaves) {
      const idx = flippedCount
      setFlippedCount((prev) => prev + 1)
      const ctrl = controlsMap.get(idx)
      if (ctrl) {
        await ctrl.start({ rotateY: -180, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } })
      }
    }
  }, [isBookOpen, flippedCount, totalLeaves, controlsMap])

  const flipBack = useCallback(async () => {
    if (flippedCount === 0) return
    const idx = flippedCount - 1
    setFlippedCount((prev) => prev - 1)
    const ctrl = controlsMap.get(idx)
    if (ctrl) {
      await ctrl.start({ rotateY: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } })
    }
    if (flippedCount - 1 === 0) {
      setIsBookOpen(false)
    }
  }, [flippedCount, controlsMap])


  if (pages.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily, color: '#999', fontSize: 14 }}>
        No content found in this case study.
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: `${perspective}px`,
        overflow: 'visible',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* Fixed-size spread container — never resizes, no open/close animation on the container itself */}
      <div
        style={{
          width: '90%',
          height: '80%',
          position: 'relative',
          boxShadow: 'none',
          borderRadius: `${radius}px`,
          pointerEvents: 'auto',
        }}
      >
        {/* LEFT PANEL — paper background revealed as pages flip open */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '50%',
            height: '100%',
            background: '#faf9f6',
            borderRadius: `${radius}px 0 0 ${radius}px`,
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.06) 27px, rgba(0,0,0,0.06) 28px)',
            backgroundPositionY: '28px',
            pointerEvents: 'none',
            // Hidden behind the cover until the book opens
            opacity: flippedCount > 0 ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* RIGHT PANEL background — fades out when all pages are flipped */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '50%',
            height: '100%',
            background: '#f0ede8',
            borderRadius: `0 ${radius}px ${radius}px 0`,
            pointerEvents: 'none',
            opacity: flippedCount < totalLeaves ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* SPINE */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '3px',
            height: '100%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to right, rgba(0,0,0,0.18), rgba(0,0,0,0.06) 40%, rgba(0,0,0,0.06) 60%, rgba(0,0,0,0.18))',
            zIndex: 1500,
            pointerEvents: 'none',
            opacity: isBookOpen ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* PAGE LEAVES — rendered in reverse DOM order so page 0 is on top of the unflipped stack */}
        {[...pages].reverse().map((page, revIdx) => {
          const index = pages.length - 1 - revIdx
          return (
            <FlipLeaf
              key={index}
              page={page}
              index={index}
              flippedCount={flippedCount}
              borderRadius={radius}
              fontFamily={fontFamily}
              registerControls={registerControls}
            />
          )
        })}

        {/* Click zones — left half goes back, right half goes forward */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none', zIndex: 2000 }}>
          <div
            style={{ flex: 1, cursor: flippedCount > 0 ? 'w-resize' : 'default', pointerEvents: 'auto' }}
            onClick={(e) => { e.stopPropagation(); flipBack() }}
          />
          <div
            style={{ flex: 1, cursor: flippedCount < totalLeaves ? 'e-resize' : 'default', pointerEvents: 'auto' }}
            onClick={(e) => { e.stopPropagation(); flipForward() }}
          />
        </div>
      </div>

      {/* Hint */}
      {!isBookOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 11,
            color: 'rgba(255,255,255,0.45)',
            fontFamily,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          click right side to open
        </motion.div>
      )}

      {/* Page counter */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        right: 16,
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        fontFamily,
        pointerEvents: 'none',
      }}>
        {flippedCount} / {totalLeaves}
      </div>
    </div>
  )
}

const imgStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  pointerEvents: 'none',
  userSelect: 'none',
}

const spineGradientLeft: CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '12%',
  background: 'linear-gradient(to right, rgba(0,0,0,0.12), transparent)',
  pointerEvents: 'none',
}

