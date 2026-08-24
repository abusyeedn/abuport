import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FONTS } from '../theme';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import KynhoodJourney from '../components/KynhoodJourney'
import DynamicRenderer from '../components/DynamicRenderer'
import PipBoyMetricsRow from '../components/PipBoyMetricsRow'
import WordHighlighter from '../components/WordHighlighter'
import BackToTopButton from '../components/BackToTopButton';
import CaseStudyHero from '../components/CaseStudyHero';
import WorkCard from '../components/WorkCard';
import { KYNHOOD_CASE_STUDY_CARDS, renderBoldedText } from '../components/KynhoodBentoCards';

function slugifyCardTitle(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// Real, work-specific facts pulled from DidYouKnow's data set - the concrete
// ones, formatted as a "My contributions" list instead of a trivia carousel.
const CONTRIBUTIONS = [
    "I independently owned the Events Listing module from concept to production.",
    "I shipped **5+ features** across events, communities, AI, payments, and organizer tools.",
    "I supported **₹5 Cr+** in event revenue through the products I designed.",
    "I helped power **5,000+ paid bookings** through product improvements.",
    "I built a notification-based inventory sync solution without third-party APIs.",
    "I took features from brainstorming through to production release, working closely with engineering.",
]

gsap.registerPlugin(ScrollTrigger);

export default function Kynhood2Page() {
    const navigate = useNavigate();
    const metricsRef = useRef<HTMLDivElement>(null);
    const pageRootRef = useRef<HTMLDivElement>(null);
    const pageBg = '#ffffff'

    useEffect(() => {
        const originalBgColor = document.body.style.backgroundColor
        const originalBgImage = document.body.style.backgroundImage
        document.body.style.backgroundColor = pageBg
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
        // `overflowX: clip` - the editor-positioned `images-img` FigmaElement is
        // scaled 2.25x and pushed right far enough to end ~15px past the viewport,
        // which gave the page a horizontal scrollbar with a ~15px range: a bar that
        // spans the window but barely moves. That sliver is off-screen artwork
        // anyway, so clipping it removes the dead scrollbar without nudging any
        // saved editor position.
        // `clip` rather than `hidden` deliberately: `overflow-x: hidden` forces the
        // computed `overflow-y` to `auto`, which turned this root into a nested
        // scroll container with its own ~125px range - trading one dead scrollbar
        // for another. `clip` clips without creating a scroll container at all.
        <div ref={pageRootRef} style={{ fontFamily: FONTS.primary, backgroundColor: pageBg, position: 'relative', display: 'flow-root', overflowX: 'clip' }}>
            {/* Case-study hero - michaeltsirakis.com/work-style full-bleed gradient
                header (back link, meta line, oversized title, stat row, floating
                mockup image), replacing the old floating-image canvas + plain title. */}
            <CaseStudyHero
                client="Kynhood"
                period="June 2024 to July 2026"
                category="Product, AI"
                title="Product designer"
                subtitle="I transformed complex community and events workflows into clean, engaging experiences, using analytics to scale product engagement."
                mockupImage="/gallery/kynhood/kyn-screens.png"
                statsLayout="column-right"
                stats={[
                    { value: '8', label: 'Sub-projects shipped' },
                    { value: '2', label: 'Years at Kynhood' },
                    { value: 'Chennai', label: 'Based in' },
                ]}
                onBack={() => window.history.back()}
            />

            {/* Caps the fixed-1440px-canvas content at its native width and centers it
                on wider monitors, instead of leaving it pinned to the left edge. */}
            <div style={{ width: '100%', maxWidth: 1440, margin: '0 auto' }}>
            {/* Bottom padding gives the GSAP-revealed bento cards room to finish
                animating and keeps the last card clear of the fixed Dock. It was
                1124px, which left ~865px of blank grid after the final card -
                28rem trims that to a ~190px tail. Don't cut it much further:
                shrinking it too far starves the ScrollTrigger reveals and the
                cards stop appearing. */}
            <div style={{ minHeight: '100vh', padding: '4rem 4rem 28rem 4rem', position: 'relative', color: 'var(--color-text-primary)', isolation: 'isolate', zIndex: 1 }}>
                <DynamicRenderer />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ maxWidth: '840px', margin: '0 auto', position: 'relative' }}
                >
                    {/* Chapter 01 - narrative intro, michaeltsirakis.com/work chapter pattern */}
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.5rem 0 1.5rem 0', color: 'var(--color-text-primary)', fontFamily: FONTS.display }}>
                        Here's what we built
                    </h2>
                    <div style={{ padding: 'var(--space-6)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginBottom: 'var(--space-16)' }}>
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

                    <div ref={metricsRef} style={{ marginBottom: 'var(--space-20)' }}>
                        <PipBoyMetricsRow />
                    </div>

                    {/* Chapter 02 - my contributions, real facts drawn from DidYouKnow's data set */}
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.5rem 0 1.5rem 0', color: 'var(--color-text-primary)', fontFamily: FONTS.display }}>
                        My contributions
                    </h2>
                    <ul style={{ margin: '0 0 var(--space-20) 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {CONTRIBUTIONS.map((fact) => (
                            <li key={fact} style={{ display: 'flex', gap: '12px', fontSize: '1.05rem', lineHeight: 1.6, color: '#475569', fontFamily: FONTS.primary }}>
                                <span style={{ color: '#00cbb4', flexShrink: 0 }}>-</span>
                                <span>{renderBoldedText(fact)}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Chapter 03 - the role journey at Kynhood */}
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.5rem 0 1.5rem 0', color: 'var(--color-text-primary)', fontFamily: FONTS.display }}>
                        The journey
                    </h2>
                    <div style={{ marginBottom: 'var(--space-20)' }}>
                        <KynhoodJourney accentColor="#077a4b" />
                    </div>

                    {/* Sub-project case studies, added back here (in addition to the
                        home page's Work section) so a visitor landing directly on
                        this page can see them too. */}
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.5rem 0 1.5rem 0', color: 'var(--color-text-primary)', fontFamily: FONTS.display }}>
                        Case studies from Kynhood
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {KYNHOOD_CASE_STUDY_CARDS.slice(0, 2).map((card, i) => (
                            <WorkCard
                                key={card.title}
                                image={card.image}
                                title={card.title}
                                description={card.subtitle}
                                onClick={() => navigate(`/kynhood2/case/${slugifyCardTitle(card.title)}`)}
                                index={i}
                            />
                        ))}
                    </div>
                </motion.div>

            </div>
            </div>

            <BackToTopButton />
        </div>
    );
}
