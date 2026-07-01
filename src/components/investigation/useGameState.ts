/**
 * useGameState.ts
 *
 * React context + hook managing the investigation progression system.
 * Tracks which clues have been found, which cases are complete,
 * and overall progress. Persisted to localStorage.
 */
import React, { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from 'react'
import { caseFiles } from '../../data/caseFileData'

// ── Types ──────────────────────────────────────────────────────────────────────

interface CaseProgress {
  solved: boolean
  cluesFound: Set<string>
}

interface GameState {
  /** 0 = intro, 1–7 = cases, 8 = finale */
  currentCase: number
  caseProgress: Map<number, CaseProgress>
  /** Overall percentage 0–100 */
  totalProgress: number
  /** Whether the intro has been seen */
  introSeen: boolean
  /** Active modal clue ID (null = no modal open) */
  activeClueId: string | null
  /** Active case modal (for case-specific interactive screens) */
  activeCaseModal: number | null
  /** Target case we are panning to (for transitions) */
  transitioningTo: number | null
  /** Active objective modal displaying when starting a case */
  activeCaseObjectiveModal: number | null
}

interface GameActions {
  markClueFound: (caseId: number, clueId: string) => void
  completeCase: (caseId: number) => void
  setCurrentCase: (caseId: number) => void
  setIntroSeen: () => void
  openClue: (clueId: string) => void
  closeClue: () => void
  openCaseModal: (caseId: number) => void
  closeCaseModal: () => void
  isCaseUnlocked: (caseId: number) => boolean
  getClueCount: (caseId: number) => number
  isClueFound: (clueId: string) => boolean
  resetProgress: () => void
  advanceCase: () => void
  closeObjectiveModal: () => void
}

type GameContextValue = GameState & GameActions

// ── localStorage helpers ───────────────────────────────────────────────────────

const STORAGE_KEY = 'abu-investigation-progress'

interface SerializedState {
  currentCase: number
  introSeen: boolean
  caseProgress: Record<number, { solved: boolean; cluesFound: string[] }>
}

function loadState(): SerializedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveState(state: GameState) {
  const serialized: SerializedState = {
    currentCase: state.currentCase,
    introSeen: state.introSeen,
    caseProgress: {},
  }
  state.caseProgress.forEach((val, key) => {
    serialized.caseProgress[key] = {
      solved: val.solved,
      cluesFound: Array.from(val.cluesFound),
    }
  })
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized))
  } catch { /* quota exceeded, ignore */ }
}

function createInitialState(): GameState {
  const caseProgress = new Map<number, CaseProgress>()
  caseFiles.forEach(c => {
    caseProgress.set(c.id, { solved: false, cluesFound: new Set() })
  })

  return {
    currentCase: 0,
    caseProgress,
    totalProgress: 0,
    introSeen: false,
    activeClueId: null,
    activeCaseModal: null,
    transitioningTo: null,
    activeCaseObjectiveModal: null,
  }
}

function computeTotalProgress(progress: Map<number, CaseProgress>): number {
  let totalCluesRequired = 0
  let totalCluesFound = 0

  caseFiles.forEach(cf => {
    totalCluesRequired += cf.requiredClues
    const cp = progress.get(cf.id)
    if (cp) {
      totalCluesFound += Math.min(cp.cluesFound.size, cf.requiredClues)
    }
  })

  if (totalCluesRequired === 0) return 0
  return Math.round((totalCluesFound / totalCluesRequired) * 100)
}

// ── Context ────────────────────────────────────────────────────────────────────

const GameContext = createContext<GameContextValue | null>(null)

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(createInitialState)

  // Persist to localStorage on state changes (except transient modal state)
  useEffect(() => {
    saveState(state)
  }, [state])

  const markClueFound = useCallback((caseId: number, clueId: string) => {
    setState(prev => {
      const cp = prev.caseProgress.get(caseId)
      if (!cp || cp.cluesFound.has(clueId)) return prev

      const newCluesFound = new Set(cp.cluesFound)
      newCluesFound.add(clueId)

      const cf = caseFiles.find(c => c.id === caseId)
      const solved = cf ? newCluesFound.size >= cf.requiredClues : false

      const newProgress = new Map(prev.caseProgress)
      newProgress.set(caseId, { solved, cluesFound: newCluesFound })

      return {
        ...prev,
        caseProgress: newProgress,
        totalProgress: computeTotalProgress(newProgress),
      }
    })
  }, [])

  const completeCase = useCallback((caseId: number) => {
    setState(prev => {
      const newProgress = new Map(prev.caseProgress)
      const cp = newProgress.get(caseId)
      if (cp) newProgress.set(caseId, { ...cp, solved: true })

      const nextCase = caseId < 7 ? caseId + 1 : 8

      return {
        ...prev,
        caseProgress: newProgress,
        totalProgress: computeTotalProgress(newProgress),
        transitioningTo: nextCase
      }
    })
  }, [])

  const advanceCase = useCallback(() => {
    setState(prev => {
      if (prev.transitioningTo === null) return prev
      return {
        ...prev,
        currentCase: prev.transitioningTo,
        transitioningTo: null,
        activeCaseObjectiveModal: prev.transitioningTo
      }
    })
  }, [])

  const closeObjectiveModal = useCallback(() => {
    setState(prev => ({ ...prev, activeCaseObjectiveModal: null }))
  }, [])

  const setCurrentCase = useCallback((caseId: number) => {
    setState(prev => ({ ...prev, currentCase: caseId }))
  }, [])

  const setIntroSeen = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      introSeen: true, 
      currentCase: 1,
      activeCaseObjectiveModal: 1 
    }))
  }, [])

  const openClue = useCallback((clueId: string) => {
    setState(prev => ({ ...prev, activeClueId: clueId }))
  }, [])

  const closeClue = useCallback(() => {
    setState(prev => ({ ...prev, activeClueId: null }))
  }, [])

  const openCaseModal = useCallback((caseId: number) => {
    setState(prev => ({ ...prev, activeCaseModal: caseId }))
  }, [])

  const closeCaseModal = useCallback(() => {
    setState(prev => ({ ...prev, activeCaseModal: null }))
  }, [])

  const isCaseUnlocked = useCallback((caseId: number): boolean => {
    if (caseId === 1) return true // First case always unlocked
    // Each case requires the previous one to be solved
    const prevCase = state.caseProgress.get(caseId - 1)
    return prevCase?.solved ?? false
  }, [state.caseProgress])

  const getClueCount = useCallback((caseId: number): number => {
    return state.caseProgress.get(caseId)?.cluesFound.size ?? 0
  }, [state.caseProgress])

  const isClueFound = useCallback((clueId: string): boolean => {
    for (const [, cp] of state.caseProgress) {
      if (cp.cluesFound.has(clueId)) return true
    }
    return false
  }, [state.caseProgress])

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(createInitialState())
  }, [])

  const value: GameContextValue = {
    ...state,
    markClueFound,
    completeCase,
    setCurrentCase,
    setIntroSeen,
    openClue,
    closeClue,
    openCaseModal,
    closeCaseModal,
    isCaseUnlocked,
    getClueCount,
    isClueFound,
    resetProgress,
    advanceCase,
    closeObjectiveModal,
    activeCaseObjectiveModal: state.activeCaseObjectiveModal,
  }

  return React.createElement(GameContext.Provider, { value }, children)
}

export function useGameState(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGameState must be used within GameStateProvider')
  return ctx
}
