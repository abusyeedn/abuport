/**
 * FlashlightOverlay.tsx
 *
 * Fixed overlay that simulates a flashlight beam centered on the viewport.
 * Uses a CSS radial-gradient for GPU-composited performance.
 *
 * Layers:
 *  1. Bright inner hotspot (fully transparent, ~200px radius)
 *  2. Mid falloff (gradual darken, ~350px)
 *  3. Near-darkness outer ring
 *  4. Very faint ambient so the wall isn't 100% black outside the beam
 */
import React from 'react'
import { useGameState } from './useGameState'

const FlashlightOverlay = React.memo(function FlashlightOverlay() {
  const { currentCase } = useGameState()

  // Switch on the tube lights! Hide flashlight mask during the finale.
  if (currentCase === 8) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
        background: `radial-gradient(
          circle at center,
          transparent 0%,
          transparent 15%,
          rgba(0, 0, 0, 0.03) 22%,
          rgba(0, 0, 0, 0.20) 30%,
          rgba(0, 0, 0, 0.45) 40%,
          rgba(0, 0, 0, 0.68) 50%,
          rgba(0, 0, 0, 0.78) 62%,
          rgba(0, 0, 0, 0.86) 75%,
          rgba(0, 0, 0, 0.90) 100%
        )`,
        mixBlendMode: 'normal',
      }}
    >
      {/* Bright warm yellow glow on the hotspot */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900,
        height: 900,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(254, 240, 138, 0.32) 0%, rgba(253, 224, 71, 0.16) 35%, rgba(234, 179, 8, 0.04) 60%, transparent 80%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
})

export default FlashlightOverlay
