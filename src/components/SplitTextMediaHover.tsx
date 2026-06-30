import * as React from "react"
import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"

interface SplitTextMediaHoverProps {
    livePreview?: boolean
    textFont?: React.CSSProperties
    splitMode?: "Fixed" | "Dynamic"
    fullText?: string
    textLeft?: string
    textRight?: string
    mediaType?: "Image" | "Video"
    image?: string
    video?: string
    textColor?: string
    expandWidth?: number
    mediaHeight?: number
    mediaRadius?: number
    gap?: number
    springStiffness?: number
    springDamping?: number
}

export default function SplitTextMediaHover(incomingProps: SplitTextMediaHoverProps) {
    const props = {
        livePreview: true,
        textFont: {
            fontSize: "96px",
            fontWeight: 800,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "-0.02em",
            lineHeight: "1em",
        } as React.CSSProperties,
        splitMode: "Dynamic" as const,
        fullText: "GAMING",
        textLeft: "GAM",
        textRight: "ING",
        mediaType: "Image" as const,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
        video: "",
        textColor: "#ffffff",
        expandWidth: 320,
        mediaHeight: 110,
        mediaRadius: 16,
        gap: 12,
        springStiffness: 400,
        springDamping: 35,
        ...incomingProps,
    }

    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const [isHovered, setIsHovered] = useState(false)
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const isDynamic = props.splitMode === "Dynamic"

    const defaultSplitIndex =
        isDynamic && props.fullText
            ? Math.max(0, Math.floor(props.fullText.length / 2) - 1)
            : 0
    const currentSplitIndex = activeIndex !== null ? activeIndex : defaultSplitIndex

    useEffect(() => {
        if (props.mediaType !== "Video" || !videoRef.current || !containerRef.current) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && props.livePreview) {
                    videoRef.current?.play().catch(() => {})
                } else {
                    videoRef.current?.pause()
                }
            },
            { threshold: 0 }
        )
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [props.mediaType, props.livePreview])

    useEffect(() => {
        if (isHovered && props.mediaType === "Video" && videoRef.current) {
            videoRef.current.play().catch(() => {})
        }
    }, [activeIndex, isHovered, props.mediaType])

    const springConfig = {
        type: "spring",
        stiffness: props.springStiffness,
        damping: props.springDamping,
        mass: 1,
    }

    const renderMedia = (expanded: boolean) => (
        <motion.div
            key="media-container"
            layout="position"
            initial={false}
            animate={{
                width: expanded ? props.expandWidth : 0,
                marginInline: expanded ? props.gap : 0,
                opacity: expanded ? 1 : 0,
                filter: expanded ? "blur(0px)" : "blur(8px)",
            }}
            transition={springConfig}
            style={{
                height: props.mediaHeight,
                borderRadius: props.mediaRadius,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                willChange: "width, opacity, filter, margin, transform",
                position: "relative",
            }}
        >
            <motion.div
                initial={false}
                animate={{ scale: expanded ? 1 : 1.2 }}
                transition={springConfig}
                style={{
                    width: props.expandWidth,
                    height: "100%",
                    position: "absolute",
                    left: "50%",
                    x: "-50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    willChange: "transform",
                } as React.CSSProperties}
            >
                {props.mediaType === "Image" ? (
                    <img
                        src={props.image}
                        style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                        alt="Hover reveal"
                    />
                ) : (
                    <video
                        ref={videoRef}
                        src={props.video}
                        loop
                        muted
                        playsInline
                        style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                    />
                )}
            </motion.div>
        </motion.div>
    )

    const elements: React.ReactNode[] = []

    if (isDynamic) {
        const chars = props.fullText ? props.fullText.split("") : []
        chars.forEach((char, i) => {
            elements.push(
                <motion.span
                    key={`char-${i}`}
                    layout="position"
                    onPointerEnter={() => setActiveIndex(i)}
                    style={{
                        ...props.textFont,
                        color: props.textColor,
                        whiteSpace: "pre",
                        margin: 0,
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        pointerEvents: "auto",
                        willChange: "transform",
                    }}
                >
                    {char}
                </motion.span>
            )
            if (i === currentSplitIndex) {
                elements.push(renderMedia(isHovered))
            }
        })
    } else {
        elements.push(
            <motion.span
                key="text-left"
                layout="position"
                style={{
                    ...props.textFont,
                    color: props.textColor,
                    whiteSpace: "pre",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: "none",
                    willChange: "transform",
                }}
            >
                {props.textLeft}
            </motion.span>
        )
        elements.push(renderMedia(isHovered))
        elements.push(
            <motion.span
                key="text-right"
                layout="position"
                style={{
                    ...props.textFont,
                    color: props.textColor,
                    whiteSpace: "pre",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: "none",
                    willChange: "transform",
                }}
            >
                {props.textRight}
            </motion.span>
        )
    }

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <motion.div
                layout
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: "20px",
                }}
            >
                {elements}
            </motion.div>
        </div>
    )
}
