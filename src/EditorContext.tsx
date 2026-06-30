/**
 * EditorContext — global state for the in-browser visual editor.
 *
 * Provides:
 *  - isEditMode: toggles drag/resize handles on FigmaElement wrappers
 *  - history / historyIndex: full undo-redo stack for element transforms
 *  - dynamicElements: runtime-cloned components (duplicates, new additions)
 *  - saveLayouts: persists state to localStorage + JSON files via the Vite dev plugin
 *
 * Production builds always use the baked-in JSON from src/data/ — localStorage is dev-only.
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import defaultLayout from './data/defaultLayout.json'
import defaultDynamicElements from './data/defaultDynamicElements.json'

export interface ElementState {
  transform: string
  width?: string
  height?: string
  deleted: boolean
  zIndex?: number
  animationType?: string
  textAlign?: 'left' | 'center' | 'right'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  tiltEnabled?: boolean
  text?: string
}

export type HistoryState = Record<string, ElementState>

export interface DynamicElementData {
  id: string
  componentType: string
  props: any
  path?: string
}

export interface EditorContextType {
  isEditMode: boolean
  setIsEditMode: (mode: boolean) => void
  history: HistoryState[]
  historyIndex: number
  currentState: HistoryState
  commitChange: (figmaId: string, changes: Partial<ElementState>) => void
  undo: () => void
  redo: () => void
  deleteTarget: (figmaId: string) => void
  saveLayouts: () => void
  selectedFigmaId: string | null
  setSelectedFigmaId: (id: string | null) => void
  dynamicElements: DynamicElementData[]
  duplicateTarget: (figmaId: string) => void
  updateDynamicProps: (figmaId: string, newProps: any) => void
  addDynamicElement: (componentType: string, defaultProps?: any) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectedFigmaId, setSelectedFigmaId] = useState<string | null>(null)

  // Lazy initializers run once on first render — no useEffect needed for initialization.
  const [history, setHistory] = useState<HistoryState[]>(() => {
    try {
      if (!import.meta.env.DEV) return [defaultLayout as unknown as HistoryState]
      const saved = localStorage.getItem('figma_state_v4')
      if (saved) {
        const savedState = JSON.parse(saved) as HistoryState
        const merged = { ...defaultLayout } as unknown as HistoryState
        // Merge all saved keys — including elements not in defaultLayout (e.g. newly placed canvas elements)
        for (const key of Object.keys(savedState)) {
          merged[key] = { ...(merged[key] || {}), ...savedState[key] }
        }
        return [merged]
      }
    } catch (e) {
      console.error('Failed to parse saved layout', e)
    }
    return [defaultLayout as unknown as HistoryState]
  })

  const [dynamicElements, setDynamicElements] = useState<DynamicElementData[]>(() => {
    try {
      if (!import.meta.env.DEV) return defaultDynamicElements as unknown as DynamicElementData[]
      const saved = localStorage.getItem('figma_dynamic_elements')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse saved dynamic elements', e)
    }
    return defaultDynamicElements as unknown as DynamicElementData[]
  })

  const currentState = useMemo(() => history[historyIndex] || {}, [history, historyIndex])

  const commitChange = useCallback((figmaId: string, changes: Partial<ElementState>) => {
    console.log('[Editor] commitChange:', figmaId, changes)
    setHistory((prevHistory) => {
      // Slice history to current index to remove any "future" if we undo'd and then made a change
      const newHistory = prevHistory.slice(0, historyIndex + 1)
      const lastState = newHistory[newHistory.length - 1] || {}
      
      const elementCurrentState = lastState[figmaId] || { transform: '', deleted: false }
      
      const newState: HistoryState = {
        ...lastState,
        [figmaId]: {
          ...elementCurrentState,
          ...changes,
        }
      }
      
      newHistory.push(newState)
      return newHistory
    })
    setHistoryIndex((prev) => prev + 1)
  }, [historyIndex])

  const undo = useCallback(() => {
    setHistoryIndex((prev) => Math.max(0, prev - 1))
  }, [])

  const redo = useCallback(() => {
    setHistoryIndex((prev) => Math.min(history.length - 1, prev + 1))
  }, [history])

  const deleteTarget = useCallback((figmaId: string) => {
    commitChange(figmaId, { deleted: true })
    setSelectedFigmaId(null)
  }, [commitChange])

  const showToast = (msg: string, isError = false) => {
    const el = document.createElement('div')
    el.textContent = msg
    Object.assign(el.style, {
      position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
      background: isError ? '#b91c1c' : '#111', color: '#fff',
      padding: '10px 20px', borderRadius: '8px', fontSize: '13px',
      fontFamily: 'monospace', zIndex: '999999', opacity: '1',
      transition: 'opacity 0.4s ease', pointerEvents: 'none', whiteSpace: 'nowrap',
    })
    document.body.appendChild(el)
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 400) }, 2500)
  }

  const saveLayouts = useCallback(async () => {
    const stateToSave = history[historyIndex] || {}
    console.log('[Editor] saveLayouts called. Saving state:', stateToSave)

    // Save the full state locally for quick reloads
    localStorage.setItem('figma_state_v4', JSON.stringify(stateToSave))
    localStorage.setItem('figma_dynamic_elements', JSON.stringify(dynamicElements))

    if (import.meta.env.DEV) {
      try {
        const payload = {
          layout: stateToSave,
          dynamicElements: dynamicElements
        }
        const res = await fetch('/api/save-layout', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' }
        })
        if (res.ok) {
          showToast('Saved to code ✓')
        } else {
          showToast('Failed to bake layouts.', true)
        }
      } catch (e) {
        console.error(e)
        showToast('Error saving layout.', true)
      }
    } else {
      showToast('Saved locally ✓')
    }
  }, [history, historyIndex, dynamicElements])

  const duplicateTarget = useCallback((figmaId: string) => {
    const el = document.querySelector(`[data-figma-id="${figmaId}"]`) as HTMLElement
    if (!el) return

    const componentType = el.getAttribute('data-component-type')
    const componentPropsStr = el.getAttribute('data-component-props')
    
    if (!componentType) {
      showToast('Cannot duplicate: component type not tagged.', true)
      return
    }

    const componentProps = componentPropsStr ? JSON.parse(componentPropsStr) : {}
    const newId = `${figmaId}-clone-${Date.now()}`
    
    // Get current state to copy position
    const baseState = currentState[figmaId] || ({} as Partial<ElementState>)
    
    // Append a slight translation so the clone isn't exactly stacked
    let newTransform = baseState.transform || ''
    if (newTransform) {
      newTransform += ' translate(20px, 20px)'
    } else {
      newTransform = 'translate(20px, 20px)'
    }

    // Register dynamic element
    setDynamicElements(prev => {
      const updated = [...prev, { id: newId, componentType, props: componentProps, path: window.location.pathname }]
      localStorage.setItem('figma_dynamic_elements', JSON.stringify(updated))
      return updated
    })

    // Commit initial state for the clone
    commitChange(newId, { transform: newTransform, width: baseState.width, height: baseState.height, deleted: false })
    
    // Select the new clone
    setSelectedFigmaId(newId)
  }, [currentState, commitChange])

  const addDynamicElement = useCallback((componentType: string, defaultProps: any = {}) => {
    const newId = `${componentType.toLowerCase()}-new-${Date.now()}`
    
    setDynamicElements(prev => {
      const updated = [...prev, { id: newId, componentType, props: defaultProps, path: window.location.pathname }]
      // Don't persist MediaElement blobs — blob: URLs are session-only and large base64 crashes localStorage
      if (componentType !== 'MediaElement') {
        localStorage.setItem('figma_dynamic_elements', JSON.stringify(updated))
      }
      return updated
    })

    const cx = Math.round(window.scrollX + window.innerWidth / 2 - 200)
    const cy = Math.round(window.scrollY + window.innerHeight / 2 - 200)
    const newTransform = `translate(${cx}px, ${cy}px)`
    const defaultSize = componentType === 'MediaElement'
      ? { width: '400px', height: '400px' }
      : {}
    commitChange(newId, { transform: newTransform, deleted: false, zIndex: 100, ...defaultSize })
    
    setSelectedFigmaId(newId)
  }, [commitChange])

  const updateDynamicProps = useCallback((figmaId: string, newProps: any) => {
    setDynamicElements(prev => {
      const updated = prev.map(el => {
        if (el.id === figmaId) {
          return { ...el, props: { ...el.props, ...newProps } }
        }
        return el
      })
      localStorage.setItem('figma_dynamic_elements', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Global Keyboard Shortcuts
  useEffect(() => {
    if (!isEditMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Cmd/Ctrl + Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      // Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
      if (((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) || 
          ((e.metaKey || e.ctrlKey) && e.key === 'y')) {
        e.preventDefault()
        redo()
      }
      // Delete
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedFigmaId) {
        // Prevent deleting if typing in an input
        const tag = document.activeElement?.tagName.toLowerCase()
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault()
          deleteTarget(selectedFigmaId)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditMode, undo, redo, deleteTarget, selectedFigmaId])

  return (
    <EditorContext.Provider 
      value={{ 
        isEditMode, 
        setIsEditMode, 
        history, 
        historyIndex, 
        currentState,
        commitChange,
        undo,
        redo,
        deleteTarget,
        saveLayouts,
        selectedFigmaId,
        setSelectedFigmaId,
        dynamicElements,
        duplicateTarget,
        updateDynamicProps,
        addDynamicElement
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

// useEditor is a hook, not a component — fast-refresh doesn't apply to hooks.
// eslint-disable-next-line react-refresh/only-export-components
export function useEditor() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}
