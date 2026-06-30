import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLocation } from 'react-router-dom'

function playWaveSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const duration = 0.9
    const bufferSize = Math.ceil(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1200, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.45)
    filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + duration)
    filter.Q.value = 1.4
    const filter2 = ctx.createBiquadFilter()
    filter2.type = 'bandpass'
    filter2.frequency.setValueAtTime(400, ctx.currentTime)
    filter2.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + duration)
    filter2.Q.value = 0.8
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.12)
    gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.55)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)
    noise.connect(filter)
    filter.connect(filter2)
    filter2.connect(gain)
    gain.connect(ctx.destination)
    noise.start()
    noise.stop(ctx.currentTime + duration)
    setTimeout(() => ctx.close(), (duration + 0.2) * 1000)
  } catch { /* ignore AudioContext errors */ }
}

// Physics-based wave: natural left + right wavy edges, slight vertical wobble
function Wave({ delay = 0, opacity = 1, yWobble = 0 }: {
  delay?: number
  fill?: string
  opacity?: number
  yWobble?: number
}) {
  const isLead = delay === 0

  // Left edge: 5 deep organic humps (trailing side)
  // Right edge: 4 pronounced humps (leading side)
  const path = isLead
    ? `M16,0
       C11,10 20,18 10,28
       C0,38 18,46 7,56
       C-4,66 16,74 8,84
       C2,92 12,97 16,100
       L92,100
       C110,96 76,86 96,74
       C116,62 78,56 96,50
       C114,44 80,36 98,24
       C116,12 108,-5 92,0 Z`
    : `M20,0
       C14,12 24,22 13,33
       C2,44 20,52 10,62
       C0,72 18,80 11,90
       C5,97 14,100 20,100
       L96,100
       C112,92 80,82 98,70
       C116,58 82,52 98,44
       C114,36 84,28 100,18
       C116,8 112,-2 96,0 Z`

  return (
    <motion.div
      initial={{ x: '-120%' }}
      animate={{
        x: '120%',
        y: [0, yWobble, -yWobble * 0.6, yWobble * 0.3, 0],
      }}
      transition={{
        x: {
          duration: 1.5,
          ease: [0.76, 0, 0.24, 1],
          delay,
        },
        y: {
          duration: 1.5,
          ease: 'easeInOut',
          delay,
          times: [0, 0.25, 0.5, 0.75, 1],
        },
      }}
      style={{ position: 'absolute', inset: 0, opacity }}
    >
      <svg
        viewBox="0 0 140 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '140%', height: '100%' }}
      >
        <defs>
          <linearGradient id={`waveGrad${isLead ? 'A' : 'B'}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLead ? '#7dd3fc' : '#0ea5e9'} />
            <stop offset="50%" stopColor={isLead ? '#38bdf8' : '#0284c7'} />
            <stop offset="100%" stopColor={isLead ? '#0ea5e9' : '#075985'} />
          </linearGradient>
        </defs>
        <path d={path} fill={`url(#waveGrad${isLead ? 'A' : 'B'})`} />
      </svg>
    </motion.div>
  )
}

export default function WaveTransition() {
  const location = useLocation()
  const [playing, setPlaying] = useState(false)
  const [waveKey, setWaveKey] = useState(0)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    setWaveKey(k => k + 1)
    setPlaying(true)
    playWaveSound()
    const t = setTimeout(() => setPlaying(false), 1800)
    return () => clearTimeout(t)
  }, [location.pathname])

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          key={waveKey}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99998,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          {/* Lead wave */}
          <Wave delay={0} opacity={0.9} yWobble={-6} />
          {/* Follow wave */}
          <Wave delay={0.08} opacity={1} yWobble={8} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
