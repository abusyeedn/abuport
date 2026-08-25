import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FONTS, MOTION } from '../theme'
import { useSiteNavItems } from '../components/siteNav'
import { WRITINGS, estimateReadTime } from '../data/writings'
import { renderBoldedText } from '../components/KynhoodBentoCards'

const PAGE_BG = '#F8F6F3'

// Tiny markdown subset -> JSX: blank-line-separated paragraphs, "### Heading"
// lines, "![alt](src)" image blocks, and consecutive "- " lines grouped into
// one bullet list. Anything beyond that isn't needed yet - extend here if a
// future entry needs more.
function renderBody(body: string) {
  const blocks = body.split('\n\n')
  const nodes: React.ReactNode[] = []
  let listBuffer: string[] = []

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return
    nodes.push(
      <ul key={key} style={{ margin: '0 0 1.5rem', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {listBuffer.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: '10px', fontFamily: FONTS.body, fontSize: '1.05rem', lineHeight: 1.7, color: '#3a463f' }}>
            <span style={{ color: '#077a4b', flexShrink: 0 }}>-</span>
            <span>{renderBoldedText(item)}</span>
          </li>
        ))}
      </ul>
    )
    listBuffer = []
  }

  blocks.forEach((block, i) => {
    const trimmed = block.trim()
    if (!trimmed) return

    if (trimmed.startsWith('### ')) {
      flushList(`list-${i}`)
      nodes.push(
        <h2 key={i} style={{ margin: '2.5rem 0 1rem', fontFamily: FONTS.display, fontSize: '1.4rem', fontWeight: 700, color: '#1a2420', lineHeight: 1.3 }}>
          {trimmed.slice(4)}
        </h2>
      )
      return
    }

    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imageMatch) {
      flushList(`list-${i}`)
      nodes.push(
        <img
          key={i}
          src={imageMatch[2]}
          alt={imageMatch[1] || ''}
          style={{ width: '100%', display: 'block', borderRadius: 12, margin: '0 0 1.5rem', border: '1px solid rgba(20,32,52,.08)' }}
        />
      )
      return
    }

    const lines = trimmed.split('\n')
    if (lines.every((l) => l.startsWith('- '))) {
      listBuffer.push(...lines.map((l) => l.slice(2)))
      return
    }

    flushList(`list-${i}`)
    nodes.push(
      <p key={i} style={{ margin: '0 0 1.5rem', fontFamily: FONTS.body, fontSize: '1.05rem', lineHeight: 1.75, color: '#3a463f' }}>
        {renderBoldedText(trimmed)}
      </p>
    )
  })
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
