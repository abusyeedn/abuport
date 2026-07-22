import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import type { CSSProperties } from "react"
import { FONTS } from "../theme"

interface VinylDeckProps {
    animationDuration?: number
    animationDelay?: number
    image?: { src: string; alt?: string }
    style?: CSSProperties
}

const lofiSongs = [
    "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
    "https://cdn.pixabay.com/audio/2022/03/10/audio_4e5d99f12e.mp3",
    "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe25f21.mp3",
    "https://cdn.pixabay.com/audio/2022/10/25/audio_c8b8e0f2f4.mp3",
    "https://cdn.pixabay.com/audio/2023/02/28/audio_c3c6c0c141.mp3",
]

export default function VinylDeck(props: VinylDeckProps) {
    const {
        animationDuration = 1.8,
        animationDelay = 0,
        image = {
            src: "https://framerusercontent.com/images/NPAzrEyYdyZWyi6W5Tru1SbRHuE.png",
            alt: "Vinyl Deck",
        },
        style,
    } = props

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentSongIndex, setCurrentSongIndex] = useState(0)
    const audioRef = useRef<HTMLAudioElement>(null)

    const togglePlayPause = useCallback(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play().catch((error) => {
                    console.error("Audio playback failed:", error)
                })
            }
            setIsPlaying((prev) => !prev)
        }
    }, [isPlaying])

    // Handle song ending to play next
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleEnded = () => {
            setCurrentSongIndex((prevIndex) => (prevIndex + 1) % lofiSongs.length)
        }

        audio.addEventListener("ended", handleEnded)
        return () => {
            audio.removeEventListener("ended", handleEnded)
        }
    }, [])

    // Update audio source when song changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = lofiSongs[currentSongIndex]
            audioRef.current.load()
            audioRef.current.volume = 0.5 // Default volume to 50%
            if (isPlaying) {
                audioRef.current.play().catch((error) => {
                    console.error("Audio playback failed:", error)
                    setIsPlaying(false)
                })
            }
        }
    }, [currentSongIndex, isPlaying])

    return (
        <motion.div
            onClick={togglePlayPause}
            style={{
                ...style,
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "visible",
                transformOrigin: "bottom center",
                cursor: "pointer",
            }}
            initial={{ rotate: 0, x: 100 }}
            animate={{ 
                rotate: -10, 
                x: 0,
                // Add a subtle bobbing effect when playing
                y: isPlaying ? [0, -5, 0] : 0,
            }}
            transition={{
                duration: animationDuration,
                delay: animationDelay,
                ease: [0.16, 1, 0.3, 1],
                // Make the bobbing loop continuously if playing
                y: {
                    repeat: isPlaying ? Infinity : 0,
                    duration: 2,
                    ease: "easeInOut"
                }
            }}
        >
            <audio ref={audioRef} style={{ display: "none" }} />
            
            <img
                src={image.src}
                alt={image.alt || ""}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: isPlaying ? "drop-shadow(0px 8px 16px rgba(0,0,0,0.2))" : "drop-shadow(0px 4px 8px rgba(0,0,0,0.1))",
                    transition: "filter 0.3s ease",
                }}
            />

            {/* Simple indicator that it's playing */}
            {isPlaying && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                        position: "absolute",
                        top: "10%",
                        right: "10%",
                        backgroundColor: "#1db954", // Spotify green-ish
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: FONTS.primary,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }}
                >
                    Playing Lofi 🎵
                </motion.div>
            )}
        </motion.div>
    )
}
