import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FONTS } from '../theme';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FigmaElement from '../components/FigmaElement'
import KynhoodJourney from '../components/KynhoodJourney'
import ScrollReveal from '../components/ScrollReveal'
import DynamicRenderer from '../components/DynamicRenderer'
import PipBoyMetricsRow from '../components/PipBoyMetricsRow'
import FlowingMenu from '../components/FlowingMenu'
import WordHighlighter from '../components/WordHighlighter'
import { Icon } from '@iconify/react';
import Dock from '../components/Dock';
import DidYouKnow from '../components/DidYouKnow';
import SplitTextMediaHover from '../components/SplitTextMediaHover';
import KynhoodBentoCards, { KynhoodBentoCardsSecondary, KynhoodBentoCardsTertiary, KynhoodBentoCardsEventsPlugin } from '../components/KynhoodBentoCards';
import OtpInput from '../components/OtpInput';
import { useZoomScale } from '../components/ViewportScaler';

const ACCESS_CODE = '786920'

function LockedFigmaEmbed({ src }: { src: string }) {
  const [unlocked, setUnlocked] = useState(false)
  const [code, setCode] = useState('')
  const [shake, setShake] = useState(false)

  const attempt = () => {
    if (code === ACCESS_CODE) {
      setUnlocked(true)
    } else {
      setShake(true)
      setCode('')
      setTimeout(() => setShake(false), 500)
    }
  }

  if (unlocked) {
    return (
      <div style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <iframe style={{ border: 'none', display: 'block' }} width="100%" height="600" src={src} allowFullScreen />
      </div>
    )
  }

  return (
    <div style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', background: 'var(--color-bg-secondary)', height: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-5)' }}>
      <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Icon icon="solar:lock-keyhole-outline" width={26} color="var(--color-text-primary)" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: '6px' }}>Enter access code to view</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted-light)' }}>This Figma file is access-restricted</div>
      </div>
      <div style={{ animation: shake ? 'shake 0.4s ease' : 'none' }}>
        <OtpInput value={code} onChange={setCode} onComplete={attempt} theme="light" autoFocus />
      </div>
      <button
        onClick={attempt}
        style={{ padding: '10px var(--space-6)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-dark)', color: '#fff', fontSize: '0.875rem', fontWeight: '600', border: 'none', cursor: 'pointer' }}
      >
        Unlock
      </button>
      <a href="mailto:abusyeed10202@gmail.com" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textDecoration: 'underline' }}>
        Email me, I am happy to walk you through
      </a>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
    </div>
  )
}

const CrabViewer = React.lazy(() =>
  import('@react-three/fiber').then(({ Canvas }) =>
    import('@react-three/drei').then(({ useGLTF, useAnimations, OrbitControls }) => {
      function CrabModel() {
        const { scene, animations } = useGLTF('/gallery/kynhood/animated_crab_rigged_free.glb') as any;
        const { actions } = useAnimations(animations, scene);
        React.useEffect(() => {
          Object.values(actions).forEach((a: any) => a?.play());
        }, [actions]);
        return <primitive object={scene} scale={6} rotation={[0.2, -Math.PI / 4, 0]} />;
      }
      useGLTF.preload('/gallery/kynhood/animated_crab_rigged_free.glb');
      function CrabViewer() {
        return (
          <div style={{ width: 480, height: 480 }}>
            <Canvas camera={{ position: [12, 7, 22], fov: 45 }} gl={{ antialias: true }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 10, 5]} intensity={1.5} />
              <React.Suspense fallback={null}>
                <CrabModel />
              </React.Suspense>
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />
            </Canvas>
          </div>
        );
      }
      return { default: CrabViewer };
    })
  )
);

gsap.registerPlugin(ScrollTrigger);

const demoMenuData = [
  { link: '#', text: 'Events', image: '/gallery/kynhood/kyn1.jpg' },
  { link: '#', text: 'Communities', image: '/gallery/kynhood/kyn2.jpg' },
  { link: '#', text: 'Local Connect', image: '/gallery/kynhood/kyn4.jpg' },
  { link: '#', text: 'Engagement', image: '/gallery/kynhood/kyn5.jpg' }
];

export default function Kynhood2Page() {
    const navigate = useNavigate();
    const galleryRef = useRef<HTMLDivElement>(null);
    const metricsRef = useRef<HTMLDivElement>(null);
    const pageRootRef = useRef<HTMLDivElement>(null);
    const bgSvgRef = useRef<SVGSVGElement>(null);
    const [bgHeight, setBgHeight] = useState<number>(0);
    const pageZoom = useZoomScale();

    // The grid background can't just be `height: 100%` — several cards are
    // positioned via FigmaElement's `transform` (including custom positions
    // saved from Edit Mode), and `transform` is paint-only, so it doesn't
    // count toward this container's own auto-height the way normal layout
    // would. A static height guess breaks the moment someone drags a card
    // further down, so instead we measure every element's real rendered
    // bottom edge (excluding the background itself and fixed overlays like
    // the Dock) and size the background to comfortably cover the deepest one.
    //
    // getBoundingClientRect() returns already-zoomed screen pixels (the page
    // is scaled via document.documentElement.style.zoom), but a CSS height we
    // set gets zoomed again on top of that — so the raw measurement has to be
    // divided by the current zoom factor before being used as a style value,
    // or the background ends up short by the zoom ratio.
    useEffect(() => {
        function measure() {
            const root = pageRootRef.current
            const svg = bgSvgRef.current
            if (!root) return
            const rootTop = root.getBoundingClientRect().top
            let maxBottom = 0
            root.querySelectorAll('*').forEach(el => {
                if (svg && (el === svg || svg.contains(el))) return
                if (window.getComputedStyle(el).position === 'fixed') return
                const bottom = el.getBoundingClientRect().bottom
                if (bottom > maxBottom) maxBottom = bottom
            })
            const zoom = pageZoom > 0 ? pageZoom : 1
            setBgHeight((Math.max(0, maxBottom - rootTop) + 100) / zoom)
        }
        measure()
        // Re-measure after images/fonts/animations settle, and on resize. Cards
        // keep animating in / lazy content (e.g. the 3D crab model) keeps
        // mounting well after the initial paint, so a few fixed timers aren't
        // enough — a MutationObserver keeps re-measuring as the DOM actually
        // changes, for as long as the page stays mounted.
        const timers = [200, 800, 2000, 4000].map(ms => setTimeout(measure, ms))
        let raf = 0
        const scheduleMeasure = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(measure)
        }
        const root = pageRootRef.current
        const observer = root
            ? new MutationObserver(scheduleMeasure)
            : null
        if (root && observer) {
            observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] })
        }
        window.addEventListener('resize', scheduleMeasure)
        window.addEventListener('load', measure)
        return () => {
            timers.forEach(clearTimeout)
            cancelAnimationFrame(raf)
            observer?.disconnect()
            window.removeEventListener('resize', scheduleMeasure)
            window.removeEventListener('load', measure)
        }
    }, [pageZoom]);

    useEffect(() => {
        const originalBgColor = document.body.style.backgroundColor
        const originalBgImage = document.body.style.backgroundImage
        document.body.style.backgroundColor = '#ffffff'
        document.body.style.backgroundImage = 'none'

        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 150);
        return () => {
            clearTimeout(timer);
            document.body.style.backgroundColor = originalBgColor
            document.body.style.backgroundImage = originalBgImage
        };
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.kyn-gallery-card');
            cards.forEach((card: any, index: number) => {
                gsap.fromTo(
                    card,
                    { scale: 0 },
                    {
                        scale: 1,
                        ease: 'elastic.out(1, 0.8)',
                        duration: 1.2,
                        delay: index * 0.1,
                        scrollTrigger: {
                            trigger: card,
                            start: 'top bottom-=50',
                        }
                    }
                );
            });

            if (metricsRef.current) {
                gsap.fromTo(
                    metricsRef.current,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: metricsRef.current,
                            start: 'top bottom-=80',
                            toggleActions: 'play none none none',
                        }
                    }
                );
            }
        });
        return () => ctx.revert();
    }, []);

    return (
        <div ref={pageRootRef} style={{ fontFamily: FONTS.primary, backgroundColor: '#ffffff', position: 'relative', display: 'flow-root' }}>
            {/* Checkered grid background — same as homepage. `absolute` (not `fixed`)
                because PageTransition's motion.div wrapper sits between this and the
                real viewport and applies a transform for its animation, which gives
                descendant `position:fixed` elements a new containing block — so a
                `fixed` layer here stops tracking the true viewport partway down a long
                page. Height is measured at runtime (see bgHeight effect above), not a
                static guess, because FigmaElement's `transform` positioning (including
                Edit Mode's saved custom positions) doesn't count toward this
                container's own auto-height. */}
            <svg
                ref={bgSvgRef}
                style={{ position: 'absolute', inset: 0, width: '100%', height: bgHeight ? `${bgHeight}px` : '100%', zIndex: 0, pointerEvents: 'none' }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern id="smallGrid-kyn" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d1d5db" strokeWidth="0.4" />
                    </pattern>
                    <pattern id="grid-kyn" width="100" height="100" patternUnits="userSpaceOnUse">
                        <rect width="100" height="100" fill="url(#smallGrid-kyn)" />
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#d1d5db" strokeWidth="0.8" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-kyn)" />
            </svg>

            {/* Caps the fixed-1440px-canvas content at its native width and centers it
                on wider monitors, instead of leaving it pinned to the left edge. */}
            <div style={{ width: '100%', maxWidth: 1440, margin: '0 auto' }}>
            <div style={{ minHeight: '100vh', padding: '4rem 4rem calc(900px + 14rem) 4rem', position: 'relative', color: 'var(--color-text-primary)', isolation: 'isolate', zIndex: 1 }}>
                <DynamicRenderer />

                <FigmaElement figmaId="kynhood-floating-image" style={{ display: 'block', position: 'absolute', top: '100px', left: '100px', zIndex: 10 }}>
                    <img src="/gallery/kynhood/kyn-cover.png" alt="Kynhood Graphic" style={{ width: '300px' }} />
                </FigmaElement>
                <FigmaElement figmaId="kynhood-images-secondary" style={{ display: 'block', position: 'absolute', top: '100px', left: '420px', zIndex: 10 }}>
                    <img src="/gallery/kynhood/kyn-screens.png" alt="Kynhood Images" style={{ width: '300px' }} />
                </FigmaElement>
                <FigmaElement figmaId="kynhood-kynlive-poster1" style={{ display: 'block', position: 'absolute', top: '100px', left: '740px', zIndex: 10 }}>
                    <img src="/gallery/kyncaseimg/kyn111.avif" alt="Kyn Live Poster" style={{ width: '300px' }} />
                </FigmaElement>
                <FigmaElement figmaId="kynhood-kynlive-poster2" style={{ display: 'block', position: 'absolute', top: '100px', left: '1060px', zIndex: 10 }}>
                    <img src="/gallery/kyncaseimg/kyn222.jpg" alt="Kyn Live Poster" style={{ width: '300px' }} />
                </FigmaElement>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}
                >
                    <FigmaElement figmaId="kynhood-back-btn" style={{ display: 'block', width: 'max-content', position: 'relative' }}>
                        <button
                            onClick={() => window.history.back()}
                            style={{
                                padding: 'var(--space-2) var(--space-4)',
                                marginBottom: '2rem',
                                border: '1px solid rgba(0,0,0,0.15)',
                                background: 'rgba(0,0,0,0.05)',
                                color: 'var(--color-text-primary)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontFamily: FONTS.primary,
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            ← Back to Portfolio
                        </button>
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-title" style={{ display: 'block', width: 'max-content', position: 'relative' }}>
                        <h1 style={{ fontSize: '3rem', margin: '2rem 0 1rem 0', color: 'var(--color-text-primary)' }}>Kynhood Project</h1>
                    </FigmaElement>

                    <FigmaElement
                        figmaId="kynhood-scroll-reveal"
                        componentType="ScrollReveal"
                        componentProps={{
                            baseOpacity: 0,
                            enableBlur: true,
                            baseRotation: 5,
                            blurStrength: 10,
                            children: "When does a man die? When he is hit by a bullet? No! When he suffers a disease? No! When he ate a soup made out of a poisonous mushroom? No! A man dies when he is forgotten!"
                        }}
                        style={{ display: 'block', width: '100%', marginBottom: 'var(--space-16)', position: 'relative' }}
                    >
                        <div style={{ color: 'var(--color-text-primary)' }}>
                            <ScrollReveal
                                baseOpacity={0}
                                enableBlur={true}
                                baseRotation={5}
                                blurStrength={10}
                            >
                                When does a man die? When he is hit by a bullet? No! When he suffers a disease? No! When he ate a soup made out of a poisonous mushroom? No! A man dies when he is forgotten!
                            </ScrollReveal>
                        </div>
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-hero-img" style={{ display: 'block', position: 'relative' }}>
                        <img
                            src="/gallery/kynhood/kyn-cover.png"
                            alt="Kynhood Project"
                            style={{
                                width: '100%',
                                height: '400px',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-2xl)',
                                marginBottom: 'var(--space-10)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.12)'
                            }}
                        />
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-overview-title" style={{ display: 'block', width: 'max-content', position: 'relative' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>Overview</h2>
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-overview-text" style={{ display: 'block', position: 'relative' }}>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#475569', marginBottom: 'var(--space-16)', fontFamily: FONTS.primary }}>
                            Welcome to the detailed view of the Kynhood project. This page acts as a dedicated case study where you can showcase the problem you solved, the technologies you used, and the impact of your work.
                        </p>
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-metrics-row" style={{ display: 'block', width: '100%', marginBottom: 'var(--space-20)', position: 'relative' }}>
                        <div ref={metricsRef}>
                            <PipBoyMetricsRow />
                        </div>
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-flowing-menu" style={{ display: 'block', width: '100%', marginBottom: 'var(--space-20)', position: 'relative' }}>
                        <div style={{ height: '400px', position: 'relative', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <FlowingMenu
                                items={demoMenuData}
                                bgColor="rgba(0,0,0,0.04)"
                                borderColor="rgba(0,0,0,0.08)"
                                marqueeBgColor="rgba(15,23,42,0.9)"
                                marqueeTextColor="#ffffff"
                            />
                        </div>
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-journey" style={{ display: 'block', position: 'relative' }}>
                        <KynhoodJourney accentColor="#3b82f6" />
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-did-you-know" style={{ display: 'block', position: 'relative', margin: 'var(--space-10) 0' }}>
                        <DidYouKnow labelColor="rgba(0,0,0,0.4)" textColor="var(--color-text-primary)" />
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-word-highlighter" style={{ display: 'block', position: 'relative', margin: 'var(--space-10) 0 var(--space-5) 0' }}>
                        <div style={{ padding: 'var(--space-6)', background: '#ffffff', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                            <WordHighlighter
                                text="Kyn is a community-led experiences platform that helps people create tribes, host events, and connect through shared interests. From discovery to booking and community engagement, everything happens in one place."
                                highlightWords="community-led experiences, connect, shared interests, one place"
                                highlightColor="#bae6fd"
                                highlightTextColor="#0369a1"
                                baseTextColor="var(--color-text-primary)"
                                highlightPadding={4}
                                highlightBorderRadius={6}
                                caseSensitive={false}
                                style={{ width: '100%', whiteSpace: 'normal' }}
                            />
                        </div>
                    </FigmaElement>

                    <div ref={galleryRef} style={{ position: 'relative', height: 0, overflow: 'visible' }}>
                        {[
                            { id: 'images-img', src: '/gallery/kynhood/kyn-screens.png', alt: 'Gallery images' },
                            { id: 'ky2-img', src: '/gallery/kynhood/kyn2-alt.jpg', alt: 'Gallery ky2' },
                            { id: 'kyn1-img', src: '/gallery/kynhood/kyn1.jpg', alt: 'Gallery kyn1' },
                            { id: 'kyn2-img', src: '/gallery/kynhood/kyn2.jpg', alt: 'Gallery kyn2' },
                            { id: 'kyn4-img', src: '/gallery/kynhood/kyn4.jpg', alt: 'Gallery kyn4' },
                            { id: 'kyn5-img', src: '/gallery/kynhood/kyn5.jpg', alt: 'Gallery kyn5' },
                            { id: 'kyn6-img', src: '/gallery/kynhood/kyn6.jpg', alt: 'Gallery kyn6' },
                            { id: 'kyn7-img', src: '/gallery/kynhood/kyn7.jpg', alt: 'Gallery kyn7' },
                        ].map(img => (
                            <FigmaElement key={img.id} figmaId={img.id} style={{ display: 'block', maxWidth: '500px' }}>
                                <div className="kyn-gallery-card">
                                    <img src={img.src} alt={img.alt} style={{ width: '100%', objectFit: 'cover', display: 'block', borderRadius: 'var(--radius-sm)' }} />
                                </div>
                            </FigmaElement>
                        ))}
                    </div>

                    <FigmaElement figmaId="kynhood-path-journey" style={{ display: 'none', width: '100%', margin: 'var(--space-20) 0', position: 'relative' }}>
                        <React.Suspense fallback={null}>
                            <CrabViewer />
                        </React.Suspense>
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-tab-image" style={{ display: 'block', width: '100%', margin: 'var(--space-20) 0', position: 'relative' }}>
                        <img src="/gallery/kynhood/tab.png" alt="Tab interface" style={{ width: '100%', display: 'block' }} />
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-bento-cards" style={{ display: 'block', width: '100%', margin: 'var(--space-20) 0', position: 'relative' }}>
                        <KynhoodBentoCards />
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-bento-cards-secondary" style={{ display: 'block', width: '100%', margin: 'var(--space-20) 0', position: 'relative' }}>
                        <KynhoodBentoCardsSecondary />
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-bento-cards-tertiary" style={{ display: 'block', width: '100%', margin: 'var(--space-20) 0', position: 'relative' }}>
                        <KynhoodBentoCardsTertiary />
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-bento-cards-events-plugin" style={{ display: 'block', width: '100%', margin: 'var(--space-20) 0 100px', position: 'relative' }}>
                        <KynhoodBentoCardsEventsPlugin />
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-split-text" style={{ display: 'block', width: '100%', height: '160px', margin: 'var(--space-20) 0 1000px', position: 'relative' }}>
                        <SplitTextMediaHover
                            splitMode="Fixed"
                            textLeft="KYN"
                            textRight="HOOD"
                            mediaType="Image"
                            image="/gallery/kynhood/kyn1.jpg"
                            textColor="var(--color-text-primary)"
                            expandWidth={220}
                            mediaHeight={120}
                            mediaRadius={12}
                            gap={16}
                            textFont={{
                                fontSize: '96px',
                                fontWeight: 800,
                                fontFamily: FONTS.display,
                                letterSpacing: '-0.02em',
                                lineHeight: '1em',
                            }}
                        />
                    </FigmaElement>

                </motion.div>

            </div>
            </div>

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
    );
}
