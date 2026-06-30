import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"

// ─────────────────────────────────────────────
// SINGLE METRIC TERMINAL CARD
// ─────────────────────────────────────────────
interface MetricCardProps {
    label: string
    value: string
    sublabel: string
    pipColor: string
    bgDark: string
    glowIntensity: number
    scanlineOpacity: number
    borderRadius: number
    index: number
}

function MetricTerminal({
    label,
    value,
    sublabel,
    pipColor,
    bgDark,
    glowIntensity,
    scanlineOpacity,
    borderRadius,
    index,
}: MetricCardProps) {
    const [blink, setBlink] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setBlink((prev) => !prev)
        }, 800)
        return () => clearInterval(interval)
    }, [])

    const pipGlow = useMemo(() => {
        const hex = pipColor.replace("#", "")
        const r = parseInt(hex.substring(0, 2), 16) || 0
        const g = parseInt(hex.substring(2, 4), 16) || 255
        const b = parseInt(hex.substring(4, 6), 16) || 0
        return `rgba(${r}, ${g}, ${b}, ${glowIntensity})`
    }, [pipColor, glowIntensity])

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                backgroundColor: bgDark,
                borderRadius: `${borderRadius}px`,
                overflow: "hidden",
                border: "6px solid #0a0a0a",
                boxShadow:
                    "inset 0 0 40px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 0.8)",
                fontFamily: '"Courier New", Courier, monospace',
                textTransform: "uppercase",
                boxSizing: "border-box",
            }}
        >
            {/* glass + scanlines */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 10,
                    pointerEvents: "none",
                    background:
                        "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.4) 80%)",
                    boxShadow: "inset 0 0 40px rgba(0,0,0,0.9)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 9,
                    pointerEvents: "none",
                    background: `linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,${scanlineOpacity}) 50%)`,
                    backgroundSize: "100% 4px",
                }}
            />

            <div
                style={{
                    position: "relative",
                    height: "100%",
                    padding: "1.5rem",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    color: pipColor,
                    textShadow: `0 0 4px ${pipGlow}`,
                }}
            >
                {/* top label row */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        letterSpacing: "2px",
                        gap: 8,
                    }}
                >
                    <span style={{ opacity: blink ? 1 : 0.3 }}>●</span>
                    {label}
                </div>

                {/* big value, center */}
                <motion.div
                    animate={{
                        textShadow: [
                            `0 0 6px ${pipGlow}`,
                            `0 0 16px ${pipGlow}`,
                            `0 0 6px ${pipGlow}`,
                        ],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                    style={{
                        fontSize: "clamp(1.6rem, 2vw, 2.4rem)",
                        fontWeight: 900,
                        lineHeight: 1.1,
                        textAlign: "center",
                    }}
                >
                    {value}
                </motion.div>

                {/* bottom sublabel + fake signal bars */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        fontSize: "0.65rem",
                        fontWeight: "bold",
                        letterSpacing: "1px",
                        opacity: 0.85,
                    }}
                >
                    <span>{sublabel}</span>
                    <div
                        style={{
                            display: "flex",
                            gap: 3,
                            alignItems: "flex-end",
                            height: 14,
                        }}
                    >
                        {[0.4, 0.7, 0.5, 1].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: "3px" }}
                                whileInView={{ height: `${h * 14}px` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                                style={{
                                    width: 3,
                                    backgroundColor: pipColor,
                                    boxShadow: `0 0 4px ${pipGlow}`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// ─────────────────────────────────────────────
// 4-UP ROW COMPONENT
// ─────────────────────────────────────────────
interface MetricsRowProps {
    pipColor?: string
    bgDark?: string
    glowIntensity?: number
    scanlineOpacity?: number
    borderRadius?: number
    gap?: number
}

export default function PipBoyMetricsRow(props: MetricsRowProps) {
    const {
        pipColor = "#1aff40",
        bgDark = "#020a02",
        glowIntensity = 0.6,
        scanlineOpacity = 0.25,
        borderRadius = 24,
        gap = 16,
    } = props

    const metrics = [
        {
            label: "Big Events",
            value: "₹75L",
            sublabel: "Revenue",
        },
        {
            label: "Micro Events",
            value: "5,000",
            sublabel: "Paid Tickets / Mo",
        },
        {
            label: "Event IPs",
            value: "₹5Cr",
            sublabel: "Revenue",
        },
        {
            label: "Micro Events",
            value: "₹20L",
            sublabel: "Revenue",
        },
    ]

    return (
        <div
            style={{
                width: "100%",
                height: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridAutoRows: "220px",
                gap: `${gap}px`,
                boxSizing: "border-box",
            }}
        >
            {metrics.map((m, i) => (
                <MetricTerminal
                    key={i}
                    index={i}
                    label={m.label}
                    value={m.value}
                    sublabel={m.sublabel}
                    pipColor={pipColor}
                    bgDark={bgDark}
                    glowIntensity={glowIntensity}
                    scanlineOpacity={scanlineOpacity}
                    borderRadius={borderRadius}
                />
            ))}
        </div>
    )
}
