import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FONTS, MOTION } from '../theme'
import { useSiteNavItems } from '../components/siteNav'
import { WRITINGS, estimateReadTime } from '../data/writings'

const PAGE_BG = '#F8F6F3'

// Like renderBoldedText (KynhoodBentoCards.tsx) but also turns
// "[label](url)" into a real link - the ex-case-study writings carry a
// couple of these (Figma file references) that plain bold-only parsing
// would otherwise leave as literal brackets.
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 700, color: '#1a2420' }}>{part.slice(2, -2)}</strong>
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noreferrer" style={{ color: '#077a4b', textDecoration: 'underline' }}>
          {linkMatch[1]}
        </a>
      )
    }
    return part
  })
}

// A handful of the ex-case-study writings carry a markdown table (competitor
// comparisons, mostly) - "| Header | ... |" then a "|---|---|" separator
// row, then body rows. Cells can hold "<br>" for a soft line break within
// one cell (there's no nested-list syntax in this tiny subset).
function renderTableCell(cell: string, key: string) {
  const lines = cell.split(/<br\s*\/?>/i)
  return (
    <td key={key} style={{ padding: '0.75rem 1rem', fontFamily: FONTS.body, fontSize: '1rem', lineHeight: 1.6, color: '#3a463f', borderBottom: '1px solid rgba(20,32,52,.08)', verticalAlign: 'top' }}>
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {renderInline(line)}
        </span>
      ))}
    </td>
  )
}

function splitTableRow(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
}

// A handful of writings carry a "[Some Figma file](url)" link on its own
// line - the original source these were converted from actually embedded
// the full Figma file inline. A real iframe embed is slow to load and
// heavy for what's just a reference link, so this renders it as a small
// clickable card instead: opens the real page in a new tab, no embed.
function LinkCard({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        margin: '0 0 1.5rem', padding: '0.9rem 1.1rem',
        borderRadius: 12, border: '1px solid rgba(20,32,52,.12)', background: '#ffffff',
        textDecoration: 'none', transition: 'border-color 0.15s ease, background 0.15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#077a4b'; e.currentTarget.style.background = '#f4faf6' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(20,32,52,.12)'; e.currentTarget.style.background = '#ffffff' }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 9, background: '#eaf5ee', flexShrink: 0 }}>
        <Icon icon={href.includes('figma.com') ? 'logos:figma' : 'solar:link-outline'} width={18} />
      </span>
      <span style={{ flex: 1, fontFamily: FONTS.body, fontSize: '0.95rem', fontWeight: 600, color: '#1a2420' }}>
        {label}
      </span>
      <Icon icon="solar:arrow-right-up-outline" width={18} color="#077a4b" style={{ flexShrink: 0 }} />
    </a>
  )
}

// Tiny markdown subset -> JSX: blank-line-separated paragraphs, "#"/"##"/"###"
// heading lines, "![alt](src)" image blocks, consecutive "- " lines grouped
// into one bullet list, and simple "| a | b |" tables. Anything beyond that
// isn't needed yet - extend here if a future entry needs more.
function renderBody(body: string) {
  const blocks = body.split('\n\n')
  const nodes: React.ReactNode[] = []
  let listBuffer: string[] = []
  // Runs of back-to-back images (mostly mobile-screenshot sequences from the
  // ex-case-study writings) - buffered so they can land in a 2/3-column
  // grid instead of each one going full-width and looking huge, a single
  // full-bleed image next to a run still renders on its own.
  let imageBuffer: { alt: string; src: string }[] = []

  const flushImages = (key: string) => {
    if (imageBuffer.length === 0) return
    if (imageBuffer.length === 1) {
      const img = imageBuffer[0]
      nodes.push(
        <img
          key={key}
          src={img.src}
          alt={img.alt}
          style={{ width: '100%', display: 'block', borderRadius: 12, margin: '0 0 1.5rem', border: '1px solid rgba(20,32,52,.08)' }}
        />
      )
    } else {
      const columns = imageBuffer.length === 2 ? 2 : 3
      nodes.push(
        <div key={key} style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '0.6rem', margin: '0 0 1.5rem' }}>
          {imageBuffer.map((img, gi) => (
            <img
              key={gi}
              src={img.src}
              alt={img.alt}
              style={{ width: '100%', display: 'block', borderRadius: 10, border: '1px solid rgba(20,32,52,.08)' }}
            />
          ))}
        </div>
      )
    }
    imageBuffer = []
  }

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return
    nodes.push(
      <ul key={key} style={{ margin: '0 0 1.5rem', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {listBuffer.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: '10px', fontFamily: FONTS.body, fontSize: '1.15rem', lineHeight: 1.7, color: '#3a463f' }}>
            <span style={{ color: '#077a4b', flexShrink: 0 }}>-</span>
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    )
    listBuffer = []
  }

  blocks.forEach((block, i) => {
    const trimmed = block.trim()
    if (!trimmed) return

    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imageMatch) {
      flushList(`list-${i}`)
      imageBuffer.push({ alt: imageMatch[1] || '', src: imageMatch[2] })
      return
    }
    flushImages(`images-${i}`)

    const linkOnlyMatch = trimmed.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkOnlyMatch) {
      flushList(`list-${i}`)
      nodes.push(<LinkCard key={i} label={linkOnlyMatch[1]} href={linkOnlyMatch[2]} />)
      return
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/)
    if (headingMatch) {
      flushList(`list-${i}`)
      nodes.push(
        <h2 key={i} style={{ margin: '2.5rem 0 1rem', fontFamily: FONTS.display, fontSize: '1.55rem', fontWeight: 700, color: '#1a2420', lineHeight: 1.3 }}>
          {headingMatch[2]}
        </h2>
      )
      return
    }

    const lines = trimmed.split('\n')

    // Simple table: "| a | b |" header, "|---|---|" separator, then rows.
    if (lines.length >= 2 && lines[0].trim().startsWith('|') && /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/.test(lines[1].trim())) {
      flushList(`list-${i}`)
      const header = splitTableRow(lines[0])
      const rows = lines.slice(2).map(splitTableRow)
      nodes.push(
        <div key={i} style={{ overflowX: 'auto', margin: '0 0 1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {header.map((cell, ci) => (
                  <th key={ci} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#077a4b', borderBottom: '2px solid rgba(20,32,52,.12)', whiteSpace: 'nowrap' }}>
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => renderTableCell(cell, `${ri}-${ci}`))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      return
    }

    if (lines.every((l) => l.startsWith('- '))) {
      listBuffer.push(...lines.map((l) => l.slice(2)))
      return
    }

    flushList(`list-${i}`)
    nodes.push(
      <p key={i} style={{ margin: '0 0 1.5rem', fontFamily: FONTS.body, fontSize: '1.15rem', lineHeight: 1.75, color: '#3a463f' }}>
        {renderInline(trimmed)}
      </p>
    )
  })
  flushImages('images-end')
  flushList('list-end')

  return nodes
}

export default function WritingDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const writing = WRITINGS.find((w) => w.slug === slug)

  // See WritingsPage.tsx for why this matches body's color, not just the div's.
  useEffect(() => {
    const original = document.body.style.backgroundColor
    document.body.style.backgroundColor = PAGE_BG
    return () => { document.body.style.backgroundColor = original }
  }, [])

  if (!writing) {
    navigate('/writings')
    return null
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: PAGE_BG }}>
      <div style={{ width: '100%', maxWidth: 720, margin: '0 auto', padding: '11.5rem 2rem 8rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MOTION.easeArray }}
          style={{ marginBottom: '3rem' }}
        >
          <span style={{ display: 'block', fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 700, color: '#077a4b', marginBottom: '0.75rem' }}>
            {estimateReadTime(writing.body)}
          </span>
          <h1 style={{ margin: 0, fontFamily: FONTS.display, fontSize: 'clamp(1.9rem, 4.5vw, 2.6rem)', fontWeight: 700, color: '#1a2420', lineHeight: 1.15 }}>
            {writing.title}
          </h1>
          <p style={{ margin: '1rem 0 0', fontFamily: FONTS.body, fontSize: '1.1rem', color: '#5c6b64' }}>
            {writing.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: MOTION.easeArray }}
        >
          {renderBody(writing.body)}
        </motion.div>
      </div>
    </div>
  )
}
