/**
 * useCameraController.ts
 *
 * Custom hook for smooth WASD camera movement with snapping,
 * smooth Q/E + scroll zoom, and imperative zone navigation.
 */
import { useEffect, useRef, useCallback, useMemo } from 'react'
import { 
  WORLD_WIDTH, 
  WORLD_HEIGHT, 
  case01Clues, 
  case02Concepts, 
  case03Objects, 
  case05Projects, 
  case06Milestones, 
  caseFiles 
} from '../../data/caseFileData'
import { useGameState } from './useGameState'

interface SnappableItem {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export default function useCameraController(
  worldRef: React.RefObject<HTMLDivElement | null>,
  viewportWidth: number,
  viewportHeight: number,
) {
  const { currentCase } = useGameState()

  // Dynamically compute the active case's snappable items to prevent WASD jumping across the entire wall
  const allItems = useMemo((): SnappableItem[] => {
    const cf = caseFiles.find(c => c.id === currentCase)
    if (!cf) return []

    // If case is 1, snap only to Case 1 clues (absolute coordinates)
    if (currentCase === 1) {
      return case01Clues.map(clue => ({
        id: clue.id,
        x: cf.zone.x + clue.x,
        y: cf.zone.y + clue.y,
        width: clue.width,
        height: clue.height,
      }))
    }

    if (currentCase === 2) {
      // Return a single snap point at the center of the zone so WASD does not jump between cards
      return [{
        id: 'case-2-center',
        x: cf.zone.x + cf.zone.width / 2 - 80,
        y: cf.zone.y + cf.zone.height / 2 - 60,
        width: 160,
        height: 120,
      }]
    }

    if (currentCase === 3) {
      return case03Objects.map(obj => ({
        id: obj.id,
        x: cf.zone.x + 200 + obj.finalX,
        y: cf.zone.y + 250 + obj.finalY,
        width: 100,
        height: 100,
      }))
    }

    if (currentCase === 5) {
      return case05Projects.map((proj, i) => ({
        id: proj.id,
        x: cf.zone.x + 200 + i * 350 + ((i % 2) * 100),
        y: cf.zone.y + 300 + (i % 2 === 0 ? 100 : 400),
        width: 240,
        height: 320,
      }))
    }

    if (currentCase === 6) {
      return case06Milestones.map((m, i) => ({
        id: m.id,
        x: cf.zone.x + 200 + i * 200,
        y: cf.zone.y + 220,
        width: 180,
        height: 180,
      }))
    }

    // Default: just snap to the zone center
    return [{
      id: `zone-${currentCase}`,
      x: cf.zone.x + cf.zone.width / 2 - 50,
      y: cf.zone.y + cf.zone.height / 2 - 50,
      width: 100,
      height: 100,
    }]
  }, [currentCase])

  // Track the active item
  const activeItemRef = useRef<SnappableItem | null>(null)

  // Track the focal point (center of the screen in unscaled world coordinates)
  const focalX = useRef(WORLD_WIDTH / 2)
  const focalY = useRef(WORLD_HEIGHT / 2)
  const targetFocalX = useRef(WORLD_WIDTH / 2)
  const targetFocalY = useRef(WORLD_HEIGHT / 2)

  // Sync active item when case changes
  useEffect(() => {
    if (allItems.length > 0) {
      const first = allItems[0]
      activeItemRef.current = first
      
      // Let the first case load center on its initial items
      targetFocalX.current = first.x + first.width / 2
      targetFocalY.current = first.y + first.height / 2
      focalX.current = first.x + first.width / 2
      focalY.current = first.y + first.height / 2
    }
  }, [allItems])

  // Zoom scale state
  const minZoom = useMemo(() => {
    return Math.max(viewportWidth / WORLD_WIDTH, viewportHeight / WORLD_HEIGHT)
  }, [viewportWidth, viewportHeight])

  const zoom = useRef(0.7)
  const targetZoom = useRef(0.7)
  const raf = useRef<number>(0)
  const keys = useRef<Set<string>>(new Set())

  // Expose imperative navigation API
  const navigateToZone = useCallback((x: number, y: number, newZoom: number = 0.8) => {
    targetFocalX.current = x
    targetFocalY.current = y
    targetZoom.current = newZoom
  }, [])

  // Move function: find next item in the given direction within the restricted case items
  const jumpToNextItem = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const current = activeItemRef.current
    if (!current || allItems.length === 0) return

    const cx = current.x + current.width / 2
    const cy = current.y + current.height / 2

    let bestCandidate: SnappableItem | null = null
    let lowestScore = Infinity

    for (const item of allItems) {
      if (item.id === current.id) continue

      const tx = item.x + item.width / 2
      const ty = item.y + item.height / 2

      let isValid = false
      const dist = Math.sqrt((tx - cx) ** 2 + (ty - cy) ** 2)
      let offset = 0

      if (direction === 'up' && ty < cy - 15) {
        isValid = true
        offset = Math.abs(tx - cx)
      } else if (direction === 'down' && ty > cy + 15) {
        isValid = true
        offset = Math.abs(tx - cx)
      } else if (direction === 'left' && tx < cx - 15) {
        isValid = true
        offset = Math.abs(ty - cy)
      } else if (direction === 'right' && tx > cx + 15) {
        isValid = true
        offset = Math.abs(ty - cy)
      }

      if (isValid) {
        const score = dist + offset * 1.6
        if (score < lowestScore) {
          lowestScore = score
          bestCandidate = item
        }
      }
    }

    if (bestCandidate) {
      activeItemRef.current = bestCandidate
      targetFocalX.current = (bestCandidate as SnappableItem).x + (bestCandidate as SnappableItem).width / 2
      targetFocalY.current = (bestCandidate as SnappableItem).y + (bestCandidate as SnappableItem).height / 2
    }
  }, [allItems])

  // Key handlers
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()

      if (['q', 'e'].includes(k)) {
        e.preventDefault()
        keys.current.add(k)
        return
      }

      if (currentCase === 3) {
        if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
          e.preventDefault()
          keys.current.add(k)
          return
        }
      }

      if (k === 'w' || e.key === 'ArrowUp') {
        e.preventDefault()
        jumpToNextItem('up')
      } else if (k === 's' || e.key === 'ArrowDown') {
        e.preventDefault()
        jumpToNextItem('down')
      } else if (k === 'a' || e.key === 'ArrowLeft') {
        e.preventDefault()
        jumpToNextItem('left')
      } else if (k === 'd' || e.key === 'ArrowRight') {
        e.preventDefault()
        jumpToNextItem('right')
      }
    }

    const up = (e: KeyboardEvent) => {
      keys.current.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [jumpToNextItem, currentCase])

  // Wheel zoom listener
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const factor = e.deltaY < 0 ? 1.08 : 0.92
      targetZoom.current = Math.max(minZoom, Math.min(2.0, targetZoom.current * factor))
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [minZoom])

  // Frame loop
  const tick = useCallback(() => {
    const k = keys.current

    // Smooth zoom interpolation
    zoom.current += (targetZoom.current - zoom.current) * 0.1

    // Apply Q/E keyboard zoom
    if (k.has('q')) {
      targetZoom.current = Math.max(minZoom, targetZoom.current - 0.015)
    }
    if (k.has('e')) {
      targetZoom.current = Math.min(2.0, targetZoom.current + 0.015)
    }

    // Free camera WASD pan inside Case 3
    if (currentCase === 3) {
      const panSpeed = 16 / zoom.current // Speed adjusts depending on zoom
      if (k.has('w') || k.has('arrowup')) {
        targetFocalY.current = Math.max(0, targetFocalY.current - panSpeed)
      }
      if (k.has('s') || k.has('arrowdown')) {
        targetFocalY.current = Math.min(WORLD_HEIGHT, targetFocalY.current + panSpeed)
      }
      if (k.has('a') || k.has('arrowleft')) {
        targetFocalX.current = Math.max(0, targetFocalX.current - panSpeed)
      }
      if (k.has('d') || k.has('arrowright')) {
        targetFocalX.current = Math.min(WORLD_WIDTH, targetFocalX.current + panSpeed)
      }
    }

    // Smoothly ease current focal point toward target
    focalX.current += (targetFocalX.current - focalX.current) * 0.08
    focalY.current += (targetFocalY.current - focalY.current) * 0.08

    // Clamp focal points to bounds to prevent board showing borders
    const minFx = viewportWidth / (2 * zoom.current)
    const maxFx = WORLD_WIDTH - viewportWidth / (2 * zoom.current)
    focalX.current = Math.max(minFx, Math.min(maxFx, focalX.current))

    const minFy = viewportHeight / (2 * zoom.current)
    const maxFy = WORLD_HEIGHT - viewportHeight / (2 * zoom.current)
    focalY.current = Math.max(minFy, Math.min(maxFy, focalY.current))

    // Calculate translation in screen pixels to center the focal point
    const tx = viewportWidth / 2 - zoom.current * focalX.current
    const ty = viewportHeight / 2 - zoom.current * focalY.current

    // Apply transform imperatively
    if (worldRef.current) {
      worldRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${zoom.current})`
      worldRef.current.style.transformOrigin = '0 0'
    }

    raf.current = requestAnimationFrame(tick)
  }, [viewportWidth, viewportHeight, worldRef, minZoom, currentCase])

  // Start tick loop
  useEffect(() => {
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [tick])

  return { targetFocalX, navigateToZone }
}
