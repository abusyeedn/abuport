import { useRef, type CSSProperties } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { FONTS } from "../theme"

// Titles/labels read as editorial headings (site-wide serif), body copy stays
// on the sans - matches the FONTS.display/FONTS.body split used everywhere
// else (CaseStudyHero, Kynhood2Page section headings).

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Phase {
    image?: { src: string; alt?: string }
    phaseLabel: string
    title: string
    dateRange: string
    description: string
    stat?: string
}

interface KynhoodJourneyProps {
    phases?: Phase[]
    accentColor?: string
    lineColor?: string
    cardBg?: string
    textColor?: string
    mutedColor?: string
    fontFamily?: string
    style?: CSSProperties
}

// ─────────────────────────────────────────────
// SINGLE PHASE CARD
// ─────────────────────────────────────────────
function PhaseCard({
    phase,
    index: _index, // eslint-disable-line @typescript-eslint/no-unused-vars
    accentColor,
    cardBg,
    textColor,
    mutedColor,
    fontFamily,
    align,
}: {
    phase: Phase
    index: number  // passed for future use (e.g. alternate layout logic)
    accentColor: string
    cardBg: string
    textColor: string
    mutedColor: string
    fontFamily: string
    align: "left" | "right"
}) {
    const tilt = align === "left" ? -3 : 3

    return (
        <motion.div
            initial={{ opacity: 0, y: 80, rotate: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, rotate: tilt, scale: 1 }}
            viewport={{ once: true, margin: "-150px", amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
                position: "relative",
                width: 320,
                background: cardBg,
                borderRadius: "6px 6px 22px 6px",
                padding: "var(--space-4)",
                paddingBottom: "var(--space-6)",
                border: "1px solid rgba(15,23,42,0.06)",
                boxShadow:
                    "0 16px 34px rgba(4,61,51,0.1), 0 2px 8px rgba(4,61,51,0.05)",
                fontFamily,
            }}
        >
            {/* tape - tinted with the accent instead of plain white, so it reads
                as part of the same palette rather than a generic craft-paper prop */}
            <div
                style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: `translateX(-50%) rotate(${-tilt * 1.4}deg)`,
                    width: 64,
                    height: 24,
                    background: `${accentColor}1a`,
                    border: `1px solid ${accentColor}33`,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
            />

            {/* image */}
            <div
                style={{
                    width: "100%",
                    height: 200,
                    borderRadius: 3,
                    overflow: "hidden",
                    background: "#e8e8e8",
                }}
            >
                {phase.image?.src && (
                    <img
                        src={phase.image.src}
                        alt={phase.image.alt || phase.title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
            </div>

            {/* year badge - phaseLabel was captured in props but never rendered */}
            <div
                style={{
                    display: "inline-block",
                    marginTop: 16,
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontFamily,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: accentColor,
                    background: `${accentColor}14`,
                }}
            >
                {phase.phaseLabel}
            </div>

            <div
                style={{
                    fontFamily: FONTS.display,
                    fontSize: 23,
                    fontWeight: 700,
                    color: textColor,
                    marginTop: 10,
                    lineHeight: 1.28,
                    letterSpacing: "-0.01em",
                }}
            >
                {phase.title}
            </div>

            <div
                style={{
                    fontFamily,
                    fontSize: 15,
                    color: mutedColor,
                    marginTop: 3,
                    fontWeight: 600,
                }}
            >
                {phase.dateRange}
            </div>

            <div
                style={{
                    fontFamily,
                    fontSize: 16,
                    color: textColor,
                    opacity: 0.78,
                    marginTop: 10,
                    lineHeight: 1.55,
                    fontWeight: 400,
                }}
            >
                {phase.description}
            </div>

            {phase.stat && (
                <div
                    style={{
                        marginTop: "var(--space-3)",
                        paddingTop: "var(--space-3)",
                        borderTop: `1px dashed ${mutedColor}40`,
                        fontFamily,
                        fontSize: 15,
                        fontWeight: 700,
                        color: accentColor,
                    }}
                >
                    {phase.stat}
                </div>
            )}
        </motion.div>
    )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function KynhoodJourney(props: KynhoodJourneyProps) {
    const {
        phases = [
            {
                phaseLabel: "2024",
                title: "Intern - Product Designer",
                dateRange: "Jun 2024 – Aug 2024",
                description:
                    "Started in Design Operations, logging bugs and shipping small design tickets to understand the product, users, and team workflows.",
                stat: "3 months · foundational ramp-up",
                image: { src: "/gallery/kynhood/kyn-journey-1.jpg", alt: "2024" }
            },
            {
                phaseLabel: "2025",
                title: "Sole Designer - Events Listing",
                dateRange: "Sep 2024 – May 2025",
                description:
                    "Promoted to Product Designer and independently owned the Events Listing module - delivering 15 phases with 10–15 medium level tickets each, scaling from incremental improvements to major feature releases alongside a 20-member cross-functional team.",
                stat: "6 months · 15 phases shipped",
                image: { src: "/gallery/kynhood/kyn-journey-2.jpg", alt: "2025" }
            },
            {
                phaseLabel: "2026",
                title: "Design Ownership + Extended Product Involvement",
                dateRange: "Jun 2025 – Jun 2026",
                description:
                    "Owned 100% of feature design end-to-end, and took on close to 50% of the product responsibilities for the features I worked on - supporting business logic and solutioning, writing PRDs and user stories, and leading UAT - functioning as a light PM/PA alongside the product team rather than owning the product role outright.",
                stat: "12 months · full lifecycle ownership",
                image: { src: "/gallery/misc/Image.jpg", alt: "2026" }
            }
        ],
        accentColor = "#077a4b",
        lineColor = "#D1D5DB",
        cardBg = "#FFFFFF",
        textColor = "#111827",
        mutedColor = "#6B7280",
        fontFamily = FONTS.primary,
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.8", "end 0.3"],
    })

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

    const itemGap = 90

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width: "100%",
                fontFamily,
                fontWeight: 700,
                padding: "60px 24px",
            }}
        >

            {/* vertical progress line */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: `linear-gradient(to bottom, transparent 0%, ${lineColor} 10%, ${lineColor} 90%, transparent 100%)`,
                    transform: "translateX(-50%)",
                    zIndex: 0,
                }}
            >
                <motion.div
                    style={{
                        width: "100%",
                        height: lineHeight,
                        background: `linear-gradient(to bottom, transparent 0%, ${accentColor} 10%, ${accentColor} 90%, transparent 100%)`,
                    }}
                />
            </div>

            {/* phases */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: itemGap,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {phases.map((phase, i) => {
                    const align = i % 2 === 0 ? "left" : "right"
                    return (
                        <div
                            key={i}
                            style={{
                                position: "relative",
                                display: "flex",
                                justifyContent:
                                    align === "left"
                                        ? "flex-start"
                                        : "flex-end",
                                alignItems: "flex-start",
                                width: "100%",
                            }}
                        >
                            <div
                                style={{
                                    width: "46%",
                                    display: "flex",
                                    justifyContent:
                                        align === "left"
                                            ? "flex-end"
                                            : "flex-start",
                                    paddingRight: align === "left" ? 40 : 0,
                                    paddingLeft: align === "right" ? 40 : 0,
                                }}
                            >
                                <PhaseCard
                                    phase={phase}
                                    index={i}
                                    accentColor={accentColor}
                                    cardBg={cardBg}
                                    textColor={textColor}
                                    mutedColor={mutedColor}
                                    fontFamily={fontFamily}
                                    align={align}
                                />
                            </div>

                            {/* dot on the line - fixed distance from the TOP of
                                every card (not row-center, which drifts when card
                                content height varies). 110px ≈ middle of the image. */}
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true, margin: "-120px" }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.2,
                                }}
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: 110,
                                    transform: "translate(-50%, -50%)",
                                    fontSize: "28px",
                                    lineHeight: 1,
                                    zIndex: 2,
                                    textShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                }}
                            >
                                📌
                            </motion.div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
