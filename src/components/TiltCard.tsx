import * as React from "react"
import { motion } from "framer-motion"

export default function TiltCard(props: any) {
    const {
        image = {
            src: "/hero1.png",
            alt: "Blue flower",
        },
        tiltFactor = 8,
        perspective = 1000,
        borderRadius = 24,
        backgroundColor = "transparent",
        shadowColor = "#0D0C0C",
        shadowIntensity: _shadowIntensity = 0.1, // eslint-disable-line @typescript-eslint/no-unused-vars
        transitionDuration = 0.2,
        hoverScale = 1.05,
        glareEffect = true,
        glareIntensity = 0.3,
        glarePosition = 50,
        glareSize = 80,
        slideInDuration = 1.5,
        slideInDelay = 0,
    } = props

    const [isHovered, setIsHovered] = React.useState(false)
    const [tiltValues, setTiltValues] = React.useState({ x: 0, y: 0 })
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
    const cardRef = React.useRef(null)
    const isOnCanvas = false

    const handleMouseMove = React.useCallback(
        (e: any) => {
            if (!cardRef.current || !isHovered || isOnCanvas) return

            const rect = (cardRef.current as any).getBoundingClientRect()

            // Calculate mouse position relative to card center (in percentage, -50 to 50)
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100

            setMousePosition({ x, y })

            // Calculate tilt values based on mouse position
            const tiltX = -(y / 50) * tiltFactor
            const tiltY = (x / 50) * tiltFactor

            setTiltValues({ x: tiltX, y: tiltY })
        },
        [isHovered, tiltFactor, isOnCanvas]
    )

    const handleMouseEnter = React.useCallback(() => {
        if (!isOnCanvas) setIsHovered(true)
    }, [isOnCanvas])

    const handleMouseLeave = React.useCallback(() => {
        if (!isOnCanvas) {
            setIsHovered(false)
            setTiltValues({ x: 0, y: 0 })
        }
    }, [isOnCanvas])

    // Calculate glare position based on mouse position
    const glareX = React.useMemo(() => {
        return isHovered ? 50 + mousePosition.x / 2 : glarePosition
    }, [isHovered, mousePosition.x, glarePosition])

    const glareY = React.useMemo(() => {
        return isHovered ? 50 + mousePosition.y / 2 : glarePosition
    }, [isHovered, mousePosition.y, glarePosition])

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
                y: {
                    duration: slideInDuration,
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: slideInDelay,
                },
                opacity: {
                    duration: slideInDuration,
                    ease: "easeOut",
                    delay: slideInDelay,
                },
                scale: { duration: transitionDuration, ease: "easeOut" },
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
                    boxShadow: `0 10px 30px -10px ${shadowColor}`,
                }}
                animate={{
                    rotateX: tiltValues.x,
                    rotateY: tiltValues.y,
                    boxShadow: isHovered
                        ? `0 25px 50px -12px rgba(13, 12, 12, 0.06)` // Reduced from 0.15
                        : `0 10px 30px -10px rgba(13, 12, 12, 0.02)`, // Reduced from 0.08
                }}
                transition={{
                    duration: transitionDuration,
                    ease: "easeOut",
                }}
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

                {/* Glare effect */}
                {glareEffect && (
                    <motion.div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 2,
                            borderRadius: `${borderRadius}px`,
                            background: `radial-gradient(
                                circle at ${glareX}% ${glareY}%, 
                                rgba(255, 255, 255, ${isHovered ? glareIntensity : 0}) 0%, 
                                rgba(255, 255, 255, 0) ${glareSize}%
                            )`,
                            pointerEvents: "none",
                        }}
                        animate={{
                            opacity: isHovered ? 1 : 0,
                        }}
                        transition={{
                            duration: transitionDuration,
                        }}
                    />
                )}
            </motion.div>
        </motion.div>
    )
}
