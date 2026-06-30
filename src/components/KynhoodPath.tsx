import React, { useEffect, useRef, Suspense, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations, Center, OrbitControls } from '@react-three/drei';
import './KynhoodPath.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Component to load and animate the crab GLB model
function CrabModel({ isScrolling }: { isScrolling: boolean }) {
  const { scene, animations } = useGLTF('/gallery/animated_crab_rigged_free.glb');
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    // Play all animations in the GLB
    Object.values(actions).forEach((action) => {
      if (action) {
        action.play();
        action.paused = true; // Start in static pose
      }
    });
  }, [actions]);

  useEffect(() => {
    // Resume animation when scrolling, pause when static
    Object.values(actions).forEach((action) => {
      if (action) {
        action.paused = !isScrolling;
      }
    });
  }, [isScrolling, actions]);

  return (
    <primitive 
      object={scene} 
      scale={6.0} 
      rotation={[0.3, -Math.PI / 4, 0]} /* Tilt slightly so user can view it in 3D */
    />
  );
}

// Preload to ensure zero loading lag when scrolling into view
useGLTF.preload('/gallery/animated_crab_rigged_free.glb');

export default function KynhoodPath() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const mainEl = containerRef.current;
    if (!mainEl) return;

    let ctx: gsap.Context | undefined;

    const createTimeline = () => {
      if (ctx) ctx.revert();

      ctx = gsap.context(() => {
        const box = mainEl.querySelector(".kynpath-box") as HTMLElement;
        if (!box) return;

        // Reset transforms before calculations so initial measurements are stable
        gsap.set(box, { clearProps: "transform" });

        const boxStartRect = box.getBoundingClientRect();
        const currentScrollY = window.scrollY;
        const currentScrollX = window.scrollX;

        const boxStartLeft = boxStartRect.left + currentScrollX;
        const boxStartTop = boxStartRect.top + currentScrollY;

        // Get other containers except initial
        const containers = gsap.utils.toArray<HTMLElement>(
          ".kynpath-container:not(.kynpath-initial)",
          mainEl
        );

        // Map markers to bezier points relative to initial box center
        const points = containers.map((container) => {
          const marker = (container.querySelector(".kynpath-marker") || container) as HTMLElement;
          const r = marker.getBoundingClientRect();

          const markerLeft = r.left + currentScrollX;
          const markerTop = r.top + currentScrollY;

          return {
            x: markerLeft + r.width / 2 - (boxStartLeft + boxStartRect.width / 2),
            y: markerTop + r.height / 2 - (boxStartTop + boxStartRect.height / 2)
          };
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: mainEl.querySelector(".kynpath-container.kynpath-initial"),
            start: "clamp(top center)",
            endTrigger: mainEl.querySelector(".kynpath-final"),
            end: "clamp(top center)",
            scrub: 1
          }
        });

        tl.to(box, {
          duration: 1,
          ease: "none",
          motionPath: {
            path: points,
            curviness: 1.5
          }
        });
      }, mainEl);
    };

    // Delay timeline creation slightly so DOM layout calculations are finalized
    const timer = setTimeout(createTimeline, 150);

    const handleResize = () => {
      createTimeline();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
      <div className="kynpath-spacer">Scroll down to trace the project journey</div>

      <div className="kynpath-main">
        <div className="kynpath-container kynpath-initial">
          <div className="kynpath-marker"></div>
          
          {/* 3D Canvas rendering the animated crab */}
          <div className="kynpath-box">
            <Canvas camera={{ position: [12.5, 7.5, 25], fov: 45 }} gl={{ antialias: true }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 10, 5]} intensity={1.5} />
              <Suspense fallback={null}>
                <Center>
                  <CrabModel isScrolling={isScrolling} />
                </Center>
              </Suspense>
              <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.5} />
            </Canvas>
          </div>
        </div>

        <div className="kynpath-container kynpath-second">
          <div className="kynpath-marker"></div>
        </div>
        
        <div className="kynpath-container kynpath-third">
          <div className="kynpath-marker"></div>
        </div>
        
        <div className="kynpath-container kynpath-fourth">
          <div className="kynpath-marker"></div>
        </div>
        
        <div className="kynpath-container kynpath-fifth">
          <div className="kynpath-marker"></div>
        </div>
        
        <div className="kynpath-container kynpath-sixth">
          <div className="kynpath-marker"></div>
        </div>
      </div>

      <div className="kynpath-spacer kynpath-final" />
    </div>
  );
}
