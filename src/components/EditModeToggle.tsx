import React from 'react'
import { useEditor } from '../EditorContext'

const Sep = () => (
  <div style={{ width: 1, height: 24, background: 'rgba(0,0,0,0.15)', flexShrink: 0, margin: '0 2px' }} />
)

/**
 * Line-height field. Keeps what you're typing in local state rather than driving
 * the input straight off the committed value — otherwise a half-typed "2." gets
 * parsed to 2 and written back into the box mid-keystroke, which fights you.
 * Only valid numbers are committed; clearing the box removes the override.
 */
function LineHeightInput({ value, onChange }: { value?: number; onChange: (v: number | undefined) => void }) {
  const [draft, setDraft] = React.useState(value === undefined ? '' : String(value))

  // Follow external changes (undo/redo, drag on the slider, reselect)
  React.useEffect(() => {
    setDraft(value === undefined ? '' : String(value))
  }, [value])

  return (
    <input
      type="text"
      inputMode="decimal"
      placeholder="auto"
      value={draft}
      onChange={e => {
        const raw = e.target.value
        setDraft(raw)
        if (raw.trim() === '') { onChange(undefined); return }
        const n = Number(raw)
        if (!Number.isNaN(n) && n > 0) onChange(n)
      }}
      title="Line height (unitless multiplier) — blank for auto"
      style={{
        width: 46, border: '1px solid #cbd5e1', borderRadius: 4,
        padding: '3px 5px', fontSize: 12, fontFamily: 'inherit',
        color: '#334155', background: '#fff', outline: 'none',
      }}
    />
  )
}

export default function EditModeToggle() {
  const {
    isEditMode,
    setIsEditMode,
    saveLayouts,
    undo,
    redo,
    deleteTarget,
    selectedFigmaId,
    historyIndex,
    history,
    dynamicElements,
    duplicateTarget,
    updateDynamicProps,
    commitChange,
    currentState,
    addDynamicElement,
    isMobileBand
  } = useEditor()

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  // Align buttons only have a visible effect if the wrapper has room to
  // redistribute content in (it otherwise shrink-wraps to `max-content`).
  // If the element hasn't been resized yet, give it breathing room the
  // first time an align button is clicked so the change is actually visible.
  const applyAlign = (figmaId: string, changes: { textAlign?: 'left' | 'center' | 'right'; verticalAlign?: 'top' | 'middle' | 'bottom' }) => {
    const state = currentState[figmaId]
    const sizeChanges: { width?: string; height?: string } = {}

    if (!state?.width || !state?.height) {
      const el = document.querySelector(`[data-figma-id="${figmaId}"]`) as HTMLElement | null
      if (el) {
        const rect = el.getBoundingClientRect()
        if (!state?.width) sizeChanges.width = `${Math.max(Math.round(rect.width * 1.6), 220)}px`
        if (!state?.height) sizeChanges.height = `${Math.max(Math.round(rect.height * 1.6), 100)}px`
      }
    }

    commitChange(figmaId, { ...changes, ...sizeChanges })
  }

  const base: React.CSSProperties = {
    padding: '5px 10px',
    fontSize: '0.72rem',
    fontWeight: 700,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    lineHeight: 1.4,
    boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
  }

  const ghost: React.CSSProperties = { ...base, background: '#f1f5f9', color: '#334155' }
  const blue: React.CSSProperties  = { ...base, background: '#3b82f6', color: '#fff' }
  const green: React.CSSProperties = { ...base, background: '#10b981', color: '#fff' }
  const red: React.CSSProperties   = { ...base, background: '#ef4444', color: '#fff' }

  if (import.meta.env.PROD) return null

  const selEl = dynamicElements.find(e => e.id === selectedFigmaId)
  const isTooltip = !!selEl && selEl.componentType === 'HintTooltip'
  const isDynamic = !!selEl

  return (
    <div
      id="edit-mode-toolbar"
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 10003,
        background: 'transparent',
        borderTop: 'none',
        padding: '7px 14px',
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none',
      }}
    >
      <style>{`#edit-mode-toolbar::-webkit-scrollbar{display:none}`}</style>

      {isEditMode && (
        <>
          {isMobileBand && (
            <div style={{ ...base, background: '#f59e0b', color: '#000', cursor: 'default' }} title="Edits here only apply to 375–768px viewports">
              📱 Editing Mobile (375–768px)
            </div>
          )}

          {/* History */}
          <button onClick={undo} disabled={!canUndo} title="Undo (Cmd+Z)"
            style={{ ...ghost, opacity: canUndo ? 1 : 0.35, cursor: canUndo ? 'pointer' : 'not-allowed' }}>
            ↩ Undo
          </button>
          <button onClick={redo} disabled={!canRedo} title="Redo (Cmd+Shift+Z)"
            style={{ ...ghost, opacity: canRedo ? 1 : 0.35, cursor: canRedo ? 'pointer' : 'not-allowed' }}>
            ↪ Redo
          </button>

          {selectedFigmaId && (
            <>
              <Sep />

              {/* Selection actions */}
              <button onClick={() => duplicateTarget(selectedFigmaId)} title="Duplicate" style={blue}>⧉ Dupe</button>

              {/* Z-index */}
              <button onClick={() => commitChange(selectedFigmaId, { zIndex: (currentState[selectedFigmaId]?.zIndex ?? 100) + 10 })} title="Bring Forward" style={ghost}>↑ Front</button>
              <button onClick={() => commitChange(selectedFigmaId, { zIndex: Math.max(0, (currentState[selectedFigmaId]?.zIndex ?? 100) - 10) })} title="Send Back" style={ghost}>↓ Back</button>

              {/* Align H */}
              <div style={{ display: 'flex', gap: 2, background: 'rgba(0,0,0,0.06)', borderRadius: 5, padding: 2 }}>
                {(['left','center','right'] as const).map(a => (
                  <button key={a} onClick={() => applyAlign(selectedFigmaId, { textAlign: a })} title={`Align ${a}`}
                    style={{ ...base, background: currentState[selectedFigmaId]?.textAlign === a ? '#3b82f6' : '#f1f5f9', color: currentState[selectedFigmaId]?.textAlign === a ? '#fff' : '#334155', padding: '4px 8px' }}>
                    {a === 'left' ? '⫷' : a === 'center' ? '≡' : '⫸'}
                  </button>
                ))}
              </div>

              {/* Align V */}
              <div style={{ display: 'flex', gap: 2, background: 'rgba(0,0,0,0.06)', borderRadius: 5, padding: 2 }}>
                {(['top','middle','bottom'] as const).map(v => (
                  <button key={v} onClick={() => applyAlign(selectedFigmaId, { verticalAlign: v })} title={`Vertical ${v}`}
                    style={{ ...base, background: currentState[selectedFigmaId]?.verticalAlign === v ? '#3b82f6' : '#f1f5f9', color: currentState[selectedFigmaId]?.verticalAlign === v ? '#fff' : '#334155', padding: '4px 8px' }}>
                    {v === 'top' ? '⤒' : v === 'middle' ? '⇕' : '⤓'}
                  </button>
                ))}
              </div>

              {/* Line height — unitless so it scales with the element's own font
                  size. 0 / empty clears the override and falls back to the CSS. */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 5, padding: '2px 6px' }}>
                <span title="Line height" style={{ fontSize: 12, color: '#334155', lineHeight: 1 }}>↕≡</span>
                <LineHeightInput
                  key={selectedFigmaId}
                  value={currentState[selectedFigmaId]?.lineHeight}
                  onChange={v => commitChange(selectedFigmaId, { lineHeight: v })}
                />
                <input
                  type="range"
                  min={0.8}
                  max={3}
                  step={0.05}
                  value={currentState[selectedFigmaId]?.lineHeight ?? 1.5}
                  onChange={e => commitChange(selectedFigmaId, { lineHeight: Number(e.target.value) })}
                  title="Drag to change line height"
                  style={{ width: 70, accentColor: '#3b82f6', cursor: 'pointer' }}
                />
              </div>

              {/* Tilt */}
              <button
                onClick={() => commitChange(selectedFigmaId, { tiltEnabled: !(currentState[selectedFigmaId]?.tiltEnabled ?? false) })}
                title="Toggle 3D tilt"
                style={{ ...base, background: currentState[selectedFigmaId]?.tiltEnabled ? '#f59e0b' : '#f1f5f9', color: currentState[selectedFigmaId]?.tiltEnabled ? '#000' : '#334155' }}>
                ✦ Tilt
              </button>

              {/* Scroll anim */}
              <select
                value={currentState[selectedFigmaId]?.animationType || 'none'}
                onChange={e => {
                  const val = e.target.value
                  commitChange(selectedFigmaId, { animationType: val })
                  if (isDynamic) updateDynamicProps(selectedFigmaId, { animationType: val })
                }}
                title="Scroll animation"
                style={{ ...blue, padding: '5px 8px', outline: 'none', fontFamily: 'inherit', WebkitAppearance: 'none', appearance: 'none' }}
              >
                <option value="none">No Anim</option>
                <option value="fade">Fade</option>
                <option value="pop">Pop</option>
                <option value="blur">Blur</option>
                <option value="slide-left">Slide ←</option>
                <option value="slide-right">Slide →</option>
              </select>

              {/* Edit text (dynamic or celestial-chat-button) */}
              {(isDynamic || selectedFigmaId === 'celestial-chat-button') && (
                <button
                  onClick={() => {
                    if (selectedFigmaId === 'celestial-chat-button') {
                      const currentVal = currentState['celestial-chat-button']?.text || "Ask Abu's AI"
                      const newText = prompt('Edit text:', currentVal)
                      if (newText !== null) {
                        commitChange('celestial-chat-button', { text: newText })
                      }
                      return
                    }
                    if (!selEl) return
                    
                    if (selEl.componentType === 'CelestialChatButton') {
                      const currentVal = selEl.props.text || currentState[selectedFigmaId]?.text || "Ask Abu's AI"
                      const newText = prompt('Edit text:', currentVal)
                      if (newText !== null) {
                        updateDynamicProps(selectedFigmaId, { text: newText })
                        commitChange(selectedFigmaId, { text: newText })
                      }
                      return
                    }

                    const currentVal = selEl.props.text !== undefined ? selEl.props.text : selEl.props.children
                    if (currentVal === undefined) { alert('No text prop on this component.'); return }
                    const newText = prompt('Edit text:', currentVal)
                    if (newText !== null) updateDynamicProps(selectedFigmaId, selEl.props.text !== undefined ? { text: newText } : { children: newText })
                  }}
                  title="Edit text content"
                  style={blue}>
                  ✎ Text
                </button>
              )}

              {/* Tooltip-specific controls */}
              {isTooltip && (
                <>
                  <Sep />
                  <button
                    onClick={() => {
                      const styles = ['curved','straight','scribble']
                      const cur = selEl.props.arrowStyle || 'curved'
                      updateDynamicProps(selectedFigmaId, { arrowStyle: styles[(styles.indexOf(cur) + 1) % styles.length] })
                    }}
                    title="Cycle arrow style" style={ghost}>
                    ⤿ {selEl.props.arrowStyle || 'curved'}
                  </button>
                  <button
                    onClick={() => {
                      const positions = ['right','bottom','left','top']
                      const cur = selEl.props.arrowPosition || 'right'
                      updateDynamicProps(selectedFigmaId, { arrowPosition: positions[(positions.indexOf(cur) + 1) % positions.length] })
                    }}
                    title="Cycle arrow position" style={ghost}>
                    ⟲ {selEl.props.arrowPosition || 'right'}
                  </button>
                  <button
                    onClick={() => updateDynamicProps(selectedFigmaId, { showArrow: !(selEl.props.showArrow !== false) })}
                    title="Toggle arrow"
                    style={{ ...ghost, opacity: selEl.props.showArrow === false ? 0.45 : 1 }}>
                    {selEl.props.showArrow === false ? '— Arrow' : '↗ Arrow'}
                  </button>
                  <div style={{ ...ghost, position: 'relative', overflow: 'hidden' }} title="Pick color">
                    ● Color
                    <input type="color" value={selEl.props.color || '#555555'}
                      onChange={e => updateDynamicProps(selectedFigmaId, { color: e.target.value })}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                  </div>
                  <button
                    onClick={() => {
                      const weights = [300,400,500,600,700]
                      const cur = selEl.props.fontWeight || 400
                      updateDynamicProps(selectedFigmaId, { fontWeight: weights[(weights.indexOf(cur) + 1) % weights.length] })
                    }}
                    title="Cycle font weight"
                    style={{ ...ghost, fontWeight: selEl.props.fontWeight || 400 }}>
                    W{selEl.props.fontWeight || 400}
                  </button>
                </>
              )}

              <Sep />

              {/* Delete */}
              <button
                onClick={() => { if (window.confirm('Delete this element?')) deleteTarget(selectedFigmaId) }}
                title="Delete (Backspace)" style={red}>
                ⌫ Delete
              </button>
            </>
          )}

          <Sep />

          {/* Add elements */}
          <label style={{ ...green, position: 'relative', overflow: 'hidden' }} title="Import image or video">
            ⬆ Media
            <input type="file" accept="image/*,video/*"
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return
                addDynamicElement('MediaElement', { src: URL.createObjectURL(file), mediaType: file.type.startsWith('video/') ? 'video' : 'image', objectFit: 'contain' })
                e.target.value = ''
              }} />
          </label>
          <button onClick={() => addDynamicElement('HintTooltip', { text: 'New tip!', arrowStyle: 'curved', arrowPosition: 'right' })} title="Add tooltip" style={green}>+ Tooltip</button>
          <button onClick={() => addDynamicElement('TiltCard', { image: { src: '/hero1.png', alt: 'Image' }, tiltFactor: 8, glareEffect: true, glareIntensity: 0.3, borderRadius: 24 })} title="Add tilt card" style={green}>+ Tilt</button>

          <Sep />

          {/* Globals */}
          <button onClick={() => { if (window.confirm('Wipe local layout and restore defaults?')) { localStorage.removeItem('figma_state_v4'); localStorage.removeItem('figma_mobile_state_v1'); localStorage.removeItem('figma_dynamic_elements'); window.location.reload() } }} style={red}>↺ Reset</button>
          <button onClick={saveLayouts} style={green}>✓ Save</button>
          <button onClick={() => setIsEditMode(false)} style={blue}>✕ Exit</button>
        </>
      )}

      {!isEditMode && (
        <button onClick={() => setIsEditMode(true)} style={blue}>✎ Edit Mode</button>
      )}
    </div>
  )
}
