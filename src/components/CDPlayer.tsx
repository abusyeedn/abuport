import React, { useState, useEffect, useRef, type CSSProperties } from "react"
import { motion, useMotionValue, useAnimationFrame } from "framer-motion"
import { useAudio } from "../AudioContext"

interface CDPlayerProps {
    cdImage?: { src: string; alt?: string }
    tonearmImage?: { src: string; alt?: string }
    backgroundImage?: { src: string; alt?: string }
    buttonImage?: { src: string; alt?: string }
    displayImage?: { src: string; alt?: string }
    backgroundColor?: string
    displayTextColor?: string
    style?: CSSProperties
}

const CD_WIDTH = "60%"
const CD_HEIGHT = "70%"
const CD_TOP = "10%"
const CD_LEFT = "12%"

const cdImages = [
    "https://framerusercontent.com/images/hICQEvu39tTvO81aZ1p5vZtg.png",
    "https://framerusercontent.com/images/HQyY5b2tuArrj6bVdZlBB3nqWI.png",
    "https://framerusercontent.com/images/rGlgyiePN9RsMV3C6btGwEeC90.png",
    "https://framerusercontent.com/images/QxI0OyXCWbwDkSX5BpOC2sTSRPw.png",
    "https://framerusercontent.com/images/NvSuQs7YjN3YYEdsfrEwNRAy7bE.png",
    "https://framerusercontent.com/images/lJHqM7F9Qln5s5zaVFFKvftVZJs.png",
    "https://framerusercontent.com/images/CKcr81TTfdcyADXOiXBGKZrT8Uk.png",
]

export default function CDPlayer(props: CDPlayerProps) {
    const {
        tonearmImage = {
            src: "https://framerusercontent.com/images/FSOZ2cAUmk8MbEu5rVhQBl1zY.png",
            alt: "Tonearm",
        },
        backgroundImage = {
            src: "https://framerusercontent.com/images/3M4OVTTiXVf9OBoBtpbRSROmsFM.png",
            alt: "Turntable Base",
        },
        buttonImage = {
            src: "https://framerusercontent.com/images/CnPFsTzuRqn4MaIWpQt9bvN1aLU.png",
            alt: "Control Button",
        },
        backgroundColor = "transparent",
        displayTextColor = "#00FF00",
    } = props

    const { isPlaying, currentSongName, currentTime, songVersion, togglePlayPause, nextSong } = useAudio()

    const [currentCDImage, setCurrentCDImage] = useState(cdImages[0])
    const [cdKey, setCdKey] = useState(0)
    const [exitingCDs, setExitingCDs] = useState<{ id: number; src: string }[]>([])

    const rotation = useMotionValue(0)
    const cdKeyRef = useRef(cdKey)
    const currentCDImageRef = useRef(currentCDImage)
    cdKeyRef.current = cdKey // eslint-disable-line react-hooks/refs
    currentCDImageRef.current = currentCDImage // eslint-disable-line react-hooks/refs

    const swapCD = () => {
        const prevKey = cdKeyRef.current
        const prevSrc = currentCDImageRef.current
        setExitingCDs(prev => [...prev, { id: prevKey, src: prevSrc }])
        setCurrentCDImage(cdImages[Math.floor(Math.random() * cdImages.length)])
        setCdKey(k => k + 1)
        setTimeout(() => setExitingCDs(prev => prev.filter(c => c.id !== prevKey)), 1200)
    }

    // Auto-swap CD when song changes from AudioContext (e.g. song ends)
    const prevSongVersion = useRef(songVersion)
    useEffect(() => {
        if (songVersion !== prevSongVersion.current) {
            prevSongVersion.current = songVersion
            swapCD()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [songVersion])

    useAnimationFrame((_time, delta) => {
        if (isPlaying) rotation.set(rotation.get() + (delta / 1000) * 180)
    })

    const handleNext = () => {
        swapCD()
        nextSong()
    }

    const formatTime = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`

    return (
        <motion.div
            initial={{ y: -1000 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
                width: "100%", height: "100%", display: "flex",
                flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 40, padding: 40, backgroundColor, position: "relative", overflow: "hidden",
            }}
        >
            {/* LED Display */}
            <div style={{ position: "relative", width: "100%", maxWidth: 300, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                    position: "absolute", width: "60%", height: "90%",
                    backgroundColor: "#0a3d0a", borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0 3%", gap: 8, boxShadow: "inset 0 1px 4px rgba(0,0,0,0.8)",
                    top: "120%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 1,
                }}>
                    <div style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(8px,1.5vw,10px)", fontWeight: "bold", color: displayTextColor, textShadow: `0 0 2px ${displayTextColor}`, letterSpacing: "0.05em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
                        {currentSongName}
                    </div>
                    <div style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(8px,1.5vw,10px)", fontWeight: "bold", color: displayTextColor, textShadow: `0 0 2px ${displayTextColor}`, letterSpacing: "0.05em", minWidth: "30%", textAlign: "right" }}>
                        {formatTime(currentTime)}
                    </div>
                </div>
            </div>

            {/* CD Player Area */}
            <div style={{ position: "relative", width: "100%", maxWidth: 400, aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Base */}
                <div style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0 }}>
                    <img src={backgroundImage.src} alt={backgroundImage.alt} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>

                {/* Current CD */}
                <motion.div
                    key={`cd-${cdKey}`}
                    onClick={togglePlayPause}
                    initial={{ y: -1000, scale: 0.8, rotateX: -30 }}
                    animate={{ y: 0, scale: 1, rotateX: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ width: CD_WIDTH, height: CD_HEIGHT, cursor: "pointer", position: "absolute", top: CD_TOP, left: CD_LEFT, transform: "translate(-50%,-50%)", zIndex: 5, rotate: rotation, perspective: 1000, transformStyle: "preserve-3d", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))" }}
                >
                    <img src={currentCDImage} alt="CD" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </motion.div>

                {/* Exiting CDs */}
                {exitingCDs.map(cd => (
                    <motion.div
                        key={`cd-exit-${cd.id}`}
                        initial={{ y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 }}
                        animate={{ y: 700, x: 500, rotateX: 75, rotateY: 60, rotateZ: 45, scale: 0.3 }}
                        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ width: CD_WIDTH, height: CD_HEIGHT, position: "absolute", top: CD_TOP, left: CD_LEFT, transform: "translate(-50%,-50%)", zIndex: 4, rotate: rotation, perspective: 1200, transformStyle: "preserve-3d", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.4))" }}
                    >
                        <img src={cd.src} alt="CD" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </motion.div>
                ))}

                {/* Tonearm */}
                <motion.div
                    onClick={togglePlayPause}
                    initial={{ rotate: 35 }}
                    animate={{ rotate: isPlaying ? 0 : 35 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ position: "absolute", top: "-30%", right: "-18%", width: "80%", height: "100%", transformOrigin: "center", cursor: "pointer", zIndex: 10 }}
                >
                    <img src={tonearmImage.src} alt={tonearmImage.alt} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }} />
                </motion.div>

                {/* Next button */}
                <motion.div
                    onClick={handleNext}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ position: "absolute", top: "66%", left: "5%", width: "20%", aspectRatio: "1", cursor: "pointer", zIndex: 10 }}
                >
                    <img src={buttonImage.src} alt={buttonImage.alt} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))" }} />
                </motion.div>
            </div>
        </motion.div>
    )
}
