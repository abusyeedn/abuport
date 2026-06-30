import { useState, useEffect } from 'react'
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
  const imageMatch = study.text.match(/!\[Image\]\(([^)]+)\)/)
  const coverImage = imageMatch ? imageMatch[1] : '/gallery/kyn-cover.png'
  const words = study.text.split(/\s+/).filter(w => w.length > 0).length
  const readTimeMins = Math.max(1, Math.ceil(words / 200))
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

const AI_SUMMARY_LABELS = ['Problem', 'Abu did', 'Output', 'Impact']

const AI_SUMMARIES: Record<string, string[]> = {
  'coinpedia---re-design---ultimez': [
    'Coinpedia\'s market and Bitcoin pages had cluttered navbars, non-functional buttons, and poor fintech readability.',
    'Redesigned the navbar, repositioned CTAs, replaced the category filter with a dropdown, rebuilt the Bitcoin page supply chart and sentiment indicator.',
    'Cleaner information hierarchy with a bento-box grid layout and updated sans-serif typography across market and coin pages.',
    'Improved color contrast on CTAs and reduced visual noise — a more trustworthy fintech reading experience.',
  ],
  'competitive-audit---real-estate-sites': [
    '99acres, Magicbricks, and Housing.com had fragmented IA, broken international links, and poor mobile UX that hurt search journeys.',
    'Ran a 2-day incognito UX audit across all three platforms with 3 fictional personas, evaluating IA, navigation, features, and visual design.',
    'Detailed SWOT analysis highlighting critical weaknesses, missed opportunities, and direct feature comparisons across all three platforms.',
    'Actionable recommendations for AI chatbots, improved onboarding flows, and accessibility improvements to capture lost users.',
  ],
  'foundit---ux-case-study': [
    'Foundit (formerly Monster) had responsiveness failures, a weak landing page hierarchy, and no clear focus on job search for freshers.',
    'Defined 4 user personas, built empathy maps and pain/gain analysis, then redesigned the landing page with job search as the primary CTA.',
    'Low- and high-fidelity Figma prototypes with a React-based responsive layout and refined color system.',
    'Clearer user journey from landing to job search — reducing drop-off for the most critical fresher persona segment.',
  ],
  'guvi---dan-jr-hackathon---greenbite': [
    'GreenBite needed a compelling landing page designed and delivered within a 48-hour GUVI hackathon, solo.',
    'Built user personas, created a custom 3D takeout box in Adobe Dimension, and delivered desktop, tablet, and mobile Figma prototypes.',
    'Full responsive landing page with interactive header navigation, hover states, and custom product packaging design.',
    'AI attention heatmap score of 66, with 34.5% attention on the headline — validated design hierarchy.',
  ],
  'kynhood---ux-&-ai': [
    'Kynhood users were confused selecting zone-areas during onboarding — the existing flow had no mapping to real Chennai geography.',
    'Mapped city wards to zones using real Chennai Corporation data and designed a two-field input flow with area search followed by zone selection.',
    'High-fidelity screens built in 48 hours using a pre-built Figma design system, with a KNN ML algorithm proposed for auto-zone detection.',
    'Reduced cognitive load in zone selection — with a future-proof map integration path for relocated users.',
  ],
  'phonepe-2-0---bts': [
    'PhonePe 2.0\'s bento-grid redesign caused massive user backlash due to muscle memory disruption from the old list-based layout.',
    'Analyzed the design shift, benchmarked against NPCI Volume Cap guideline OC97, and applied Jakob\'s Law to explain user resistance.',
    'Structured breakdown of old vs. new UI trade-offs including language support wins, dark mode accessibility gaps, and regulatory constraints.',
    'Recommended gradual rollouts with a Classic UI toggle and Parent Mode — a phased adoption path that respects existing mental models.',
  ],
  'recruit-crm---ux-enhancement-1---abusyeed': [
    'Recruit CRM\'s advanced search had a critical case-sensitivity bug that silently returned zero results, breaking recruiter workflows.',
    'Imported fake candidate data via Python + Faker, benchmarked Zoho Recruit, Manatal, and Bullhorn, then redesigned the search panel.',
    'Unified Boolean + filter search interface with Location, Gender, and Language dropdowns — and a repositioned Reset Filters button.',
    'Eliminated the silent zero-results bug and applied Hick\'s Law to reduce CTA confusion for power-user recruiters.',
  ],
  'recruit-crm---ux-enhancement-2---abusyeed': [
    'Recruit CRM\'s header had misplaced icons — a broken help icon, an intimidating lock icon, and a hidden Column Editor button.',
    'Ran usability testing with 3 participants via Maze, confirming low discoverability of key features, then redesigned the header.',
    'Cleaner static header with a repositioned Column Editor, replaced misleading icons, and flagged inconsistent icon families across the sidebar.',
    'Improved task completion and discoverability of help and editing features — confirmed by usability test sessions.',
  ],
  'stimuler---ux-enhancement': [
    'Stimuler\'s profile tab had an oversized picture and a non-interactive progress bar — key feature cards were buried below the fold.',
    'Created a user persona and flow, restructured the profile tab, and enhanced the Word of the Day card with pronunciation, meanings, and a Save button.',
    'Redesigned profile tab with surfaced feature cards and an enriched Word of the Day experience with a Start Now CTA.',
    'Recommended 2 additional quiz questions of increasing difficulty to extend session length and improve retention metrics.',
  ],
  'ux-enhancement---spaarks': [
    'Spaarks\' Android app had broken swipe transitions, non-functional back gestures, and buried marketplace save buttons — hurting core flows.',
    'Ran an end-to-end usability and accessibility audit, tested post-creation, onboarding, marketplace, and navbar flows across Android.',
    'Prioritized issue report covering broken interactions, inconsistent icon states, toast sizing bugs, and save button discoverability.',
    'Recommended solid CTAs over gradients, vignettes in story editing, and a standardized rounded icon system — improving visual consistency.',
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

// ── Markdown → JSX renderer ──────────────────────────────────────────────────

function renderBlocks(text: string, keyOffset = 0): ReactNode[] {
  const blocks = text.split('\n\n').map(b => b.trim()).filter(Boolean)
  return blocks.map((block, i) => {
    const key = keyOffset + i
    const imgMatch = block.match(/^!\[Image\]\(([^)]+)\)$/)
    if (imgMatch) {
      if (imgMatch[1].startsWith('/gallery/')) {
        return (
          <img key={key} src={imgMatch[1]} alt="" draggable={false}
            style={{ width: '100%', borderRadius: 6, margin: '8px 0', display: 'block', objectFit: 'contain' }}
          />
        )
      }
      return null
    }
    if (block.startsWith('http')) return null
    if (block === '📌') return null
    if (block.startsWith('# '))
      return <h1 key={key} style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-text-primary)', margin: 'var(--space-5) 0 var(--space-2)', lineHeight: 1.3 }}>{block.slice(2)}</h1>
    if (block.startsWith('## '))
      return <h2 key={key} style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', margin: 'var(--space-4) 0 var(--space-2)' }}>{block.slice(3)}</h2>
    if (block.startsWith('### '))
      return <h3 key={key} style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', margin: 'var(--space-3) 0 var(--space-1)' }}>{block.slice(4)}</h3>
    if (block.startsWith('- '))
      return <div key={key} style={{ display: 'flex', gap: 'var(--space-2)', margin: 'var(--space-1) 0' }}>
        <span style={{ color: 'var(--color-text-muted)', marginTop: 2 }}>•</span>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>{block.slice(2)}</p>
      </div>
    return <p key={key} style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{block}</p>
  }).filter(Boolean) as ReactNode[]
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
      setUnlockedIds(prev => new Set(prev).add(selectedCaseId))
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
                      {AI_SUMMARIES[activeCase.id].map((line, i) => (
                        <>
                          <div key={`label-${i}`} style={{
                            padding: '10px 12px 10px 16px',
                            borderBottom: i < 3 ? '1px solid rgba(99,102,241,0.12)' : 'none',
                            borderRight: '1px solid rgba(99,102,241,0.18)',
                            display: 'flex', alignItems: 'center',
                          }}>
                            <span style={{
                              fontSize: '0.55rem', fontWeight: 800, color: '#6366f1',
                              textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.5,
                            }}>
                              {AI_SUMMARY_LABELS[i] ?? String(i + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <div key={`val-${i}`} style={{
                            padding: '10px 16px',
                            borderBottom: i < 3 ? '1px solid rgba(99,102,241,0.12)' : 'none',
                          }}>
                            <p style={{ margin: 0, fontSize: '0.73rem', color: '#3730a3', lineHeight: 1.65 }}>{line}</p>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                )}
                {renderContent(activeCase.text)}
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
                      Unlock with a password to open
                    </p>
                    <p style={{ margin: '0 0 24px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                      This is a top pick case study
                    </p>

                    {/* Input */}
                    <input
                      type="password"
                      value={pwInput}
                      onChange={e => { setPwInput(e.target.value); setPwError(false) }}
                      onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                      placeholder="enter password"
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
                        wrong password — try again
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
                      Unlock
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
  const rawSnippet = caseData ? caseData.text : ''
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
