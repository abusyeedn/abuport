import { useState, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ShinyName from './components/ShinyName'
import WorkCard from './components/WorkCard'
import AboutIntro from './components/AboutIntro'
import ExpertiseSection from './components/ExpertiseSection'
import FeaturedOnSection from './components/FeaturedOnSection'
import { KYNHOOD_CASE_STUDY_CARDS, KYNHOOD_DESIGN_SYSTEM_CARDS, KYNHOOD_VIBE_CODED_CARDS } from './components/KynhoodBentoCards'
import { Icon } from '@iconify/react'
import MichaelFooter from './components/MichaelFooter'
import { FONTS, MOTION } from './theme'
import ChatWidget from './components/ChatWidget'
import { useBreakpoint } from './hooks/useBreakpoint'
import { getLenis } from './components/SmoothScroll'

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
  { image: '/gallery/home/gallery_9.jpg', text: 'تشيناي\nChennai' },
  { image: '/gallery/bagdad.png', text: 'بغداد\nBaghdad' },
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

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = getLenis()
  // The page's scroll is actually driven by Lenis, not the native scrollbar -
  // calling the browser's own scrollIntoView left the two systems fighting
  // over the final position, which is why it always landed a few pixels
  // short/long instead of exactly at the section. Driving Lenis directly
  // lands exactly on target every time instead of needing a manual nudge after.
  //
  // "about" specifically needs a different offset than every other section:
  // it carries a large decorative top padding (17rem/272px on desktop, added
  // earlier purely for breathing room when scrolling past it naturally) before
  // its actual heading. Landing at the section's own top the way every other
  // section does leaves a big empty gap under the nav instead of the heading
  // showing right away - a positive offset here scrolls past most of that
  // padding instead of stopping at the very top of the (empty) div.
  const isNarrow = typeof window !== 'undefined' && window.innerWidth <= 640
  const offset = id === 'about' ? (isNarrow ? 90 : 150) : -130
  if (lenis) {
    lenis.scrollTo(el, { offset })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Lets other pages (e.g. Visual UI) link back to a home-page section via
// `/#work` - since this is a client-side route change, not a real page
// load, the browser's native hash-scroll never fires, so it's done manually
// once the section elements exist in the DOM.
function useScrollToHashOnMount() {
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    // A single scroll shortly after mount used to land short of the real
    // target (e.g. clicking "Posters" from another page would land on
    // "Case Studies" instead, one section per re-click) - several sections
    // above most anchors (the Work/Vibe-Coded/Design-Systems grids, the
    // lazy-loaded Posters gallery) are still loading their images at 80ms,
    // so the page is shorter than its final height and every section below
    // them is still sitting higher than it will end up. Re-issuing the same
    // scroll a few times over the first 1.5s corrects for that layout
    // settling instead of gambling on one fixed delay - Lenis just smoothly
    // retargets each time, so it converges on the right spot instead of
    // visibly jumping.
    const delays = [80, 300, 600, 1000, 1500]
    const timers = delays.map((d) => setTimeout(() => scrollToId(hash), d))
    return () => timers.forEach(clearTimeout)
  }, [])
}

export default function App() {
  const navigate = useNavigate()
  useScrollToHashOnMount()
  const [showSuccessMsg, setShowSuccessMsg] = useState(false)
  // Dark mode removed - site is light-only now.
  const isDarkMode = false
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

  // Broadcasts which homepage section ("work", "expertise", "posters",
  // "about") is currently in view, so the nav pill in TopHeader.tsx (a
  // sibling component mounted above <Routes>, not a descendant of App) can
  // light up the matching item as the visitor scrolls - a plain window
  // CustomEvent instead of new shared state/context, since this is the only
  // consumer and it's a one-way broadcast.
  useEffect(() => {
    const ids = ['work', 'expertise', 'posters', 'about']
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))
    if (els.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) {
          window.dispatchEvent(new CustomEvent('homepage-section-in-view', { detail: visible.target.id }))
        }
      },
      { rootMargin: '-130px 0px -60% 0px' }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', backgroundColor: bg, overflowX: 'clip', transition: 'background-color 0.3s ease' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Work - Kynhood's sub-project case studies, then every other case
            study in the general Selected Work grid. Leads the page now -
            the name/tagline/description that used to sit above this moved
            down into a two-column section with the Kynhood card, between
            "Design Systems I built" and Recognition. Top padding picks up
            the navbar clearance the old hero used to provide. */}
        <div id="work" style={{ width: '100%', maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: isMobile ? `9rem ${sidePad} 0` : `11rem ${sidePad} 0`, scrollMarginTop: '130px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, ease: MOTION.easeArray }}
            style={{ marginBottom: isMobile ? '2.5rem' : '4rem' }}
          >
            <span style={{ fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              Kynhood
            </span>
            <h2 style={{
              margin: '0.5rem 0 0 0',
              fontFamily: FONTS.display,
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: isDarkMode ? '#f5f5f5' : '#0f172a',
            }}>
              My works at KYN
            </h2>
          </motion.div>

          {/* Kynhood's real sub-project case studies - same 2-column
              WorkCard grid/style as Selected Work below; each card is now a
              real page at /kynhood2/case/:slug instead of an in-page modal.
              All shown expanded, no "See more" gate. The flagship Kynhood
              card itself lives in its own "My journey" section, below
              Selected work. */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            rowGap: isMobile ? '2.5rem' : '5.5rem',
          }}>
            {KYNHOOD_CASE_STUDY_CARDS.map((card, i) => (
              <WorkCard
                key={card.title}
                image={card.image}
                imageFit={card.imageFit}
                imageAspect="16 / 9"
                title={card.title}
                points={card.meta?.map((m) => m.value)}
                onClick={() => navigate(`/kynhood2/case/${slugify(card.title)}`)}
                dark={isDarkMode}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Vibe-Coded Products - Chase & Cheer and Notify were both built by
            vibe-coding rather than as regular Kynhood case studies, so they
            get their own section instead of sitting in "My works at KYN". */}
        <div style={{ width: '100%', maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: isMobile ? `5rem ${sidePad} 0` : `9rem ${sidePad} 0` }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, ease: MOTION.easeArray }}
            style={{ marginBottom: isMobile ? '2.5rem' : '4rem' }}
          >
            <span style={{ fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              Side Projects
            </span>
            <h2 style={{
              margin: '0.5rem 0 0 0',
              fontFamily: FONTS.display,
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: textPrimary,
            }}>
              Vibe-Coded Products
            </h2>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr' : 'repeat(2, 1fr)',
            columnGap: '3rem',
            rowGap: isMobile ? '2.5rem' : '5.5rem',
          }}>
            {KYNHOOD_VIBE_CODED_CARDS.map((card, i) => (
              <WorkCard
                key={card.title}
                image={card.image}
                imageFit={card.imageFit}
                imageAspect="16 / 9"
                title={card.title}
                points={card.meta?.map((m) => m.value)}
                onClick={() => navigate(`/kynhood2/case/${slugify(card.title)}`)}
                dark={isDarkMode}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Design Systems - the reference-system entries (Kynhood's token
            spec, Kynhood's component pipeline, Spaarks' component catalog)
            don't belong in a case-study grid, since none of them are a
            "case study" - they're standalone systems. Own section. */}
        <div style={{ width: '100%', maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: isMobile ? `5rem ${sidePad} 5rem` : `9rem ${sidePad} 8rem` }}>
          <span style={{ display: 'block', fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
            Systems
          </span>
          <h2 style={{
            margin: isMobile ? '0.5rem 0 2.5rem 0' : '0.5rem 0 4rem 0',
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
                  description={neighbourhoodDS.homeBlurb || neighbourhoodDS.description}
                  onClick={() => navigate(`/kynhood2/case/${slugify(neighbourhoodDS.title)}`)}
                  dark={isDarkMode}
                  index={0}
                  hoverLabel="Read design system"
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
                  description={styleGuideDS.homeBlurb || styleGuideDS.description}
                  onClick={() => navigate(`/kynhood2/case/${slugify(styleGuideDS.title)}`)}
                  dark={isDarkMode}
                  index={1}
                  hoverLabel="Read design system"
                />
              )
            })()}
            <WorkCard
              image="/gallery/spaarks/spark_ds_cover.jpg"
              title="Spaarks Design System"
              description="24 reusable components built for the Spaarks Android app, navigation, dialogs, form fields, and more, with full variants and states."
              onClick={() => navigate('/spaarks')}
              dark={isDarkMode}
              index={2}
              hoverLabel="Read design system"
            />
          </div>
        </div>

        {/* Name/tagline/description, two columns with the Kynhood cover
            image, its label, and the "View my journey" CTA - sits here,
            between "Design Systems I built" and Recognition, rather than
            leading the page ("My works at KYN" does that now). Stacks on
            tablet/mobile, text first. */}
        <div style={{ width: '100%', maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: isMobile ? `5rem ${sidePad} 5rem` : `9rem ${sidePad} 9rem` }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr',
            alignItems: 'center',
            gap: isMobile ? '3rem' : '4rem',
          }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: MOTION.easeArray }}
              style={{ width: '100%', textAlign: isTablet ? 'center' : 'left' }}
            >
              <ShinyName fontSize="clamp(2.5rem, 6vw, 4.5rem)" dark={false}>Abu Syeed</ShinyName>

              <p
                style={{
                  marginTop: isMobile ? '1.25rem' : '1.5rem',
                  fontFamily: FONTS.display,
                  fontSize: 'clamp(1.15rem, 1.8vw, 1.4rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: textPrimary,
                }}
              >
                Product & Designer | 2.6 XP | Chennai
              </p>

              <p
                style={{ marginTop: '0.6rem', fontFamily: FONTS.body, fontSize: '1.15rem', lineHeight: 1.55, color: textSecondary, maxWidth: 560, marginLeft: isTablet ? 'auto' : 0, marginRight: isTablet ? 'auto' : 0 }}
              >
                I did my education in AI and data science, and spent the last 2.5 years
                at Kynhood, designing, solving real problems, and learning product management
                and strategy along the way, using AI wherever it could help me move faster.
                I've also worked on a feature end to end, designing it completely from start
                to finish.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: MOTION.easeArray, delay: 0.08 }}
              style={{ width: '100%', maxWidth: isTablet ? 480 : 'none', margin: isTablet ? '0 auto' : 0, display: 'flex', flexDirection: 'column', alignItems: isTablet ? 'center' : 'flex-start', gap: '20px' }}
            >
              <img
                src="/gallery/kynhood/kyn-cover.png"
                alt="Kynhood - Product Designer, June 2024 to July 2026"
                loading="lazy"
                decoding="async"
                style={{ width: '100%', display: 'block', borderRadius: 18 }}
              />

              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: FONTS.display, fontStyle: 'italic', letterSpacing: '0.015em', fontSize: '1.6rem', fontWeight: 700, color: textPrimary,
                }}>
                  Kynhood - Product Designer
                </span>

                <motion.button
                  onClick={() => navigate('/kynhood2')}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '11px 20px', borderRadius: 'var(--radius-cta)',
                    background: '#000000', color: '#ffffff',
                    border: 'none', cursor: 'pointer',
                    fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 400,
                    whiteSpace: 'nowrap',
                  }}
                >
                  View my journey <Icon icon="solar:arrow-right-up-outline" width={14} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        <div style={{ marginTop: '6rem' }}>
          <FeaturedOnSection dark={isDarkMode} />
        </div>

        <div id="expertise" style={{ marginTop: '2rem', scrollMarginTop: '130px' }}>
          <ExpertiseSection dark={isDarkMode} />
        </div>

        <div id="posters" style={{ width: '100%', maxWidth: CONTENT_WIDTH, margin: isMobile ? '5rem auto 0' : '10rem auto 0', padding: `0 ${sidePad}`, scrollMarginTop: '130px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: MOTION.easeArray }}
            style={{ margin: 0, fontFamily: FONTS.display, fontStyle: 'italic', letterSpacing: '0.015em', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: textPrimary, lineHeight: 1.2, textAlign: 'center' }}
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
        <div id="about" style={{ scrollMarginTop: '130px', padding: isMobile ? '10rem 0 7rem' : '17rem 0 12rem' }}>
          <AboutIntro dark={isDarkMode} />
        </div>

        <div style={{ height: isMobile ? '5rem' : '7rem' }} />

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
