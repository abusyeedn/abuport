/**
 * MobileChat.tsx
 *
 * "Ask Abu's AI" for the mobile build — a CTA (same label/intent as the desktop
 * CelestialChatButton) that opens a bottom sheet, the standard mobile pattern for
 * this kind of transient panel (desktop uses a centered modal instead, which
 * doesn't fit a phone).
 *
 * Speaks the same `/api/chat` contract as the desktop widget (POST
 * { messages: [{role, content}] } → { text }), but is otherwise a separate
 * component — the desktop one is a portalled modal wired to ViewportScaler's
 * zoom, neither of which exists on mobile.
 *
 * The chat state lives here and this component is never unmounted while the
 * sheet is closed (only its visibility toggles), so the conversation survives
 * closing/reopening the sheet and resets only on an actual page reload.
 */
import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Icon } from '@iconify/react'
import { FONTS, TYPE, COLORS, RADII, MOTION, SHADOWS } from '../theme'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const INITIAL: Message[] = [
  {
    role: 'assistant',
    content:
      "Hi! I'm Abusyeed's AI assistant. Ask me anything about his experience, skills, or projects.",
  },
]

const STARTERS = [
  { label: 'What does he do?', prompt: "What does Abusyeed do and what's his current role?" },
  { label: 'His experience?', prompt: "Can you give me an overview of Abusyeed's work experience?" },
  { label: 'Impact with numbers', prompt: "What are Abusyeed's top career achievements, specifically with real numbers attached?" },
  { label: 'Contact details', prompt: 'How can I contact Abusyeed? Give phone, email, and LinkedIn.' },
]

const stripHtml = (text: string) => text.replace(/<[^>]+>/g, '')

/**
 * The model replies in markdown (**bold**, "- "/"* " bullets), but this renders
 * as plain text, not HTML — so those came through as literal asterisks in the
 * bubble. Normalize bullets to "•" and turn **bold** into real <strong> nodes
 * instead of dangerouslySetInnerHTML, which would be an XSS risk on model output.
 */
function formatReply(text: string): ReactNode[] {
  const normalized = stripHtml(text).replace(/^[ \t]*[-*]\s+/gm, '• ')
  return normalized.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/)
    return bold ? <strong key={i} style={{ fontWeight: TYPE.semibold }}>{bold[1]}</strong> : part
  })
}

export default function MobileChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  // Scroll the transcript's own box, never scrollIntoView — a fixed-position
  // sheet scrolling itself is fine; scrolling the page underneath it is not.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading, open])

  // Lock page scroll while the sheet covers the screen
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const ask = async (prompt: string, display = prompt) => {
    if (loading) return
    const history = [...messages, { role: 'user' as const, content: prompt }]
    setMessages(m => [...m, { role: 'user', content: display }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.text || data.error || 'Something went wrong.' }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Network error — please try again.' }])
    }
    setLoading(false)
  }

  const send = () => {
    const text = input.trim()
    if (text) ask(text)
  }

  const showStarters = messages.length === 1 && !loading

  return (
    <>
      {/*
       * Trigger — same "celestial" button as desktop's CelestialChatButton
       * (orbiting particles, pulse ring, dark gradient pill), reproduced here
       * rather than imported: the desktop component reads useEditor(), which
       * throws outside EditorProvider, and the mobile tree deliberately
       * doesn't mount that (or any other) desktop-only machinery.
       */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', padding: 14 }}>
        {/* Orbit 1 — sky blue, fast */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 130, height: 130,
          marginTop: -65, marginLeft: -65,
          borderRadius: '50%',
          animation: 'mc-orbit-spin 4s linear infinite',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%',
            width: 9, height: 9, borderRadius: '50%',
            background: '#38bdf8',
            boxShadow: '0 0 10px 3px rgba(56,189,248,0.95)',
            transform: 'translateX(-50%) translateY(-50%)',
          }} />
        </div>

        {/* Orbit 2 — light blue, slow, reverse */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 115, height: 115,
          marginTop: -57.5, marginLeft: -57.5,
          borderRadius: '50%',
          animation: 'mc-orbit-spin 7s linear infinite reverse',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', bottom: 0, left: '50%',
            width: 6, height: 6, borderRadius: '50%',
            background: '#bae6fd',
            boxShadow: '0 0 8px 2px rgba(186,230,253,0.95)',
            transform: 'translateX(-50%) translateY(50%)',
          }} />
        </div>

        {/* Pulse ring */}
        <div style={{
          position: 'absolute', inset: 6,
          borderRadius: 50,
          border: '1.5px solid rgba(56,189,248,0.35)',
          animation: 'mc-ring-pulse 2.6s ease-out infinite',
          pointerEvents: 'none',
        }} />

        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'relative',
            padding: '13px 26px',
            borderRadius: 50,
            background: 'linear-gradient(135deg, #0c2340 0%, #0a3a5c 50%, #0e4a72 100%)',
            border: '1.5px solid rgba(56,189,248,0.5)',
            boxShadow: '0 0 32px rgba(14,165,233,0.45), 0 6px 24px rgba(0,0,0,0.5)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 9,
            fontFamily: FONTS.primary,
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 30% 25%, rgba(56,189,248,0.2) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <Icon icon="solar:stars-bold" width={22} color="#38bdf8" />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e0f2fe', letterSpacing: '0.02em' }}>
            Ask Abu's AI
          </span>
          <Icon icon="solar:stars-minimalistic-outline" width={13} color="rgba(56,189,248,0.5)" />
        </button>

        <style>{`
          @keyframes mc-orbit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes mc-ring-pulse { 0% { transform: scale(1); opacity: 0.55; } 100% { transform: scale(1.5); opacity: 0; } }
        `}</style>
      </div>

      {/* ── Sheet — always mounted so `messages`/`input` survive closing it,
          only visibility/transform toggles with `open` ──────────────────── */}
      <div
        aria-hidden={!open}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          visibility: open ? 'visible' : 'hidden',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* Scrim */}
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(20,32,52,0.45)',
            opacity: open ? 1 : 0,
            transition: `opacity ${MOTION.dur2} ${MOTION.ease}`,
          }}
        />

        {/* Panel */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            background: COLORS.bgPrimary,
            borderTopLeftRadius: RADII['3xl'],
            borderTopRightRadius: RADII['3xl'],
            boxShadow: SHADOWS.deep,
            transform: open ? 'translateY(0)' : 'translateY(100%)',
            transition: `transform ${MOTION.dur3} ${MOTION.ease}`,
          }}
        >
          {/* Drag handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
            <div style={{ width: 36, height: 4, borderRadius: RADII.full, background: COLORS.line }} />
          </div>

          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 18px 14px',
              borderBottom: `1px solid ${COLORS.hairline}`,
            }}
          >
            <Icon icon="solar:magic-stick-3-bold" width={16} color={COLORS.navy} />
            <span style={{ fontSize: TYPE.sm, fontWeight: TYPE.semibold, color: COLORS.ink }}>Ask Abu's AI</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                marginLeft: 'auto',
                border: 'none',
                background: 'none',
                padding: 4,
                cursor: 'pointer',
                color: COLORS.faint,
                display: 'flex',
              }}
            >
              <Icon icon="solar:close-circle-outline" width={20} />
            </button>
          </div>

          {/* Transcript */}
          <div
            ref={listRef}
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.role === 'user' ? '#fff' : COLORS.surface2,
                  border: m.role === 'user' ? `1px solid ${COLORS.line}` : 'none',
                  color: COLORS.soft,
                  borderRadius: RADII.xl,
                  padding: '9px 12px',
                  fontSize: TYPE.sm,
                  lineHeight: TYPE.relaxed,
                  // Model replies can contain long unbroken URLs/emails
                  overflowWrap: 'anywhere',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.role === 'assistant' ? formatReply(m.content) : m.content}
              </div>
            ))}

            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: COLORS.surface2,
                  borderRadius: RADII.xl,
                  padding: '9px 12px',
                  fontSize: TYPE.sm,
                  color: COLORS.faint,
                }}
              >
                <span style={{ animation: 'mc-pulse 1.2s ease-in-out infinite' }}>Thinking…</span>
              </div>
            )}
          </div>

          {/* Starter chips */}
          {showStarters && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 16px 12px' }}>
              {STARTERS.map(s => (
                <button
                  key={s.label}
                  onClick={() => ask(s.prompt, s.label)}
                  style={{
                    border: `1px solid ${COLORS.line}`,
                    background: '#fff',
                    color: COLORS.soft,
                    borderRadius: RADII.full,
                    padding: '6px 11px',
                    fontSize: TYPE['3xs'],
                    fontWeight: TYPE.medium,
                    cursor: 'pointer',
                    fontFamily: FONTS.primary,
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: 12,
              paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
              borderTop: `1px solid ${COLORS.hairline}`,
              background: '#fff',
            }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder="Ask about his work…"
              // No autoFocus: a sheet the user just opened is already in view,
              // but auto-focusing still fires the iOS keyboard immediately,
              // which reads as jarring rather than helpful on open.
              style={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: FONTS.primary,
                // <16px input text makes iOS Safari zoom the page on focus
                fontSize: '16px',
                color: COLORS.ink,
                padding: '6px 4px',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Send"
              style={{
                flexShrink: 0,
                width: 34,
                height: 34,
                borderRadius: RADII.circle,
                border: 'none',
                background: input.trim() && !loading ? COLORS.navyDeep : COLORS.surface2,
                color: input.trim() && !loading ? COLORS.textInverse : COLORS.faint,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                transition: `background ${MOTION.dur1} ${MOTION.ease}`,
              }}
            >
              <Icon icon="solar:arrow-up-outline" width={17} />
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes mc-pulse { 0%,100% { opacity: .45 } 50% { opacity: 1 } }`}</style>
    </>
  )
}
