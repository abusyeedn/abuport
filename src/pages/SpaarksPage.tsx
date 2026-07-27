import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { FONTS } from '../theme'
import { Icon } from '@iconify/react'
import Dock from '../components/Dock'
import OtpInput from '../components/OtpInput'
import { useZoomScale } from '../components/ViewportScaler'
import './SpaarksPage.css'

const ACCESS_CODE = '786920'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Flip)

function InteractiveComponentDemo({ name, isMobile }: { name: string; isMobile: boolean }) {
  // 1. Action List
  if (name === 'Action List') {
    const [active, setActive] = useState(0)
    const items = ['Profile settings', 'Integrations & API', 'Security logs']
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)', background: 'var(--color-bg-secondary)' }}>
        {items.map((item, idx) => (
          <div
            key={item}
            onClick={() => setActive(idx)}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              background: active === idx ? '#326fd2' : 'transparent',
              color: active === idx ? '#ffffff' : '#363744',
              transition: 'background 0.2s, color 0.2s'
            }}
          >
            {item}
          </div>
        ))}
      </div>
    )
  }

  // 2. App Bar
  if (name === 'App Bar') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#363744' }}>←</button>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#17171d' }}>Inbox</span>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#326fd2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>A</div>
      </div>
    )
  }

  // 3. Avatar
  if (name === 'Avatar') {
    const [active, setActive] = useState(0)
    return (
      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
        {[
          { type: 'img', val: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&crop=faces' },
          { type: 'initials', val: 'JD' },
          { type: 'anonymous', val: '?' }
        ].map((av, idx) => (
          <div
            key={idx}
            onClick={() => setActive(idx)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              border: active === idx ? '2px solid #326fd2' : '2px solid transparent',
              boxShadow: active === idx ? '0 0 0 2px rgba(50, 111, 210, 0.15)' : 'none',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: av.type === 'initials' ? '#c1c1c5' : av.type === 'anonymous' ? '#ebebec' : 'transparent',
              color: '#363744',
              fontSize: '12px',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            {av.type === 'img' ? <img src={av.val} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar preview" /> : av.val}
          </div>
        ))}
      </div>
    )
  }

  // 4. Badge
  if (name === 'Badge') {
    const [count, setCount] = useState(5)
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div style={{ position: 'relative', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', cursor: 'pointer', fontSize: '14px', color: '#363744' }}>
          🔔 Notifications
          {count > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#f24141',
              color: '#ffffff',
              borderRadius: '50%',
              fontSize: '10px',
              fontWeight: 700,
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}>
              {count}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button onClick={() => setCount(Math.max(0, count - 1))} style={{ padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '12px' }}>-</button>
          <button onClick={() => setCount(count + 1)} style={{ padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '12px' }}>+</button>
        </div>
      </div>
    )
  }

  // 5. Bottom Sheet
  if (name === 'Bottom Sheet') {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '80px', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-bg-secondary)', padding: 'var(--space-2)' }}>
        <button 
          onClick={() => setOpen(!open)}
          style={{ width: '100%', padding: 'var(--space-2)', background: '#326fd2', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
        >
          {open ? 'Dismiss sheet' : 'Open bottom sheet'}
        </button>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          padding: 'var(--space-3)',
          zIndex: 5,
          boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
        }}>
          <div style={{ width: '32px', height: '4px', borderRadius: 'var(--radius-xs)', background: '#a3a3a9', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#17171d', marginBottom: 'var(--space-1)' }}>Context Actions</div>
          <div style={{ fontSize: '12px', color: '#363744' }}>Select option parameters above.</div>
        </div>
      </div>
    )
  }

  // 6. Button
  if (name === 'Button') {
    const [loading, setLoading] = useState(false)
    const triggerLoading = () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 1500)
    }
    return (
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <button
          onClick={triggerLoading}
          disabled={loading}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            background: '#326fd2',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 700,
            opacity: loading ? 0.7 : 1,
            transition: 'background 0.2s'
          }}
        >
          {loading ? 'Loading...' : 'Primary Button'}
        </button>
        <button
          style={{
            padding: 'var(--space-2) var(--space-4)',
            background: 'transparent',
            color: '#326fd2',
            border: '1px solid #326fd2',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 700
          }}
        >
          Outline
        </button>
      </div>
    )
  }

  // 7. Card
  if (name === 'Card') {
    const [liked, setLiked] = useState(false)
    return (
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', background: '#ffffff', padding: 'var(--space-3)', width: '100%', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ height: '50px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #326fd2, #769fe1)', marginBottom: 'var(--space-2)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#17171d' }}>Spark Module</div>
            <div style={{ fontSize: '12px', color: '#363744' }}>Figma tokens active</div>
          </div>
          <button 
            onClick={() => setLiked(!liked)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: liked ? '#f24141' : '#a3a3a9' }}
          >
            {liked ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    )
  }

  // 8. Checkbox
  if (name === 'Checkbox') {
    const [checked, setChecked] = useState(false)
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '14px', color: '#363744', fontWeight: 500 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #e2e8f0',
            accentColor: '#326fd2',
            cursor: 'pointer'
          }}
        />
        {checked ? 'Checked state' : 'Unchecked state'}
      </label>
    )
  }

  // 9. Divider
  if (name === 'Divider') {
    const [styleType, setStyleType] = useState<'subtle' | 'normal' | 'muted'>('normal')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: '100%' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {['subtle', 'normal', 'muted'].map(t => (
            <button 
              key={t}
              onClick={() => setStyleType(t as any)}
              style={{
                padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', fontSize: '12px', border: '1px solid #e2e8f0',
                background: styleType === t ? '#326fd2' : '#fff',
                color: styleType === t ? '#fff' : '#363744', cursor: 'pointer'
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#363744', marginBottom: 'var(--space-1)' }}>Content Above</div>
          <hr style={{
            border: 'none',
            height: styleType === 'subtle' ? '0.5px' : '1px',
            backgroundColor: styleType === 'subtle' ? '#ebebec' : styleType === 'muted' ? '#a3a3a9' : 'var(--color-border)',
            margin: 0
          }} />
          <div style={{ fontSize: '12px', color: '#363744', marginTop: 'var(--space-1)' }}>Content Below</div>
        </div>
      </div>
    )
  }

  // 10. Donut Chart
  if (name === 'Donut Chart') {
    const [selected, setSelected] = useState<number | null>(null)
    const data = [
      { label: 'Category A', value: 45, color: '#326fd2' },
      { label: 'Category B', value: 35, color: '#769fe1' },
      { label: 'Category C', value: 20, color: '#bfd2f1' }
    ]
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <svg width="50" height="50" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ebebec" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#326fd2" strokeWidth="3.2" strokeDasharray="45 55" strokeDashoffset="25" 
            onMouseEnter={() => setSelected(0)} onMouseLeave={() => setSelected(null)} style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }} />
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#769fe1" strokeWidth="3.2" strokeDasharray="35 65" strokeDashoffset="80" 
            onMouseEnter={() => setSelected(1)} onMouseLeave={() => setSelected(null)} style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }} />
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#bfd2f1" strokeWidth="3.2" strokeDasharray="20 80" strokeDashoffset="115" 
            onMouseEnter={() => setSelected(2)} onMouseLeave={() => setSelected(null)} style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }} />
        </svg>
        <div style={{ fontSize: '12px', color: '#363744' }}>
          {selected !== null ? (
            <div>
              <span style={{ fontWeight: 700, color: data[selected].color }}>{data[selected].label}</span>
              <br />
              Ratio: {data[selected].value}%
            </div>
          ) : (
            <div style={{ color: '#363744' }}>Hover sectors to analyze</div>
          )}
        </div>
      </div>
    )
  }

  // 11. Input Text Area
  if (name === 'Input Text Area') {
    const [text, setText] = useState('')
    const maxChars = 100
    return (
      <div style={{ width: '100%' }}>
        <textarea
          placeholder="Type description..."
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars))}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            minHeight: '50px',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2)',
            fontSize: '14px',
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px', color: text.length >= maxChars ? '#f24141' : '#363744', marginTop: 'var(--space-1)' }}>
          {text.length}/{maxChars}
        </div>
      </div>
    )
  }

  // 12. Input Text
  if (name === 'Input Text') {
    const [val, setVal] = useState('')
    const isValid = val.includes('@')
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type="text"
          placeholder="email@domain.com"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: 'var(--space-2) var(--space-8) var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-md)',
            border: val === '' ? '1px solid #e2e8f0' : isValid ? '1px solid #54bf23' : '1px solid #f24141',
            fontSize: '14px',
            outline: 'none',
            background: val === '' ? '#fff' : isValid ? '#f0fce9' : '#fef2f2'
          }}
        />
        <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>
          {val === '' ? '' : isValid ? '✅' : '❌'}
        </span>
      </div>
    )
  }

  // 13. Link
  if (name === 'Link') {
    const [hovered, setHovered] = useState(false)
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <a
          href="#/"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ fontSize: '14px', color: '#326fd2', fontWeight: 600, textDecoration: hovered ? 'underline' : 'none' }}
        >
          View System reference ↗
        </a>
        {hovered && (
          <div style={{ position: 'absolute', bottom: '20px', left: 0, background: '#17171d', color: '#fff', fontSize: '12px', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap', zIndex: 10 }}>
            Maps to semantic token schema.
          </div>
        )}
      </div>
    )
  }

  // 14. Media Card
  if (name === 'Media Card') {
    const [playing, setPlaying] = useState(false)
    return (
      <div style={{ position: 'relative', width: '100%', height: '60px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#a3a3a9' }}>
        {playing ? (
          <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px' }}>
            📹 Playing simulation...
            <button onClick={() => setPlaying(false)} style={{ marginLeft: 'var(--space-2)', background: '#fff', color: '#000', border: 'none', borderRadius: 'var(--radius-sm)', padding: '2px 6px', cursor: 'pointer', fontSize: '12px' }}>Stop</button>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #769fe1, #326fd2)' }}>
            <button 
              onClick={() => setPlaying(true)}
              style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}
            >
              ▶
            </button>
          </div>
        )}
      </div>
    )
  }

  // 15. Menu
  if (name === 'Menu') {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{ padding: 'var(--space-2) var(--space-3)', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', background: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
        >
          Options ▾
        </button>
        {open && (
          <div style={{ position: 'absolute', left: 0, top: '34px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 10px rgba(0,0,0,0.06)', padding: 'var(--space-1)', zIndex: 10, minWidth: '90px' }}>
            {['Rename', 'Delete'].map(item => (
              <div 
                key={item}
                onClick={() => setOpen(false)}
                style={{ padding: '6px 10px', fontSize: '12px', color: item === 'Delete' ? '#f24141' : '#363744', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ebebec'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 16. Modal
  if (name === 'Modal') {
    const [active, setActive] = useState(false)
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '60px', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-secondary)', overflow: 'hidden' }}>
        <button 
          onClick={() => setActive(true)}
          style={{ padding: 'var(--space-2) var(--space-4)', background: '#17171d', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
        >
          Trigger Modal
        </button>
        {active && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(23,23,29,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: 'var(--space-2)' }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', width: '90%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#17171d', marginBottom: '6px' }}>Confirm?</div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
                <button onClick={() => setActive(false)} style={{ padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '12px' }}>No</button>
                <button onClick={() => setActive(false)} style={{ padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', border: 'none', background: '#326fd2', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>Yes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // 17. Navigation Bar
  if (name === 'Navigation Bar') {
    const [active, setActive] = useState('home')
    return (
      <div style={{ display: 'flex', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-4)', justifyContent: 'space-between', width: '100%' }}>
        {['home', 'search', 'profile'].map(n => (
          <button
            key={n}
            onClick={() => setActive(n)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
              color: active === n ? '#326fd2' : '#a3a3a9', transition: 'color 0.2s'
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' }}>{n}</span>
          </button>
        ))}
      </div>
    )
  }

  // 18. OTP Input
  if (name === 'OTP Input') {
    const [pins, setPins] = useState(['', '', '', ''])
    const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]
    const handleChange = (val: string, idx: number) => {
      const updated = [...pins]
      updated[idx] = val.slice(-1)
      setPins(updated)
      if (val && idx < 3) {
        refs[idx + 1].current?.focus()
      }
    }
    return (
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        {pins.map((p, idx) => (
          <input
            key={idx}
            ref={refs[idx]}
            type="text"
            maxLength={1}
            value={p}
            onChange={(e) => handleChange(e.target.value, idx)}
            style={{
              width: '32px', height: '36px', borderRadius: 'var(--radius-base)', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '16px', fontWeight: 700, outline: 'none',
              borderColor: p !== '' ? '#326fd2' : '#c1c1c5', boxShadow: p !== '' ? '0 0 0 2px rgba(50,111,210,0.08)' : 'none'
            }}
          />
        ))}
      </div>
    )
  }

  // 19. Poll
  if (name === 'Poll') {
    const [votes, setVotes] = useState({ figma: 8, code: 4 })
    const [voted, setVoted] = useState(false)
    const total = votes.figma + votes.code
    const figmaPct = Math.round((votes.figma / total) * 100)
    const codePct = Math.round((votes.code / total) * 100)
    const handleVote = (choice: 'figma' | 'code') => {
      if (voted) return
      setVotes(prev => ({ ...prev, [choice]: prev[choice] + 1 }))
      setVoted(true)
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: '100%' }}>
        {['figma', 'code'].map(choice => {
          const pct = choice === 'figma' ? figmaPct : codePct
          return (
            <div
              key={choice}
              onClick={() => handleVote(choice as any)}
              style={{
                position: 'relative', height: '32px', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', padding: '0 12px', cursor: voted ? 'default' : 'pointer', overflow: 'hidden', background: '#fff'
              }}
            >
              {voted && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: choice === 'figma' ? 'rgba(50, 111, 210, 0.08)' : 'rgba(118, 159, 225, 0.08)', zIndex: 1 }} />
              )}
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '14px', fontWeight: 500, color: '#363744' }}>
                <span style={{ textTransform: 'capitalize' }}>{choice}</span>
                {voted && <span>{pct}%</span>}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // 20. Radio
  if (name === 'Radio') {
    const [selected, setSelected] = useState('one')
    return (
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        {['one', 'two'].map(opt => (
          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '14px', color: '#363744', fontWeight: 500 }}>
            <input
              type="radio"
              name="demo-radio"
              checked={selected === opt}
              onChange={() => setSelected(opt)}
              style={{ width: '14px', height: '14px', accentColor: '#326fd2', cursor: 'pointer' }}
            />
            {opt === 'one' ? 'Alpha' : 'Beta'}
          </label>
        ))}
      </div>
    )
  }

  // 21. Tab
  if (name === 'Tab') {
    const [active, setActive] = useState('one')
    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 'var(--space-2)' }}>
          {['one', 'two'].map(t => (
            <button
              key={t}
              onClick={() => setActive(t)}
              style={{
                padding: '6px var(--space-3)', background: 'none', border: 'none', borderBottom: active === t ? '2px solid #326fd2' : '2px solid transparent',
                cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: active === t ? '#326fd2' : '#a3a3a9', textTransform: 'uppercase'
              }}
            >
              Tab {t}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: '#363744' }}>
          {active === 'one' ? 'Tokens are fully structured.' : 'Platform outputs generate SCSS & Swift.'}
        </div>
      </div>
    )
  }

  // 22. Tag
  if (name === 'Tag') {
    const [tags, setTags] = useState(['iOS', 'Android'])
    const removeTag = (t: string) => setTags(tags.filter(x => x !== t))
    return (
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
        {tags.length > 0 ? (
          tags.map(t => (
            <span 
              key={t} 
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', background: '#ebebec', color: '#363744', borderRadius: 'var(--radius-base)', padding: 'var(--space-1) var(--space-2)', fontSize: '12px', fontWeight: 600 }}
            >
              {t}
              <button onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a9', fontSize: '12px', padding: 0 }}>✕</button>
            </span>
          ))
        ) : (
          <button onClick={() => setTags(['iOS', 'Android'])} style={{ padding: 'var(--space-1) var(--space-2)', border: '1px dashed #e2e8f0', borderRadius: 'var(--radius-base)', background: 'none', fontSize: '12px', cursor: 'pointer', color: '#a3a3a9' }}>Reset</button>
        )}
      </div>
    )
  }

  // 23. Toast
  if (name === 'Toast') {
    const [active, setActive] = useState(false)
    const triggerToast = () => {
      setActive(true)
      setTimeout(() => setActive(false), 2000)
    }
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '34px' }}>
        <button
          onClick={triggerToast}
          style={{ padding: 'var(--space-2) var(--space-3)', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', background: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
        >
          Trigger Toast
        </button>
        {active && (
          <div style={{
            position: 'absolute', bottom: '28px', left: 0, right: 0, background: '#17171d', color: '#fff', fontSize: '12px', padding: '6px 10px', borderRadius: 'var(--radius-base)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10
          }}>
            <span>Copied to clipboard!</span>
          </div>
        )}
      </div>
    )
  }

  // 24. Toggle
  if (name === 'Toggle') {
    const [enabled, setEnabled] = useState(false)
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <div 
          onClick={() => setEnabled(!enabled)}
          style={{
            width: '36px', height: '20px', borderRadius: 'var(--radius-lg)', background: enabled ? '#54bf23' : '#c1c1c5', cursor: 'pointer', position: 'relative', transition: 'background 0.2s'
          }}
        >
          <div style={{
            width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px',
            left: enabled ? '18px' : '2px', transition: 'left 0.2s'
          }} />
        </div>
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#363744' }}>
          {enabled ? 'On' : 'Off'}
        </span>
      </div>
    )
  }

  return null
}

interface CatalogComponent {
  name: string
  image: string
  description: string
  variations: string[]
}

// Draggable, scrollbar-free 2-row shelf for the component catalog. Click-drag
// (mouse) or touch-drag scrolls it horizontally; native touch scrolling still
// works untouched since we only hijack mouse events.
// Ease-out cubic — matches the site's signature deceleration feel (MOTION.ease).
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

// Animates scrollLeft from its current value to `target`, easing out to a soft
// stop rather than snapping. Returns a cancel function.
function easeScrollTo(el: HTMLDivElement, target: number, duration: number) {
  const start = el.scrollLeft
  const distance = target - start
  const startTime = performance.now()
  let raf = 0
  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / duration)
    el.scrollLeft = start + distance * easeOutCubic(t)
    if (t < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

function ComponentCatalogGrid({ componentsList }: { componentsList: CatalogComponent[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({ startX: 0, startScrollLeft: 0, moved: false, lastX: 0, lastTime: 0, velocity: 0 })

  // One-time "peek" scroll on mount — eases out a little, holds, eases back — hinting
  // that the shelf scrolls horizontally without relying on native smooth-scroll (which
  // varies in feel/speed across browsers).
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let cancel = () => {}
    const t1 = setTimeout(() => { cancel = easeScrollTo(el, 160, 650) }, 700)
    const t2 = setTimeout(() => { cancel = easeScrollTo(el, 0, 650) }, 1550)
    return () => { clearTimeout(t1); clearTimeout(t2); cancel() }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el) return
    setIsDragging(true)
    const now = performance.now()
    dragState.current = { startX: e.pageX, startScrollLeft: el.scrollLeft, moved: false, lastX: e.pageX, lastTime: now, velocity: 0 }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const el = scrollRef.current
    if (!el) return
    const dx = e.pageX - dragState.current.startX
    if (Math.abs(dx) > 3) dragState.current.moved = true
    el.scrollLeft = dragState.current.startScrollLeft - dx

    // Track instantaneous velocity (px/ms) for the release-momentum ease-out.
    const now = performance.now()
    const dt = now - dragState.current.lastTime
    if (dt > 0) {
      dragState.current.velocity = (e.pageX - dragState.current.lastX) / dt
      dragState.current.lastX = e.pageX
      dragState.current.lastTime = now
    }
  }

  const endDrag = () => {
    setIsDragging(false)
    const el = scrollRef.current
    if (!el || !dragState.current.moved) return
    // Gentle momentum: keep gliding a short distance in the flick direction,
    // easing out to a soft stop instead of halting dead on mouse-up.
    const throwDistance = dragState.current.velocity * -140
    if (Math.abs(throwDistance) > 4) {
      easeScrollTo(el, el.scrollLeft + throwDistance, 500)
    }
  }

  return (
    <div>
      <div
        ref={scrollRef}
        className="catalog-drag-scroll no-select"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridTemplateRows: 'repeat(2, auto)',
          gridAutoColumns: '230px',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: 'var(--space-3)',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        {componentsList.map((comp) => (
          <div
            key={comp.name}
            onClickCapture={(e) => {
              // Suppress the click that follows a drag so it doesn't feel sticky/broken
              if (dragState.current.moved) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Component image preview */}
            <div style={{
              background: '#f1f5f9',
              borderBottom: '1px solid #e2e8f0',
              height: '120px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {comp.image && (
                <img
                  src={comp.image}
                  alt={`${comp.name} component preview`}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top left'
                  }}
                />
              )}
            </div>

            {/* Component text content */}
            <div style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-tertiary)', fontSize: '0.88rem' }}>
                {comp.name}
              </h4>
              <p style={{
                fontSize: '0.74rem',
                color: 'var(--color-text-muted-light)',
                lineHeight: 1.5,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {comp.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint — pulsing icon + label under the shelf */}
      <div className="catalog-scroll-hint" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        marginTop: 'var(--space-3)',
      }}>
        <Icon icon="solar:double-alt-arrow-right-bold-duotone" width={20} color="var(--color-text-muted-light)" />
        <span style={{
          fontSize: '0.68rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted-light)',
        }}>
          Scroll
        </span>
      </div>
    </div>
  )
}

export default function SpaarksPage() {
  const navigate = useNavigate()
  const pageContainerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const pageZoom = useZoomScale()
  // This gallery is a full-bleed hero visual, meant to span the true
  // physical viewport rather than shrink along with the rest of the
  // 1440px-canvas page — same reasoning as Dock.tsx's counter-zoom: `zoom`
  // is a paint-time transform applied uniformly to everything under it
  // regardless of vw/vh/% units, so the only way to opt an element out is
  // to cancel the ambient scale directly on it.
  const galleryCounterZoom = pageZoom > 0 ? 1 / pageZoom : 1
  
  const [isMobile, setIsMobile] = useState(false)
  const [activeSection, setActiveSection] = useState('summary')
  const [showToC, setShowToC] = useState(false)

  // Access-code lock state for Figma Iframe
  const [password, setPassword] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const handlePasswordSubmit = (value?: string) => {
    if ((value ?? password) === ACCESS_CODE) {
      setIsUnlocked(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const sections = [
    { id: 'summary', title: 'AI Summary' },
    { id: 'figma-lock', title: 'Figma Sandbox' },
    { id: 'problem', title: 'Chaos & Design Debt' },
    { id: 'token-arch', title: 'Unified Token Schema' },
    { id: 'token-system', title: 'Foundations & Variables' },
    { id: 'components-showcase', title: 'Component Catalog' },
    { id: 'platform', title: 'Mapping Figma to Code' },
    { id: 'comparison', title: 'System Benchmarking' },
    { id: 'handoff', title: 'Handoff Pipeline' },
    { id: 'impact', title: 'Reflection & Ripple Effect' }
  ]

  // Complete list of all 24 components from the design system PDF specification
  const componentsList = [
    {
      name: 'Action List',
      image: '/gallery/spaarks/components/comp_action_list.jpg',
      description: 'Vertical menu containers that group interactive lists of item triggers, icons, or navigation paths.',
      variations: ['Default list items', 'Hover focus state', 'Disabled items', 'Divided groups']
    },
    {
      name: 'App Bar',
      image: '/gallery/spaarks/components/comp_app_bar.jpg',
      description: 'A structural header layout spanning the top of the viewport, housing title labels, back navigations, actions, and placeholder slots.',
      variations: ['Standard header layout', 'Brand identity config', 'Integrated search configuration']
    },
    {
      name: 'Avatar',
      image: '/gallery/spaarks/components/comp_avatar.jpg',
      description: 'Visual identity badge displaying initials, user pictures, or placeholder icons to represent profiles.',
      variations: ['Image type', 'Icon overlay type', 'Initials type', 'Small / Medium / Large sizes', 'isStory ring state', 'isLabel text visibility', 'isAnonymous default icon']
    },
    {
      name: 'Badge',
      image: '/gallery/spaarks/components/comp_badge.jpg',
      description: 'Overlay indicators signifying notifications, status updates, or numeric counts.',
      variations: ['Dot status indicators', 'Numeric counts', 'State-based variants (Info, Success, Warning, Error)']
    },
    {
      name: 'Bottom Sheet',
      image: '/gallery/spaarks/components/comp_bottom_sheet.jpg',
      description: 'An overlay viewport drawer sliding up from the bottom edge of mobile layouts to present contextual options.',
      variations: ['Default', 'Avatar', 'Modal', 'Banner', 'Custom', 'Grid']
    },
    {
      name: 'Button',
      image: '/gallery/spaarks/components/comp_button.jpg',
      description: 'Interactive triggers that initiate interface actions, supporting loaded cues and distinct priority styling.',
      variations: ['Primary Filled', 'Primary Outline', 'Secondary', 'Tertiary', 'Link', 'Small / Medium / Large', 'Disabled', 'Loading state']
    },
    {
      name: 'Card',
      image: '/gallery/spaarks/components/comp_card.jpg',
      description: 'Structured layout container grouping related visual images, title headers, text, and actionable links.',
      variations: ['Default', 'Custom', 'Content only', 'Image card', 'With header/footer']
    },
    {
      name: 'Checkbox',
      image: '/gallery/spaarks/components/comp_checkbox.jpg',
      description: 'An interactive toggle allowing multiple selections in list configurations.',
      variations: ['False (unchecked)', 'True (checked)', 'Indeterminate', 'Disabled', 'Small / Medium', 'Validation states']
    },
    {
      name: 'Divider',
      image: '/gallery/spaarks/components/comp_divider.jpg',
      description: 'Separation rule lines that organize content blocks cleanly across vertical or horizontal space.',
      variations: ['0.5pt Subtle', '1pt Normal', '1pt Muted', 'Horizontal / Vertical orientations']
    },
    {
      name: 'Donut Chart',
      image: '/gallery/spaarks/components/comp_donut_chart.jpg',
      description: 'Circular chart layouts mapping percentage breakdowns of data streams in dashboards.',
      variations: ['Segment breakdown ratios', 'Centered stat label', 'Legend component']
    },
    {
      name: 'Input Text Area',
      image: '/gallery/spaarks/components/comp_input_text_area.jpg',
      description: 'Multi-line text entry field designed for longer comments, messages, or descriptions.',
      variations: ['Placeholder', 'Disabled', 'Success', 'In-Progress', 'Error', 'Small / Medium / Large']
    },
    {
      name: 'Input Text',
      image: '/gallery/spaarks/components/comp_input_text.jpg',
      description: 'Single-line data entry fields featuring prompt placeholders and error message support.',
      variations: ['Placeholder', 'Disabled', 'Success', 'In-Progress', 'Error', 'Medium size']
    },
    {
      name: 'Link',
      image: '/gallery/spaarks/components/comp_link.jpg',
      description: 'Inline text anchors pointing target viewports to external destinations or local pages.',
      variations: ['Primary Link', 'Small / Medium / Large', 'Default / Hover / Active / Disabled states']
    },
    {
      name: 'Media Card',
      image: '/gallery/spaarks/components/comp_media_card.jpg',
      description: 'Large content card layout centering image or video assets with overlaid titles and action triggers.',
      variations: ['Post Card', 'Product Card', 'isSplitter True/False', 'showContent True/False']
    },
    {
      name: 'Menu',
      image: '/gallery/spaarks/components/comp_menu.jpg',
      description: 'Dropdown lists offering option menus relative to activated settings or anchor coordinates.',
      variations: ['showDismiss True/False', 'Icon / Action variants', 'Default / Hover states']
    },
    {
      name: 'Modal',
      image: '/gallery/spaarks/components/comp_modal.jpg',
      description: 'Focus-locked dialog boxes layering over viewports to demand action confirmations.',
      variations: ['Horizontal / Vertical orientation', 'Medium size', 'Header + Footer + Content', 'Splitter variants']
    },
    {
      name: 'Navigation Bar',
      image: '/gallery/spaarks/components/comp_navigation_bar.jpg',
      description: 'Bottom structural navigation layouts targeting core destinations on mobile screens.',
      variations: ['Default 4-tab layout', 'Active item highlight', 'Label captions', 'Badge indicators']
    },
    {
      name: 'OTP Input',
      image: '/gallery/spaarks/components/comp_otp_input.jpg',
      description: 'Split single-character numeric inputs grouping code validation sequences.',
      variations: ['Placeholder', 'Inactive', 'Active', 'Disabled', 'Success', 'In-Progress', 'Error']
    },
    {
      name: 'Poll',
      image: '/gallery/spaarks/components/comp_poll.jpg',
      description: 'Feedback cards rendering voting questions alongside dynamic result ratio indicators.',
      variations: ['Result True/False', '2 / 3 / 4 Options', 'No-Result / Right / Wrong states', 'Percentage bars']
    },
    {
      name: 'Radio',
      image: '/gallery/spaarks/components/comp_radio.jpg',
      description: 'Circular selection trigger designed for single selection parameter controls.',
      variations: ['False (unselected)', 'True (selected)', 'Disabled', 'Small / Medium', 'Validation states']
    },
    {
      name: 'Tab',
      image: '/gallery/spaarks/components/comp_tab.jpg',
      description: 'Horizontal navigation tabs switcher that organizes related content into labeled panels.',
      variations: ['Border + Icon', 'Border No-Icon', 'No-Border', 'Small / Medium', 'Switch On/Off states']
    },
    {
      name: 'Tag',
      image: '/gallery/spaarks/components/comp_tag.jpg',
      description: 'Compact metadata labels that categorize or classify content within lists and interfaces.',
      variations: ['Default', 'Disabled', 'Medium / Large', 'Removable with dismiss icon']
    },
    {
      name: 'Toast',
      image: '/gallery/spaarks/components/comp_toast.jpg',
      description: 'Ephemeral notification banners that slide into the viewport and auto-dismiss after a brief timeout.',
      variations: ['Info', 'Success', 'Warning', 'Error', 'With/Without action button', 'Placeholder text']
    },
    {
      name: 'Toggle',
      image: '/gallery/spaarks/components/comp_toggle.jpg',
      description: 'Binary on/off sliders controlling boolean preferences, settings switches, or feature flags.',
      variations: ['Small Off / On', 'Medium Off / On', 'Disabled state']
    }
  ]

  useEffect(() => {
    // Save original body styles
    const originalBgColor = document.body.style.backgroundColor
    const originalBgImage = document.body.style.backgroundImage
    document.body.style.backgroundColor = '#ffffff'
    document.body.style.backgroundImage = 'none'

    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener('resize', handleResize)


    let ctx: gsap.Context

    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Section subtle reveal animations
        gsap.utils.toArray('section').forEach((sec: any) => {
          gsap.fromTo(sec,
            { y: 30, opacity: 0.8 },
            {
              y: 0,
              opacity: 1,
              ease: 'sine.out',
              scrollTrigger: {
                trigger: sec,
                start: 'top bottom-=100px',
                end: 'top top+=200px',
                scrub: 1
              }
            }
          )
        })

        // Bento grid flip setup
        const galleryElement = galleryRef.current
        if (!galleryElement) return
        const galleryItems = galleryElement.querySelectorAll('.gallery__item')

        galleryElement.classList.add('gallery--final')
        const flipState = Flip.getState(galleryItems)
        galleryElement.classList.remove('gallery--final')

        const flip = Flip.to(flipState, {
          absolute: true,
          ease: 'power1.inOut',
          simple: true,
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.gallery-wrap',
            start: 'top top',
            end: '+=150%',
            scrub: true,
            pin: true,
          }
        })
        tl.add(flip)
      })
    }, 100)

    // Setup active section tracking observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id)
      if (el) observer.observe(el)
    })

    // ToC visibility: use IntersectionObserver on the story intro paragraph.
    // Show ToC when that block enters viewport, hide it when scrolled back above it.
    const introEl = document.getElementById('story-intro')
    let tocObserver: IntersectionObserver | null = null
    if (introEl) {
      tocObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Paragraph is visible — show ToC
            setShowToC(true)
          } else {
            // Paragraph scrolled out — check if above or below viewport
            if (entry.boundingClientRect.top > 0) {
              // Scrolled back up above the paragraph — hide ToC
              setShowToC(false)
            }
            // If below viewport (user hasn't reached it yet) — keep hidden
          }
        },
        { threshold: 0.1 }
      )
      tocObserver.observe(introEl)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
      if (tocObserver) tocObserver.disconnect()
      clearTimeout(timer)
      if (ctx) ctx.revert()
      document.body.style.backgroundColor = originalBgColor
      document.body.style.backgroundImage = originalBgImage
    }
  }, [])

  const handleIndexClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const tableHeaderStyle: React.CSSProperties = {
    padding: '14px var(--space-4)',
    color: 'var(--color-text-primary)',
    fontWeight: 700,
    backgroundColor: '#f1f5f9',
    textAlign: 'left',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }

  const tableCellStyle: React.CSSProperties = {
    padding: '14px var(--space-4)',
    fontSize: '0.9rem',
    borderBottom: '1px solid #e2e8f0',
    color: 'var(--color-text-tertiary)',
    lineHeight: 1.6
  }

  const codeBlockStyle: React.CSSProperties = {
    background: 'var(--color-bg-secondary)',
    border: '1px solid #e2e8f0',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-5)',
    overflowX: 'auto',
    fontSize: '0.85rem',
    fontFamily: 'monospace',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-6)'
  }

  return (
    <div ref={pageContainerRef} style={{ fontFamily: FONTS.primary, backgroundColor: '#ffffff', color: 'var(--color-text-primary)', minHeight: '100vh', position: 'relative' }}>
      
      {/* Background checkered grid pattern */}
      <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid-spaarks" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.4" />
          </pattern>
          <pattern id="grid-spaarks" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid-spaarks)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-spaarks)" />
      </svg>

      <div style={{ position: 'relative', zIndex: 1, padding: 0 }}>
        
        {/* Bento Grid Pin Zone (Starts immediately at the top). Zoom
            cancellation lives on this outer wrapper rather than on
            .gallery-wrap itself — GSAP's ScrollTrigger pins .gallery-wrap
            directly (toggling it to position:fixed), and combining that
            with its own `zoom` style causes the same fixed-position
            offset/crop bug seen elsewhere in this codebase when the two mix. */}
        <div style={{ zoom: galleryCounterZoom } as React.CSSProperties}>
        <div className="gallery-wrap">
          <div
            ref={galleryRef}
            className="gallery gallery--bento gallery--switch"
            id="gallery-8"
          >
            <div className="gallery__item"><img src="/gallery/spaarks/components/comp_button.jpg" alt="Spark Button component variants" /></div>
            <div className="gallery__item"><img src="/gallery/spaarks/components/comp_badge.jpg" alt="Spark Badge component" /></div>
            <div className="gallery__item"><img src="/gallery/spaarks/spark_ds_cover.jpg" alt="Spark Design System overview" /></div>
            <div className="gallery__item"><img src="/gallery/spaarks/components/comp_bottom_sheet.jpg" alt="Spark Bottom Sheet component" /></div>
            <div className="gallery__item"><img src="/gallery/spaarks/components/comp_navigation_bar.jpg" alt="Spark Navigation Bar component" /></div>
            <div className="gallery__item"><img src="/gallery/spaarks/components/comp_tab.jpg" alt="Spark Tab component" /></div>
            <div className="gallery__item"><img src="/gallery/spaarks/components/comp_toggle.jpg" alt="Spark Toggle component" /></div>
            <div className="gallery__item"><img src="/gallery/spaarks/components/comp_avatar.jpg" alt="Spark Avatar component" /></div>
          </div>
        </div>
        </div>

        {/* Figma Sandbox Workspace Container - macOS Browser Wrapper Style */}
        <section style={{ 
          maxWidth: '1000px', 
          margin: '4rem auto 2rem', 
          padding: isMobile ? '0 24px' : '0 48px', 
          scrollMarginTop: '24px',
          boxSizing: 'border-box'
        }}>
          
          {/* Main Hero Title & Intro Paragraphs */}
          <div id="story-intro" style={{ marginBottom: 'var(--space-10)', textAlign: 'left' }}>
            <h1 style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 var(--space-5)', letterSpacing: '-0.03em' }}>
              Spark Design System
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-5)' }}>
              My first project at Spaarks wasn't designing new features — it was understanding the product first. I joined as a remote design intern and the first thing I was asked to do was audit the whole application. Simple enough, right? Go through every screen, find bugs, inconsistencies, UX issues, and put it all in a one-page report.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '0' }}>
              But while I was documenting all of this, I kept noticing something — most of these problems weren't one-off mistakes. The same button looked different on every screen. Spacing was all over the place. Colors had no system. Components were being recreated from scratch every single time. It was clear the product didn't just need fixes — it needed a proper design language that everyone could follow.
            </p>
          </div>

          {/* AI Generated Summary */}
          <div id="summary" style={{ marginBottom: 'var(--space-12)', scrollMarginTop: '24px' }}>
            <div style={{
              marginBottom: 0,
              borderRadius: 10,
              border: '1px solid #e0e7ff',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)',
            }}>
              {/* Header bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px var(--space-4)',
                borderBottom: '1px solid #e0e7ff',
                background: 'rgba(99,102,241,0.08)',
              }}>
                <Icon icon="solar:stars-minimalistic-outline" width={15} color="#6366f1" />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: FONTS.primary }}>
                  AI Generated Summary
                </span>
              </div>

              {/* Two-column grid rows */}
              <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr' }}>
                {[
                  { label: '01', text: 'Started as a remote design intern at Spaarks — first task was a full app audit to find all the visual inconsistencies and UX issues.' },
                  { label: '02', text: 'Proposed building Spark, a design system from scratch, starting with the basics — layout, spacing, colors, and typography.' },
                  { label: '03', text: 'Built a three-tier design token model (Global → Semantic → Component) so no one ever had to hardcode style values again.' },
                  { label: '04', text: 'Designed 24 reusable components in Figma — with proper variants, states, and layout grids for each one.' },
                  { label: '05', text: 'Translated the whole system into developer-ready exports: CSS/SCSS for web, Android XML, and Swift variables for iOS.' },
                ].map((row, i, arr) => {
                  const isLast = i === arr.length - 1
                  return (
                    <React.Fragment key={row.label}>
                      <div style={{
                        padding: '10px var(--space-3) 10px var(--space-4)',
                        borderBottom: !isLast ? '1px solid rgba(99,102,241,0.12)' : 'none',
                        borderRight: '1px solid rgba(99,102,241,0.18)',
                        display: 'flex', alignItems: 'center',
                      }}>
                        <span style={{
                          fontSize: '0.55rem', fontWeight: 800, color: '#6366f1',
                          textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.5,
                          fontFamily: FONTS.primary,
                        }}>
                          {row.label}
                        </span>
                      </div>
                      <div style={{
                        padding: '10px var(--space-4)',
                        borderBottom: !isLast ? '1px solid rgba(99,102,241,0.12)' : 'none',
                      }}>
                        <p style={{ margin: 0, fontSize: '0.73rem', color: '#3730a3', lineHeight: 1.65, fontFamily: FONTS.primary }}>{row.text}</p>
                      </div>
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          </div>

          {/* MacOS Browser Frame Wrapper (Figma sandbox iframe) */}
          <div id="figma-lock" style={{ 
            borderRadius: 'var(--radius-4xl)', 
            overflow: 'hidden', 
            border: '1px solid #cbd5e1', 
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            background: 'var(--color-bg-secondary)',
            scrollMarginTop: '24px'
          }}>
            {/* Browser Header Bar */}
            <div style={{ background: '#f1f5f9', padding: '14px var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', borderBottom: '1px solid #cbd5e1' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f24141' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#e1801f' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#54bf23' }} />
              
              <div style={{
                flex: 1,
                maxWidth: '480px',
                margin: '0 auto',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)',
                fontFamily: 'monospace'
              }}>
                figma.com/design/spark-design-system
              </div>
            </div>

            {/* Browser Body Area */}
            <div style={{ 
              height: '640px', 
              position: 'relative', 
              background: '#0a0a0a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {!isUnlocked ? (
                /* Centered macOS Locked Box Panel */
                <div style={{
                  background: 'rgba(26,26,26,0.92)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 32,
                  boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
                  padding: 'var(--space-10) var(--space-10) 36px',
                  width: 320,
                  textAlign: 'center',
                  fontFamily: FONTS.primary,
                  zIndex: 2
                }}>
                  {/* Icon */}
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', margin: '0 auto 20px',
                    background: 'rgba(59,130,246,0.15)',
                    border: '1px solid rgba(59,130,246,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon icon="solar:lock-keyhole-bold" width={24} color="#60a5fa" />
                  </div>

                  {/* Heading */}
                  <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '1rem', color: '#ffffff', fontFamily: FONTS.primary, lineHeight: 1.3 }}>
                    This one's kept close 🔒
                  </p>
                  <p style={{ margin: '0 0 24px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                    Enter the access code to continue. Access is valid for 5 days on this browser — shared solely to protect the integrity of this work.
                  </p>

                  {/* Input */}
                  <div style={{ marginBottom: passwordError ? 8 : 12 }}>
                    <OtpInput
                      value={password}
                      onChange={v => { setPassword(v); setPasswordError(false) }}
                      onComplete={handlePasswordSubmit}
                      hasError={passwordError}
                      theme="dark"
                    />
                  </div>
                  {passwordError && (
                    <p style={{ margin: '0 0 12px', fontSize: '0.72rem', color: 'rgba(239,68,68,0.85)', textAlign: 'center' }}>
                      Incorrect code — please try again
                    </p>
                  )}

                  {/* Button */}
                  <button
                    onClick={() => handlePasswordSubmit()}
                    style={{
                      width: '100%', padding: '11px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: '#3b82f6', color: '#ffffff',
                      fontFamily: FONTS.primary, fontWeight: 700, fontSize: '0.9rem',
                      transition: 'background 0.2s, transform 0.2s',
                    }}
                  >
                    Unlock Access
                  </button>
                  <a href="mailto:abusyeed10202@gmail.com" style={{ display: 'block', marginTop: 'var(--space-3)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}>
                    Email me, I am happy to walk you through
                  </a>
                </div>
              ) : (
                /* Unlocked Iframe display */
                <iframe 
                  title="Spark Figma System"
                  src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2F3XEIfBgCzEuCkfnDGq4Li1%2FSpark-Design-System%3Fnode-id%3D6-3639%26t%3DoGh04dlrCigL9ezO-1%26view%3Dvariables" 
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allowFullScreen
                />
              )}
            </div>
          </div>

        </section>

        {/* Main Center Documentation Content */}
        <div style={{ 
          maxWidth: '1000px', 
          margin: isMobile ? '0 auto 6rem' : '0 auto 12rem', 
          padding: isMobile ? '0 24px' : '0 48px',
          boxSizing: 'border-box',
          position: 'relative'
        }}>
          
          {/* Main Content Column */}
          <div style={{ minWidth: 0 }}>

            {/* Problem Spark Solved */}
            <section id="problem" style={{ scrollMarginTop: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 'var(--space-20) 0 var(--space-2)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                The Chaos Beneath: A System in Design Debt
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-5)', fontSize: '1.05rem' }}>
                As the audit went deeper, I started seeing the same problems repeating everywhere. It wasn't just a few bad screens — the whole product had grown in an unplanned way:
              </p>
              <ul style={{ paddingLeft: 'var(--space-5)', listStyleType: 'disc', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                <li style={{ marginBottom: 'var(--space-2)' }}><strong>One button, six different looks:</strong> Same component, styled differently on every single page. No consistency at all.</li>
                <li style={{ marginBottom: 'var(--space-2)' }}><strong>Colours and typography by gut feeling:</strong> No shared scale existed — every designer just picked what looked right to them in that moment.</li>
                <li style={{ marginBottom: 'var(--space-2)' }}><strong>Spacing was just guesswork:</strong> No spacing system, so layouts would shift from screen to screen in ways that felt random.</li>
                <li style={{ marginBottom: 'var(--space-2)' }}><strong>Everyone reinventing the wheel:</strong> Instead of reusing components, designers were drawing the same buttons and cards from scratch every single time they opened a new frame.</li>
                <li style={{ marginBottom: 'var(--space-2)' }}><strong>Lost in translation:</strong> Without a shared language, developers had to just figure out what the design meant — and that's where production bugs came from.</li>
              </ul>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 0, fontSize: '1.05rem' }}>
                Every new feature was making things worse. The more the product grew, the more inconsistent it became. That's when I went to the team and proposed building a proper design system — one place where both designers and developers could work from the same source of truth.
              </p>
            </section>

            {/* Token Architecture */}
            <section id="token-arch" style={{ scrollMarginTop: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 'var(--space-20) 0 var(--space-2)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                Designing the Infrastructure: A Unified Token Schema
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-5)', fontSize: '1.05rem' }}>
                I knew that just making components in Figma wouldn't solve the root problem. If tomorrow someone changed a colour, we'd still have to update it manually in iOS, Android, and web — three different places. So instead of jumping straight into designing screens, I spent nearly a month on something less visible but much more important: the foundations. I broke everything down into a <strong>three-tier design token model</strong> so that style decisions could live in one place and flow everywhere:
              </p>
              {/* Visual Token Flowchart */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-8)',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: 'var(--radius-2xl)',
                border: '1px solid #e2e8f0',
                padding: isMobile ? '24px' : '54px 24px',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                {/* Step 1: Global */}
                <div style={{
                  flex: 1,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-4)',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  width: '100%',
                  boxSizing: 'border-box',
                  transform: !isMobile ? 'translateY(-20px)' : 'none',
                  transition: 'transform 0.3s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 800, background: 'var(--color-border)', color: '#475569',
                      padding: '2px 6px', borderRadius: 'var(--radius-sm)', textTransform: 'uppercase'
                    }}>Tier 1</span>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Global Tokens (Raw)</h5>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                    Base constants containing static values. Raw color, spacing, or height assets.
                  </p>
                  <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-base)', padding: 'var(--space-2)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    <span style={{ color: '#326fd2', fontWeight: 700 }}>blue.500</span> = <span style={{ color: '#059669' }}>#326fd2</span>
                  </div>
                </div>

                {/* Zig-zag Arrow 1 */}
                {!isMobile ? (
                  <svg width="40" height="80" viewBox="0 0 40 80" fill="none" style={{ alignSelf: 'center', opacity: 0.8, flexShrink: 0 }}>
                    <path d="M 5 20 L 20 20 L 20 60 L 35 60" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 28 55 L 35 60 L 28 65" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="24" height="40" viewBox="0 0 24 40" fill="none" style={{ opacity: 0.7, margin: '8px 0', flexShrink: 0 }}>
                    <path d="M 12 5 L 12 15 L 4 25 L 12 35" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
                    <path d="M 8 31 L 12 35 L 16 31" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}

                {/* Step 2: Semantic */}
                <div style={{
                  flex: 1,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-4)',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  width: '100%',
                  boxSizing: 'border-box',
                  transform: !isMobile ? 'translateY(20px)' : 'none',
                  transition: 'transform 0.3s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 800, background: '#dbeafe', color: '#1e40af',
                      padding: '2px 6px', borderRadius: 'var(--radius-sm)', textTransform: 'uppercase'
                    }}>Tier 2</span>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Semantic Tokens (Alias)</h5>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                    Meaningful labels describing role and intent. Decouples styling from exact values.
                  </p>
                  <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-base)', padding: 'var(--space-2)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    <span style={{ color: '#326fd2', fontWeight: 700 }}>color.primary</span> = <span style={{ color: '#326fd2' }}>blue.500</span>
                  </div>
                </div>

                {/* Zig-zag Arrow 2 */}
                {!isMobile ? (
                  <svg width="40" height="80" viewBox="0 0 40 80" fill="none" style={{ alignSelf: 'center', opacity: 0.8, flexShrink: 0 }}>
                    <path d="M 5 60 L 20 60 L 20 20 L 35 20" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 28 15 L 35 20 L 28 25" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="24" height="40" viewBox="0 0 24 40" fill="none" style={{ opacity: 0.7, margin: '8px 0', flexShrink: 0 }}>
                    <path d="M 12 5 L 12 15 L 20 25 L 12 35" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
                    <path d="M 8 31 L 12 35 L 16 31" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}

                {/* Step 3: Component */}
                <div style={{
                  flex: 1,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-4)',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  width: '100%',
                  boxSizing: 'border-box',
                  transform: !isMobile ? 'translateY(-20px)' : 'none',
                  transition: 'transform 0.3s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 800, background: '#f3e8ff', color: '#6b21a8',
                      padding: '2px 6px', borderRadius: 'var(--radius-sm)', textTransform: 'uppercase'
                    }}>Tier 3</span>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Component Tokens</h5>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                    Context-specific decisions. Allows overriding single components without breaking styles.
                  </p>
                  <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-base)', padding: 'var(--space-2)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    <span style={{ color: '#326fd2', fontWeight: 700 }}>button.background</span> = <span style={{ color: '#7c3aed' }}>color.primary</span>
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Industry Comparisons</h4>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-6)', fontSize: '1.05rem' }}>
                I was curious — how does Spark actually compare to systems built by big teams with years of investment? Here's an honest look at how the architecture stacks up against Google's Material Design 3 and Adobe's Spectrum:
              </p>

              <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', marginBottom: 'var(--space-8)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: '600px' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>System Name</th>
                      <th style={tableHeaderStyle}>Token Strategy</th>
                      <th style={tableHeaderStyle}>Multi-Platform parity</th>
                      <th style={tableHeaderStyle}>Handoff Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tableCellStyle}><strong>Spark System (Ours)</strong></td>
                      <td style={tableCellStyle}>3-Tier (Global → Semantic → Component)</td>
                      <td style={tableCellStyle}>Full Sync (iOS, Compose, SCSS)</td>
                      <td style={tableCellStyle}>Auto-Generated CLI Pipeline</td>
                    </tr>
                    <tr>
                      <td style={tableCellStyle}><strong>Material Design 3</strong></td>
                      <td style={tableCellStyle}>3-Tier (Sys → Ref → Component)</td>
                      <td style={tableCellStyle}>Android native, Web custom mappings</td>
                      <td style={tableCellStyle}>Manual Web/JSON export tools</td>
                    </tr>
                    <tr>
                      <td style={tableCellStyle}><strong>Salesforce Lightning</strong></td>
                      <td style={tableCellStyle}>2-Tier (Global → Component)</td>
                      <td style={tableCellStyle}>Proprietary Aura/LWC platforms</td>
                      <td style={tableCellStyle}>Internal Aura bundle packaging</td>
                    </tr>
                    <tr>
                      <td style={tableCellStyle}><strong>Adobe Spectrum</strong></td>
                      <td style={tableCellStyle}>3-Tier (Global → Semantic → Component)</td>
                      <td style={tableCellStyle}>Web & Native Desktop libraries</td>
                      <td style={tableCellStyle}>CSS Custom Properties distribution</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Token System Details */}
            <section id="token-system" style={{ scrollMarginTop: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 'var(--space-20) 0 var(--space-2)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                Building bottom-up: Foundations and Variable Schema
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-6)', fontSize: '1.05rem' }}>
                A design system is only as good as its most basic variables. I didn't want a single hardcoded value anywhere in the product. So before I designed even one component in Figma, I sat down and mapped out every primitive — colours, spacing, border radii, elevation — and gave each one a proper token name. This way, the whole visual rhythm of the product could be controlled from one place:
              </p>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Token Schema JSON</h4>
              <pre style={codeBlockStyle}>
                <code>
                  {'{'}{'\n'}
                  {'  '}<span style={{ color: '#2563eb' }}>"color"</span>: {'{\n'}
                  {'    '}<span style={{ color: '#2563eb' }}>"blue"</span>: {'{ '}<span style={{ color: '#2563eb' }}>"500"</span>: {'{ '}<span style={{ color: '#059669' }}>"value"</span>: <span style={{ color: '#7c3aed' }}>"#326fd2"</span>{' } }\n'}
                  {'  '}{'},\n'}
                  {'  '}<span style={{ color: '#2563eb' }}>"semantic"</span>: {'{\n'}
                  {'    '}<span style={{ color: '#2563eb' }}>"primary"</span>: {'{ '}<span style={{ color: '#059669' }}>"value"</span>: <span style={{ color: '#7c3aed' }}>"{'{color.blue.500}'}"</span>{' }\n'}
                  {'  '}{'}\n'}
                  {'}'}
                </code>
              </pre>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Platform Mapping Table</h4>
              <div style={{ overflowX: 'auto', marginBottom: 'var(--space-8)', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: '600px' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Token</th>
                      <th style={tableHeaderStyle}>Web (SCSS)</th>
                      <th style={tableHeaderStyle}>iOS (SwiftUI)</th>
                      <th style={tableHeaderStyle}>Android (Compose)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tableCellStyle}><code>color.primary</code></td>
                      <td style={tableCellStyle}><span style={{ color: '#059669', fontFamily: 'monospace' }}>$color-primary: #326fd2;</span></td>
                      <td style={tableCellStyle}><span style={{ color: '#2563eb', fontFamily: 'monospace' }}>Color("primary")</span></td>
                      <td style={tableCellStyle}><span style={{ color: '#7c3aed', fontFamily: 'monospace' }}>MaterialTheme.colors.primary</span></td>
                    </tr>
                    <tr>
                      <td style={tableCellStyle}><code>font.size.base</code></td>
                      <td style={tableCellStyle}><span style={{ color: '#059669', fontFamily: 'monospace' }}>$font-size-base: 16px;</span></td>
                      <td style={tableCellStyle}><span style={{ color: '#2563eb', fontFamily: 'monospace' }}>.font(.system(size: 16))</span></td>
                      <td style={tableCellStyle}><span style={{ color: '#7c3aed', fontFamily: 'monospace' }}>MaterialTheme.typography.body1</span></td>
                    </tr>
                    <tr>
                      <td style={tableCellStyle}><code>spacing.md</code></td>
                      <td style={tableCellStyle}><span style={{ color: '#059669', fontFamily: 'monospace' }}>$spacing-md: 16px;</span></td>
                      <td style={tableCellStyle}><span style={{ color: '#2563eb', fontFamily: 'monospace' }}>CGFloat(16)</span></td>
                      <td style={tableCellStyle}><span style={{ color: '#7c3aed', fontFamily: 'monospace' }}>16.dp</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Color System — coded swatches */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Color Foundations</h4>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                {[
                  { label: 'Primary', shades: [['50','#ebf1fb'],['100','#bfd2f1'],['200','#a1bdea'],['300','#769fe1'],['400','#5b8cdb'],['500','#326fd2'],['600','#2e65bf'],['700','#244f95'],['800','#1c3d74'],['900','#152f58']] },
                  { label: 'Neutral', shades: [['50','#ebebec'],['100','#c1c1c5'],['200','#a3a3a9'],['300','#787982'],['400','#5e5f69'],['500','#363744'],['600','#31323e'],['700','#262730'],['800','#1e1e25'],['900','#17171d']] },
                  { label: 'Success', shades: [['50','#f0fce9'],['100','#dff9ce'],['200','#c0f2a4'],['300','#98e86e'],['400','#74d942'],['500','#54bf23'],['600','#3e9818'],['700','#317417'],['800','#2a5c18'],['900','#264f18']] },
                  { label: 'Warning', shades: [['50','#fdf8ed'],['100','#f9eacc'],['200','#f3d494'],['300','#edb85c'],['400','#e9a036'],['500','#e1801f'],['600','#c76018'],['700','#a54318'],['800','#873519'],['900','#6f2c18']] },
                  { label: 'Error', shades: [['50','#fef2f2'],['100','#fee2e2'],['200','#ffc9c9'],['300','#fea3a3'],['400','#fa6f6f'],['500','#f24141'],['600','#df2323'],['700','#bc1919'],['800','#9b1919'],['900','#811b1b']] },
                ].map(group => (
                  <div key={group.label} style={{ marginBottom: 'var(--space-5)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>{group.label}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? Math.ceil(group.shades.length / 2) : group.shades.length}, 1fr)`, gap: '6px', width: '100%' }}>
                      {group.shades.map(([shade, hex]) => (
                        <div key={shade} style={{ textAlign: 'center' }}>
                          <div style={{ width: '100%', height: '52px', borderRadius: 'var(--radius-md)', backgroundColor: hex, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 'var(--space-1)' }} />
                          <div style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{shade}</div>
                          <div style={{ fontSize: '0.58rem', color: 'var(--color-text-muted-light)', fontFamily: 'monospace' }}>{hex}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Spacing Scale — coded bars */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Layout Spacing Foundations</h4>
              <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', padding: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
                {[
                  { token: 'spacing.0', value: '0px', px: 0 },
                  { token: 'spacing.1', value: '4px', px: 4 },
                  { token: 'spacing.2', value: '8px', px: 8 },
                  { token: 'spacing.3', value: '12px', px: 12 },
                  { token: 'spacing.4', value: '16px', px: 16 },
                  { token: 'spacing.5', value: '20px', px: 20 },
                  { token: 'spacing.6', value: '24px', px: 24 },
                  { token: 'spacing.8', value: '32px', px: 32 },
                  { token: 'spacing.10', value: '40px', px: 40 },
                  { token: 'spacing.12', value: '48px', px: 48 },
                  { token: 'spacing.16', value: '64px', px: 64 },
                ].map(s => (
                  <div key={s.token} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: '10px' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#2563eb', width: '110px', flexShrink: 0 }}>{s.token}</div>
                    <div style={{ height: '12px', backgroundColor: '#326fd2', borderRadius: '3px', opacity: 0.7, width: `${Math.min(s.px * 2.5, 320)}px`, minWidth: s.px > 0 ? '4px' : '0', transition: 'width 0.3s' }} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', flexShrink: 0 }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Typography System — coded spec */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', marginTop: 'var(--space-8)' }}>Typography Foundations</h4>
              
              {/* Font Sizes & Weights Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
                {/* Font Sizes */}
                <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', padding: 'var(--space-5)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-4)' }}>Font Size Tokens</div>
                  {[
                    { token: 'font.size.100', size: '10px' },
                    { token: 'font.size.200', size: '12px' },
                    { token: 'font.size.300', size: '14px' },
                    { token: 'font.size.400', size: '16px' },
                    { token: 'font.size.500', size: '18px' },
                    { token: 'font.size.600', size: '20px' },
                    { token: 'font.size.700', size: '24px' },
                    { token: 'font.size.800', size: '32px' },
                    { token: 'font.size.1000', size: '36px' },
                    { token: 'font.size.1200', size: '40px' },
                  ].map(fs => (
                    <div key={fs.token} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)', borderBottom: '1px solid #f1f5f9', paddingBottom: 'var(--space-1)' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#2563eb' }}>{fs.token}</span>
                      <span style={{ fontSize: fs.size, fontWeight: 500, color: 'var(--color-text-primary)' }}>Aa</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{fs.size}</span>
                    </div>
                  ))}
                </div>

                {/* Font Weights & Heights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  {/* Font Weights */}
                  <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', padding: 'var(--space-5)', flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-4)' }}>Font Weight Tokens</div>
                    {[
                      { token: 'font.weight.regular', label: 'Regular (400)', weight: '400' },
                      { token: 'font.weight.medium', label: 'Medium (500)', weight: '500' },
                      { token: 'font.weight.semibold', label: 'Semibold (600)', weight: '600' },
                      { token: 'font.weight.bold', label: 'Bold (700)', weight: '700' },
                      { token: 'font.weight.extrabold', label: 'Extra Bold (800)', weight: '800' },
                    ].map(fw => (
                      <div key={fw.token} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)', borderBottom: '1px solid #f1f5f9', paddingBottom: 'var(--space-1)' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#2563eb' }}>{fw.token}</span>
                        <span style={{ fontWeight: fw.weight as any, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{fw.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Typeface */}
                  <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', padding: 'var(--space-5)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>Typeface</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>Inter</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>Used for entire mobile and web UI rendering ensuring high-legibility at micro resolutions.</div>
                  </div>
                </div>
              </div>

              {/* Typestyles Scale (Intent-based) */}
              <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', padding: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-4)' }}>Typestyles Scale (Intent Mappings)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {[
                    { style: 'Display/XLarge', tokenSize: 'font.size.1200', size: '40px', height: '48px', tokenHeight: 'font.height.1300', weights: '400, 500, 600' },
                    { style: 'Display/Large', tokenSize: 'font.size.1100', size: '38px', height: '46px', tokenHeight: 'font.height.1200', weights: '400, 500, 600' },
                    { style: 'Display/Medium', tokenSize: 'font.size.1000', size: '36px', height: '42px', tokenHeight: 'font.height.1100', weights: '400, 500, 600' },
                    { style: 'Display/Small', tokenSize: 'font.size.900', size: '34px', height: '40px', tokenHeight: 'font.height.1000', weights: '400, 500, 600' },
                    { style: 'Heading/2XLarge', tokenSize: 'font.size.800', size: '32px', height: '38px', tokenHeight: 'font.height.900', weights: '400, 600' },
                    { style: 'Heading/XLarge', tokenSize: 'font.size.700', size: '24px', height: '32px', tokenHeight: 'font.height.800', weights: '400, 600' },
                    { style: 'Heading/Large', tokenSize: 'font.size.600', size: '20px', height: '26px', tokenHeight: 'font.height.700', weights: '400, 500, 600' },
                    { style: 'Heading/Medium', tokenSize: 'font.size.500', size: '18px', height: '24px', tokenHeight: 'font.height.600', weights: '400, 500, 600' },
                    { style: 'Heading/Small', tokenSize: 'font.size.400', size: '16px', height: '22px', tokenHeight: 'font.height.500', weights: '400, 500, 600' },
                    { style: 'Label/Large', tokenSize: 'font.size.500', size: '18px', height: '24px', tokenHeight: 'font.height.600', weights: '400, 500' },
                    { style: 'Label/Medium', tokenSize: 'font.size.400', size: '16px', height: '20px', tokenHeight: 'font.height.400', weights: '400, 500' },
                    { style: 'Label/Small', tokenSize: 'font.size.300', size: '14px', height: '16px', tokenHeight: 'font.height.200', weights: '400, 500' },
                    { style: 'Label/XSmall', tokenSize: 'font.size.200', size: '12px', height: '16px', tokenHeight: 'font.height.200', weights: '400, 500' },
                    { style: 'Paragraph/Small', tokenSize: 'font.size.200', size: '12px', height: '18px', tokenHeight: 'font.height.300', weights: '400, 500' },
                    { style: 'Paragraph/XSmall', tokenSize: 'font.size.100', size: '10px', height: '14px', tokenHeight: 'font.height.100', weights: '400, 500' },
                  ].map(ts => (
                    <div key={ts.style} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 'var(--space-3)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 'var(--space-3)', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center' }}>
                      <div style={{ minWidth: '150px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{ts.style}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                          size: {ts.tokenSize} ({ts.size})<br />
                          height: {ts.tokenHeight} ({ts.height})
                        </div>
                      </div>
                      <div style={{ 
                        flex: 1, 
                        fontSize: `calc(${ts.size} * 0.75)`, 
                        lineHeight: `calc(${ts.height} * 0.75)`, 
                        fontWeight: 500,
                        color: 'var(--color-text-tertiary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: isMobile ? '100%' : '380px'
                      }}>
                        Spark Design System Spec
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted-light)', textAlign: 'right', fontFamily: 'monospace' }}>
                        weights: [{ts.weights}]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Complete 24 Component Library Catalog */}
            <section id="components-showcase" style={{ scrollMarginTop: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 'var(--space-20) 0 var(--space-2)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                The Core Catalog: Reusable Component Specifications
              </h3>
              <p style={{ color: 'var(--color-text-tertiary)', lineHeight: 1.75, marginBottom: 'var(--space-8)', fontSize: '1.05rem' }}>
                Once the foundations were solid, I moved on to building the actual components. This is the part that took the most time — not because designing one component is hard, but because doing it properly for 24 of them, with all their variants, states, and edge cases, is a real effort. Here's the full catalog of what I built inside Spark:
              </p>

              <ComponentCatalogGrid componentsList={componentsList} />
            </section>

            {/* Platform Implementation */}
            <section id="platform" style={{ scrollMarginTop: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 'var(--space-20) 0 var(--space-2)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                Bridging the Divide: Mapping Figma to Code
              </h3>
              <p style={{ color: 'var(--color-text-tertiary)', lineHeight: 1.75, marginBottom: 'var(--space-6)', fontSize: '1.05rem' }}>
                Figma is only half the job. A design system that only lives in a design tool is not really a design system — it's just a nice library. For it to actually work, developers need to be able to use it without copy-pasting hex codes. So I mapped our tokens directly into platform-native outputs. Once we exported from Figma, the code was ready to use on web, iOS, and Android without any manual translation:
              </p>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Web (SCSS/CSS)</h4>
              <pre style={codeBlockStyle}>
                <code>
                  <span style={{ color: '#2563eb' }}>.spark-button-primary</span> {'{\n'}
                  {'  '}<span style={{ color: '#059669' }}>background-color</span>: <span style={{ color: '#7c3aed' }}>$spark-color-primary</span>; <span style={{ color: 'var(--color-text-muted-light)' }}>// #0057FF</span>{'\n'}
                  {'  '}<span style={{ color: '#059669' }}>color</span>: <span style={{ color: '#7c3aed' }}>$spark-color-on-primary</span>; <span style={{ color: 'var(--color-text-muted-light)' }}>// #FFFFFF</span>{'\n'}
                  {'  '}<span style={{ color: '#059669' }}>border-radius</span>: <span style={{ color: '#7c3aed' }}>$spark-radius-medium</span>; <span style={{ color: 'var(--color-text-muted-light)' }}>// 8px</span>{'\n'}
                  {'  '}<span style={{ color: '#059669' }}>padding</span>: <span style={{ color: '#7c3aed' }}>$spark-spacing-2 $spark-spacing-4</span>; <span style={{ color: 'var(--color-text-muted-light)' }}>// 8px 16px</span>{'\n'}
                  {'}'}
                </code>
              </pre>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>iOS (SwiftUI)</h4>
              <pre style={codeBlockStyle}>
                <code>
                  <span style={{ color: '#7c3aed' }}>struct</span> <span style={{ color: '#2563eb' }}>SparkButton</span>: <span style={{ color: '#4f46e5' }}>View</span> {'{\n'}
                  {'  '}<span style={{ color: '#7c3aed' }}>var</span> title: <span style={{ color: '#4f46e5' }}>String</span>{'\n'}
                  {'  '}<span style={{ color: '#7c3aed' }}>var</span> action: () -&gt; <span style={{ color: '#4f46e5' }}>Void</span>{'\n'}
                  {'  '}<span style={{ color: '#7c3aed' }}>var</span> body: <span style={{ color: '#7c3aed' }}>some</span> <span style={{ color: '#4f46e5' }}>View</span> {'{\n'}
                  {'    '}<span style={{ color: '#2563eb' }}>Button</span>(action: action) {'{\n'}
                  {'      '}<span style={{ color: '#2563eb' }}>Text</span>(title){'\n'}
                  {'        '}.font(.custom(SparkFonts.primary, size: SparkFontSize.size400)) <span style={{ color: 'var(--color-text-muted-light)' }}>// 16px</span>{'\n'}
                  {'        '}.padding(.horizontal, SparkSpacing.spacing4) <span style={{ color: 'var(--color-text-muted-light)' }}>// 16px</span>{'\n'}
                  {'        '}.padding(.vertical, SparkSpacing.spacing2) <span style={{ color: 'var(--color-text-muted-light)' }}>// 8px</span>{'\n'}
                  {'        '}.background(SparkColor.primary) <span style={{ color: 'var(--color-text-muted-light)' }}>// #0057FF</span>{'\n'}
                  {'        '}.foregroundColor(SparkColor.onPrimary) <span style={{ color: 'var(--color-text-muted-light)' }}>// #FFFFFF</span>{'\n'}
                  {'        '}.cornerRadius(SparkRadius.medium) <span style={{ color: 'var(--color-text-muted-light)' }}>// 8px</span>{'\n'}
                  {'    '}{'}\n'}
                  {'  '}{'}\n'}
                  {'}'}
                </code>
              </pre>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Android (Jetpack Compose)</h4>
              <pre style={codeBlockStyle}>
                <code>
                  <span style={{ color: '#7c3aed' }}>@Composable</span>{'\n'}
                  <span style={{ color: '#7c3aed' }}>fun</span> <span style={{ color: '#2563eb' }}>SparkButton</span>(title: <span style={{ color: '#4f46e5' }}>String</span>, onClick: () -&gt; <span style={{ color: '#4f46e5' }}>Unit</span>) {'{\n'}
                  {'  '}<span style={{ color: '#2563eb' }}>Button</span>({'\n'}
                  {'    '}onClick = onClick,{'\n'}
                  {'    '}colors = ButtonDefaults.buttonColors({'\n'}
                  {'      '}containerColor = SparkTheme.colors.primary, <span style={{ color: 'var(--color-text-muted-light)' }}>// #0057FF</span>{'\n'}
                  {'      '}contentColor = SparkTheme.colors.onPrimary  <span style={{ color: 'var(--color-text-muted-light)' }}>// #FFFFFF</span>{'\n'}
                  {'    '}),{'\n'}
                  {'    '}shape = RoundedCornerShape(SparkTheme.radius.medium), <span style={{ color: 'var(--color-text-muted-light)' }}>// 8dp</span>{'\n'}
                  {'    '}contentPadding = PaddingValues({'\n                   '}horizontal = SparkTheme.spacing.spacing4, <span style={{ color: 'var(--color-text-muted-light)' }}>// 16dp</span>{'\n                   '}vertical = SparkTheme.spacing.spacing2    <span style={{ color: 'var(--color-text-muted-light)' }}>// 8dp</span>{'\n                  '}){'\n'}
                  {'  '}) {'{\n'}
                  {'    '}<span style={{ color: '#2563eb' }}>Text</span>({'\n'}
                  {'      '}text = title,{'\n'}
                  {'      '}fontSize = SparkTheme.typography.size400 <span style={{ color: 'var(--color-text-muted-light)' }}>// 16sp</span>{'\n'}
                  {'    '}){'\n'}
                  {'  '}{'}\n'}
                  {'}'}
                </code>
              </pre>
            </section>

            {/* How Spark Compares */}
            <section id="comparison" style={{ scrollMarginTop: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 'var(--space-20) 0 var(--space-2)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                Design System Benchmarking
              </h3>
              <p style={{ color: '#475569', lineHeight: 1.75, marginBottom: '28px', fontSize: '1.05rem' }}>
                Spark was a one-person job, not a 30-engineer Google effort. But that doesn't mean it can't be compared fairly. Here's an honest look at where Spark stands against Material Design 3 and Razorpay's Blade — two systems I deeply respect.
              </p>

              {/* M3 Comparison (Low emphasis) */}
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '1rem' }}>vs. Material Design 3 (Google)</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>— Industry gold-standard, 50+ engineers</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {[
                    { label: 'Token architecture', spark: '3-tier (Global → Semantic → Component)', comp: '3-tier (Ref → System → Component)' },
                    { label: 'Platform coverage', spark: 'iOS, Android, Web (Figma-first)', comp: 'Android native + Web, deep OS integration' },
                    { label: 'Handoff method', spark: 'Figma Tokens Studio → SCSS/JSON export', comp: 'Material Theme Builder + manual export' },
                    { label: 'Dark mode', spark: 'Token-ready architecture (not shipped)', comp: 'Full automatic inversion via ref tokens' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '180px 1fr 1fr', gap: 'var(--space-2)', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', fontSize: '0.8rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>{row.label}</div>
                      <div style={{ color: '#475569' }}><strong style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Spark:</strong> {row.spark}</div>
                      <div style={{ color: 'var(--color-text-muted)' }}><strong style={{ fontWeight: 600, color: '#475569' }}>M3:</strong> {row.comp}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginTop: 'var(--space-3)', fontStyle: 'italic' }}>
                  <strong>Verdict:</strong> Structurally, Spark and M3 are doing the same thing — same token hierarchy, same semantic aliasing, same component-level overrides. The gap is that M3 has Compose codegen and covers 50+ components. For a solo system, that kind of parity is actually quite something.
                </p>
              </div>

              {/* Blade Comparison (Low emphasis) */}
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '1rem' }}>vs. Razorpay Blade</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>— India's most documented fintech system</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {[
                    { label: 'Token naming convention', spark: 'Brand-contextual (spark.color.primary)', comp: 'Intent-based (feedback.icon.positive)' },
                    { label: 'Component count', spark: '24 components + typography tokens', comp: '40+ components + motion tokens' },
                    { label: 'Documentation quality', spark: 'Figma-native + this case study', comp: 'Storybook + full MDX docs site' },
                    { label: 'Accessibility', spark: 'WCAG AA targets defined in tokens', comp: 'AAA with automated a11y testing' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '180px 1fr 1fr', gap: 'var(--space-2)', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', fontSize: '0.8rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>{row.label}</div>
                      <div style={{ color: '#475569' }}><strong style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Spark:</strong> {row.spark}</div>
                      <div style={{ color: 'var(--color-text-muted)' }}><strong style={{ fontWeight: 600, color: '#475569' }}>Blade:</strong> {row.comp}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Developer Collaboration */}
            <section id="handoff" style={{ scrollMarginTop: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 'var(--space-20) 0 var(--space-2)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                Design-to-Dev Handoff Pipeline
              </h3>
              <p style={{ color: '#475569', lineHeight: 1.75, marginBottom: 'var(--space-6)', fontSize: '1.05rem' }}>
                Honestly, I quickly realised that designing is the easy part — keeping design and code in sync is where things actually get complicated. Without a proper process, the Figma file and the codebase would drift apart within a week. So I set up a structured handoff cycle so that didn't happen:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                {[
                  { step: '01', title: 'Figma Tokens Studio', desc: 'All design tokens live inside Figma as a structured JSON object, managed through the Tokens Studio plugin. Change a colour or spacing value there — the token file updates automatically.' },
                  { step: '02', title: 'Token Export Pipeline', desc: 'Tokens get exported through Style Dictionary and transformed into platform-specific outputs: SCSS variables for web, .xcconfig files for iOS, and resource files for Android. One source, three outputs.' },
                  { step: '03', title: 'PR Lint Checks', desc: 'I wrote a custom ESLint rule that blocks hardcoded values in component code. Write `color: #0057FF` without a token reference and the CI pipeline will reject the PR — no exceptions.' },
                  { step: '04', title: 'Semantic Versioning', desc: 'Renaming or removing a token triggers a major version bump. Adding new tokens is a minor bump. This way, teams consuming the system always know when they need to do migration work.' },
                ].map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-lg)', background: '#326fd2', color: '#fff', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.step}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.95rem', marginBottom: 'var(--space-1)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.65 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Before & After */}
            <section id="impact" style={{ scrollMarginTop: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 'var(--space-20) 0 var(--space-2)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                Crafting Systems Manually: Reflection and Ripple Effect
              </h3>

              {/* Challenges Subsection */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Project Challenges</h4>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-6)', fontSize: '1.05rem' }}>
                This project was done nearly three years back, before any AI tool could help you build token hierarchies or auto-generate documentation. Every variable, every cross-platform naming decision, every token relationship — all of it was worked out by hand. The hard part wasn't designing the components. It was designing a logic structure that could actually scale as the team grew, without becoming a pain to work with.
              </p>

              {/* Impact Cards */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Systemic Impact Projections</h4>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                {[
                  { metric: '~80%', label: 'Inconsistency Reduction', detail: 'Once token adoption replaces local overrides, the kind of visual mismatches we saw between Android and iOS screens are expected to drop dramatically — similar migrations at Airbnb brought it down by 75–85%.' },
                  { metric: '2×', label: 'Feature Release Speed', detail: 'Pre-approved token modules mean teams skip the "what colour is this button?" back-and-forth entirely. Documented components can go straight to implementation.' },
                  { metric: '~47%', label: 'Faster Front-end Dev', detail: 'Design systems cut UI implementation time by 47% vs. building from scratch — this is from a Forrester-cited study. Spark\'s token exports and documented components are built to hit that same ceiling.' },
                  { metric: '3x', label: 'Fewer QA Iterations', detail: 'When the design specs and the code tokens are literally the same values, the "looks different in staging" problem mostly disappears. Fewer review cycles, fewer bug reports.' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-5)', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#326fd2', letterSpacing: '-0.03em', marginBottom: 'var(--space-1)' }}>{item.metric}</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.9rem', marginBottom: 'var(--space-2)' }}>{item.label}</div>
                    <div style={{ fontSize: '0.79rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.detail}</div>
                  </div>
                ))}
              </div>

              {/* Reflection Callout */}
              <div style={{ 
                padding: 'var(--space-6)', 
                background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)', 
                borderRadius: 'var(--radius-2xl)', 
                border: '1px solid #e0e7ff',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.05)',
                marginBottom: 'var(--space-4)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <Icon icon="solar:stars-minimalistic-bold" width={18} color="#6366f1" />
                  <span style={{ fontWeight: 800, color: '#4f46e5', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Internship Reflection</span>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '0.86rem', color: '#3730a3', lineHeight: 1.7 }}>
                  This was the first project where I really understood that design isn't only about making screens look good. It's about building systems that help the whole team move faster, more consistently, and with less confusion. Spark taught me to think in patterns — not just pages — and to design things that could be handed off without a 30-minute explanation.
                </p>
                <p style={{ margin: 0, fontSize: '0.86rem', color: '#3730a3', lineHeight: 1.7, fontWeight: 600 }}>
                  Even now, whenever I start on a new feature, the first question I ask is: "Can this be part of the system, or am I just solving it for one screen?"
                </p>
              </div>
            </section>            
          </div>

        </div>

        {/* Floating Right-Sticked Table of Contents */}
        {!isMobile && (
          <div className={`floating-toc ${showToC ? 'visible' : ''}`}>
            <h4 style={{ 
              fontSize: '0.68rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              color: '#326fd2', 
              fontWeight: 700, 
              marginBottom: '10px',
              fontFamily: FONTS.primary
            }}>
              Table of Contents
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {sections.map((sec) => {
                const isActive = activeSection === sec.id
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleIndexClick(sec.id)}
                    className={`toc-btn ${isActive ? 'active' : ''}`}
                    style={{ fontFamily: FONTS.primary }}
                  >
                    {sec.title}
                  </button>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* Dock navigation bar */}
      <Dock
        isDark
        items={[
          { icon: <Icon icon="solar:arrow-left-outline" width={22} color="#ffffff" />, label: 'Back', onClick: () => navigate(-1) },
          { icon: <Icon icon="solar:home-2-outline" width={22} color="#ffffff" />, label: 'Home', onClick: () => navigate('/') },
          { icon: <Icon icon="solar:file-outline" width={22} color="#ffffff" />, label: 'Resume', onClick: () => navigate('/resume') },
          { icon: <Icon icon="solar:user-outline" width={22} color="#ffffff" />, label: 'About me', onClick: () => navigate('/about') }
        ]}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />
    </div>
  )
}
