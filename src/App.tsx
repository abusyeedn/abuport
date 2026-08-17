import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import TopHeader from './components/TopHeader'
import ShinyName from './components/ShinyName'
import WorkCard from './components/WorkCard'
import FeaturedWorkCard from './components/FeaturedWorkCard'
import AboutIntro from './components/AboutIntro'
import ExpertiseSection from './components/ExpertiseSection'
import FeaturedOnSection from './components/FeaturedOnSection'
import { KYNHOOD_CASE_STUDY_CARDS, KYNHOOD_DESIGN_SYSTEM_CARDS } from './components/KynhoodBentoCards'
import RevealSection from './components/RevealSection'
import { Icon } from '@iconify/react'
import MichaelFooter from './components/MichaelFooter'
import { FONTS, MOTION } from './theme'
import ChatWidget from './components/ChatWidget'
import caseStudies from './data/caseStudies.json'
import { useBreakpoint } from './hooks/useBreakpoint'

const CircularGallery = lazy(() => import('./components/CircularGallery'))

// Rebuilt home page, Aug 2026 - design language pulled from three reference
// portfolios (vishnuroy.com's oversized name treatment + accolades ticker,
// harshgond.framer.website's warm intro block + big work grid, michaeltsirakis.com's
// header w/ light-dark toggle), rebuilt with this project's own tokens/content/images
// rather than any copied markup or copy.
// The previous freeform Figma-canvas home page is archived, not deleted -
// see src/archive/HomeCanvasArchive.tsx.txt.

// Rotating circular gallery, restored from the old portfolio's WebGL
// component - real personal photography, kept as-is (not case study content).
const GALLERY_ITEMS = [
  { image: '/gallery/home/gallery_1.jpg', text: "الجعران\nAl-Ga'ran - Scarab" },
  { image: '/gallery/home/gallery_2.jpg', text: 'القرار\nAl-Qarar - The Decision' },
  { image: '/gallery/home/gallery_3.jpg', text: "رؤيا\nRu'ya - Vision" },
  { image: '/gallery/home/gallery_4.jpg', text: 'خليك\nKhaleek - Stay' },
  { image: '/gallery/home/gallery_5.jpg', text: 'حرية\nHurriya - Freedom' },
  { image: '/gallery/home/gallery_6.jpg', text: 'جميلة\nJamila - Beautiful' },
  { image: '/gallery/home/gallery_7.jpg', text: 'بحبك\nBahebak - I love you' },
  { image: '/gallery/home/gallery_8.jpg', text: 'لو في\nLaw Fi - If only' },
]

const CIRCULAR_GALLERY_BASE_PROPS = {
  bend: 3,
  borderRadius: 0.05,
  scrollSpeed: 2.1,
  scrollEase: 0.03,
  fontUrl: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&display=swap',
  font: "bold 64px 'Libre Baskerville'",
  items: GALLERY_ITEMS,
}

const CONTENT_WIDTH = 1320
const SIDE_PADDING = '2.5rem'

// Kynhood and Spaarks keep their own dedicated pages; every other case study
// now routes to its own real page too - /casestudies/:caseId opens the
// gallery already showing that case's full panel, a real URL instead of a
// generic gallery link.
const ROUTE_OVERRIDES: Record<string, string> = {
  'kynhood---ux-&-ai': '/kynhood2',
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

const TAG_OVERRIDES: Record<string, string> = {
  'kynhood---ux-&-ai': 'Product · AI',
  'medrep---assignment': 'Healthtech · AI',
  'foreverstage---deal-copilot': 'B2B SaaS · AI',
  'phonepe-2-0---bts': 'Fintech · UX',
  'coinpedia---re-design---ultimez': 'Redesign',
  'foundit---ux-case-study': 'UX Case Study',
  'recruit-crm---ux-enhancement-1---abusyeed': 'SaaS · UX',
  'recruit-crm---ux-enhancement-2---abusyeed': 'SaaS · UX',
  'competitive-audit---real-estate-sites': 'Research',
}

// Formal titles + one-line subtext for every case study on the home page -
// replaces the earlier auto-generated "Full case study - {title}." filler.
const TITLE_OVERRIDES: Record<string, string> = {
  'medrep---assignment': 'Medrep - Making Lab Reports Readable',
  'foreverstage---deal-copilot': 'Foreverstage - Deal Copilot',
  'coinpedia---re-design---ultimez': 'Coinpedia - Redesign Concept',
  'competitive-audit---real-estate-sites': 'Real Estate Platforms - Competitive UX Audit',
  'foundit---ux-case-study': 'FoundIt - Landing Page UX Case Study',
  'phonepe-2-0---bts': 'PhonePe 2.0 - Behind the Redesign',
  'recruit-crm---ux-enhancement-1---abusyeed': 'Recruit CRM - Advanced Search Enhancement',
  'recruit-crm---ux-enhancement-2---abusyeed': 'Recruit CRM - Header & Navigation Enhancement',
}

// Overrides the auto-derived cover image (first ![Image] in the case
// study's text) for cards where a dedicated thumbnail reads better.
const IMAGE_OVERRIDES: Record<string, string> = {
  'medrep---assignment': '/gallery/ui-playground/Frame 29.png',
}

// 'contain' for source art that's a wide composite (two mockups side by
// side, etc.) that shouldn't get cropped by the card's 4:3 box.
const IMAGE_FIT_OVERRIDES: Record<string, 'cover' | 'contain'> = {
  'medrep---assignment': 'contain',
}

const DESCRIPTION_OVERRIDES: Record<string, string> = {
  'medrep---assignment': 'An AI layer that reads lab reports the way a person would, scan, upload, or type in values, and get a plain-language explanation back.',
  'foreverstage---deal-copilot': 'A Deal Intelligence Layer that listens to sales calls, drafts CRM updates for review, and surfaces only what reps, managers, and VPs actually need to see.',
  'coinpedia---re-design---ultimez': "A UI/UX redesign of Coinpedia's market and Bitcoin pages, focused on cleaner data visualization and layout.",
  'competitive-audit---real-estate-sites': 'A comparative UX audit of 99acres, Housing.com, and Magicbricks - usability, navigation, and brand trust.',
  'foundit---ux-case-study': 'A responsive landing page redesign for FoundIt (formerly Monster.com), putting job search front and center.',
  'phonepe-2-0---bts': "An analysis of PhonePe's 2024 UI overhaul - bento layouts, muscle memory, and UPI design constraints.",
  'recruit-crm---ux-enhancement-1---abusyeed': 'Simplifying case-sensitive Boolean search and advanced filters for recruiters.',
  'recruit-crm---ux-enhancement-2---abusyeed': 'Cleaning up header icons and navigation for better discoverability and accessibility.',
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Lets other pages (e.g. Visual UI) link back to a home-page section via
// `/#work` - since this is a client-side route change, not a real page
// load, the browser's native hash-scroll never fires, so it's done manually
// once the section elements exist in the DOM.
function useScrollToHashOnMount() {
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    const t = setTimeout(() => scrollToId(hash), 80)
    return () => clearTimeout(t)
  }, [])
}

function useWorkItems() {
  return useMemo(() => {
    // Kynhood gets its own flagship card + sub-project row above this grid,
    // so it's excluded here to avoid showing it twice. Spaarks is also
    // excluded - '/spaarks' is actually a design-system reference page, not
    // an audit case study, so it belongs in the Design Systems section
    // instead of the case-study grid (its old "Audit" label there was wrong).
    return caseStudies.filter((s) => s.id !== 'kynhood---ux-&-ai' && s.id !== 'ux-enhancement---spaarks').map((study) => {
      const imageMatch = study.text.match(/!\[Image\]\(([^)]*(?:\([^)]*\)[^)]*)*)\)/)
      const image = IMAGE_OVERRIDES[study.id] || (imageMatch ? imageMatch[1] : '/gallery/kynhood/kyn-cover.png')
      const fallbackTitle = study.title
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/\s+-\s+Abusyeed/gi, '').replace(/\s+-\s+Ultimez/gi, '').trim()
      const title = TITLE_OVERRIDES[study.id] || fallbackTitle
      return {
        id: study.id,
        image,
        imageFit: IMAGE_FIT_OVERRIDES[study.id] || 'cover',
        tag: TAG_OVERRIDES[study.id] || 'Case Study',
        title,
        description: DESCRIPTION_OVERRIDES[study.id] || `Full case study - ${title}.`,
        route: ROUTE_OVERRIDES[study.id] || `/casestudies/${study.id}`,
      }
    })
  }, [])
}

export default function App() {
  const navigate = useNavigate()
  useScrollToHashOnMount()
  const [showSuccessMsg, setShowSuccessMsg] = useState(false)
  // Dark mode removed - site is light-only now.
  const isDarkMode = false
  const [showAllKynhood, setShowAllKynhood] = useState(false)
  const [showAllWork, setShowAllWork] = useState(false)
  const workItems = useWorkItems()
  const { isTablet, isMobile } = useBreakpoint()
  const sidePad = isMobile ? '1.25rem' : SIDE_PADDING

  const bg = isDarkMode ? '#0f0f0f' : '#F8F6F3'
  const textPrimary = isDarkMode ? '#f5f5f5' : '#0f172a'
  const textSecondary = isDarkMode ? '#a1a1a1' : '#334155'

  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = bg
    return () => { document.body.style.backgroundColor = prev }
  }, [bg])

  useEffect(() => {
    const handleSuccess = () => {
      setShowSuccessMsg(true)
      setTimeout(() => setShowSuccessMsg(false), 4000)
    }
    window.addEventListener('post-receive', handleSuccess)
    return () => window.removeEventListener('post-receive', handleSuccess)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', backgroundColor: bg, overflowX: 'clip', transition: 'background-color 0.3s ease' }}>
      <TopHeader
        maxWidth={CONTENT_WIDTH}
        items={[
          { label: 'Work', onClick: () => scrollToId('work') },
          { label: 'Case Studies', onClick: () => scrollToId('selected-work') },
          { label: 'Expertise', onClick: () => scrollToId('expertise') },
          { label: 'Posters', onClick: () => scrollToId('posters') },
          { label: 'About', onClick: () => scrollToId('about') },
          { label: 'Visual Piece', onClick: () => navigate('/visual-ui') },
        ]}
        cta={{ label: 'Download resume', onClick: () => { window.open('/gallery/resume.pdf', '_blank') } }}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', position: 'relative' }}>
          <div style={{ width: '100%', maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: isMobile ? `7rem 0 0` : `10rem 0 0`, position: 'relative' }}>
          {/* Hero - copy on the left, a polaroid scatter of real Kynhood
              event posters and behind-the-scenes shots on the right, giving
              the intro some visual texture instead of a bare text block. */}
          <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '0.7fr 1.3fr', gap: isTablet ? '0' : '2rem', alignItems: 'center' }}>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: MOTION.easeArray, delay: 0.08 }}
            >
              <ShinyName fontSize="clamp(3rem, 9vw, 7rem)" dark={isDarkMode}>Abu Syeed</ShinyName>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: MOTION.easeArray, delay: 0.18 }}
              style={{
                marginTop: isMobile ? '1.25rem' : '1.5rem',
                fontFamily: FONTS.display,
                fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: textPrimary,
                maxWidth: 620,
              }}
            >
              Product Designer with 2 years of experience, based in Chennai, India.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: MOTION.easeArray, delay: 0.26 }}
              style={{ marginTop: '0.85rem', fontFamily: FONTS.body, fontSize: '1.05rem', lineHeight: 1.65, color: textSecondary, maxWidth: 520 }}
            >
              I come from a background in AI &amp; Data Science. I most recently led
              product design at Kynhood - building computational design systems, shaping
              product strategy, and using AI to accelerate interface design.
            </motion.p>

          </div>

          {!isTablet && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: MOTION.easeArray, delay: 0.2 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '-4rem' }}
            >
              <img
                src="/gallery/kynhood/kyn-screens.png"
                alt="Polaroid scatter of Kynhood event posters and behind-the-scenes shots"
                style={{ width: '100%', maxWidth: 900, height: 'auto', display: 'block' }}
              />
            </motion.div>
          )}
          </div>
          </div>
        </div>

        {/* My journey - the Kynhood flagship card, first section on the page
            after the hero, ahead of the case-study grids. */}
        <div style={{ width: '100%', maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: isMobile ? `5rem ${sidePad} 0` : `7rem ${sidePad} 0` }}>
          <h2 style={{
            margin: isMobile ? '0 0 2.5rem 0' : '0 0 4rem 0',
            fontFamily: FONTS.display,
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: textPrimary,
          }}>
            My journey
          </h2>
          <FeaturedWorkCard
            image="/gallery/kynhood/kyn-cover.png"
            tag="Product Designer"
            period="June 2024 to July 2026"
            title="Kynhood"
            description="I worked here for 2 years, transforming complex community and events workflows into clean user experiences and using analytics to scale product engagement."
            onClick={() => navigate('/kynhood2')}
            dark={isDarkMode}
          />
        </div>

        {/* Work - Kynhood's sub-project case studies, then every other case
            study in the general Selected Work grid */}
        <div id="work" style={{ width: '100%', maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: isMobile ? `5rem ${sidePad} 0` : `9rem ${sidePad} 0`, scrollMarginTop: '100px' }}>
          <h2 style={{
            margin: isMobile ? '0 0 2.5rem 0' : '0 0 4rem 0',
            fontFamily: FONTS.display,
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: isDarkMode ? '#f5f5f5' : '#0f172a',
          }}>
            My works at KYN
          </h2>

          {/* Kynhood's real sub-project case studies - same 2-column
              WorkCard grid/style as Selected Work below; each card is now a
              real page at /kynhood2/case/:slug instead of an in-page modal.
              First 2x2 shown plain, second 2x2 blurred behind "See more".
              The flagship Kynhood card itself now lives in its own "My
              journey" section, below Selected work. */}
          <div>
            <RevealSection
              items={KYNHOOD_CASE_STUDY_CARDS}
              expanded={showAllKynhood}
              onExpand={() => setShowAllKynhood(true)}
              dark={isDarkMode}
              renderItem={(card, i) => (
                <WorkCard
                  key={card.title}
                  image={card.image}
                  imageFit={card.imageFit}
                  title={card.title}
                  description={card.subtitle}
                  onClick={() => navigate(`/kynhood2/case/${slugify(card.title)}`)}
                  dark={isDarkMode}
                  index={i}
                />
              )}
            />
          </div>
        </div>

        {/* Design Systems - the reference-system entries (Kynhood's token
            spec, Kynhood's component pipeline, Spaarks' component catalog)
            don't belong in a case-study grid, since none of them are a
            "case study" - they're standalone systems. Own section. */}
        <div style={{ width: '100%', maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: isMobile ? `5rem ${sidePad} 5rem` : `9rem ${sidePad} 8rem` }}>
          <h2 style={{
            margin: isMobile ? '0 0 2.5rem 0' : '0 0 4rem 0',
            fontFamily: FONTS.display,
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: textPrimary,
          }}>
            Design Systems I built
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', columnGap: '3rem', rowGap: '5rem' }}>
            {(() => {
              const neighbourhoodDS = KYNHOOD_DESIGN_SYSTEM_CARDS.find((c) => c.title === 'Neighbourhood Design System')
              if (!neighbourhoodDS) return null
              return (
                <WorkCard
                  image={neighbourhoodDS.image}
                  title="Kynhood Design System"
                  description={neighbourhoodDS.description}
                  onClick={() => navigate(`/kynhood2/case/${slugify(neighbourhoodDS.title)}`)}
                  dark={isDarkMode}
                  index={0}
                />
              )
            })()}
            {(() => {
              const styleGuideDS = KYNHOOD_DESIGN_SYSTEM_CARDS.find((c) => c.title === 'Style Guide > Design System')
              if (!styleGuideDS) return null
              return (
                <WorkCard
                  image={styleGuideDS.image}
                  title="Kynhood Style Guide"
                  description={styleGuideDS.description}
                  onClick={() => navigate(`/kynhood2/case/${slugify(styleGuideDS.title)}`)}
                  dark={isDarkMode}
                  index={1}
                />
              )
            })()}
            <WorkCard
              image="/gallery/spaarks/spark_ds_cover.jpg"
              title="Spaarks Design System"
              description="A component design system built for the Spaarks Android app, covering navigation, dialogs, form fields, and other reusable UI patterns."
              onClick={() => navigate('/spaarks')}
              dark={isDarkMode}
              index={2}
            />
          </div>
        </div>

        <div id="selected-work" style={{ width: '100%', maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: isMobile ? `4rem ${sidePad} 5rem` : `7rem ${sidePad} 11rem`, scrollMarginTop: '100px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, ease: MOTION.easeArray }}
            style={{ marginBottom: '3rem' }}
          >
            <span style={{ fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              Portfolio
            </span>
            <h2 style={{ margin: '0.5rem 0 0 0', fontFamily: FONTS.display, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, color: textPrimary }}>
              Selected work
            </h2>
          </motion.div>
          <RevealSection
            items={workItems}
            expanded={showAllWork}
            onExpand={() => setShowAllWork(true)}
            dark={isDarkMode}
            renderItem={(item, i) => (
              <WorkCard
                key={item.id}
                image={item.image}
                imageFit={item.imageFit}
                tag={item.tag}
                title={item.title}
                description={item.description}
                onClick={() => navigate(item.route)}
                dark={isDarkMode}
                index={i}
              />
            )}
          />
        </div>

        <div style={{ marginTop: '6rem' }}>
          <FeaturedOnSection dark={isDarkMode} />
        </div>

        <div id="expertise" style={{ marginTop: '2rem', scrollMarginTop: '100px' }}>
          <ExpertiseSection dark={isDarkMode} />
        </div>

        <div id="posters" style={{ width: '100%', maxWidth: CONTENT_WIDTH, margin: isMobile ? '5rem auto 0' : '10rem auto 0', padding: `0 ${sidePad}`, scrollMarginTop: '100px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: MOTION.easeArray }}
            style={{ margin: 0, fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: textPrimary, lineHeight: 1.2, textAlign: 'center' }}
          >
            My posters
          </motion.h2>
        </div>

        <div style={{ width: '100%', marginTop: '6rem', height: isMobile ? '380px' : isTablet ? '520px' : '720px', position: 'relative' }}>
          <Suspense fallback={null}>
            <CircularGallery {...CIRCULAR_GALLERY_BASE_PROPS} textColor={isDarkMode ? '#f5f5f5' : '#0f172a'} />
          </Suspense>
        </div>

        {/* About */}
        <div id="about" style={{ scrollMarginTop: '100px', padding: isMobile ? '5rem 0 0' : '9rem 0 0' }}>
          <AboutIntro dark={isDarkMode} />
        </div>

        <div style={{ height: '4rem' }} />

        <AnimatePresence>
          {showSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(10px)', y: -10 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: FONTS.primary,
                fontSize: '14px',
                fontWeight: 500,
                color: '#000',
                backgroundColor: '#fff',
                padding: 'var(--space-3) var(--space-6)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 10001,
              }}
            >
              email sent, I will get back to you!
            </motion.div>
          )}
        </AnimatePresence>

        <ChatWidget />
      </div>
      <MichaelFooter dark={isDarkMode} />
    </div>
  )
}
