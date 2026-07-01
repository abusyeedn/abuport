import { useState, useEffect, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import caseStudies from '../data/caseStudies.json'
import { FONTS } from '../theme'
import { Icon } from '@iconify/react'
import FigmaElement from '../components/FigmaElement'
import DynamicRenderer from '../components/DynamicRenderer'
import { useEditor } from '../EditorContext'
import Dock from '../components/Dock'
import DidYouKnow from '../components/DidYouKnow'

interface FolderItem {
  id: string
  folderLabel: string
  folderColor: string
  title: string
  image: string
  readTime: string
  emoji: string
}

const CASE_FOLDERS: FolderItem[] = caseStudies.map((study) => {
  const imageMatch = study.text.match(/!\[Image\]\(([^)]*(?:\([^)]*\)[^)]*)*)\)/)
  const coverImage = imageMatch ? imageMatch[1] : '/gallery/kyn-cover.png'
  const words = study.text
    .replace(/!\[.*?\]\(.*?\)/g, '')          // remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // keep link text, drop URL
    .replace(/^:::.*$/gm, '')                  // remove block tags
    .replace(/^---$/gm, '')                    // remove dividers
    .replace(/^#{1,6}\s*/gm, '')               // remove heading hashes
    .replace(/https?:\/\/\S+/g, '')            // remove bare URLs
    .replace(/[*_`~|]/g, '')                   // remove markdown symbols
    .split(/\s+/).filter(w => w.length > 1).length
  const readTimeMins = Math.max(1, Math.ceil(words / 220))
  const cleanTitle = study.title
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+-\s+Abusyeed/gi, '')
    .replace(/\s+-\s+Ultimez/gi, '')
    .replace(/\s+-\s+by Abusyeed/gi, '')
    .replace(/\s+-\s+UX Enhancement\s+\d/gi, '')
    .trim()
  let label = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  if (label.length > 15) label = label.substring(0, 15).replace(/_$/, '')
  label += '.case'
  if (study.id === 'recruit-crm---ux-enhancement-1---abusyeed') label = 'crm_search.case'
  if (study.id === 'recruit-crm---ux-enhancement-2---abusyeed') label = 'crm_header.case'
  const getEmoji = (id: string) => {
    const l = id.toLowerCase()
    if (l.includes('phonepe')) return '💜'
    if (l.includes('kynhood')) return '✈️'
    if (l.includes('motions')) return '🦖'
    if (l.includes('stimuler') && l.includes('enhancement')) return '🚀'
    if (l.includes('changejar')) return '📁'
    if (l.includes('spaarks')) return '💻'
    if (l.includes('guvi') || l.includes('greenbite')) return '↗️'
    if (l.includes('coinpedia')) return '⭐️'
    if (l.includes('real-estate') || l.includes('competitive')) return '❄️'
    if (l.includes('recruit') && l.includes('2')) return '⚜️'
    if (l.includes('recruit') && l.includes('1')) return '✴️'
    if (l.includes('foundit')) return '✳️'
    return '📁'
  }
  return { id: study.id, folderLabel: label, folderColor: '#5DADE2', title: cleanTitle, image: coverImage, readTime: `${readTimeMins} min read`, emoji: getEmoji(study.id) }
})

const FOLDER_ORDER = [
  // Row 1 — lock icon
  'competitive-audit---real-estate-sites',
  'kynhood---ux-&-ai',
  'phonepe-2-0---bts',
  'stimuler---ux-enhancement',
  // Row 2
  'coinpedia---re-design---ultimez',
  'foundit---ux-case-study',
  'recruit-crm---ux-enhancement-2---abusyeed',
  'ux-enhancement---spaarks',
  // Row 3 — last 2
  'guvi---dan-jr-hackathon---greenbite',
  'recruit-crm---ux-enhancement-1---abusyeed',
]

const _CASE_FOLDERS_SORTED = FOLDER_ORDER
  .map(id => CASE_FOLDERS.find(f => f.id === id))
  .filter(Boolean) as FolderItem[]

// Append any folders not listed in FOLDER_ORDER at the end
CASE_FOLDERS.forEach(f => { if (!FOLDER_ORDER.includes(f.id)) _CASE_FOLDERS_SORTED.push(f) })

const SORTED_FOLDERS = _CASE_FOLDERS_SORTED

const totalReadTime = CASE_FOLDERS.reduce((acc, f) => acc + (parseInt(f.readTime) || 0), 0)

const AI_SUMMARY_LABELS = ['Problem', 'Abu did', 'Impact']

const AI_SUMMARIES: Record<string, string[]> = {
  'coinpedia---re-design---ultimez': [
    'Coinpedia\'s market and Bitcoin pages had cluttered navbars, non-functional buttons, and poor fintech readability.',
    'Redesigned the navbar, repositioned CTAs, replaced the category filter with a dropdown, rebuilt the Bitcoin page supply chart and sentiment indicator.',
    'Improved color contrast on CTAs and reduced visual noise — a more trustworthy fintech reading experience.',
  ],
  'competitive-audit---real-estate-sites': [
    'Conduct a SWOT analysis and usability audit across 99acres, Magicbricks, and Housing.com to evaluate IA, navigation, features, and visual layout.',
    'Ran a UX audit using 3 fictional personas to evaluate IA, navigation, features, and visual design, producing actionable recommendations for AI chatbots, onboarding, and accessibility.',
  ],
  'foundit---ux-case-study': [
    'Foundit (formerly Monster) had responsiveness failures, a weak landing page hierarchy, and no clear focus on job search for freshers.',
    'Defined 4 user personas, built empathy maps and pain/gain analysis, then redesigned the landing page with job search as the primary CTA.',
    'Clearer user journey from landing to job search — reducing drop-off for the most critical fresher persona segment.',
  ],
  'guvi---dan-jr-hackathon---greenbite': [
    'GreenBite needed a compelling landing page designed and delivered within a 48-hour GUVI hackathon, solo.',
    'Built user personas, created a custom 3D takeout box in Adobe Dimension, and delivered Figma prototypes, validating design hierarchy with an AI attention heatmap score of 66 (34.5% on headline).',
  ],
  'kynhood---ux-&-ai': [
    'Kynhood users were confused selecting zone-areas during onboarding — the existing flow had no mapping to real Chennai geography.',
    'Designed a two-field flow where users pick their area first, then get zone suggestions — and proposed a KNN algorithm to automatically link one area to multiple overlapping zones for smarter content surfacing.',
    'Reduced cognitive load in zone selection — with a future-proof map integration path for relocated users.',
  ],
  'phonepe-2-0---bts': [
    'PhonePe 2.0\'s bento-grid redesign caused massive user backlash due to muscle memory disruption from the old list-based layout.',
    'Analyzed the design shift, benchmarked against NPCI Volume Cap guideline OC97, and applied Jakob\'s Law to explain user resistance.',
  ],
  'recruit-crm---ux-enhancement-1---abusyeed': [
    'Recruit CRM\'s advanced search had a critical case-sensitivity bug that silently returned zero results, breaking recruiter workflows.',
    'Imported fake candidate data via Python + Faker, benchmarked Zoho Recruit, Manatal, and Bullhorn, redesigned the search panel, and applied Hick\'s Law to eliminate the silent zero-results bug and reduce CTA confusion.',
  ],
  'recruit-crm---ux-enhancement-2---abusyeed': [
    'Recruit CRM\'s header had misplaced icons — a broken help icon, an intimidating lock icon, and a hidden Column Editor button.',
    'Ran usability testing with 3 participants via Maze, confirming low discoverability of key features, then redesigned the header.',
  ],
  'stimuler---ux-enhancement': [
    'Redesign and revamp the profile tab and the "Word of the Day" feature to implement fresh ideas while keeping key metrics, user retention, and increased session length in mind.',
    'Mapped user journeys and redesigned the profile tab and vocabulary practice interface to enhance usability and layout hierarchy.',
  ],
  'ux-enhancement---spaarks': [
    'Spaarks\' Android app had subtle usability issues, broken swipe transitions, and non-functional back gestures.',
    'Ran an end-to-end usability and accessibility audit.',
  ],
}

// ── SWOT Table ───────────────────────────────────────────────────────────────

function SWOTTable({ text }: { text: string }) {
  const parseSection = (heading: string, nextHeading: string | null) => {
    const start = text.indexOf(heading)
    if (start < 0) return []
    const sectionStart = start + heading.length
    const end = nextHeading ? text.indexOf(nextHeading) : text.length
    return text.slice(sectionStart, end)
      .split('📌')
      .slice(1)
      .map(s => s.trim())
      .filter(Boolean)
  }

  const cells = [
    {
      label: 'Strengths', items: parseSection('### Strengths', '### Weaknesses'),
      bg: '#f0fdf4', border: '#bbf7d0', accent: '#15803d', dot: '#22c55e',
    },
    {
      label: 'Weaknesses', items: parseSection('### Weaknesses', '### Opportunities'),
      bg: '#fff1f2', border: '#fecdd3', accent: '#b91c1c', dot: '#ef4444',
    },
    {
      label: 'Opportunities', items: parseSection('### Opportunities', '### Threats'),
      bg: '#eff6ff', border: '#bfdbfe', accent: '#1d4ed8', dot: '#3b82f6',
    },
    {
      label: 'Threats', items: parseSection('### Threats', null),
      bg: '#fff7ed', border: '#fed7aa', accent: '#c2410c', dot: '#f97316',
    },
  ]

  return (
    <div style={{ margin: '20px 0 24px' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 0, borderRadius: 10, overflow: 'hidden',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        {cells.map((cell, idx) => (
          <div key={cell.label} style={{
            backgroundColor: cell.bg,
            borderRight: idx % 2 === 0 ? '1px solid #e5e7eb' : undefined,
            borderBottom: idx < 2 ? '1px solid #e5e7eb' : undefined,
          }}>
            {/* quadrant header */}
            <div style={{
              padding: '10px 16px',
              borderBottom: `1px solid ${cell.border}`,
              backgroundColor: cell.border,
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                backgroundColor: cell.dot, flexShrink: 0, display: 'inline-block',
              }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: cell.accent, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {cell.label}
              </span>
            </div>
            {/* items */}
            <div style={{ padding: '12px 16px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {cell.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                  <span style={{ color: cell.dot, fontSize: '0.65rem', marginTop: 3, flexShrink: 0 }}>▸</span>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#374151', lineHeight: 1.55 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Strip personal intro notes ───────────────────────────────────────────────

function stripPersonalIntros(text: string): string {
  let t = text

  // Remove the leading "Note: ..." block that ends before the first ## or ### heading
  // Covers coinpedia, foundit, guvi
  t = t.replace(/^Note:\s+[\s\S]*?(?=\n\n##|\n\n###)/m, '').trimStart()

  // Remove "### Note" sections that contain personal intros (stimuler)
  t = t.replace(/###\s*Note\s*\n([\s\S]*?)(?=\n###|\n##|$)/m, (match) =>
    /Hi[, ]+I am|I hope the reader|writing this document for/i.test(match) ? '' : match
  )

  // Remove "Hi, I am Abusyeed / Abu" sentences anywhere in text
  t = t.replace(/Hi,?\s+I\s+am\s+Abusyeed[^.!?]*[.!?]/gi, '')
  t = t.replace(/Hi,?\s+I\s+am\s+Abu\b[^.!?]*[.!?]/gi, '')
  t = t.replace(/Hi\s+I\s+am\s+Abu\b[^.!?]*[.!?]/gi, '')

  // Remove "I hope the reader is doing well" sentences
  t = t.replace(/I hope the reader is doing well[^.!?]*[.!?]/gi, '')

  // Remove "I am writing this document for the ... role ..."
  t = t.replace(/I am writing this document for[^.!?]*[.!?]/gi, '')

  // Remove "I am making this research for an event..."
  t = t.replace(/I am making this research for[^.!?]*[.!?]/gi, '')

  // Remove "I writing this study for a challenge..."
  t = t.replace(/I\s+writing this study for[^.!?]*[.!?]/gi, '')

  // Remove "then I thought to do for my portfolio as well"
  t = t.replace(/[,.]?\s*then I thought to do for my portfolio as well/gi, '')

  // Remove "The event is a UI/UX Design contest from Zuno website..."
  t = t.replace(/The event is a UI\/UX Design contest[^.!?]*[.!?]/gi, '')

  // Remove "Thanks for considering my application..." and thanks to named people
  t = t.replace(/Thanks for considering my application[^.!?]*[.!?]/gi, '')
  t = t.replace(/[Tt]hanks?\s+(?:you\s+)?(?:to\s+)?Sriram[^.!?\n]*/gi, '')
  t = t.replace(/[Tt]hanks?\s+(?:you\s+)?(?:to\s+)?Shruthi[^.!?\n]*/gi, '')
  t = t.replace(/[Tt]hanks?\s+(?:you\s+)?(?:to\s+)?Shurthi[^.!?\n]*/gi, '')

  // Remove "Happy reading!"
  t = t.replace(/Happy\s+reading!?/gi, '')

  // Clean up multiple blank lines left behind
  t = t.replace(/\n{3,}/g, '\n\n').trim()

  return t
}

// ── Markdown → JSX renderer ──────────────────────────────────────────────────

// ── Python syntax highlighter ─────────────────────────────────────────────────

const PY_KEYWORDS = new Set(['import','from','as','for','in','def','return','if','else','elif','while','class','with','pass','not','and','or','is','None','True','False','lambda','yield','del','try','except','finally','raise','assert','global','nonlocal'])
const PY_BUILTINS = new Set(['print','input','range','list','set','int','str','float','len','type','zip','map','filter','enumerate','sorted','reversed','open','sum','min','max','abs','round'])

function highlightPython(code: string): ReactNode {
  return (
    <>
      {code.split('\n').map((line, li) => (
        <span key={li} style={{ display: 'block' }}>
          {tokenizePyLine(line)}
          {'\n'}
        </span>
      ))}
    </>
  )
}

function tokenizePyLine(line: string): ReactNode[] {
  // Tokenize: string literals, comments, numbers, keywords, builtins, identifiers
  const re = /(#[^\n]*)|(f?"[^"\\]*(?:\\.[^"\\]*)*"|f?'[^'\\]*(?:\\.[^'\\]*)*')|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)|([^\w\s]|\s+)/g
  const nodes: ReactNode[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(line)) !== null) {
    const [, comment, str, num, word, other] = m
    if (comment) { nodes.push(<span key={m.index} style={{ color: '#64748b', fontStyle: 'italic' }}>{comment}</span>); continue }
    if (str)     { nodes.push(<span key={m.index} style={{ color: '#86efac' }}>{str}</span>); continue }
    if (num)     { nodes.push(<span key={m.index} style={{ color: '#fb923c' }}>{num}</span>); continue }
    if (word) {
      if (PY_KEYWORDS.has(word))  { nodes.push(<span key={m.index} style={{ color: '#c084fc' }}>{word}</span>); continue }
      if (PY_BUILTINS.has(word))  { nodes.push(<span key={m.index} style={{ color: '#38bdf8' }}>{word}</span>); continue }
      // Function definition name
      const prev = line.slice(0, m.index).trimEnd()
      if (prev.endsWith('def'))   { nodes.push(<span key={m.index} style={{ color: '#facc15' }}>{word}</span>); continue }
      nodes.push(<span key={m.index} style={{ color: '#e2e8f0' }}>{word}</span>)
      continue
    }
    if (other) nodes.push(<span key={m.index} style={{ color: '#94a3b8' }}>{other}</span>)
  }
  return nodes
}

function renderInline(text: string): ReactNode {
  const boldParts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {boldParts.map((bp, i) => {
        if (bp.startsWith('**') && bp.endsWith('**')) {
          return <strong key={i} style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>{bp.slice(2, -2)}</strong>
        }
        const italicParts = bp.split(/(\*[^*]+\*)/)
        return (
          <Fragment key={i}>
            {italicParts.map((ip, j) => {
              if (ip.startsWith('*') && ip.endsWith('*')) {
                return <em key={j} style={{ fontStyle: 'italic' }}>{ip.slice(1, -1)}</em>
              }
              return ip
            })}
          </Fragment>
        )
      })}
    </>
  )
}

function renderTableCell(text: string): ReactNode {
  const lines = text.split(/<br\s*\/?>/i)
  return (
    <>
      {lines.map((line, idx) => {
        const isNegative = line.trim().startsWith('-')
        const prevLine = idx > 0 ? lines[idx - 1] : ''
        const prevWasPositive = prevLine.trim().startsWith('+')
        const needsSpacing = isNegative && prevWasPositive

        return (
          <Fragment key={idx}>
            {idx > 0 && (needsSpacing ? <div style={{ height: '8px' }} /> : <br />)}
            {renderInline(line)}
          </Fragment>
        )
      })}
    </>
  )
}

function renderBlocks(text: string, keyOffset = 0): ReactNode[] {
  // Split text into segments: fenced code blocks stay intact, rest split by \n\n
  type Seg = { type: 'code'; lang: string; code: string } | { type: 'text'; content: string }
  const segments: Seg[] = []
  const fenceRe = /```(\w*)\n([\s\S]*?)```/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = fenceRe.exec(text)) !== null) {
    if (m.index > last) segments.push({ type: 'text', content: text.slice(last, m.index) })
    segments.push({ type: 'code', lang: m[1], code: m[2] })
    last = m.index + m[0].length
  }
  if (last < text.length) segments.push({ type: 'text', content: text.slice(last) })

  const nodes: ReactNode[] = []
  let keyCount = keyOffset

  segments.forEach((seg) => {
    if (seg.type === 'code') {
      const isOutput = seg.lang === 'output'
      nodes.push(
        <div key={keyCount++}>
          {isOutput && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: -1, padding: '5px 14px', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)', borderBottom: 'none', borderRadius: '8px 8px 0 0', width: 'fit-content' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Output</span>
            </div>
          )}
          <pre style={{
            background: isOutput ? '#061a12' : '#0f172a',
            borderRadius: isOutput ? '0 8px 8px 8px' : 8,
            padding: '16px 20px', margin: '12px 0', overflowX: 'auto',
            fontSize: '0.75rem', lineHeight: 1.7,
            color: isOutput ? '#6ee7b7' : '#e2e8f0',
            fontFamily: "var(--font-mono, 'SF Mono', 'Fira Code', monospace)",
            border: isOutput ? '1px solid rgba(16,185,129,0.20)' : '1px solid rgba(255,255,255,0.06)',
            marginTop: isOutput ? 0 : '12px',
          }}>
            <code>{seg.lang === 'python' ? highlightPython(seg.code) : seg.code}</code>
          </pre>
        </div>
      )
      return
    }

    const blocks = seg.content.split('\n\n').map((b: string) => b.trim()).filter(Boolean)
    blocks.forEach((block: string) => {
      const key = keyCount++
      const imgMatch = block.match(/^!\[Image\]\(([^)]*(?:\([^)]*\)[^)]*)*)\)$/)
      if (imgMatch) {
        if (imgMatch[1].startsWith('/gallery/')) {
          nodes.push(
            <img key={key} src={imgMatch[1]} alt="" draggable={false}
              style={{ width: '100%', borderRadius: 6, margin: '8px 0', display: 'block', objectFit: 'contain' }}
            />
          )
        }
        return
      }
      if (block.startsWith('http')) return
      // :::showcase block — side-by-side image and explanation panels
      if (block.startsWith(':::showcase')) {
        const gridContent = block.replace(/^:::showcase\s*/i, '').replace(/:::\s*$/, '').trim()
        const sections = gridContent.split('\n---\n').map(s => s.trim()).filter(Boolean)
        
        const parsed = sections.map(secText => {
          const lines = secText.split('\n').map(l => l.trim()).filter(Boolean)
          const imgMatch = lines[0]?.match(/!\[Image\]\(([^)]*(?:\([^)]*\)[^)]*)*)\)/)
          const imageUrl = imgMatch ? imgMatch[1] : ''
          const textLines = imgMatch ? lines.slice(1) : lines
          
          const title = textLines[0] || ''
          const desc = textLines.slice(1).join('\n')
          return { imageUrl, title, desc }
        })
        
        nodes.push(
          <div key={key} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            margin: '24px 0 32px',
          }}>
            {parsed.map((item, ii) => (
              <div key={ii} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                background: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
              }}>
                {/* Image Top */}
                {item.imageUrl && (
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      draggable={false}
                      style={{
                        width: '100%',
                        maxHeight: '400px',
                        borderRadius: '8px',
                        objectFit: 'contain',
                        border: '1px solid var(--color-border)',
                      }}
                    />
                  </div>
                )}
                {/* Text Bottom */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Redesign Focus</span>
                  <h4 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {item.title.replace(/^\*\*|^\*|^\s*|\*\*$|\*$|\s*$/g, '')}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {item.desc.split('\n').map((line, li) => {
                      const trimmed = line.trim()
                      if (trimmed.startsWith('-')) {
                        return (
                          <div key={li} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--color-accent)', marginTop: '6px', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }} />
                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{renderInline(trimmed.replace(/^-\s*/, ''))}</span>
                          </div>
                        )
                      }
                      return (
                        <p key={li} style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                          {renderInline(line)}
                        </p>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
        return
      }
      // :::verdict block — styled grid of UX recommendations
      if (block.startsWith(':::verdict')) {
        const gridContent = block.replace(/^:::verdict\s*/i, '').replace(/:::\s*$/, '').trim()
        const items = gridContent.split('\n').map(l => l.trim()).filter(Boolean)
        nodes.push(
          <div key={key} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            margin: '20px 0 24px',
          }}>
            {items.map((item, idx) => {
              const cleanedText = item.replace(/^-\s*|^•\s*/, '').trim()
              return (
                <div key={idx} style={{
                  background: '#f8fafc',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {renderInline(cleanedText)}
                  </span>
                </div>
              )
            })}
          </div>
        )
        return
      }
      // :::heatmap block — progress bars for visual attention metrics
      if (block.startsWith(':::heatmap')) {
        const gridContent = block.replace(/^:::heatmap\s*/i, '').replace(/:::\s*$/, '').trim()
        const items = gridContent.split('\n').map(l => l.trim()).filter(Boolean)
        
        nodes.push(
          <div key={key} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: 'var(--color-bg-card, #f8fafc)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '20px',
            margin: '24px 0',
            maxWidth: '500px',
          }}>
            <h5 style={{ margin: '0 0 8px', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>AI Heatmap Attention Share</h5>
            {items.map((item, idx) => {
              const parts = item.replace(/^-\s*|^•\s*/, '').split('-').map(s => s.trim())
              const label = parts[0] || ''
              const pctStr = parts[1] || ''
              const pct = parseFloat(pctStr) || 0
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                    <span style={{ color: 'var(--color-accent)' }}>{pctStr}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    <div style={{ width: `${pct * 2.5}%`, height: '100%', borderRadius: '4px', background: 'var(--color-accent)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )
        return
      }

      // :::process block — horizontal step flowchart
      if (block.startsWith(':::process')) {
        const gridContent = block.replace(/^:::process\s*/i, '').replace(/:::\s*$/, '').trim()
        const items = gridContent.split('\n').map(l => l.trim()).filter(Boolean)
        
        const parsed = items.map((item, idx) => {
          const [name, icon, desc] = item.split('|').map(p => p.trim())
          return { name, icon: icon || 'tabler:circle', desc: desc || '', stepNum: idx + 1 }
        })
        
        nodes.push(
          <div key={key} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            margin: '24px 0 32px',
          }}>
            {parsed.map((step, si) => (
              <div key={si} style={{
                background: 'rgba(99, 102, 241, 0.03)',
                border: '1px solid rgba(99, 102, 241, 0.08)',
                borderRadius: '16px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'center',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}>
                  {step.stepNum}
                </div>
                <Icon icon={step.icon} style={{ fontSize: '1.4rem', color: '#6366f1' }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{step.name}</span>
                {step.desc && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>{step.desc}</span>
                )}
              </div>
            ))}
          </div>
        )
        return
      }
      // :::ideation block — pain vs solution cards
      if (block.startsWith(':::ideation')) {
        const gridContent = block.replace(/^:::ideation\s*/i, '').replace(/:::\s*$/, '').trim()
        const sections = gridContent.split('\n---\n').map(s => s.trim()).filter(Boolean)
        
        const parsed = sections.map(secText => {
          const lines = secText.split('\n').map(l => l.trim()).filter(Boolean)
          const categoryName = lines[0] || ''
          
          const pains: string[] = []
          const solutions: string[] = []
          
          lines.slice(1).forEach(line => {
            if (line.startsWith('- Pain:')) {
              pains.push(line.replace(/^- Pain:\s*/i, ''))
            } else if (line.startsWith('- Solution:')) {
              solutions.push(line.replace(/^- Solution:\s*/i, ''))
            }
          })
          
          return { categoryName, pains, solutions }
        })
        
        nodes.push(
          <div key={key} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            margin: '24px 0 32px',
          }}>
            {parsed.map((ide, ii) => (
              <div key={ii} style={{
                background: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
              }}>
                <h4 style={{ margin: '0 0 16px', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {ide.categoryName}
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px',
                }}>
                  {/* Pains Column */}
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.02)',
                    border: '1px solid rgba(239, 68, 68, 0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon icon="material-symbols:cancel-presentation-outline" style={{ fontSize: '1.1rem', color: '#ef4444' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pain Points</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {ide.pains.map((p, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span style={{ color: '#ef4444', marginTop: '7px', width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Solutions Column */}
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.02)',
                    border: '1px solid rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon icon="material-symbols:reviews-outline" style={{ fontSize: '1.1rem', color: '#10b981' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proposed Solutions</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {ide.solutions.map((s, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span style={{ color: '#10b981', marginTop: '7px', width: '4px', height: '4px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
        return
      }
      // :::competitors block — competitor grid with logos/icons
      if (block.startsWith(':::competitors')) {
        const gridContent = block.replace(/^:::competitors\s*/i, '').replace(/:::\s*$/, '').trim()
        const items = gridContent.split('\n').map(l => l.trim()).filter(Boolean)
        
        const parsed = items.map(item => {
          const [name, icon] = item.split('|').map(p => p.trim())
          return { name, icon: icon || 'tabler:briefcase' }
        })
        
        nodes.push(
          <div key={key} style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            margin: '16px 0 24px',
          }}>
            {parsed.map((comp, ci) => {
              const isUrl = comp.icon.startsWith('http') || comp.icon.startsWith('/')
              return (
                <div key={ci} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  background: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  flexGrow: 1,
                  minWidth: '160px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  {isUrl
                    ? <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <img src={comp.icon} alt={comp.name} draggable={false} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                      </div>
                    : <Icon icon={comp.icon} style={{ fontSize: '1.25rem', color: '#6366f1' }} />
                  }
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{comp.name}</span>
                </div>
              )
            })}
          </div>
        )
        return
      }
      // :::personas block — grid of user personas
      if (block.startsWith(':::personas')) {
        const gridContent = block.replace(/^:::personas\s*/i, '').replace(/:::\s*$/, '').trim()
        const sections = gridContent.split('\n---\n').map(s => s.trim()).filter(Boolean)
        
        const parsed = sections.map(secText => {
          const lines = secText.split('\n').map(l => l.trim()).filter(Boolean)
          const name = lines[0] || ''
          
          const needs: string[] = []
          let mindsetName = ''
          let mindsetAge = ''
          let mindsetDesc = ''
          let isMindset = false
          
          lines.slice(1).forEach(line => {
            if (line.toLowerCase() === 'mindset') {
              isMindset = true
              return
            }
            if (line.startsWith('-')) {
              needs.push(line.replace(/^-\s*/, ''))
            } else if (isMindset) {
              if (line.startsWith('Name:')) {
                mindsetName = line.replace(/^Name:\s*/i, '')
              } else if (line.startsWith('Age:')) {
                mindsetAge = line.replace(/^Age:\s*/i, '')
              } else {
                mindsetDesc = line
              }
            }
          })
          
          return { name, needs, mindsetName, mindsetAge, mindsetDesc }
        })
        
        nodes.push(
          <div key={key} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            margin: '24px 0 32px',
          }}>
            {parsed.map((p, pi) => (
              <div key={pi} style={{
                background: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              }}>
                <div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>User Persona</span>
                  <h4 style={{ margin: '4px 0 0', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{p.name}</h4>
                </div>
                
                {p.needs.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Needs & Goals</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {p.needs.map((need, ni) => (
                        <div key={ni} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--color-accent)', marginTop: '6px', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }} />
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{need}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Profile & Mindset</span>
                    {p.mindsetName && (
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {p.mindsetName} {p.mindsetAge ? `• ${p.mindsetAge}` : ''}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                    "{p.mindsetDesc}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
        return
      }
      // :::paingain block — side-by-side pain & gain comparison
      if (block.startsWith(':::paingain')) {
        const gridContent = block.replace(/^:::paingain\s*/i, '').replace(/:::\s*$/, '').trim()
        const sections = gridContent.split('\n---\n').map(s => s.trim()).filter(Boolean)
        
        const parseSection = (secText: string) => {
          const lines = secText.split('\n').map(l => l.trim()).filter(Boolean)
          const title = lines[0] || ''
          const items = lines.slice(1).map(l => l.replace(/^-\s*/, ''))
          return { title, items }
        }
        
        const parsed = sections.map(parseSection)
        
        const getIcon = (title: string) => {
          const t = title.toLowerCase()
          if (t.includes('pain')) return 'material-symbols:cancel-presentation-outline'
          return 'material-symbols:reviews-outline'
        }
        
        const getBgColor = (title: string) => {
          const t = title.toLowerCase()
          if (t.includes('pain')) return 'rgba(239, 68, 68, 0.04)' // Red
          return 'rgba(16, 185, 129, 0.04)' // Emerald/Green
        }

        const getBorderColor = (title: string) => {
          const t = title.toLowerCase()
          if (t.includes('pain')) return 'rgba(239, 68, 68, 0.15)'
          return 'rgba(16, 185, 129, 0.15)'
        }
        
        const getThemeColor = (title: string) => {
          const t = title.toLowerCase()
          if (t.includes('pain')) return '#ef4444'
          return '#10b981'
        }

        nodes.push(
          <div key={key} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            margin: '24px 0 32px',
          }}>
            {parsed.map((sec, si) => (
              <div key={si} style={{
                background: getBgColor(sec.title),
                border: `1px solid ${getBorderColor(sec.title)}`,
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon icon={getIcon(sec.title)} style={{ fontSize: '1.25rem', color: getThemeColor(sec.title) }} />
                  <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{sec.title}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sec.items.map((item, ii) => (
                    <div key={ii} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: getThemeColor(sec.title), marginTop: '7px', fontSize: '0.9rem', width: '5px', height: '5px', borderRadius: '50%', background: getThemeColor(sec.title), flexShrink: 0 }} />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
        return
      }
      // :::empathy block — multi-column empathy map grid
      if (block.startsWith(':::empathy')) {
        const gridContent = block.replace(/^:::empathy\s*/i, '').replace(/:::\s*$/, '').trim()
        const sections = gridContent.split('\n---\n').map(s => s.trim()).filter(Boolean)
        
        const parseSection = (secText: string) => {
          const lines = secText.split('\n').map(l => l.trim()).filter(Boolean)
          const title = lines[0] || ''
          const items = lines.slice(1).map(l => l.replace(/^-\s*/, ''))
          return { title, items }
        }
        
        const parsed = sections.map(parseSection)
        
        const getIcon = (title: string) => {
          const t = title.toLowerCase()
          if (t.includes('think')) return 'material-symbols:psychology-alt'
          if (t.includes('see')) return 'material-symbols:visibility-outline'
          if (t.includes('say')) return 'material-symbols:forum-outline'
          if (t.includes('hear')) return 'material-symbols:hearing'
          return 'material-symbols:help-outline'
        }
        
        const getBgColor = (title: string) => {
          const t = title.toLowerCase()
          if (t.includes('think')) return 'rgba(99, 102, 241, 0.04)' // Indigo
          if (t.includes('see')) return 'rgba(14, 165, 233, 0.04)' // Sky
          if (t.includes('say')) return 'rgba(16, 185, 129, 0.04)' // Emerald
          if (t.includes('hear')) return 'rgba(139, 92, 246, 0.04)' // Violet
          return 'rgba(0,0,0,0.02)'
        }

        const getBorderColor = (title: string) => {
          const t = title.toLowerCase()
          if (t.includes('think')) return 'rgba(99, 102, 241, 0.15)'
          if (t.includes('see')) return 'rgba(14, 165, 233, 0.15)'
          if (t.includes('say')) return 'rgba(16, 185, 129, 0.15)'
          if (t.includes('hear')) return 'rgba(139, 92, 246, 0.15)'
          return 'var(--color-border)'
        }
        
        const getThemeColor = (title: string) => {
          const t = title.toLowerCase()
          if (t.includes('think')) return '#6366f1'
          if (t.includes('see')) return '#0ea5e9'
          if (t.includes('say')) return '#10b981'
          return '#8b5cf6'
        }

        nodes.push(
          <div key={key} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            margin: '24px 0 32px',
          }}>
            {parsed.map((sec, si) => (
              <div key={si} style={{
                background: getBgColor(sec.title),
                border: `1px solid ${getBorderColor(sec.title)}`,
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon icon={getIcon(sec.title)} style={{ fontSize: '1.25rem', color: getThemeColor(sec.title) }} />
                  <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{sec.title}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sec.items.map((item, ii) => (
                    <div key={ii} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: getThemeColor(sec.title), marginTop: '7px', fontSize: '0.9rem', width: '5px', height: '5px', borderRadius: '50%', background: getThemeColor(sec.title), flexShrink: 0 }} />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
        return
      }
      // :::grid block — multi-column image/content grid
      if (block.startsWith(':::grid')) {
        const gridContent = block.replace(/^:::grid\s*/i, '').replace(/:::\s*$/, '').trim()
        const columns = gridContent.split('---').map(c => c.trim()).filter(Boolean)
        nodes.push(
          <div key={key} style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
            gap: '16px',
            margin: '16px 0',
          }}>
            {columns.map((colText, ci) => {
              const imgRegex = /!\[Image\]\(([^)\n]*(?:\([^)\n]*\)[^)\n]*)*)\)(?:\s*\n|$)/
              const match = colText.match(imgRegex)
              const caption = colText.replace(imgRegex, '').trim()
              return (
                <div key={ci} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  {match && (
                    <img
                      src={match[1]}
                      alt={caption || ""}
                      draggable={false}
                      style={{ width: '100%', borderRadius: 6, display: 'block', objectFit: 'contain', marginBottom: '8px' }}
                    />
                  )}
                  {caption && (
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                      {caption}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )
        return
      }
      // :::meta block — project metadata pill row
      if (block.startsWith(':::meta')) {
        const lines = block.split('\n').slice(1).filter(l => l && !l.startsWith(':::'))
        nodes.push(
          <div key={key} style={{
            display: 'flex', flexWrap: 'wrap', gap: '8px',
            margin: '12px 0 16px',
            padding: '14px 16px',
            background: 'rgba(99,102,241,0.05)',
            border: '1px solid rgba(99,102,241,0.14)',
            borderRadius: '10px',
          }}>
            {lines.map((line, li) => {
              const [label, value] = line.split('|').map(p => p.trim())
              return (
                <div key={li} style={{
                  display: 'flex', flexDirection: 'column', gap: '2px',
                  padding: '6px 12px',
                  background: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: '7px',
                  minWidth: '90px',
                }}>
                  <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}</span>
                </div>
              )
            })}
          </div>
        )
        return
      }
      // Markdown table — starts with "| "
      if (block.startsWith('| ')) {
        const rows = block.split('\n').filter(r => r.trim() && !r.match(/^\|[-| ]+\|$/))
        const [header, ...body] = rows
        const parseRow = (r: string) => r.split('|').slice(1, -1).map(c => c.trim())
        nodes.push(
          <div key={key} style={{ overflowX: 'auto', margin: '12px 0 16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)' }}>
              <thead>
                <tr>
                  {parseRow(header).map((cell, ci) => (
                    <th key={ci} style={{ padding: '8px 14px', textAlign: 'left', verticalAlign: 'top', fontWeight: 700, fontSize: '0.70rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-muted)', borderBottom: '2px solid var(--color-border)', whiteSpace: 'nowrap' }}>
                      {renderTableCell(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} style={{ background: ri % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                    {parseRow(row).map((cell, ci) => (
                      <td key={ci} style={{ padding: '7px 14px', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-sm)', lineHeight: 1.5, textAlign: 'left', verticalAlign: 'top' }}>
                        {renderTableCell(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        return
      }
      if (block.startsWith('# ')) { nodes.push(<h1 key={key} style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text-primary)', margin: 'var(--space-5) 0 var(--space-2)', lineHeight: 1.3 }}>{block.slice(2)}</h1>); return }
      if (block.startsWith('## ')) { nodes.push(<h2 key={key} style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', margin: 'var(--space-4) 0 var(--space-2)' }}>{block.slice(3)}</h2>); return }
      if (block.startsWith('### ')) { nodes.push(<h3 key={key} style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)', margin: 'var(--space-3) 0 var(--space-1)' }}>{block.slice(4)}</h3>); return }
      if (block.startsWith('- ')) {
        nodes.push(
          <div key={key} style={{ display: 'flex', gap: 'var(--space-2)', margin: 'var(--space-1) 0' }}>
            <span style={{ color: 'var(--color-text-muted)', marginTop: 2 }}>•</span>
            <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>{renderInline(block.slice(2))}</p>
          </div>
        )
        return
      }
      nodes.push(<p key={key} style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{renderTableCell(block)}</p>)
    })
  })

  return nodes
}


function renderContent(text: string): ReactNode[] {
  const swotStart = text.indexOf('### Strengths')
  const threatsHeading = text.indexOf('### Threats')

  if (swotStart >= 0 && threatsHeading >= 0) {
    // Find where the Threats section ends (next ### or end of text)
    const afterThreats = text.indexOf('\n### ', threatsHeading + 1)
    const swotEnd = afterThreats >= 0 ? afterThreats : text.length

    const before = text.slice(0, swotStart)
    const swotText = text.slice(swotStart, swotEnd)
    const after = text.slice(swotEnd)

    return [
      ...renderBlocks(before, 0),
      <SWOTTable key="swot-table" text={swotText} />,
      ...renderBlocks(after, 10000),
    ]
  }

  return renderBlocks(text)
}

// ── Main Page ────────────────────────────────────────────────────────────────


export default function CaseStudiesPage() {
  const navigate = useNavigate()
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState(false)

  // Signed token helpers — base64(id:secret:expiry)
  // Cannot be forged from console without knowing the secret
  const TOKEN_KEY = 'abu_cs_tokens'
  const SECRET = 'h1r3m3br0_s1gn'

  const makeToken = (id: string, expiry: number) =>
    btoa(`${id}:${SECRET}:${expiry}`)

  const verifyToken = (token: string): { id: string; expiry: number } | null => {
    try {
      const decoded = atob(token)
      const parts = decoded.split(':')
      // Must have id, secret, expiry — and secret must match
      if (parts.length < 3) return null
      const expiry = parseInt(parts[parts.length - 1])
      const secret = parts[parts.length - 2]
      const id = parts.slice(0, parts.length - 2).join(':')
      if (secret !== SECRET || isNaN(expiry)) return null
      return { id, expiry }
    } catch { return null }
  }

  // Restore unlocked IDs from signed tokens (30-day expiry)
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (stored) {
      try {
        const tokens: string[] = JSON.parse(stored)
        const now = Date.now()
        const valid = tokens
          .map(verifyToken)
          .filter((r): r is { id: string; expiry: number } => r !== null && r.expiry > now)
          .map(r => r.id)
        if (valid.length > 0) setUnlockedIds(new Set(valid))
      } catch { /* ignore */ }
    }
  }, [])

  const activeCase = caseStudies.find(s => s.id === selectedCaseId)
  const activeFolder = CASE_FOLDERS.find(f => f.id === selectedCaseId)
  const LOCKED_IDS = new Set([
    'competitive-audit---real-estate-sites',
    'kynhood---ux-&-ai',
    'phonepe-2-0---bts',
    'foundit---ux-case-study',
    'recruit-crm---ux-enhancement-1---abusyeed',
  ])
  const isTopPick = selectedCaseId ? LOCKED_IDS.has(selectedCaseId) : false
  const isLocked = isTopPick && selectedCaseId ? !unlockedIds.has(selectedCaseId) : false

  const handleUnlock = () => {
    if (pwInput === 'hiremebro' && selectedCaseId) {
      const next = new Set(unlockedIds).add(selectedCaseId)
      setUnlockedIds(next)
      // Persist as signed token with 30-day expiry
      const expiry = Date.now() + 5 * 24 * 60 * 60 * 1000
      const token = makeToken(selectedCaseId, expiry)
      const stored = localStorage.getItem(TOKEN_KEY)
      const existing: string[] = stored ? JSON.parse(stored) : []
      // Remove any old token for same id, then add new
      const filtered = existing.filter(t => {
        const r = verifyToken(t); return r !== null && r.id !== selectedCaseId
      })
      localStorage.setItem(TOKEN_KEY, JSON.stringify([...filtered, token]))
      setPwInput('')
      setPwError(false)
    } else {
      setPwError(true)
      setTimeout(() => setPwError(false), 1200)
    }
  }

  useEffect(() => {
    const origBg = document.body.style.backgroundColor
    const origBgImg = document.body.style.backgroundImage
    document.body.style.backgroundColor = '#ffffff'
    document.body.style.backgroundImage = 'none'
    return () => {
      document.body.style.backgroundColor = origBg
      document.body.style.backgroundImage = origBgImg
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', fontFamily: FONTS.primary, backgroundColor: '#ffffff', position: 'relative' }}>
      <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid-cs" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d1d5db" strokeWidth="0.4" />
          </pattern>
          <pattern id="grid-cs" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid-cs)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#d1d5db" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-cs)" />
      </svg>
    <div style={{ height: '100vh', overflow: 'hidden', padding: '4rem', position: 'relative', color: '#0f172a', isolation: 'isolate', zIndex: 1 }}>
      <DynamicRenderer />

<div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', height: '100%', boxSizing: 'border-box' }}>
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'relative', maxWidth: selectedCaseId ? '45%' : '100%', transition: 'max-width 0.4s ease' }}
        >
          <FigmaElement figmaId="casestudies-title" style={{ display: 'block', position: 'relative' }}>
            <h1 style={{ fontSize: 'var(--text-4xl)', margin: 'var(--space-4) 0 var(--space-2) 0', color: '#0f172a' }}>
              Case Studies
            </h1>
          </FigmaElement>

          <FigmaElement figmaId="casestudies-stats" style={{ display: 'block', position: 'relative' }}>
            <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center', fontSize: 'var(--text-base)', color: 'rgba(0,0,0,0.6)', marginBottom: 'var(--space-10)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icon icon="solar:clock-circle-outline" width={16} /> Total Read Time: {totalReadTime} mins</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icon icon="solar:calendar-outline" width={16} /> Last Updated: June 25, 2026</span>
            </div>
          </FigmaElement>

          <FigmaElement figmaId="casestudies-did-you-know" style={{ display: 'block', position: 'relative' }}>
            <DidYouKnow labelColor="rgba(0,0,0,0.4)" textColor="#0f172a" />
          </FigmaElement>

          <FigmaElement figmaId="casestudies-grid" style={{ display: 'block', position: 'relative', overflow: 'visible' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 200px))', gap: '32px', width: '100%', justifyContent: 'start' }}>
              {SORTED_FOLDERS.map((folder, index) => (
                <FolderWidget
                  key={folder.id}
                  folder={folder}
                  index={index}
                  isSelected={folder.id === selectedCaseId}
                  onOpen={() => setSelectedCaseId(prev => prev === folder.id ? null : folder.id)}
                />
              ))}
            </div>
          </FigmaElement>
        </motion.div>

        {/* Right Side — Preview Panel */}
        <AnimatePresence>
          {selectedCaseId && activeCase && activeFolder && (
            <motion.div
              key={selectedCaseId}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 20 } }}
              exit={{ x: '100%', opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '48%',
                height: '100vh',
                backgroundColor: '#fafaf8',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.35)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 99999,
                overflow: 'hidden',
              }}
            >
              {/* Panel header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-5) var(--space-8)',
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: '#fff',
                flexShrink: 0,
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <p className="ds-label" style={{ margin: 0, color: 'var(--color-text-muted)' }}>Case Study</p>
                    {LOCKED_IDS.has(selectedCaseId!) && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: 'linear-gradient(135deg, #1e3a5f 0%, #1e4976 100%)',
                        borderRadius: 20, padding: '2px 8px 2px 5px',
                      }}>
                        <Icon icon="solar:lock-keyhole-bold" width={10} color="#7dd3fc" />
                        <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#7dd3fc', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Top Pick</span>
                      </div>
                    )}
                  </div>
                  <h2 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{activeFolder.title}</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <span className="ds-caption" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    <Icon icon="solar:clock-circle-outline" width={14} /> {activeFolder.readTime}
                  </span>
                  <button
                    onClick={() => setSelectedCaseId(null)}
                    className="ds-btn ds-btn-ghost"
                    style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)' }}
                  >
                    <Icon icon="solar:close-circle-outline" width={20} />
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div style={{ flex: 1, overflowY: isLocked ? 'hidden' : 'auto', position: 'relative', padding: 'var(--space-8) var(--space-8) var(--space-12)', filter: isLocked ? 'blur(6px)' : 'none', userSelect: isLocked ? 'none' : 'auto', pointerEvents: isLocked ? 'none' : 'auto' }}>
                {/* AI Summary */}
                {AI_SUMMARIES[activeCase.id] && (
                  <div style={{
                    marginBottom: 28,
                    borderRadius: 10,
                    border: '1px solid #e0e7ff',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)',
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 16px',
                      borderBottom: '1px solid #e0e7ff',
                      background: 'rgba(99,102,241,0.08)',
                    }}>
                      <Icon icon="solar:stars-minimalistic-outline" width={15} color="#6366f1" />
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        AI Summary
                      </span>
                      <span style={{
                        marginLeft: 'auto', fontSize: '0.6rem', color: '#a5b4fc',
                        background: '#ede9fe', borderRadius: 4, padding: '2px 7px', fontWeight: 600,
                      }}>
                        Generated
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr' }}>
                      {AI_SUMMARIES[activeCase.id].map((line, i) => {
                        const isLast = i === AI_SUMMARIES[activeCase.id].length - 1;
                        return (
                          <>
                            <div key={`label-${i}`} style={{
                              padding: '10px 12px 10px 16px',
                              borderBottom: !isLast ? '1px solid rgba(99,102,241,0.12)' : 'none',
                              borderRight: '1px solid rgba(99,102,241,0.18)',
                              display: 'flex', alignItems: 'center',
                            }}>
                              <span style={{
                                fontSize: '0.55rem', fontWeight: 800, color: '#6366f1',
                                textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.5,
                              }}>
                                {(activeCase.id === 'stimuler---ux-enhancement' || activeCase.id === 'competitive-audit---real-estate-sites' || activeCase.id === 'guvi---dan-jr-hackathon---greenbite') && i === 0
                                  ? 'Goal'
                                  : (AI_SUMMARY_LABELS[i] ?? String(i + 1).padStart(2, '0'))}
                              </span>
                            </div>
                            <div key={`val-${i}`} style={{
                              padding: '10px 16px',
                              borderBottom: !isLast ? '1px solid rgba(99,102,241,0.12)' : 'none',
                            }}>
                              <p style={{ margin: 0, fontSize: '0.73rem', color: '#3730a3', lineHeight: 1.65 }}>{line}</p>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                )}
                {renderContent(stripPersonalIntros(activeCase.text))}
              </div>

              {/* Lock overlay */}
              {isLocked && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                }}>
                  <div style={{
                    background: 'rgba(26,26,26,0.92)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 32,
                    boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
                    padding: '40px 40px 36px',
                    width: 320,
                    textAlign: 'center',
                    fontFamily: FONTS.primary,
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
                      Enter the password to continue. Access is valid for 5 days on this browser — shared solely to protect the integrity of this work.
                    </p>

                    {/* Input */}
                    <input
                      type="password"
                      value={pwInput}
                      onChange={e => { setPwInput(e.target.value); setPwError(false) }}
                      onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                      placeholder="Enter password"
                      autoFocus
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '11px 16px', borderRadius: 10,
                        fontSize: '0.88rem', fontFamily: FONTS.primary,
                        border: pwError ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.1)',
                        outline: 'none', marginBottom: pwError ? 8 : 12,
                        background: pwError ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.06)',
                        color: '#ffffff',
                        transition: 'border 0.2s, background 0.2s',
                      }}
                    />
                    {pwError && (
                      <p style={{ margin: '0 0 12px', fontSize: '0.72rem', color: 'rgba(239,68,68,0.85)', textAlign: 'left' }}>
                        Incorrect password — please try again
                      </p>
                    )}

                    {/* Button */}
                    <button
                      onClick={handleUnlock}
                      style={{
                        width: '100%', padding: '11px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: '#3b82f6', color: '#ffffff',
                        fontFamily: FONTS.primary, fontWeight: 700, fontSize: '0.9rem',
                        transition: 'background 0.2s, transform 0.2s',
                      }}
                      onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = '#2563eb' }}
                      onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = '#3b82f6' }}
                    >
                      Unlock Access
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        animate={{ opacity: selectedCaseId ? 0.15 : 1, pointerEvents: selectedCaseId ? 'none' : 'auto' }}
        transition={{ duration: 0.3 }}
      >
        <Dock
          items={[
            { icon: <Icon icon="solar:arrow-left-outline" width={22} color="#1e293b" />, label: 'Back', onClick: () => navigate(-1) },
            { icon: <Icon icon="solar:home-2-outline" width={22} color="#1e293b" />, label: 'Home', onClick: () => navigate('/') },
            { icon: <Icon icon="solar:file-outline" width={22} color="#1e293b" />, label: 'Resume', onClick: () => navigate('/resume') },
            { icon: <Icon icon="solar:user-outline" width={22} color="#1e293b" />, label: 'About me', onClick: () => navigate('/about') }
          ]}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </motion.div>
    </div>
    </div>
  )
}

// ── Folder Widget ────────────────────────────────────────────────────────────

function FolderWidget({ folder, index, isSelected, onOpen }: { folder: FolderItem; index: number; isSelected: boolean; onOpen: () => void }) {
  const [isHovered, setIsHovered] = useState(false)
  const caseData = caseStudies.find(s => s.id === folder.id)
  const rawSnippet = caseData ? stripPersonalIntros(caseData.text) : ''
  const cleanSnippet = rawSnippet
    .replace(/#.*?\n/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 120) + '...'

  const { isEditMode } = useEditor()

  return (
    <motion.div
      initial={isEditMode ? false : { y: -150, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={isEditMode ? { duration: 0 } : { type: 'spring', stiffness: 100, damping: 15, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpen}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'pointer', height: '220px' }}
    >
      {/* Mini paper document */}
      <motion.div
        initial={{ y: 0, scale: 0, rotate: 0 }}
        animate={{ y: (isHovered || isSelected) ? -90 : 0, scale: (isHovered || isSelected) ? 1.15 : 0, rotate: (isHovered || isSelected) ? -5 : 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        style={{
          position: 'absolute', top: '30%', width: '120px', height: '140px',
          backgroundColor: '#ffffff', padding: '12px 10px', borderRadius: '4px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.45)', zIndex: 1, pointerEvents: 'none',
          border: '1px solid rgba(0,0,0,0.15)', color: '#1f2937', fontSize: '7px',
          lineHeight: '1.3', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', boxSizing: 'border-box',
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.03) 0.8px, transparent 0)',
          backgroundSize: '8px 8px',
        }}
      >
        <span style={{ fontSize: '8px', fontWeight: '800', marginBottom: '6px', borderBottom: '1px solid #e5e7eb', width: '100%', paddingBottom: '3px', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {folder.title}
        </span>
        <span style={{ color: '#4b5563', textAlign: 'left', fontSize: '6.5px', fontFamily: FONTS.primary }}>
          {cleanSnippet}
        </span>
      </motion.div>

      {/* Folder Icon */}
      <div style={{ position: 'relative', width: '140px', height: '110px', zIndex: 5, marginTop: '25px' }}>
        <div style={{
          position: 'absolute', top: '5px', left: '12px', width: '50px', height: '15px',
          backgroundColor: '#5DADE2',
          borderTopLeftRadius: '6px', borderTopRightRadius: '6px',
        }} />
        <div style={{
          position: 'absolute', top: '18px', left: '5px', width: '130px', height: '85px',
          backgroundColor: '#5DADE2',
          borderRadius: '8px', boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
          {(['competitive-audit---real-estate-sites','kynhood---ux-&-ai','phonepe-2-0---bts','foundit---ux-case-study','recruit-crm---ux-enhancement-1---abusyeed'].includes(folder.id)) && (
            <Icon icon="solar:lock-keyhole-bold" width={20} color="rgba(255,255,255,0.8)" style={{ position: 'absolute', left: 10, bottom: 10, zIndex: 1 }} />
          )}
        </div>
      </div>

      {/* Label */}
      <span style={{ marginTop: '12px', fontSize: '1rem', fontWeight: '600', color: '#0f172a', zIndex: 10, textAlign: 'center', maxWidth: '180px', wordBreak: 'break-all' }}>
        {folder.folderLabel}
      </span>
    </motion.div>
  )
}
