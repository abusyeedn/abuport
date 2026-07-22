/**
 * HumanSilhouette.tsx
 *
 * Shared bust-outline component used by:
 *  - Case 01 (Memory Reconstruction) — evidence fills the silhouette as it's restored
 *  - Case 04 (Profile Reconstruction) — traits are dragged/placed into the silhouette
 *
 * Renders an SVG clip-path bust shape. Anything passed as `children`, positioned
 * absolutely inside `slots`, is clipped to only show within the silhouette.
 */
import React, { useMemo } from 'react'
import { SILHOUETTE_PATH, SILHOUETTE_VIEWBOX } from '../../data/caseFileData'

interface HumanSilhouetteProps {
  /** 0–1, how "lit" / complete the outline glow should look */
  progress: number
  width?: number
  height?: number
  accentColor?: string
  children?: React.ReactNode
}

/** Deterministic slot generator — spreads N items across the bust interior. */
export function generateSilhouetteSlots(count: number): { x: number; y: number }[] {
  const slots: { x: number; y: number }[] = []

  // Head ring — up to 6 slots around the head circle (cx 200, cy 150, r ~70)
  const headCount = Math.min(count, 6)
  for (let i = 0; i < headCount; i++) {
    const angle = (i / headCount) * Math.PI * 2 - Math.PI / 2
    slots.push({
      x: 200 + Math.cos(angle) * 55,
      y: 150 + Math.sin(angle) * 55,
    })
  }

  // Shoulder grid — remaining items, 4 columns, spread y 280–470
  const remaining = count - headCount
  const cols = 4
  for (let i = 0; i < remaining; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    const rowCount = Math.min(cols, remaining - row * cols)
    const spanStart = 200 - (rowCount - 1) * 35
    slots.push({
      x: spanStart + col * 70,
      y: 300 + row * 60,
    })
  }

  return slots
}

const HumanSilhouette = React.memo(function HumanSilhouette({
  progress,
  width = 500,
  height = 625,
  accentColor = '#dc2626',
  children,
}: HumanSilhouetteProps) {
  const clipId = useMemo(() => `silhouette-clip-${Math.random().toString(36).slice(2, 9)}`, [])

  return (
    <div style={{ position: 'relative', width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={SILHOUETTE_VIEWBOX}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={SILHOUETTE_PATH} />
          </clipPath>
          <radialGradient id={`${clipId}-glow`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={0.35 * progress} />
            <stop offset="100%" stopColor={accentColor} stopOpacity={0.02} />
          </radialGradient>
        </defs>

        {/* Ambient glow fill, brightens with progress */}
        <path d={SILHOUETTE_PATH} fill={`url(#${clipId}-glow)`} />

        {/* Outline — always visible as a guide */}
        <path
          d={SILHOUETTE_PATH}
          fill="none"
          stroke={accentColor}
          strokeWidth={2}
          strokeDasharray="6 5"
          opacity={0.25 + progress * 0.5}
        />

        {/* Clipped content layer */}
        <g clipPath={`url(#${clipId})`}>
          <foreignObject x={0} y={0} width={400} height={500}>
            <div
              // @ts-expect-error -- xmlns required for foreignObject content
              xmlns="http://www.w3.org/1999/xhtml"
              style={{ position: 'relative', width: 400, height: 500 }}
            >
              {children}
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  )
})

export default HumanSilhouette
