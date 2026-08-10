import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { FONTS } from "../theme"
import { useZoomScale } from "../components/ViewportScaler"
import BackButton from "../components/BackButton"
import FigmaElement from "../components/FigmaElement"
// InvestigationWall ("crime thriller") entry point archived from About page per request - component kept for later reuse

// Seeded random helper for stable values across renders
function getSeededRandom(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const x = Math.sin(hash) * 10000
  return x - Math.floor(x)
}

// Inner image component that handles automatic 3D floating, overriding with manual tilt on mouse hover
function TiltImage({ src, seed }: { src: string; seed: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Desynchronize animations by generating custom durations & negative delays per image
  const duration = (seed * 6) + 8 // 8s to 14s cycles
  const delay = -(seed * 7) // Offset start time so images float independently

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const xc = rect.width / 2
    const yc = rect.height / 2
    const rotateY = ((x - xc) / xc) * 15 // tilt range up to 15deg
    const rotateX = -((y - yc) / yc) * 15
    setTilt({ x: rotateX, y: rotateY })
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        width: "100%",
        height: "100%",
        display: "block",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: isHovered ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined,
          animation: isHovered ? "none" : `float-tilt ${duration}s infinite ease-in-out`,
          animationDelay: isHovered ? "0s" : `${delay}s`,
          transition: isHovered ? "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)" : "transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)",
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src={src}
          alt="Gallery Pic"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "0px", // Remove corner radius
            border: "none", // Remove white stroke
            display: "block",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden", // Safari-specific anti-aliasing lock
            transform: "translate3d(0, 0, 0) scale(1.001)", // Force constant GPU rendering without raster snaps
            WebkitTransform: "translate3d(0, 0, 0) scale(1.001)",
            willChange: "transform", // Keep GPU layer warm to prevent dynamic resolution scaling
            imageRendering: "-webkit-optimize-contrast", // Safari/Chrome sharpness optimization
          }}
        />
      </div>
    </div>
  )
}

export default function AboutPage() {
  const navigate = useNavigate()
  const zoomScale = useZoomScale()

  // Files under /public aren't importable as JS modules, so this list is generated
  // from the known "image 1..26" naming convention rather than via import.meta.glob
  // (which only works for files under src). Some were converted to JPEG during
  // compression (opaque images re-encoded smaller), hence the per-index extension.
  // Image 27 is excluded - it's shown separately as the centered hero image below.
  const jpgIndices = new Set([13, 14, 15, 16, 17, 18, 19, 21, 22])
  const imagePaths = Array.from({ length: 26 }, (_, i) => {
    const n = i + 1
    return `/gallery/pics/image ${n}.${jpgIndices.has(n) ? 'jpg' : 'png'}`
  })

  return (
    <div style={{
      fontFamily: FONTS.primary,
      backgroundColor: "#077a4b", // Exact self-healing green mat base color
      position: "relative",
      // `100vh` alone renders short here: ViewportScaler applies CSS `zoom` to
      // the <html> root, which shrinks this box's real rendered size along
      // with everything else instead of growing vh's reference frame to
      // compensate - dividing by the current zoom scale cancels that out so
      // this still fills exactly one real viewport.
      height: `${100 / (zoomScale || 1)}vh`,
      color: "#ffffff",
      overflow: "hidden", // Disable all scrolling on the page
    }}>
      {/* CSS Animation definitions for glitch, horror pulse, and slow 3D floating mat sways */}
      <style>{`
        @keyframes horror-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(239, 68, 68, 0.2); }
          50% { box-shadow: 0 0 25px rgba(239, 68, 68, 0.85), inset 0 0 15px rgba(239, 68, 68, 0.4); }
        }
        @keyframes scary-flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% { opacity: 0.99; filter: hue-rotate(0deg); }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0.4; filter: hue-rotate(45deg) saturate(2); }
        }
        @keyframes float-tilt {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          25% { transform: rotateX(5deg) rotateY(-4deg); }
          50% { transform: rotateX(-6deg) rotateY(5deg); }
          75% { transform: rotateX(4deg) rotateY(4deg); }
          100% { transform: rotateX(0deg) rotateY(0deg); }
        }
        .scary-glow-btn {
          animation: horror-pulse 2s infinite ease-in-out;
        }
        .scary-glow-btn:hover {
          animation: horror-pulse 0.6s infinite ease-in-out !important;
        }
        .scary-text-glitch {
          animation: scary-flicker 5s infinite;
        }
      `}</style>

      {/* Grid lines styled like the user's uploaded professional green self-healing mat with bright cyan lines */}
      <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid-about" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00cbb4" strokeWidth="0.5" strokeOpacity="0.22" />
          </pattern>
          <pattern id="grid-about" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid-about)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#00cbb4" strokeWidth="0.9" strokeOpacity="0.45" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-about)" />
        {/* Aesthetic 45-degree and 60-degree diagonal mat measurement lines */}
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#00cbb4" strokeWidth="0.8" strokeOpacity="0.15" />
        <line x1="20%" y1="0" x2="100%" y2="80%" stroke="#00cbb4" strokeWidth="0.8" strokeOpacity="0.1" />
        <line x1="0" y1="20%" x2="80%" y2="100%" stroke="#00cbb4" strokeWidth="0.8" strokeOpacity="0.1" />
      </svg>

      {/* Main content container */}
      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "800px",
        margin: "0 auto",
        padding: "4rem 2rem calc(4rem + 80px) 2rem",
        height: "100%",
        boxSizing: "border-box",
      }}>
        {/* Back Button */}
        <FigmaElement figmaId="about-back-btn" style={{ display: "block", width: "max-content", position: "relative", marginBottom: "2rem" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              color: "#e2f0e7", // High contrast light green text
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Icon icon="solar:arrow-left-outline" width={18} />
            Back
          </button>
        </FigmaElement>

        {/* Hero Section */}
        <FigmaElement figmaId="about-header" style={{ display: "block", position: "relative", marginBottom: "2.5rem" }}>
          <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#00cbb4", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            About Me
          </span>
          <h1 style={{
            fontFamily: FONTS.display,
            fontSize: "3rem",
            margin: "0.5rem 0 1rem 0",
            color: "#ffffff",
            lineHeight: 1.1,
            letterSpacing: "-0.02em"
          }}>
            Abu Syeed
          </h1>
          <p style={{
            fontSize: "1.2rem",
            fontWeight: 500,
            color: "#e2f0e7",
            lineHeight: 1.4,
            margin: 0
          }}>
            Product Designer & AI/Data Science Practitioner based in Chennai, India. Specializing in computational design systems, product strategies, and AI-accelerated interface design.
          </p>
        </FigmaElement>

        {/* Bio Card (Yellow Sticky Note) */}
        <FigmaElement figmaId="about-bio-card" style={{ display: "block", position: "relative", marginBottom: "28px" }}>
          <div style={{
            background: "#fef08a", // Classic yellow post-it
            border: "1px solid #fde047",
            borderRadius: "2px",
            padding: "24px",
            boxShadow: "2px 10px 25px rgba(0,0,0,0.25), 0 2px 5px rgba(0,0,0,0.1)",
            transform: "rotate(-1.2deg)",
            position: "relative",
          }}>
            {/* Top Tape Effect */}
            <div style={{
              position: "absolute",
              top: "-12px",
              left: "50%",
              transform: "translateX(-50%) rotate(1deg)",
              width: "80px",
              height: "22px",
              background: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(0,0,0,0.04)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
            }} />
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: 800, color: "#854d0e", fontFamily: FONTS.display }}>Who I Am</h3>
            <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: "#713f12" }}>
              I approach design from both an artistic and computational lens. Graduating in B.Tech Artificial Intelligence and Data Science, I bridge the gap between design theory and technical deployment. Currently, I lead product design at Kynhood, transforming complex workflows into clean user experiences while leveraging analytics to scale product engagement.
            </p>
          </div>
        </FigmaElement>

        {/* Sticky Notes Grid (Education & Experience side-by-side) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "28px",
          marginBottom: "32px"
        }}>
          {/* Education Card (Blue Sticky Note) */}
          <FigmaElement figmaId="about-education-card" style={{ display: "block", position: "relative" }}>
            <div style={{
              background: "#e0f2fe", // Blue post-it
              border: "1px solid #bae6fd",
              borderRadius: "2px",
              padding: "20px",
              boxShadow: "2px 8px 20px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.1)",
              transform: "rotate(1deg)",
              position: "relative",
              height: "100%",
              boxSizing: "border-box",
            }}>
              {/* Top Tape Effect */}
              <div style={{
                position: "absolute",
                top: "-12px",
                left: "40%",
                transform: "translateX(-50%) rotate(-2deg)",
                width: "70px",
                height: "22px",
                background: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(0,0,0,0.04)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "#0369a1" }}>
                <Icon icon="solar:document-bold" width={20} />
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#0369a1", fontFamily: FONTS.display }}>Education</h4>
              </div>
              <div style={{ fontSize: "0.85rem", lineHeight: 1.4, color: "#075985" }}>
                <strong style={{ display: "block", color: "#0369a1", marginBottom: "4px" }}>B.Tech in AI & Data Science</strong>
                Sri Manakula Vinayagar Engineering College
                <span style={{ display: "block", color: "#0284c7", marginTop: "4px", fontWeight: 600 }}>2020–2024 · GPA 87%</span>
              </div>
            </div>
          </FigmaElement>

          {/* Experience Card (Pink Sticky Note) */}
          <FigmaElement figmaId="about-experience-card" style={{ display: "block", position: "relative" }}>
            <div style={{
              background: "#ffe4e6", // Pink post-it
              border: "1px solid #fecdd3",
              borderRadius: "2px",
              padding: "20px",
              boxShadow: "2px 8px 20px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.1)",
              transform: "rotate(-0.8deg)",
              position: "relative",
              height: "100%",
              boxSizing: "border-box",
            }}>
              {/* Top Tape Effect */}
              <div style={{
                position: "absolute",
                top: "-12px",
                left: "60%",
                transform: "translateX(-50%) rotate(3deg)",
                width: "70px",
                height: "22px",
                background: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(0,0,0,0.04)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#be123c" }}>
                <Icon icon="solar:suitcase-tag-bold" width={20} />
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#be123c", fontFamily: FONTS.display }}>Experience</h4>
              </div>
              <div style={{ fontSize: "0.85rem", lineHeight: 1.4, color: "#9f1239", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div>
                  <strong style={{ display: "block", color: "#be123c" }}>Kynhood - Product Designer</strong>
                  <span style={{ color: "#e11d48", fontWeight: 500 }}>2024–Present · Chennai</span>
                </div>
                <div>
                  <strong style={{ display: "block", color: "#be123c" }}>Spaarks - UX Design Intern</strong>
                  <span style={{ color: "#e11d48", fontWeight: 500 }}>2024 · Remote</span>
                </div>
              </div>
            </div>
          </FigmaElement>
        </div>

        {/* Standalone Scary Crime Scene Button - archived along with the Investigation Wall */}

        {/* Special Centered Image 27 (Positioned in the center, above all gutter images) */}
        <FigmaElement
          figmaId="about-pic-27"
          style={{
            display: "block",
            position: "absolute",
            top: "220px",
            left: "175px", // Center alignment: (800px content width - 450px width) / 2 = 175px
            width: "450px",
            zIndex: 950, // Placed on top of standard gutter images (which are zIndex 900)
          }}
        >
          <TiltImage src="/gallery/pics/image 27.png" seed={0.88} />
        </FigmaElement>

        {/* Floating Pictures (loaded dynamically from public/gallery/pics, positioned above the content with 3D hover tilt) */}
        {imagePaths.map((path, idx) => {
          const seed = getSeededRandom(path)
          const rotate = Math.round((seed * 30) - 15) // -15deg to +15deg
          const width = Math.round((seed * 120) + 140) // Randomize width between 140px and 260px
          const initialTop = 150 + (idx * 220)
          const isLeft = idx % 2 === 0
          const initialLeft = isLeft ? -190 : 770

          return (
            <FigmaElement
              key={path}
              figmaId={`about-pic-${idx}`}
              style={{
                display: "block",
                position: "absolute",
                top: `${initialTop}px`,
                left: isLeft ? `${initialLeft + (seed * 50)}px` : `${initialLeft - (seed * 50)}px`,
                width: `${width}px`,
                transform: `rotate(${rotate}deg)`,
                zIndex: 900, // Standard gutter images z-index
              }}
            >
              <TiltImage src={path} seed={seed} />
            </FigmaElement>
          )
        })}
      </div>

      <BackButton />
    </div>
  )
}
