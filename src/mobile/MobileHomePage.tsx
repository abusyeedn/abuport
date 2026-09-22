/**
 * MobileHomePage.tsx
 *
 * Mobile-native reflow of the ACTUAL desktop homepage (App.tsx), same
 * section order and same real components/data, not a hand-paraphrased
 * summary: hero -> "My works at KYN" (KYNHOOD_CASE_STUDY_CARDS) -> "Design
 * Systems I built" -> FeaturedOnSection -> ExpertiseSection -> "My posters"
 * -> AboutIntro -> MichaelFooter. ExpertiseSection, FeaturedOnSection,
 * AboutIntro and MichaelFooter are all already responsive in their own
 * right (useBreakpoint, no GSAP/canvas-only assumptions), so they're
 * mounted directly here rather than rebuilt - anything else would drift out
 * of sync with real edits to those files. Posters swaps desktop's WebGL
 * CircularGallery for a plain swipeable carousel (MobilePosterSlider) -
 * same images, no WebGL needed on a phone.
 *
 * Section ids (work/expertise/posters/about) match App.tsx exactly so the
 * hamburger nav's scroll-to-section links actually land on the right spot.
 */
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { FONTS, TYPE, MOBILE_TYPE, COLORS } from '../theme'
import { KYNHOOD_CASE_STUDY_CARDS, KYNHOOD_DESIGN_SYSTEM_CARDS, KYNHOOD_VIBE_CODED_CARDS } from '../components/KynhoodBentoCards'
import ExpertiseSection from '../components/ExpertiseSection'
import FeaturedOnSection from '../components/FeaturedOnSection'
import AboutIntro from '../components/AboutIntro'
import MichaelFooter from '../components/MichaelFooter'
import MobileHero from './MobileHero'
import MobilePosterSlider from './MobilePosterSlider'

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

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <span style={{ display: 'block', fontFamily: FONTS.body, fontSize: MOBILE_TYPE['3xs'], fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.textMuted }}>
      {children}
    </span>
  )
}

/** Same card language as desktop's WorkCard - image, title, blurb - navigating
 *  to the real /kynhood2/case/:slug route (mobile-safe: see KynhoodCasePage).
 *  A couple of cards (e.g. "Notify") use a video as their cover, not an
 *  image - rendering those through a plain <img> is why their thumbnail
 *  never loaded; this matches desktop's WorkCard video/image branch. */
function MobileWorkCard({ image, imageFit, imageAspect = '4 / 3', title, description, points, onClick }: { image: string; imageFit?: 'cover' | 'contain'; imageAspect?: string; title: string; description?: string; points?: string[]; onClick: () => void }) {
  const isVideo = image.endsWith('.mp4') || image.endsWith('.mov') || image.endsWith('.webm')
  return (
    <button
      onClick={onClick}
      style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', background: 'none', border: 'none', padding: 0, margin: 0, textAlign: 'left', cursor: 'pointer' }}
    >
      <div style={{ width: '100%', aspectRatio: imageAspect, borderRadius: 14, overflow: 'hidden', background: '#eceae4' }}>
        {isVideo ? (
          <video src={image} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: imageFit || 'cover', display: 'block' }} />
        ) : (
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: imageFit || 'cover', display: 'block' }} />
        )}
      </div>
      <h3 style={{ margin: 0, fontFamily: FONTS.display, fontSize: MOBILE_TYPE.lg, fontWeight: 700, lineHeight: 1.4, letterSpacing: '-0.01em', color: COLORS.textPrimary }}>
        {title}
      </h3>
      {description && (
        <p style={{ margin: 0, fontFamily: FONTS.body, fontSize: MOBILE_TYPE.xs, lineHeight: TYPE.relaxed, color: COLORS.textMuted }}>
          {description}
        </p>
      )}
      {points && points.length > 0 && (
        <p style={{ margin: 0, fontFamily: FONTS.body, fontSize: MOBILE_TYPE.xs, lineHeight: TYPE.relaxed, color: COLORS.textMuted }}>
          {points.map((point, i) => (
            <span key={i}>
              {i > 0 && <span style={{ margin: '0 6px' }}>•</span>}
              {point}
            </span>
          ))}
        </p>
      )}
    </button>
  )
}

export default function MobileHomePage() {
  const navigate = useNavigate()
  const sidePad = '1.25rem'
  const isDarkMode = false

  const neighbourhoodDS = KYNHOOD_DESIGN_SYSTEM_CARDS.find((c) => c.title === 'Neighbourhood Design System')
  const styleGuideDS = KYNHOOD_DESIGN_SYSTEM_CARDS.find((c) => c.title === 'Style Guide > Design System')

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: `4rem ${sidePad} 0` }}>
        <MobileHero />
      </div>

      {/* Work - same real Kynhood sub-project cards as desktop's "My works at KYN" */}
      <div id="work" style={{ padding: `4rem ${sidePad} 0`, scrollMarginTop: '76px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <SectionEyebrow>Kynhood</SectionEyebrow>
          <h2 style={{ margin: '0.5rem 0 0 0', fontFamily: FONTS.display, fontSize: MOBILE_TYPE.xl, fontWeight: 700, letterSpacing: '-0.01em', color: COLORS.textPrimary }}>
            My works at KYN
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {KYNHOOD_CASE_STUDY_CARDS.map((card) => (
            <MobileWorkCard
              key={card.title}
              image={card.image}
              imageFit={card.imageFit}
              imageAspect="16 / 9"
              title={card.title}
              points={card.meta?.map((m) => m.value)}
              onClick={() => navigate(`/kynhood2/case/${slugify(card.title)}`)}
            />
          ))}
        </div>
      </div>

      {/* Vibe-Coded Products - Chase & Cheer and Notify were both built by
          vibe-coding rather than as regular Kynhood case studies, so they
          get their own section instead of sitting in "My works at KYN". */}
      <div style={{ padding: `4rem ${sidePad} 0` }}>
        <h2 style={{ margin: '0 0 2rem 0', fontFamily: FONTS.display, fontSize: MOBILE_TYPE.xl, fontWeight: 700, letterSpacing: '-0.01em', color: COLORS.textPrimary }}>
          Vibe-Coded Products
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {KYNHOOD_VIBE_CODED_CARDS.map((card) => (
            <MobileWorkCard
              key={card.title}
              image={card.image}
              imageFit={card.imageFit}
              imageAspect="16 / 9"
              title={card.title}
              points={card.meta?.map((m) => m.value)}
              onClick={() => navigate(`/kynhood2/case/${slugify(card.title)}`)}
            />
          ))}
        </div>
      </div>

      {/* Design Systems I built */}
      <div style={{ padding: `4rem ${sidePad} 4rem` }}>
        <h2 style={{ margin: '0 0 2rem 0', fontFamily: FONTS.display, fontSize: MOBILE_TYPE.xl, fontWeight: 700, letterSpacing: '-0.01em', color: COLORS.textPrimary }}>
          Design Systems I built
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {neighbourhoodDS && (
            <MobileWorkCard
              image={neighbourhoodDS.image}
              title="Kynhood Design System"
              description={neighbourhoodDS.homeBlurb || neighbourhoodDS.description}
              onClick={() => navigate(`/kynhood2/case/${slugify(neighbourhoodDS.title)}`)}
            />
          )}
          {styleGuideDS && (
            <MobileWorkCard
              image={styleGuideDS.image}
              title="Kynhood Style Guide"
              description={styleGuideDS.homeBlurb || styleGuideDS.description}
              onClick={() => navigate(`/kynhood2/case/${slugify(styleGuideDS.title)}`)}
            />
          )}
          <MobileWorkCard
            image="/gallery/spaarks/spark_ds_cover.jpg"
            title="Spaarks Design System"
            description="24 reusable components built for the Spaarks Android app, navigation, dialogs, form fields, and more, with full variants and states."
            onClick={() => navigate('/spaarks')}
          />
        </div>
      </div>

      {/* Kynhood cover image, its label, and the "View my journey" CTA -
          used to live inside MobileHero's green mat; pulled out here, right
          above the existing Recognition strip, matching desktop. */}
      <div style={{ padding: `3rem ${sidePad} 0`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <img
          src="/gallery/kynhood/kyn-cover.png"
          alt="Kynhood - Product Designer, June 2024 to July 2026"
          loading="lazy"
          decoding="async"
          style={{ width: '100%', maxWidth: 480, display: 'block', borderRadius: 16 }}
        />
        <span style={{ fontFamily: FONTS.display, fontStyle: 'italic', letterSpacing: '0.015em', fontSize: MOBILE_TYPE.lg, fontWeight: 700, color: COLORS.textPrimary }}>
          Kynhood - Product Designer
        </span>
        <button
          onClick={() => navigate('/kynhood2')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 18px', borderRadius: 'var(--radius-cta)',
            background: '#000000', color: '#ffffff',
            border: 'none', cursor: 'pointer',
            fontFamily: FONTS.body, fontSize: MOBILE_TYPE.xs, fontWeight: 400,
            whiteSpace: 'nowrap',
          }}
        >
          View my journey <Icon icon="solar:arrow-right-up-outline" width={13} />
        </button>
      </div>

      <FeaturedOnSection dark={isDarkMode} />

      <div id="expertise" style={{ scrollMarginTop: '76px' }}>
        <ExpertiseSection dark={isDarkMode} />
      </div>

      <div id="posters" style={{ padding: `0 ${sidePad}`, scrollMarginTop: '76px', marginTop: '3rem' }}>
        <h2 style={{ margin: 0, fontFamily: FONTS.display, fontStyle: 'italic', letterSpacing: '0.015em', fontSize: MOBILE_TYPE.xl, fontWeight: 700, color: COLORS.textPrimary, textAlign: 'center' }}>
          My posters
        </h2>
      </div>

      <div style={{ width: '100%', marginTop: '2.5rem' }}>
        <MobilePosterSlider items={GALLERY_ITEMS} />
      </div>

      <div id="about" style={{ scrollMarginTop: '76px', padding: '6rem 0 3rem' }}>
        <AboutIntro dark={isDarkMode} />
      </div>

      <MichaelFooter dark={isDarkMode} />
    </div>
  )
}
