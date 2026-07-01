import * as React from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"

// Slow idle figure-8 tilt animation
function useIdleTilt(active: boolean, tiltFactor: number) {
  const t = React.useRef(0)
  const raf = React.useRef<number | null>(null)
  const [idle, setIdle] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    if (active) {
      if (raf.current) cancelAnimationFrame(raf.current)
      return
    }

    const tick = () => {
      t.current += 0.004  // very slow
      const x = Math.sin(t.current) * tiltFactor * 0.6
      const y = Math.sin(t.current * 1.3) * tiltFactor * 0.5
      setIdle({ x, y })
      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [active, tiltFactor])

  return idle
}

export default function TiltCard(props: any) {
  const {
    image = { src: "/hero1.png", alt: "Blue flower" },
    tiltFactor = 8,
    perspective = 1000,
    borderRadius = 24,
    backgroundColor = "transparent",
    shadowColor = "#0D0C0C",
    transitionDuration = 0.2,
    hoverScale = 1.05,
    glareEffect = true,
    glareIntensity = 0.3,
    glareSize = 80,
    slideInDuration = 1.5,
    slideInDelay = 0,
  } = props

  const [isHovered, setIsHovered] = React.useState(false)
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })
  const cardRef = React.useRef<HTMLDivElement>(null)

  // Idle looping tilt — pauses as soon as hover starts
  const idle = useIdleTilt(isHovered, tiltFactor)

  // When hovered: derive tilt from mouse
  const targetX = isHovered
    ? -(((mousePos.y) / 50) * tiltFactor)
    : idle.x
  const targetY = isHovered
    ? (mousePos.x / 50) * tiltFactor
    : idle.y

  // Slow spring — smooth hand-off between idle and mouse control
  const springCfg = { stiffness: 40, damping: 12, mass: 1.2 }
  const rotX = useSpring(useMotionValue(0), springCfg)
  const rotY = useSpring(useMotionValue(0), springCfg)

  React.useEffect(() => { rotX.set(targetX) }, [targetX, rotX])
  React.useEffect(() => { rotY.set(targetY) }, [targetY, rotY])

  const glareX = isHovered ? 50 + mousePos.x / 2 : 50
  const glareY = isHovered ? 50 + mousePos.y / 2 : 50

  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100
    setMousePos({ x, y })
  }, [])

  return (
    <motion.div
      ref={cardRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
        borderRadius: `${borderRadius}px`,
        overflow: "hidden",
      }}
      initial={{ y: "-100%", opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        scale: isHovered ? hoverScale : 1,
      }}
      transition={{
        y:       { duration: slideInDuration, ease: [0.25, 0.1, 0.25, 1], delay: slideInDelay },
        opacity: { duration: slideInDuration, ease: "easeOut", delay: slideInDelay },
        scale:   { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePos({ x: 0, y: 0 })
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          borderRadius: `${borderRadius}px`,
          overflow: "hidden",
          backgroundColor,
          transformStyle: "preserve-3d",
          rotateX: rotX,
          rotateY: rotY,
          boxShadow: `0 10px 30px -10px ${shadowColor}`,
        }}
        animate={{
          boxShadow: isHovered
            ? `0 25px 50px -12px rgba(13,12,12,0.06)`
            : `0 10px 30px -10px rgba(13,12,12,0.02)`,
        }}
        transition={{ duration: transitionDuration, ease: "easeOut" }}
      >
        <img
          src={image.src}
          alt={image.alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: `${borderRadius}px`,
            position: "relative",
            zIndex: 1,
          }}
        />

        {glareEffect && (
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              borderRadius: `${borderRadius}px`,
              pointerEvents: "none",
              background: `radial-gradient(
                circle at ${glareX}% ${glareY}%,
                rgba(255,255,255,${isHovered ? glareIntensity : 0.06}) 0%,
                rgba(255,255,255,0) ${glareSize}%
              )`,
            }}
            animate={{ opacity: 1 }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
