import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LockedFigmaEmbed({ src }: { src: string }) {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)

  const attempt = () => {
    if (input === 'hireme') {
      setUnlocked(true)
    } else {
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 500)
    }
  }

  if (unlocked) {
    return (
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <iframe style={{ border: 'none', display: 'block' }} width="100%" height="600" src={src} allowFullScreen />
      </div>
    )
  }

  return (
    <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', background: '#f8fafc', height: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
      <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Icon icon="solar:lock-keyhole-outline" width={26} color="#0f172a" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a', marginBottom: '6px' }}>Enter password to view</div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>This Figma file is access-restricted</div>
      </div>
      <div style={{ display: 'flex', gap: '8px', animation: shake ? 'shake 0.4s ease' : 'none' }}>
        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="Password"
          autoFocus
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none', width: '180px', background: '#fff', color: '#0f172a' }}
        />
        <button
          onClick={attempt}
          style={{ padding: '10px 20px', borderRadius: '8px', background: '#0f172a', color: '#fff', fontSize: '0.875rem', fontWeight: '600', border: 'none', cursor: 'pointer' }}
        >
          Unlock
        </button>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
    </div>
  )
}
import { FONTS } from '../theme';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FigmaElement from '../components/FigmaElement'
import KynhoodJourney from '../components/KynhoodJourney'
import ScrollReveal from '../components/ScrollReveal'
import DynamicRenderer from '../components/DynamicRenderer'
import PipBoyMetricsRow from '../components/PipBoyMetricsRow'
import CuttingMatBackground from '../components/CuttingMatBackground'
import FlowingMenu from '../components/FlowingMenu'
import WordHighlighter from '../components/WordHighlighter'
import { Icon } from '@iconify/react';
import Dock from '../components/Dock';
import DidYouKnow from '../components/DidYouKnow';



const CrabViewer = React.lazy(() =>
  import('@react-three/fiber').then(({ Canvas }) =>
    import('@react-three/drei').then(({ useGLTF, useAnimations, OrbitControls }) => {
      function CrabModel() {
        const { scene, animations } = useGLTF('/gallery/animated_crab_rigged_free.glb') as any;
        const { actions } = useAnimations(animations, scene);
        React.useEffect(() => {
          Object.values(actions).forEach((a: any) => a?.play());
        }, [actions]);
        return <primitive object={scene} scale={6} rotation={[0.2, -Math.PI / 4, 0]} />;
      }
      useGLTF.preload('/gallery/animated_crab_rigged_free.glb');
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
  { link: '#', text: 'Events', image: '/gallery/kyn1.jpg' },
  { link: '#', text: 'Communities', image: '/gallery/kyn2.png' },
  { link: '#', text: 'Local Connect', image: '/gallery/kyn4.png' },
  { link: '#', text: 'Engagement', image: '/gallery/kyn5.jpg' }
];

export default function KynhoodPage() {
    const navigate = useNavigate();
    const galleryRef = useRef<HTMLDivElement>(null);
    const metricsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // Set body background to white on mount
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
        <div style={{ fontFamily: FONTS.primary, backgroundColor: '#064e3b', paddingBottom: '50rem' }}>
        <div style={{ minHeight: '100vh', padding: '4rem', position: 'relative', color: '#fff', isolation: 'isolate' }}>
            <CuttingMatBackground minorSpacing={40} majorSpacing={200} showRulerNumbers={true} />
            <DynamicRenderer />
            
            <FigmaElement figmaId="kynhood-floating-image" style={{ display: 'block', position: 'absolute', top: '100px', left: '100px', zIndex: 10 }}>
                    <img src="/gallery/kyn-cover.png" alt="Kynhood Graphic" style={{ width: '300px' }} />
                </FigmaElement>
            <FigmaElement figmaId="kynhood-images-secondary" style={{ display: 'block', position: 'absolute', top: '100px', left: '420px', zIndex: 10 }}>
                    <img src="/gallery/kyn-screens.png" alt="Kynhood Images" style={{ width: '300px' }} />
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
                                padding: '8px 16px',
                                marginBottom: '2rem',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(0,0,0,0.3)',
                                color: '#fff',
                                borderRadius: '8px',
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
                        <h1 style={{ fontSize: '3rem', margin: '2rem 0 1rem 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Kynhood Project</h1>
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
                        style={{ display: 'block', width: '100%', marginBottom: '3rem', position: 'relative' }}
                    >
                        <div style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
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
                             src="/gallery/kyn-cover.png"
                            alt="Kynhood Project"
                            style={{
                                width: '100%',
                                height: '400px',
                                objectFit: 'cover',
                                borderRadius: '16px',
                                marginBottom: '2rem',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                            }}
                        />
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-overview-title" style={{ display: 'block', width: 'max-content', position: 'relative' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>Overview</h2>
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-overview-text" style={{ display: 'block', position: 'relative' }}>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', marginBottom: '3rem', textShadow: '0 1px 3px rgba(0,0,0,0.5)', fontFamily: FONTS.primary }}>
                            Welcome to the detailed view of the Kynhood project. This page acts as a dedicated case study where you can showcase the problem you solved, the technologies you used, and the impact of your work.
                        </p>
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-metrics-row" style={{ display: 'block', width: '100%', marginBottom: '4rem', position: 'relative' }}>
                        <div ref={metricsRef}>
                            <PipBoyMetricsRow />
                        </div>
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-flowing-menu" style={{ display: 'block', width: '100%', marginBottom: '4rem', position: 'relative' }}>
                        <div style={{ height: '400px', position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                            <FlowingMenu 
                                items={demoMenuData} 
                                bgColor="rgba(0,0,0,0.3)" 
                                borderColor="rgba(255,255,255,0.1)"
                                marqueeBgColor="rgba(255,255,255,0.9)"
                                marqueeTextColor="#120F17"
                            />
                        </div>
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-journey" style={{ display: 'block', position: 'relative' }}>
                        <KynhoodJourney accentColor="#ef4444" />
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-did-you-know" style={{ display: 'block', position: 'relative', margin: '2rem 0' }}>
                        <DidYouKnow labelColor="rgba(255,255,255,0.5)" textColor="rgba(255,255,255,0.85)" />
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-word-highlighter" style={{ display: 'block', position: 'relative', margin: '40px 0 20px 0' }}>
                        <div style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                            <WordHighlighter 
                                text="Kyn is a community-led experiences platform that helps people create tribes, host events, and connect through shared interests. From discovery to booking and community engagement, everything happens in one place."
                                highlightWords="community-led experiences, connect, shared interests, one place"
                                highlightColor="#bae6fd"
                                highlightTextColor="#0369a1"
                                baseTextColor="#0f172a"
                                highlightPadding={4}
                                highlightBorderRadius={6}
                                caseSensitive={false}
                                style={{ width: '100%', whiteSpace: 'normal' }}
                            />
                        </div>
                    </FigmaElement>

                    <div ref={galleryRef} style={{ position: 'relative', height: 0, overflow: 'visible' }}>
                        {[
                            { id: 'images-img', src: '/gallery/kyn-screens.png', alt: 'Gallery images' },
                            { id: 'ky2-img', src: '/gallery/kyn2-alt.jpg', alt: 'Gallery ky2' },
                            { id: 'kyn1-img', src: '/gallery/kyn1.jpg', alt: 'Gallery kyn1' },
                            { id: 'kyn2-img', src: '/gallery/kyn2.png', alt: 'Gallery kyn2' },
                            { id: 'kyn4-img', src: '/gallery/kyn4.png', alt: 'Gallery kyn4' },
                            { id: 'kyn5-img', src: '/gallery/kyn5.jpg', alt: 'Gallery kyn5' },
                            { id: 'kyn6-img', src: '/gallery/kyn6.jpg', alt: 'Gallery kyn6' },
                            { id: 'kyn7-img', src: '/gallery/kyn7.jpg', alt: 'Gallery kyn7' },
                        ].map(img => (
                            <FigmaElement key={img.id} figmaId={img.id} style={{ display: 'block', maxWidth: '500px' }}>
                                <div className="kyn-gallery-card">
                                    <img src={img.src} alt={img.alt} style={{ width: '100%', objectFit: 'cover', display: 'block', borderRadius: '4px' }} />
                                </div>
                            </FigmaElement>
                        ))}
                    </div>

                    <FigmaElement figmaId="kynhood-path-journey" style={{ display: 'none', width: '100%', margin: '4rem 0', position: 'relative' }}>
                        <React.Suspense fallback={null}>
                            <CrabViewer />
                        </React.Suspense>
                    </FigmaElement>

                    <FigmaElement figmaId="kynhood-tab-image" style={{ display: 'block', width: '100%', margin: '4rem 0', position: 'relative' }}>
                        <img src="/gallery/tab.png" alt="Tab interface" style={{ width: '100%', display: 'block' }} />
                    </FigmaElement>

                </motion.div>

            </div>

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
        </div>
    );
}

