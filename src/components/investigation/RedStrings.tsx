/**
 * RedStrings.tsx
 *
 * SVG overlay that draws red strings connecting evidence zones.
 * Each string has a slight sag via quadratic bezier curves.
 */
import React, { useMemo } from 'react'
import { wallRedStrings, WORLD_WIDTH, WORLD_HEIGHT } from '../../data/caseFileData'

const RedStrings = React.memo(function RedStrings() {
  const paths = useMemo(() => {
    return wallRedStrings.map((s, i) => {
      // Sag control point — midpoint with downward offset
      const mx = (s.fromX + s.toX) / 2
      const my = (s.fromY + s.toY) / 2 + Math.abs(s.toX - s.fromX) * 0.08 + 20

      return (
        <path
          key={i}
          d={`M ${s.fromX} ${s.fromY} Q ${mx} ${my} ${s.toX} ${s.toY}`}
          fill="none"
          stroke="#dc2626"
          strokeWidth={1.5}
          opacity={0.6}
          strokeLinecap="round"
          strokeDasharray="4 2"
        />
      )
    })
  }, [])

  return (
    <svg
      width={WORLD_WIDTH}
      height={WORLD_HEIGHT}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 15,
      }}
    >
      {paths}
    </svg>
  )
})

export default RedStrings
