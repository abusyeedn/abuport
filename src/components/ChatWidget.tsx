import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS } from '../theme'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const COMMANDS = [
  { cmd: '/reset',  icon: 'solar:restart-outline',       label: 'Reset',    desc: 'Clear conversation' },
  { cmd: '/jd',     icon: 'solar:document-text-outline', label: 'JD Check', desc: "Score a JD against Abu's resume" },
  { cmd: '/email',  icon: 'solar:letter-outline',        label: 'Email',    desc: "Get Abu's email" },
  { cmd: '/about',  icon: 'solar:info-circle-outline',   label: 'About',    desc: 'About Abu Syeed' },
]

const QUESTIONS = [
  { label: "What's Abu's current role?",   prompt: "What is Abusyeed's current role and what does he do there?" },
  { label: 'Top achievements?',            prompt: "What are Abusyeed's top career achievements with numbers?" },
  { label: 'Tools he uses?',              prompt: "What design and prototyping tools does Abusyeed use?" },
  { label: 'How to contact him?',         prompt: "How can I contact Abusyeed? Give phone, email, and LinkedIn." },
  { label: 'Score a JD',                  prompt: '__jd__' },
]

const INITIAL: Message[] = [
  { role: 'assistant', content: "Hi! I'm Abusyeed's AI assistant. Ask me anything about his experience, skills, or projects — or paste a job description and I'll score it against his resume." }
]

function stripTags(text: string) {
  return text.replace(/<[^>]+>/g, '')
}

function SmartLink({ href, children }: { href: string; children: string }) {
  const [copied, setCopied] = useState(false)
  const fullHref = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
    ? href
    : `https://${href}`
  const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey) return
    e.preventDefault()
    navigator.clipboard.writeText(fullHref).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <a href={fullHref} target="_blank" rel="noopener noreferrer" onClick={handle}
      title="Click to copy · Cmd+Click to open"
      style={{ color: '#7dd3fc', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}>
      {copied ? '✓ Copied' : children}
    </a>
  )
}

// Inline span: bold, italic, code, URLs, emails, phone numbers
function renderInline(text: string): React.ReactNode[] {
  const tokenRe = /(https?:\/\/[^\s)>\]]+|(?<![/@\w])[a-zA-Z0-9][-a-zA-Z0-9.]*\.[a-zA-Z]{2,}(?:\/[^\s)>\]]*)?(?=\s|$)|[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}|\+?[\d][\d\s\-]{7,}|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g
  const nodes: React.ReactNode[] = []
  let last = 0, m: RegExpExecArray | null, key = 0
  while ((m = tokenRe.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('http')) {
      nodes.push(<SmartLink key={key++} href={tok}>{tok}</SmartLink>)
    } else if (/^[a-zA-Z0-9._%+\-]+@/.test(tok)) {
      nodes.push(<SmartLink key={key++} href={`mailto:${tok}`}>{tok}</SmartLink>)
    } else if (/^\+?[\d][\d\s\-]{7,}$/.test(tok)) {
      nodes.push(<SmartLink key={key++} href={`tel:${tok.replace(/\s/g,'')}`}>{tok}</SmartLink>)
    } else if (/^[a-zA-Z0-9][-a-zA-Z0-9.]*\.[a-zA-Z]{2,}/.test(tok)) {
      // bare domain like linkedin.com/... or abusyeed.vercel.app
      nodes.push(<SmartLink key={key++} href={tok}>{tok}</SmartLink>)
    } else if (m[2] !== undefined) {
      nodes.push(<strong key={key++} style={{ color: '#e0f2fe', fontWeight: 700 }}>{m[2]}</strong>)
    } else if (m[3] !== undefined) {
      nodes.push(<em key={key++} style={{ color: '#bae6fd', fontStyle: 'italic' }}>{m[3]}</em>)
    } else if (m[4] !== undefined) {
      nodes.push(<code key={key++} style={{ background: 'rgba(56,189,248,0.15)', padding: '1px 6px', borderRadius: 4, fontSize: '0.85em', color: '#38bdf8', fontFamily: 'monospace' }}>{m[4]}</code>)
    }
    last = m.index + tok.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

function renderContent(text: string) {
  const lines = text.split('\n')
  const output: React.ReactNode[] = []
  let listBuffer: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let tableRows: string[][] = []
  let key = 0

  const flushList = () => {
    if (!listBuffer.length) return
    const Tag = listType === 'ol' ? 'ol' : 'ul'
    output.push(
      <Tag key={key++} style={{ margin: '6px 0 6px 16px', padding: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {listBuffer.map((item, i) => (
          <li key={i} style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#cbd5e1' }}>{renderInline(item)}</li>
        ))}
      </Tag>
    )
    listBuffer = []; listType = null
  }

  const flushTable = () => {
    if (!tableRows.length) return
    const [head, , ...body] = tableRows  // row[1] is the separator line
    output.push(
      <div key={key++} style={{ overflowX: 'auto', margin: '8px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
          <thead>
            <tr>
              {head.map((cell, ci) => (
                <th key={ci} style={{ padding: '7px 12px', textAlign: 'left', color: '#38bdf8', fontWeight: 700, borderBottom: '1px solid rgba(56,189,248,0.25)', whiteSpace: 'nowrap' }}>
                  {renderInline(cell.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ padding: '7px 12px', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)', lineHeight: 1.5 }}>
                    {renderInline(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    tableRows = []
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    const isTableRow = /^\|.+\|$/.test(line)

    if (isTableRow) {
      flushList()
      tableRows.push(line.slice(1, -1).split('|'))
      continue
    }
    flushTable()

    const ulMatch = line.match(/^[-•*]\s+(.+)/)
    const olMatch = line.match(/^\d+\.\s+(.+)/)
    const h3Match = line.match(/^###\s+(.+)/)
    const h2Match = line.match(/^##\s+(.+)/)
    const hrMatch = line.match(/^---+$/)

    if (ulMatch) { if (listType === 'ol') flushList(); listType = 'ul'; listBuffer.push(ulMatch[1]); continue }
    if (olMatch) { if (listType === 'ul') flushList(); listType = 'ol'; listBuffer.push(olMatch[1]); continue }
    flushList()

    if (h3Match) {
      output.push(<p key={key++} style={{ margin: '10px 0 2px', fontSize: '0.82rem', fontWeight: 700, color: '#7dd3fc', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h3Match[1]}</p>)
    } else if (h2Match) {
      output.push(<p key={key++} style={{ margin: '12px 0 4px', fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>{h2Match[1]}</p>)
    } else if (hrMatch) {
      output.push(<hr key={key++} style={{ border: 'none', borderTop: '1px solid rgba(56,189,248,0.15)', margin: '8px 0' }} />)
    } else if (line === '') {
      output.push(<br key={key++} />)
    } else {
      output.push(<span key={key++} style={{ display: 'block', lineHeight: 1.65 }}>{renderInline(line)}</span>)
    }
  }
  flushList(); flushTable()
  return output
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const close = () => { setOpen(false); window.dispatchEvent(new CustomEvent('close-chat')) }
  const [messages, setMessages] = useState<Message[]>(INITIAL)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [awaitingJD, setAwaitingJD] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-chat', handler)
    return () => window.removeEventListener('open-chat', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleInputChange = (val: string) => {
    setInput(val)
    setShowDropdown(val.startsWith('/') && val.length > 0)
  }

  const runCommand = (cmd: string) => {
    setShowDropdown(false)
    if (cmd === '/reset') {
      setMessages(INITIAL)
      setAwaitingJD(false)
      setInput('')
      return
    }
    if (cmd === '/email') {
      setMessages(m => [...m,
        { role: 'user', content: '/email' },
        { role: 'assistant', content: 'Reach Abu at sravani.y@kynhood.com' }
      ])
      setInput('')
      return
    }
    if (cmd === '/about') {
      setInput('')
      sendPrompt('/about', "Give a concise intro of Abu Syeed — who he is, his current role, and what makes him stand out as a designer. Under 100 words.")
      return
    }
    if (cmd === '/jd') {
      setAwaitingJD(true)
      setMessages(m => [...m,
        { role: 'user', content: '/jd' },
        { role: 'assistant', content: "Paste the job description below and I'll score it against Abu's resume." }
      ])
      setInput('')
      return
    }
  }

  const sendPrompt = async (displayText: string, prompt: string) => {
    const displayMsg: Message = { role: 'user', content: displayText }
    const apiMsg: Message = { role: 'user', content: prompt }
    setMessages(m => [...m, displayMsg])
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, apiMsg].map(m => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      const text = stripTags(data.text || data.error || 'Something went wrong.')
      setMessages(m => [...m, { role: 'assistant', content: text }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Network error — please try again.' }])
    }
    setLoading(false)
  }

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setShowDropdown(false)

    let prompt = text
    if (awaitingJD) {
      prompt = `Score this job description against Abu Syeed's resume. Give: match score /10, what aligns, gaps, and a one-line verdict.\n\nJob Description:\n${text}`
      setAwaitingJD(false)
    }

    const displayMsg: Message = { role: 'user', content: text }
    const apiHistory = [...messages, { role: 'user' as const, content: prompt }]
    setMessages(m => [...m, displayMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiHistory.map(m => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      const reply = stripTags(data.text || data.error || 'Something went wrong.')
      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Network error — please try again.' }])
    }
    setLoading(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (showDropdown) return
      send()
    }
    if (e.key === 'Escape') setShowDropdown(false)
  }

  const filteredCmds = COMMANDS.filter(c => c.cmd.startsWith(input.toLowerCase()))

  return createPortal(
    <>
      {/* Dimmer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            style={{ position: 'fixed', inset: 0, background: 'rgba(2,11,28,0.75)', zIndex: 9999999 }}
          />
        )}
      </AnimatePresence>

      {/* Full-size Modal */}
      <AnimatePresence>
        {open && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 99999999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              pointerEvents: 'all',
              width: 'min(780px, 92vw)', height: 'min(680px, 90vh)',
              background: 'linear-gradient(160deg, #020b18 0%, #041424 35%, #061e38 65%, #082550 100%)',
              borderRadius: 32,
              border: 'none',
              boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              fontFamily: FONTS.primary,
              position: 'relative',
            }}
          >
            {/* Bottom-right radial bloom */}
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 320, height: 320,
              background: 'radial-gradient(circle at 100% 100%, rgba(14,165,233,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Header */}
            <div style={{
              padding: '20px 28px',
              display: 'flex', alignItems: 'center', gap: 14,
              flexShrink: 0,
            }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f0f9ff', letterSpacing: '-0.01em' }}>Abu's AI</div>
              <button onClick={close}
                style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer', color: 'rgba(255,255,255,0.45)', padding: '6px 8px', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.1)'; e.currentTarget.style.color = '#e0f2fe'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              >
                <Icon icon="solar:close-circle-outline" width={22} />
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '24px 28px',
              display: 'flex', flexDirection: 'column', gap: 16, scrollbarWidth: 'none',
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
                  <div style={{
                    maxWidth: '74%', padding: '13px 18px',
                    borderRadius: msg.role === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #0369a1, #0ea5e9)'
                      : 'rgba(255,255,255,0.08)',
                    border: 'none',
                    boxShadow: msg.role === 'user' ? '0 4px 16px rgba(14,165,233,0.25)' : 'none',
                    color: '#e0f2fe',
                    fontSize: '0.9rem', lineHeight: 1.65,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}>
                    {msg.role === 'assistant' ? renderContent(msg.content) : msg.content}
                  </div>
                  {/* Question tags only on the last assistant reply, hidden when awaiting JD or loading */}
                  {msg.role === 'assistant' && !loading && !awaitingJD && i === messages.length - 1 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxWidth: '80%' }}>
                      {QUESTIONS.map(q => (
                        <button key={q.label}
                          onClick={() => q.prompt === '__jd__' ? runCommand('/jd') : sendPrompt(q.label, q.prompt)}
                          style={{
                            padding: '4px 12px', borderRadius: 20,
                            background: 'rgba(56,189,248,0.06)',
                            border: '1px solid rgba(56,189,248,0.16)',
                            color: '#7dd3fc', fontSize: '0.72rem', cursor: 'pointer',
                            transition: 'all 0.15s', fontFamily: FONTS.primary,
                          }}
                          onMouseEnter={e => { const t = e.currentTarget; t.style.background = 'rgba(56,189,248,0.16)'; t.style.borderColor = 'rgba(56,189,248,0.4)'; t.style.color = '#e0f2fe' }}
                          onMouseLeave={e => { const t = e.currentTarget; t.style.background = 'rgba(56,189,248,0.06)'; t.style.borderColor = 'rgba(56,189,248,0.16)'; t.style.color = '#7dd3fc' }}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex' }}>
                  <div style={{ padding: '14px 18px', borderRadius: '20px 20px 20px 6px', background: 'rgba(255,255,255,0.05)', display: 'flex', gap: 6, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{
                        width: 7, height: 7, borderRadius: '50%', background: '#38bdf8',
                        display: 'inline-block',
                        animation: 'chatbounce 1.2s ease-in-out infinite',
                        animationDelay: `${i * 0.2}s`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>


            {/* Slash dropdown */}
            {showDropdown && filteredCmds.length > 0 && (
              <div style={{ margin: '0 20px', background: 'rgba(2,11,28,0.9)', backdropFilter: 'blur(20px)', borderRadius: 14, overflow: 'hidden' }}>
                {filteredCmds.map(c => (
                  <button key={c.cmd} onClick={() => runCommand(c.cmd)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(56,189,248,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <Icon icon={c.icon} width={18} color="#38bdf8" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f0f9ff' }}>{c.cmd}</div>
                      <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)' }}>{c.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* JD hint */}
            {awaitingJD && (
              <div style={{ margin: '6px 20px 0', background: 'rgba(14,165,233,0.08)', borderRadius: 10, padding: '8px 14px', fontSize: '0.78rem', color: '#7dd3fc', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon icon="solar:document-text-outline" width={15} />
                Paste the job description below and press Enter
              </div>
            )}

            {/* Input row */}
            <div style={{ padding: '12px 20px 20px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                ref={inputRef}
                className="chat-input"
                value={input}
                onChange={e => handleInputChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={awaitingJD ? 'Paste job description here…' : 'Ask anything… or try /jd  /email  /about  /reset'}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.04)',
                  border: 'none',
                  borderRadius: 16, padding: '14px 18px',
                  color: '#f0f9ff', fontSize: '0.95rem',
                  outline: 'none', fontFamily: FONTS.primary,
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.55)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.2)')}
              />
              <button onClick={send} disabled={!input.trim() || loading}
                style={{
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, #0369a1, #0ea5e9)'
                    : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(56,189,248,0.25)',
                  cursor: input.trim() && !loading ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                  boxShadow: input.trim() && !loading ? '0 0 20px rgba(14,165,233,0.4)' : 'none',
                }}
              >
                <Icon icon="solar:arrow-up-outline" width={22} color={input.trim() && !loading ? '#fff' : '#475569'} />
              </button>
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes chatbounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .chat-input::placeholder { color: rgba(255,255,255,0.35); }
      `}</style>
    </>,
    document.body
  )
}
