import React from 'react'
import { useEditor } from '../EditorContext'

const Sep = () => (
  <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)', flexShrink: 0, margin: '0 2px' }} />
)

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
    addDynamicElement
  } = useEditor()

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const base: React.CSSProperties = {
    padding: '5px 10px',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    lineHeight: 1.4,
  }

  const ghost: React.CSSProperties = { ...base, background: 'rgba(255,255,255,0.1)' }
  const blue: React.CSSProperties  = { ...base, background: '#3b82f6' }
  const green: React.CSSProperties = { ...base, background: '#10b981' }
  const red: React.CSSProperties   = { ...base, background: '#ef4444' }

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
              <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 5, padding: 2 }}>
                {(['left','center','right'] as const).map(a => (
                  <button key={a} onClick={() => commitChange(selectedFigmaId, { textAlign: a })} title={`Align ${a}`}
                    style={{ ...base, background: currentState[selectedFigmaId]?.textAlign === a ? '#3b82f6' : 'rgba(255,255,255,0.1)', padding: '4px 8px' }}>
                    {a === 'left' ? '⫷' : a === 'center' ? '≡' : '⫸'}
                  </button>
                ))}
              </div>

              {/* Align V */}
              <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 5, padding: 2 }}>
                {(['top','middle','bottom'] as const).map(v => (
                  <button key={v} onClick={() => commitChange(selectedFigmaId, { verticalAlign: v })} title={`Vertical ${v}`}
                    style={{ ...base, background: currentState[selectedFigmaId]?.verticalAlign === v ? '#3b82f6' : 'rgba(255,255,255,0.1)', padding: '4px 8px' }}>
                    {v === 'top' ? '⤒' : v === 'middle' ? '⇕' : '⤓'}
                  </button>
                ))}
              </div>

              {/* Tilt */}
              <button
                onClick={() => commitChange(selectedFigmaId, { tiltEnabled: !(currentState[selectedFigmaId]?.tiltEnabled ?? false) })}
                title="Toggle 3D tilt"
                style={{ ...base, background: currentState[selectedFigmaId]?.tiltEnabled ? '#f59e0b' : 'rgba(255,255,255,0.1)', color: currentState[selectedFigmaId]?.tiltEnabled ? '#000' : '#fff' }}>
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
          <button onClick={() => addDynamicElement('CelestialChatButton')} title="Add Chat button" style={green}>+ Chat</button>

          <Sep />

          {/* Globals */}
          <button onClick={() => { if (window.confirm('Wipe local layout and restore defaults?')) { localStorage.removeItem('figma_state_v4'); window.location.reload() } }} style={red}>↺ Reset</button>
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
