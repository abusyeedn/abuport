import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import TopHeader from './components/TopHeader'
import ShinyName from './components/ShinyName'
import WorkCard from './components/WorkCard'
import FeaturedWorkCard from './components/FeaturedWorkCard'
import SkillPills from './components/SkillPills'
import AboutIntro from './components/AboutIntro'
import ExpertiseSection from './components/ExpertiseSection'
import { ALL_KYNHOOD_CARDS } from './components/KynhoodBentoCards'
import RevealSection from './components/RevealSection'
import { Icon } from '@iconify/react'
import MichaelFooter from './components/MichaelFooter'
import { FONTS, MOTION } from './theme'
import ChatWidget from './components/ChatWidget'
import caseStudies from './data/caseStudies.json'
import { useBreakpoint } from './hooks/useBreakpoint'

const CircularGallery = lazy(() => import('./components/CircularGallery'))
const GradientWaves = lazy(() => import('./components/GradientWaves'))

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
  'ux-enhancement---spaarks': '/spaarks',
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

const TAG_OVERRIDES: Record<string, string> = {
  'kynhood---ux-&-ai': 'Product · AI',
  'ux-enhancement---spaarks': 'UX Design',
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
  'coinpedia---re-design---ultimez': 'Coinpedia - Redesign Concept',
  'competitive-audit---real-estate-sites': 'Real Estate Platforms - Competitive UX Audit',
  'foundit---ux-case-study': 'FoundIt - Landing Page UX Case Study',
  'phonepe-2-0---bts': 'PhonePe 2.0 - Behind the Redesign',
  'recruit-crm---ux-enhancement-1---abusyeed': 'Recruit CRM - Advanced Search Enhancement',
  'recruit-crm---ux-enhancement-2---abusyeed': 'Recruit CRM - Header & Navigation Enhancement',
  'ux-enhancement---spaarks': 'Spaarks - Usability & Accessibility Audit',
}

const DESCRIPTION_OVERRIDES: Record<string, string> = {
  'coinpedia---re-design---ultimez': "A UI/UX redesign of Coinpedia's market and Bitcoin pages, focused on cleaner data visualization and layout.",
  'competitive-audit---real-estate-sites': 'A comparative UX audit of 99acres, Housing.com, and Magicbricks - usability, navigation, and brand trust.',
  'foundit---ux-case-study': 'A responsive landing page redesign for FoundIt (formerly Monster.com), putting job search front and center.',
  'phonepe-2-0---bts': "An analysis of PhonePe's 2024 UI overhaul - bento layouts, muscle memory, and UPI design constraints.",
  'recruit-crm---ux-enhancement-1---abusyeed': 'Simplifying case-sensitive Boolean search and advanced filters for recruiters.',
  'recruit-crm---ux-enhancement-2---abusyeed': 'Cleaning up header icons and navigation for better discoverability and accessibility.',
  'ux-enhancement---spaarks': 'An end-to-end usability and accessibility audit of the Spaarks mobile app.',
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function useWorkItems() {
  return useMemo(() => {
    // Kynhood gets its own flagship card + sub-project row above this grid,
    // so it's excluded here to avoid showing it twice.
    return caseStudies.filter((s) => s.id !== 'kynhood---ux-&-ai').map((study) => {
      const imageMatch = study.text.match(/!\[Image\]\(([^)]*(?:\([^)]*\)[^)]*)*)\)/)
      const image = imageMatch ? imageMatch[1] : '/gallery/kynhood/kyn-cover.png'
      const fallbackTitle = study.title
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/\s+-\s+Abusyeed/gi, '').replace(/\s+-\s+Ultimez/gi, '').trim()
      const title = TITLE_OVERRIDES[study.id] || fallbackTitle
      return {
        id: study.id,
        image,
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
  const [showSuccessMsg, setShowSuccessMsg] = useState(false)
  // Light mode by default. Once a visitor toggles it via TopHeader, that
  // choice is remembered (localStorage) and used on every later visit,
  // instead of resetting to light each time.
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    window.localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])
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
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((v) => !v)}
        maxWidth={CONTENT_WIDTH}
        items={[
          { label: 'Work', onClick: () => scrollToId('work') },
          { label: 'Case Studies', onClick: () => scrollToId('selected-work') },
          { label: 'Posters', onClick: () => scrollToId('posters') },
          { label: 'Visual UI', onClick: () => navigate('/visual-ui') },
          { label: 'About', onClick: () => scrollToId('about') },
        ]}
        cta={{ label: 'Say Hi', onClick: () => { window.location.href = 'mailto:abusyeed10202@gmail.com' } }}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', position: 'relative' }}>
          {/* Decorative only, and at 45% width it would collide with the hero
              text once that text wraps to full-width on tablet/mobile - hide
              it there rather than let it overlap. */}
          {!isTablet && (
          <div
            style={{
              position: 'absolute', top: 0, right: 0, width: '45%', height: '600px', overflow: 'hidden', pointerEvents: 'none',
              filter: 'blur(1.5px)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 75%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 75%, transparent 100%)',
            }}
          >
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '100vmax', height: '100vmax', transform: 'translate(-50%, -50%) rotate(90deg)' }}>
              <Suspense fallback={null}>
                <GradientWaves
                  horizonColor={isDarkMode ? '#0a0a0a' : '#043d33'}
                  waveColor="#077a4b"
                  crestColor="#00cbb4"
                  speed={0.4}
                  amplitude={2.5}
                  waveScale={0.6}
                  waveRatio={0.9}
                  swell={35}
                  turbulence={20}
                  tilt={1.11}
                  zoom={1.0}
                  height={5.5}
                  fogDepth={15}
                  detail="medium"
                  brightness={isDarkMode ? 0.8 : 1.0}
                  opacity={isDarkMode ? 0.95 : 0.65}
                  mouseInteraction={true}
                  parallaxStrength={0.5}
                  grain={true}
                  grainIntensity={0.05}
                />
              </Suspense>
            </div>
            {/* Left-edge fade into the page background, so it blends with the
                hero text instead of ending in a hard vertical line. */}
            <div
              style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to right, ${isDarkMode ? '#0f0f0f' : '#F8F6F3'} 0%, transparent 40%)`,
              }}
            />
          </div>
          )}
          <div style={{ width: '100%', maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: isMobile ? `6rem ${sidePad} 3rem` : `10rem ${sidePad} 4rem`, position: 'relative' }}>
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: MOTION.easeArray }}
          >
            <ShinyName fontSize="clamp(3rem, 9vw, 7rem)" dark={isDarkMode}>Abu Syeed</ShinyName>
            <div style={{ marginTop: '1.75rem', display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: FONTS.body, fontSize: '1rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: isDarkMode ? '#00cbb4' : '#077a4b' }}>
                Product Designer with 2 years of experience
              </span>
              <p style={{ fontFamily: FONTS.body, fontSize: '1.05rem', lineHeight: 1.5, color: textSecondary, maxWidth: 480, margin: 0 }}>
                With a background in AI &amp; Data Science, based in Chennai, India. Most
                recently led product design at Kynhood - specializing in computational
                design systems, product strategy, and AI-accelerated interface design.
              </p>
            </div>
            <div style={{ marginTop: '1.75rem' }}>
              <motion.a
                href="mailto:abusyeed10202@gmail.com"
                whileHover="hover"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: FONTS.body,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  color: textPrimary,
                  textDecoration: 'none',
                  borderBottom: `2px solid ${textPrimary}`,
                  paddingBottom: '2px',
                }}
              >
                Let's talk
                <motion.span
                  variants={{ hover: { x: 4, y: -4 } }}
                  transition={{ duration: 0.2, ease: MOTION.easeArray }}
                  style={{ display: 'inline-flex' }}
                >
                  <Icon icon="solar:arrow-right-up-outline" width={16} />
                </motion.span>
              </motion.a>
            </div>
          </motion.div>
          </div>
        </div>

        {/* Work - Kynhood flagship card, then its own sub-projects, then
            every other case study in the general Selected Work grid */}
        <div id="work" style={{ width: '100%', maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: isMobile ? `5rem ${sidePad} 0` : `11rem ${sidePad} 0`, scrollMarginTop: '100px' }}>
          <FeaturedWorkCard
            image="/gallery/kynhood/kyn-cover.png"
            tag="Product Designer"
            period="June 2024 to July 2026"
            title="Kynhood"
            description="Transforming complex community and events workflows into clean user experiences while leveraging analytics to scale product engagement."
            onClick={() => navigate('/kynhood2')}
            dark={isDarkMode}
          />

          {/* Kynhood's real sub-project case studies - same 2-column
              WorkCard grid/style as Selected Work below; each card is now a
              real page at /kynhood2/case/:slug instead of an in-page modal.
              First 2x2 shown plain, second 2x2 blurred behind "See more". */}
          <div style={{ marginTop: '5rem' }}>
            <RevealSection
              items={ALL_KYNHOOD_CARDS}
              expanded={showAllKynhood}
              onExpand={() => setShowAllKynhood(true)}
              dark={isDarkMode}
              renderItem={(card, i) => (
                <WorkCard
                  key={card.title}
                  image={card.image}
                  tag="Kynhood"
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

        {/* About */}
        <div id="about" style={{ scrollMarginTop: '100px', padding: '4rem 0 0' }}>
          <AboutIntro dark={isDarkMode} />
          <div style={{ marginTop: '4rem' }}>
            <SkillPills dark={isDarkMode} />
          </div>
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

        <div style={{ marginTop: '6rem' }}>
          <ExpertiseSection dark={isDarkMode} />
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
