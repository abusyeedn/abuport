/**
 * DustParticles.tsx
 *
 * ~30 subtle dust motes floating inside the flashlight beam.
 * Pure CSS animations — no JS per frame.
 */
import React from 'react'

const PARTICLE_COUNT = 30

interface Particle {
  id: number
  size: number
  x: number
  y: number
  duration: number
  delay: number
  opacity: number
  dx: number
  dy: number
}

// Generate particles once
const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  size: 1 + Math.random() * 2,
  x: 30 + Math.random() * 40,   // % — centered around viewport middle
  y: 30 + Math.random() * 40,
  duration: 8 + Math.random() * 12,
  delay: Math.random() * -20,
  opacity: 0.12 + Math.random() * 0.2,
  dx: -15 + Math.random() * 30,  // drift range in px
  dy: -20 + Math.random() * 40,
}))

const DustParticles = React.memo(function DustParticles() {
  return (
    <>
      <style>{`
        @keyframes dust-float {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: var(--dust-op);
          }
          25% {
            opacity: calc(var(--dust-op) * 1.5);
          }
          50% {
            transform: translate(var(--dust-dx), var(--dust-dy)) scale(0.8);
            opacity: var(--dust-op);
          }
          75% {
            opacity: calc(var(--dust-op) * 0.5);
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: var(--dust-op);
          }
        }
      `}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 49, pointerEvents: 'none', overflow: 'hidden' }}>
        {particles.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: 'rgba(255, 252, 240, 0.9)',
              ['--dust-op' as string]: p.opacity,
              ['--dust-dx' as string]: `${p.dx}px`,
              ['--dust-dy' as string]: `${p.dy}px`,
              animation: `dust-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>
    </>
  )
})

export default DustParticles
