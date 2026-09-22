/**
 * MobileKynhoodPage.tsx
 *
 * Mobile-native /kynhood2 - same real content as desktop's Kynhood2Page
 * (CaseStudyHero, the "what we built" intro, PipBoyMetricsRow, the
 * contributions list, the role journey, closing case-study links), just
 * without the GSAP ScrollTrigger card reveals and the FigmaElement/
 * DynamicRenderer decorative canvas, which both assume the fixed-1440px
 * desktop layout. No entrance-animation gimmicks here - it's read content,
 * so it just renders.
 */
import { useNavigate } from 'react-router-dom'
import { FONTS, MOBILE_TYPE, TYPE, COLORS } from '../theme'
import CaseStudyHero from '../components/CaseStudyHero'
import BackButton from '../components/BackButton'
import WordHighlighter from '../components/WordHighlighter'
import PipBoyMetricsRow from '../components/PipBoyMetricsRow'
import { KYNHOOD_CASE_STUDY_CARDS, renderBoldedText } from '../components/KynhoodBentoCards'

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

const CONTRIBUTIONS = [
  'I independently owned the Events Listing module from concept to production.',
  'I shipped **5+ features** across events, communities, AI, payments, and organizer tools.',
  'I supported **₹5 Cr+** in event revenue through the products I designed.',
  'I helped power **5,000+ paid bookings** through product improvements.',
  'I took features from brainstorming through to production release, working closely with engineering, including a notification-based inventory sync solution built without third-party APIs.',
]

const JOURNEY = [
  { year: '2024', title: 'Intern - Product Designer', dateRange: 'Jun 2024 - Aug 2024', description: 'Started in Design Operations, logging bugs and shipping small design tickets to understand the product, users, and team workflows.', stat: '3 months - foundational ramp-up', image: '/gallery/kynhood/kyn-journey-1.jpg' },
  { year: '2025', title: 'Sole Designer - Events Listing', dateRange: 'Sep 2024 - May 2025', description: 'Promoted to Product Designer and independently owned the Events Listing module - delivering 15 phases with 10-15 medium level tickets each, scaling from incremental improvements to major feature releases alongside a 20-member cross-functional team.', stat: '6 months - 15 phases shipped', image: '/gallery/kynhood/kyn-journey-2.jpg' },
  { year: '2026', title: 'Design Ownership + Extended Product Involvement', dateRange: 'Jun 2025 - Jun 2026', description: 'Owned 100% of feature design end-to-end, and took on close to 50% of the product responsibilities for the features I worked on - supporting business logic and solutioning, writing PRDs and user stories, and leading UAT - functioning as a light PM/PA alongside the product team rather than owning the product role outright.', stat: '12 months - full lifecycle ownership', image: '/gallery/misc/Image.jpg' },
]

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 style={{ margin: '0 0 1.25rem', fontFamily: FONTS.display, fontSize: MOBILE_TYPE.lg, fontWeight: 700, color: COLORS.textPrimary }}>
      {children}
    </h2>
  )
}

export default function MobileKynhoodPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#ffffff' }}>
      <CaseStudyHero
        client="Kynhood"
        period="June 2024 to July 2026"
        category="Product, AI"
        title="Product Designer"
        subtitle="I transformed complex community and events workflows into clean, engaging experiences, using analytics to scale product engagement."
        mockupImage="/gallery/kynhood/kyn-screens.png"
        stats={[
          { value: '8', label: 'Sub-projects shipped' },
          { value: '2', label: 'Years at Kynhood' },
          { value: 'Chennai', label: 'Based in' },
        ]}
      />

      <div style={{ padding: '2.5rem 1.25rem 4rem' }}>
        <SectionHeading>Here's what we built</SectionHeading>
        <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
          <WordHighlighter
            text="Kyn is a community-led experiences platform that helps people create tribes, host events, and connect through shared interests. From discovery to booking and community engagement, everything happens in one place."
            highlightWords="community-led experiences, connect, shared interests, one place"
            highlightColor="#bae6fd"
            highlightTextColor="#0369a1"
            baseTextColor={COLORS.textPrimary}
            highlightPadding={3}
            highlightBorderRadius={5}
            caseSensitive={false}
            style={{ width: '100%', whiteSpace: 'normal', fontSize: MOBILE_TYPE.sm, lineHeight: 1.7 }}
          />
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <PipBoyMetricsRow />
        </div>

        <SectionHeading>My contributions</SectionHeading>
        <ul style={{ margin: '0 0 2.5rem', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CONTRIBUTIONS.map((fact) => (
            <li key={fact} style={{ display: 'flex', gap: 10, fontSize: MOBILE_TYPE.sm, lineHeight: 1.6, color: '#475569', fontFamily: FONTS.primary }}>
              <span style={{ color: '#00cbb4', flexShrink: 0 }}>-</span>
              <span>{renderBoldedText(fact)}</span>
            </li>
          ))}
        </ul>

        <SectionHeading>The journey</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
          {JOURNEY.map((phase) => (
            <div key={phase.year} style={{ display: 'flex', flexDirection: 'column', gap: 12, borderLeft: '2px solid #e2e8f0', paddingLeft: '1.1rem' }}>
              <div style={{ width: '100%', height: 150, borderRadius: 12, overflow: 'hidden', background: '#e8e8e8' }}>
                <img src={phase.image} alt={phase.year} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <span style={{ display: 'inline-block', width: 'fit-content', padding: '3px 10px', borderRadius: 999, fontSize: MOBILE_TYPE['4xs'], fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#077a4b', background: 'rgba(7,122,75,0.08)' }}>
                {phase.year}
              </span>
              <h3 style={{ margin: 0, fontFamily: FONTS.display, fontSize: MOBILE_TYPE.md, fontWeight: 700, color: COLORS.textPrimary, lineHeight: 1.3 }}>
                {phase.title}
              </h3>
              <span style={{ fontSize: MOBILE_TYPE.xs, color: COLORS.textMuted, fontWeight: 600 }}>{phase.dateRange}</span>
              <p style={{ margin: 0, fontSize: MOBILE_TYPE.sm, color: COLORS.textPrimary, opacity: 0.8, lineHeight: 1.6 }}>{phase.description}</p>
              <span style={{ fontSize: MOBILE_TYPE.xs, fontWeight: 700, color: '#077a4b' }}>{phase.stat}</span>
            </div>
          ))}
        </div>

        <SectionHeading>Case studies from Kynhood</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {KYNHOOD_CASE_STUDY_CARDS.slice(0, 2).map((card) => {
            const isVideo = card.image.endsWith('.mp4') || card.image.endsWith('.mov') || card.image.endsWith('.webm')
            return (
              <button
                key={card.title}
                onClick={() => navigate(`/kynhood2/case/${slugify(card.title)}`)}
                style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
              >
                <div style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: 14, overflow: 'hidden', background: '#eceae4' }}>
                  {isVideo ? (
                    <video src={card.image} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: card.imageFit || 'cover', display: 'block' }} />
                  ) : (
                    <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: card.imageFit || 'cover', display: 'block' }} />
                  )}
                </div>
                <h3 style={{ margin: 0, fontFamily: FONTS.display, fontSize: MOBILE_TYPE.md, fontWeight: 700, lineHeight: 1.4, color: COLORS.textPrimary }}>{card.title}</h3>
                {card.meta && card.meta.length > 0 && (
                  <p style={{ margin: 0, fontSize: MOBILE_TYPE.xs, lineHeight: TYPE.relaxed, color: COLORS.textMuted }}>
                    {card.meta.map((m, i) => (
                      <span key={i}>
                        {i > 0 && <span style={{ margin: '0 6px' }}>•</span>}
                        {m.value}
                      </span>
                    ))}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <BackButton />
    </div>
  )
}
